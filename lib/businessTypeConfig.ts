/**
 * Business Type Configuration
 *
 * Defines per-business-type certificates, documents, packaging items,
 * and default product details that are generated during MSME registration.
 */

export const BUSINESS_TYPES = ['Steel', 'Food', 'Agricultural Goods', 'Diamonds', 'Gold'] as const;
export type BusinessType = (typeof BUSINESS_TYPES)[number];

export interface BusinessTypeRequirement {
  type: 'document' | 'certification';
  title: string;
  description: string;
  priority: 'critical' | 'high' | 'medium' | 'low';
  weight: number;
  blocksDispatch: boolean;
}

export interface BusinessTypePackagingItem {
  title: string;
  type: 'packaging' | 'labelling';
  priority: 'high' | 'medium' | 'low';
  mandatory: boolean;
  initialStatus: 'completed' | 'incomplete';
  notes: string;
}

export interface BusinessTypeShipmentReq {
  type: 'shipment' | 'labelling';
  title: string;
  description: string;
  priority: 'critical' | 'high' | 'medium';
  weight: number;
  initialStatus: 'verified' | 'missing';
}

export interface BusinessTypeConfig {
  label: string;
  businessTypeLabel: string;
  categoryMatch: string; // pattern to match ProductCategory.name
  defaultProduct: {
    name: string;
    hsCode: string;
    unit: string;
    defaultValue: number;
  };
  requirements: BusinessTypeRequirement[];
  packagingItems: BusinessTypePackagingItem[];
  shipmentPrereqs: BusinessTypeShipmentReq[];
}

