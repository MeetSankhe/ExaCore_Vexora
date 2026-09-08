import { prisma } from '@/lib/prisma';

export interface ReadinessScoreResult {
  totalScore: number;
  readinessState: 'Getting Started' | 'In Progress' | 'Almost Ready' | 'Export Ready' | 'Action Required (Blockers)';
  isExportReady: boolean;
  categoryScores: {
    business: { score: number; weight: number; label: string };
    documents: { score: number; weight: number; label: string };
    certifications: { score: number; weight: number; label: string };
    packaging: { score: number; weight: number; label: string };
    shipment: { score: number; weight: number; label: string };
  };
  blockers: Array<{
    id: string;
    title: string;
    type: string;
    priority: string;
    reason: string;
    status: string;
    actionUrl: string;
  }>;
  nextActions: Array<{
    id: string;
    title: string;
    type: string;
    actionText: string;
    dueDate?: string;
  }>;
}

export async function calculateReadinessScore(productCountryId: string): Promise<ReadinessScoreResult> {
  const pc = await prisma.productCountry.findUnique({
    where: { id: productCountryId },
    include: {
      product: { include: { business: true } },
      country: true,
      requirements: {
        include: {
          documents: true,
          rule: true,
        },
      },
      packagingItems: true,
    },
  });

  if (!pc) {
    throw new Error('Product country mapping not found');
  }

  const requirements = pc.requirements;
  const packagingItems = pc.packagingItems;
  const business = pc.product.business;

  // 1. Business Score (20% max)
  let businessPoints = 0;
  if (business.gstStatus.toLowerCase().includes('active')) businessPoints += 50;
  if (business.iecStatus.toLowerCase().includes('active')) businessPoints += 50;
  const businessScore = Math.min(100, businessPoints);

  // 2. Documents Score (25% max)
  const docReqs = requirements.filter((r) => r.type === 'document');
  const completedDocReqs = docReqs.filter((r) => r.status === 'verified');
  const docScore = docReqs.length > 0 ? Math.round((completedDocReqs.length / docReqs.length) * 100) : 100;

  // 3. Certifications Score (20% max)
  const certReqs = requirements.filter((r) => r.type === 'certification');
  const completedCertReqs = certReqs.filter((r) => r.status === 'verified');
  const certScore = certReqs.length > 0 ? Math.round((completedCertReqs.length / certReqs.length) * 100) : 100;

  // 4. Packaging & Labelling Score (15% max)
  const completedPackaging = packagingItems.filter((p) => p.status === 'completed');
  const packagingScore = packagingItems.length > 0 ? Math.round((completedPackaging.length / packagingItems.length) * 100) : 100;

  // 5. Shipment Readiness Score (20% max)
  const shipmentReqs = requirements.filter((r) => r.type === 'shipment' || r.type === 'labelling');
  const completedShipmentReqs = shipmentReqs.filter((r) => r.status === 'verified');
  const shipmentScore = shipmentReqs.length > 0 ? Math.round((completedShipmentReqs.length / shipmentReqs.length) * 100) : 50;

  // Weighted overall calculation:
  // Business (20%) + Documents (25%) + Certifications (20%) + Packaging (15%) + Shipment (20%)
  const totalScore = Math.round(
    businessScore * 0.20 +
    docScore * 0.25 +
    certScore * 0.20 +
    packagingScore * 0.15 +
    shipmentScore * 0.20
  );

  // Critical Blockers evaluation
  const blockers: ReadinessScoreResult['blockers'] = [];

  // Check unverified mandatory/critical requirements
  for (const req of requirements) {
    if (req.status !== 'verified') {
      const isCritical = req.priority === 'critical' || (req.rule && req.rule.blocksDispatch);
      if (isCritical || req.status === 'missing' || req.status === 'under_review' || req.status === 'rejected') {
        let actionUrl = `/readiness`;
        if (req.type === 'document') actionUrl = `/documents`;
        if (req.type === 'certification') actionUrl = `/certifications`;
        if (req.type === 'labelling' || req.type === 'packaging') actionUrl = `/packaging`;

        blockers.push({
          id: req.id,
          title: req.title,
          type: req.type,
          priority: req.priority,
          reason: req.reason || `Status is currently '${req.status}'. Action required to complete export compliance.`,
          status: req.status,
          actionUrl,
        });
      }
    }
  }

  // Check incomplete packaging items
  for (const item of packagingItems) {
    if (item.status !== 'completed' && item.mandatory) {
      blockers.push({
        id: item.id,
        title: item.title,
        type: item.type,
        priority: item.priority,
        reason: item.notes || `Mandatory ${item.type} requirement incomplete.`,
        status: 'incomplete',
        actionUrl: `/packaging`,
      });
    }
  }

  // Determine readiness state
  let readinessState: ReadinessScoreResult['readinessState'] = 'Getting Started';
  if (blockers.length > 0) {
    readinessState = 'Action Required (Blockers)';
  } else if (totalScore >= 90) {
    readinessState = 'Export Ready';
  } else if (totalScore >= 70) {
    readinessState = 'Almost Ready';
  } else if (totalScore >= 40) {
    readinessState = 'In Progress';
  }

  // Next actions (prioritized top 5 pending items)
  const nextActions: ReadinessScoreResult['nextActions'] = blockers.slice(0, 5).map((b) => ({
    id: b.id,
    title: b.title,
    type: b.type,
    actionText: b.status === 'under_review' ? 'Awaiting Verification' : b.type === 'document' ? 'Upload Document' : b.type === 'certification' ? 'Request Certification' : 'Complete Checklist',
  }));

  return {
    totalScore,
    readinessState,
    isExportReady: blockers.length === 0 && totalScore >= 70,
    categoryScores: {
      business: { score: businessScore, weight: 20, label: 'Business & Registrations' },
      documents: { score: docScore, weight: 25, label: 'Export Documents' },
      certifications: { score: certScore, weight: 20, label: 'Product Certifications' },
      packaging: { score: packagingScore, weight: 15, label: 'Packaging & Labelling' },
      shipment: { score: shipmentScore, weight: 20, label: 'Shipment Prerequisites' },
    },
    blockers,
    nextActions,
  };
}