export const BUSINESS_TYPE_CONFIGS: Record<BusinessType, BusinessTypeConfig> = {
  Steel: {
    label: 'Steel',
    businessTypeLabel: 'Steel MSME Exporter',
    categoryMatch: 'Steel',
    defaultProduct: {
      name: 'Structural Steel Products (TMT Bars / Coils)',
      hsCode: '7213.10.00',
      unit: 'MT',
      defaultValue: 2500000,
    },
    requirements: [
      {
        type: 'certification',
        title: 'BIS Certification (Bureau of Indian Standards)',
        description: 'Mandatory BIS product certification for steel exports confirming IS standards compliance.',
        priority: 'critical',
        weight: 20,
        blocksDispatch: true,
      },
      {
        type: 'certification',
        title: 'Mill Test Certificate (MTC / EN 10204 3.1)',
        description: 'Chemical composition and mechanical properties test report from steel mill.',
        priority: 'critical',
        weight: 15,
        blocksDispatch: true,
      },
      {
        type: 'document',
        title: 'Certificate of Origin (CoO)',
        description: 'Non-preferential certificate issued by Chamber of Commerce for steel products.',
        priority: 'critical',
        weight: 15,
        blocksDispatch: true,
      },
      {
        type: 'document',
        title: 'Commercial Invoice & Packing List',
        description: 'Detailed export invoice with HS code, unit weight, grade specification, and shipping marks.',
        priority: 'high',
        weight: 10,
        blocksDispatch: true,
      },
      {
        type: 'document',
        title: 'Shipping Bill & Bill of Lading',
        description: 'Customs export declaration and carrier bill for ocean freight of steel cargo.',
        priority: 'high',
        weight: 10,
        blocksDispatch: true,
      },
      {
        type: 'certification',
        title: 'Third-Party Inspection Certificate (SGS / Bureau Veritas)',
        description: 'Independent quality and quantity inspection report from accredited surveyor.',
        priority: 'medium',
        weight: 10,
        blocksDispatch: false,
      },
    ],
    packagingItems: [
      {
        title: 'Anti-Rust Coating & VCI Wrapping for Steel Products',
        type: 'packaging',
        priority: 'high',
        mandatory: true,
        initialStatus: 'incomplete',
        notes: 'Volatile corrosion inhibitor (VCI) wrapping applied to prevent rust during ocean transit.',
      },
      {
        title: 'Bundle Strapping & Steel Banding (ISO 4171)',
        type: 'packaging',
        priority: 'high',
        mandatory: true,
        initialStatus: 'incomplete',
        notes: 'Steel coils/bars bundled and banded per ISO 4171 for safe transport.',
      },
      {
        title: 'Heat Number & Grade Marking Labels',
        type: 'labelling',
        priority: 'high',
        mandatory: true,
        initialStatus: 'incomplete',
        notes: 'Each bundle must display heat number, grade, and manufacturer stamp.',
      },
      {
        title: 'Container Dunnage & Load Securing Plan',
        type: 'packaging',
        priority: 'medium',
        mandatory: true,
        initialStatus: 'incomplete',
        notes: 'Wooden dunnage and lashing plan for container load stability.',
      },
      {
        title: 'Weight Verification & Tally Sheet',
        type: 'labelling',
        priority: 'medium',
        mandatory: false,
        initialStatus: 'incomplete',
        notes: 'Cross-verify actual weight against invoice and bill of lading declared weight.',
      },
    ],
    shipmentPrereqs: [
      {
        type: 'shipment',
        title: 'Export Quality Control Order Compliance',
        description: 'Steel products must comply with DGFT Quality Control Orders before export.',
        priority: 'critical',
        weight: 15,
        initialStatus: 'missing',
      },
      {
        type: 'shipment',
        title: 'Pre-Shipment Inspection Clearance',
        description: 'Container loading supervision and pre-shipment survey by accredited inspector.',
        priority: 'high',
        weight: 10,
        initialStatus: 'missing',
      },
    ],
  },

  Food: {
    label: 'Food',
    businessTypeLabel: 'Food Processing MSME Exporter',
    categoryMatch: 'Food',
    defaultProduct: {
      name: 'Processed Food Products (Ready-to-Eat / Canned)',
      hsCode: '2008.99.11',
      unit: 'MT',
      defaultValue: 1200000,
    },
    requirements: [
      {
        type: 'document',
        title: 'FSSAI Central Export License',
        description: 'Food Safety and Standards Authority of India central license for food export operations.',
        priority: 'critical',
        weight: 20,
        blocksDispatch: true,
      },
      {
        type: 'certification',
        title: 'Phytosanitary Inspection Certificate',
        description: 'Plant quarantine clearance from Directorate of Plant Protection for food cargo.',
        priority: 'critical',
        weight: 20,
        blocksDispatch: true,
      },
      {
        type: 'certification',
        title: 'Halal Food Compliance Certificate',
        description: 'Certificate from accredited Halal certification body for food exports to GCC/Islamic countries.',
        priority: 'high',
        weight: 15,
        blocksDispatch: false,
      },
      {
        type: 'document',
        title: 'APEDA/RCMC Export Registration',
        description: 'Registration-Cum-Membership Certificate from APEDA for processed food exports.',
        priority: 'critical',
        weight: 15,
        blocksDispatch: true,
      },
      {
        type: 'certification',
        title: 'Health & Hygiene Certificate',
        description: 'Health certificate issued by authorized medical officer for food safety.',
        priority: 'high',
        weight: 10,
        blocksDispatch: false,
      },
      {
        type: 'document',
        title: 'Commercial Invoice & Packing List',
        description: 'Export invoice specifying unit price, HS Code, batch number, manufacturing and expiry dates.',
        priority: 'high',
        weight: 10,
        blocksDispatch: true,
      },
    ],
    packagingItems: [
      {
        title: 'Food-Grade Aseptic Container Hermetic Sealing',
        type: 'packaging',
        priority: 'high',
        mandatory: true,
        initialStatus: 'incomplete',
        notes: 'Inner food-grade liner integrity verified for sealed containers.',
      },
      {
        title: 'Bilingual English/Arabic Nutrition & Expiry Labelling',
        type: 'labelling',
        priority: 'high',
        mandatory: true,
        initialStatus: 'incomplete',
        notes: 'Each container must display ingredients, nutrition info, batch code, MFG/EXP in English & Arabic.',
      },
      {
        title: 'Cold Chain Temperature Logger Placement',
        type: 'packaging',
        priority: 'high',
        mandatory: true,
        initialStatus: 'incomplete',
        notes: 'Temperature data logger required inside each reefer container for perishable goods.',
      },
      {
        title: 'ISPM-15 Heat-Treated Wooden Pallets',
        type: 'packaging',
        priority: 'medium',
        mandatory: false,
        initialStatus: 'incomplete',
        notes: 'Wooden pallets must bear ISPM-15 phytosanitary treatment stamp.',
      },
    ],
    shipmentPrereqs: [
      {
        type: 'shipment',
        title: 'Cold Chain Logistics Arrangement',
        description: 'Reefer container booking and cold chain continuity verification for perishable food.',
        priority: 'critical',
        weight: 15,
        initialStatus: 'missing',
      },
      {
        type: 'shipment',
        title: 'Port Health Officer Clearance',
        description: 'Health inspection clearance at port of export for food cargo.',
        priority: 'high',
        weight: 10,
        initialStatus: 'missing',
      },
    ],
  },

  'Agricultural Goods': {
    label: 'Agricultural Goods',
    businessTypeLabel: 'Agricultural MSME Exporter',
    categoryMatch: 'Agricultural',
    defaultProduct: {
      name: 'Premium Agricultural Produce (Grains / Pulses / Spices)',
      hsCode: '0713.20.00',
      unit: 'MT',
      defaultValue: 900000,
    },
    requirements: [
      {
        type: 'document',
        title: 'APEDA Registration Certificate (RCMC)',
        description: 'Mandatory APEDA registration for export of agricultural and processed food products.',
        priority: 'critical',
        weight: 20,
        blocksDispatch: true,
      },
      {
        type: 'certification',
        title: 'Phytosanitary Certificate',
        description: 'Plant quarantine inspection certificate from Directorate of Plant Protection.',
        priority: 'critical',
        weight: 20,
        blocksDispatch: true,
      },
      {
        type: 'certification',
        title: 'Fumigation Certificate (Methyl Bromide / Phosphine)',
        description: 'Pest treatment certificate confirming fumigation of agricultural cargo.',
        priority: 'critical',
        weight: 15,
        blocksDispatch: true,
      },
      {
        type: 'document',
        title: 'Certificate of Origin (CoO)',
        description: 'Non-preferential certificate of origin from authorized Chamber of Commerce.',
        priority: 'critical',
        weight: 15,
        blocksDispatch: true,
      },
      {
        type: 'certification',
        title: 'Plant Quarantine Clearance Certificate',
        description: 'Clearance from plant quarantine station at port of export.',
        priority: 'high',
        weight: 10,
        blocksDispatch: true,
      },
      {
        type: 'document',
        title: 'Commercial Invoice & Weight Certificate',
        description: 'Export invoice with quantity, grade, and certified weight from approved weighbridge.',
        priority: 'high',
        weight: 10,
        blocksDispatch: true,
      },
    ],
    packagingItems: [
      {
        title: 'Jute / PP Woven Bag Stitching & Moisture Barrier',
        type: 'packaging',
        priority: 'high',
        mandatory: true,
        initialStatus: 'incomplete',
        notes: 'Bags sealed with moisture-proof inner liner for grain/pulse protection.',
      },
      {
        title: 'Lot Number & Grade Marking on Bags',
        type: 'labelling',
        priority: 'high',
        mandatory: true,
        initialStatus: 'incomplete',
        notes: 'Each bag must show lot number, grade, net weight, and exporter details.',
      },
      {
        title: 'Container Ventilation & Desiccant Placement',
        type: 'packaging',
        priority: 'medium',
        mandatory: true,
        initialStatus: 'incomplete',
        notes: 'Desiccant bags placed inside container to prevent moisture damage during transit.',
      },
    ],
    shipmentPrereqs: [
      {
        type: 'shipment',
        title: 'Warehouse Fumigation Pre-Loading Certificate',
        description: 'Fumigation of warehouse and loading area before container stuffing.',
        priority: 'critical',
        weight: 15,
        initialStatus: 'missing',
      },
      {
        type: 'shipment',
        title: 'Sampling & Quality Check by AGMARK Inspector',
        description: 'Pre-shipment quality and grading inspection by authorized AGMARK inspector.',
        priority: 'high',
        weight: 10,
        initialStatus: 'missing',
      },
    ],
  },

  Diamonds: {
    label: 'Diamonds',
    businessTypeLabel: 'Diamond & Precious Stones MSME Exporter',
    categoryMatch: 'Diamond',
    defaultProduct: {
      name: 'Cut & Polished Diamonds (Natural / Lab-Grown)',
      hsCode: '7102.39.00',
      unit: 'CT',
      defaultValue: 5000000,
    },
    requirements: [
      {
        type: 'certification',
        title: 'Kimberley Process Certificate (KPC)',
        description: 'Mandatory Kimberley Process certification for rough and polished diamond exports.',
        priority: 'critical',
        weight: 25,
        blocksDispatch: true,
      },
      {
        type: 'certification',
        title: 'GIA / IGI Diamond Grading Report',
        description: 'Gemological grading report from GIA or IGI for each diamond lot (4Cs verification).',
        priority: 'critical',
        weight: 20,
        blocksDispatch: true,
      },
      {
        type: 'document',
        title: 'Certificate of Origin (CoO)',
        description: 'Certificate of origin issued by GJEPC (Gem & Jewellery Export Promotion Council).',
        priority: 'critical',
        weight: 15,
        blocksDispatch: true,
      },
      {
        type: 'document',
        title: 'Customs Valuation Certificate',
        description: 'Government-approved valuation of diamond consignment for customs declaration.',
        priority: 'high',
        weight: 10,
        blocksDispatch: true,
      },
      {
        type: 'document',
        title: 'GJEPC Membership & Export Authorization',
        description: 'Active membership of Gem & Jewellery Export Promotion Council for diamond export license.',
        priority: 'high',
        weight: 10,
        blocksDispatch: false,
      },
    ],
    packagingItems: [
      {
        title: 'Tamper-Proof Sealed Diamond Parcel Packaging',
        type: 'packaging',
        priority: 'high',
        mandatory: true,
        initialStatus: 'incomplete',
        notes: 'Diamonds packed in tamper-evident sealed parcels with unique serial numbers.',
      },
      {
        title: 'Individual Stone Identification & Barcode Labels',
        type: 'labelling',
        priority: 'high',
        mandatory: true,
        initialStatus: 'incomplete',
        notes: 'Each parcel labelled with carat weight, clarity, cut, color grade, and barcode.',
      },
      {
        title: 'High-Security Vault Packaging for Air Transit',
        type: 'packaging',
        priority: 'high',
        mandatory: true,
        initialStatus: 'incomplete',
        notes: 'Secure vault-grade container for high-value diamond air cargo.',
      },
      {
        title: 'Insurance Documentation & Declared Value Tag',
        type: 'labelling',
        priority: 'medium',
        mandatory: false,
        initialStatus: 'incomplete',
        notes: 'Declared value tag attached to each parcel for cargo insurance purposes.',
      },
    ],
    shipmentPrereqs: [
      {
        type: 'shipment',
        title: 'Customs Bonded Warehouse Clearance',
        description: 'Export clearance from customs bonded warehouse at designated diamond trading zone.',
        priority: 'critical',
        weight: 15,
        initialStatus: 'missing',
      },
      {
        type: 'shipment',
        title: 'Armed Security Escort Arrangement',
        description: 'Secure transit with armed escort from vault to airport for high-value diamond shipments.',
        priority: 'high',
        weight: 10,
        initialStatus: 'missing',
      },
    ],
  },

  Gold: {
    label: 'Gold',
    businessTypeLabel: 'Gold & Precious Metals MSME Exporter',
    categoryMatch: 'Gold',
    defaultProduct: {
      name: 'Gold Bars & Jewellery (Hallmarked 22K / 24K)',
      hsCode: '7108.13.00',
      unit: 'GM',
      defaultValue: 8000000,
    },
    requirements: [
      {
        type: 'certification',
        title: 'BIS Hallmark Certificate',
        description: 'Bureau of Indian Standards hallmarking for gold purity (22K/24K) verification.',
        priority: 'critical',
        weight: 20,
        blocksDispatch: true,
      },
      {
        type: 'certification',
        title: 'Assay Report (Gold Purity Test)',
        description: 'Independent assay laboratory report confirming gold fineness and purity.',
        priority: 'critical',
        weight: 20,
        blocksDispatch: true,
      },
      {
        type: 'document',
        title: 'Certificate of Origin (CoO)',
        description: 'Certificate of origin issued by authorized Chamber of Commerce or GJEPC.',
        priority: 'critical',
        weight: 15,
        blocksDispatch: true,
      },
      {
        type: 'document',
        title: 'RBI Authorization for Gold Export',
        description: 'Reserve Bank of India authorization/no-objection for export of gold and precious metals.',
        priority: 'critical',
        weight: 15,
        blocksDispatch: true,
      },
      {
        type: 'document',
        title: 'Customs Declaration & Valuation Certificate',
        description: 'Customs export declaration with certified valuation for gold consignment.',
        priority: 'high',
        weight: 10,
        blocksDispatch: true,
      },
    ],
    packagingItems: [
      {
        title: 'Tamper-Proof Sealed Gold Bar Packaging',
        type: 'packaging',
        priority: 'high',
        mandatory: true,
        initialStatus: 'incomplete',
        notes: 'Gold bars sealed in tamper-evident packaging with unique serial identifiers.',
      },
      {
        title: 'Hallmark & Purity Stamp Verification Labels',
        type: 'labelling',
        priority: 'high',
        mandatory: true,
        initialStatus: 'incomplete',
        notes: 'Each item labelled with BIS hallmark, purity (KT), weight (grams), and assay certificate number.',
      },
      {
        title: 'High-Security Vault Container for Air Transit',
        type: 'packaging',
        priority: 'high',
        mandatory: true,
        initialStatus: 'incomplete',
        notes: 'Armored vault-grade container required for high-value gold air cargo.',
      },
      {
        title: 'Insurance Declared Value & Customs Seal',
        type: 'labelling',
        priority: 'medium',
        mandatory: true,
        initialStatus: 'incomplete',
        notes: 'Customs seal and declared value label applied to each secure parcel.',
      },
    ],
    shipmentPrereqs: [
      {
        type: 'shipment',
        title: 'RBI Export Compliance Clearance',
        description: 'RBI compliance clearance for gold export under FEMA regulations.',
        priority: 'critical',
        weight: 15,
        initialStatus: 'missing',
      },
      {
        type: 'shipment',
        title: 'Armed Security & Vault-to-Airport Logistics',
        description: 'Secure armed transit from vault facility to airport cargo terminal.',
        priority: 'high',
        weight: 10,
        initialStatus: 'missing',
      },
    ],
  },
};

/**
 * GSTIN format: 2 digits (state) + 5 alpha (PAN) + 4 digits + 1 alpha + 1 alphanumeric + Z + 1 alphanumeric
 * Example: 27AAACP1234F1Z5
 */
export const GSTIN_REGEX = /^\d{2}[A-Z]{5}\d{4}[A-Z]{1}[A-Z\d]{1}Z[A-Z\d]{1}$/;

/**
 * IEC Code format: exactly 10 digits
 * Example: 0301099882
 */
export const IEC_REGEX = /^\d{10}$/;

export function validateGSTIN(gstin: string): { valid: boolean; error?: string } {
  const cleaned = gstin.trim().toUpperCase();
  if (!cleaned) return { valid: false, error: 'GSTIN is required.' };
  if (cleaned.length !== 15) return { valid: false, error: 'GSTIN must be exactly 15 characters.' };
  if (!GSTIN_REGEX.test(cleaned)) {
    return {
      valid: false,
      error: 'Invalid GSTIN format. Expected: 2 digits + 5 letters (PAN) + 4 digits + 1 letter + 1 alphanumeric + Z + 1 alphanumeric (e.g. 27AAACP1234F1Z5).',
    };
  }
  return { valid: true };
}

export function validateIEC(iec: string): { valid: boolean; error?: string } {
  const cleaned = iec.trim();
  if (!cleaned) return { valid: false, error: 'IEC Code is required.' };
  if (cleaned.length !== 10) return { valid: false, error: 'IEC Code must be exactly 10 digits.' };
  if (!IEC_REGEX.test(cleaned)) {
    return { valid: false, error: 'Invalid IEC format. Must be exactly 10 digits (e.g. 0301099882).' };
  }
  return { valid: true };
}
