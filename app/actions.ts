'use server';

import { prisma } from '@/lib/prisma';
import { calculateReadinessScore } from '@/lib/services/readiness';
import { revalidatePath } from 'next/cache';
import { cookies } from 'next/headers';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';
import {
  BUSINESS_TYPE_CONFIGS,
  validateGSTIN,
  validateIEC,
  type BusinessType,
} from '@/lib/businessTypeConfig';

async function saveFileLocally(file: File | null, prefix: string): Promise<{ storageKey: string, size: number, name: string } | null> {
  if (!file || file.size === 0) return null;
  const buffer = Buffer.from(await file.arrayBuffer());
  const filename = `${prefix}_${Date.now()}_${file.name.replace(/[^a-zA-Z0-9.]/g, '_')}`;
  
  const uploadDir = path.join(process.cwd(), 'public', 'uploads');
  try {
    await mkdir(uploadDir, { recursive: true });
  } catch (e) {}

  const filepath = path.join(uploadDir, filename);
  await writeFile(filepath, buffer);
  
  return { storageKey: `uploads/${filename}`, size: file.size, name: file.name };
}


// Cookie key for active persona
const PERSONA_COOKIE = 'vyaparflow_active_role';
const USER_ID_COOKIE = 'vyaparflow_active_user_id';

export async function getActiveUser(): Promise<{
  user: any;
  role: 'MSME' | 'PROVIDER' | 'ADMIN';
}> {
  const cookieStore = await cookies();
  const userIdVal = cookieStore.get(USER_ID_COOKIE)?.value;
  const roleVal = cookieStore.get(PERSONA_COOKIE)?.value;

  if (userIdVal && roleVal) {
    const user = await prisma.user.findUnique({
      where: { id: userIdVal },
      include: { 
        businesses: { 
          include: { 
            products: { 
              include: { 
                destinations: { include: { country: true } } 
              } 
            } 
          } 
        },
        providers: true 
      },
    });
    if (user) {
      return { user, role: roleVal as 'MSME' | 'PROVIDER' | 'ADMIN' };
    }
  }

  // Fallback to demo user if no cookie or user not found
  const demoMsme = await prisma.user.findFirst({
    where: { role: 'MSME' },
    include: { 
      businesses: { 
        include: { 
          products: { 
            include: { 
              destinations: { include: { country: true } } 
            } 
          } 
        } 
      },
      providers: true
    },
  });

  return { user: demoMsme, role: 'MSME' };
}

export async function switchUserRoleAction(role: 'MSME' | 'PROVIDER' | 'ADMIN'): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.set(PERSONA_COOKIE, role);
  revalidatePath('/');
}

export async function switchUserAccountAction(userId: string): Promise<void> {
  const cookieStore = await cookies();
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (user) {
    cookieStore.set(USER_ID_COOKIE, user.id);
    cookieStore.set(PERSONA_COOKIE, user.role);
    revalidatePath('/');
  }
}

export async function uploadDocumentAction(formData: FormData): Promise<void> {
  const requirementId = formData.get('requirementId') as string;
  const businessId = formData.get('businessId') as string;
  const docType = formData.get('docType') as string;
  const file = formData.get('file') as File | null;
  const notes = formData.get('notes') as string;

  if (!businessId) {
    throw new Error('Business ID is required for document upload');
  }

  const saved = await saveFileLocally(file, docType || 'doc');
  const filename = saved?.name || file?.name || `${docType}_Sample_Evidence.pdf`;
  const storageKey = saved?.storageKey || `uploads/${Date.now()}_${filename.replace(/\s+/g, '_')}`;

  await prisma.document.create({
    data: {
      businessId,
      requirementId: requirementId || null,
      type: docType || 'ComplianceEvidence',
      storageKey,
      originalName: filename,
      mimeType: file?.type || 'application/pdf',
      size: saved?.size || file?.size || 256000,
      issueDate: new Date(),
      expiryDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
      status: 'under_review',
      notes: notes || 'Uploaded for export readiness verification.',
    },
  });

  if (requirementId) {
    await prisma.requirement.update({
      where: { id: requirementId },
      data: {
        status: 'under_review',
        reason: 'Document uploaded successfully. Awaiting platform verification.',
      },
    });
  }

  revalidatePath('/dashboard');
  revalidatePath('/documents');
  revalidatePath('/readiness');
}

export async function verifyDocumentAction(documentId: string, status: 'verified' | 'rejected', notes?: string): Promise<void> {
  const doc = await prisma.document.update({
    where: { id: documentId },
    data: {
      status,
      notes: notes || (status === 'verified' ? 'Document verified by Platform Admin.' : 'Rejected due to legibility/format error.'),
    },
  });

  if (doc.requirementId) {
    await prisma.requirement.update({
      where: { id: doc.requirementId },
      data: {
        status,
        reason: status === 'verified' ? 'Requirement verified with document proof.' : 'Uploaded document rejected.',
        completedAt: status === 'verified' ? new Date() : null,
      },
    });
  }

  const { user } = await getActiveUser();
  if (user) {
    await prisma.auditLog.create({
      data: {
        actorId: user.id,
        entityType: 'Document',
        entityId: documentId,
        action: status === 'verified' ? 'VERIFY_DOCUMENT' : 'REJECT_DOCUMENT',
        newValueJson: JSON.stringify({ status, notes }),
      },
    });
  }

  revalidatePath('/dashboard');
  revalidatePath('/documents');
  revalidatePath('/readiness');
}

export async function requestCertificationAction(requirementId: string, providerId: string): Promise<void> {
  const req = await prisma.requirement.findUnique({
    where: { id: requirementId },
  });

  if (!req) throw new Error('Requirement not found');

  const providerTask = await prisma.providerTask.create({
    data: {
      providerId,
      requirementId,
      type: 'CERTIFICATION',
      status: 'in_progress',
      notes: `Certification request submitted for: ${req.title}`,
    },
  });

  await prisma.certificationRequest.create({
    data: {
      requirementId,
      providerTaskId: providerTask.id,
      status: 'in_progress',
    },
  });

  await prisma.requirement.update({
    where: { id: requirementId },
    data: {
      status: 'under_review',
      reason: 'Certification request assigned to accredited laboratory provider.',
    },
  });

  revalidatePath('/dashboard');
  revalidatePath('/certifications');
  revalidatePath('/readiness');
}

export async function updatePackagingItemAction(itemId: string, status: 'completed' | 'incomplete'): Promise<void> {
  await prisma.packagingItem.update({
    where: { id: itemId },
    data: { status },
  });

  revalidatePath('/dashboard');
  revalidatePath('/packaging');
  revalidatePath('/readiness');
}

export async function createShipmentAction(formData: FormData): Promise<void> {
  const businessId = formData.get('businessId') as string;
  const productName = formData.get('productName') as string;

  let product = await prisma.product.findFirst({
    where: { businessId, name: productName },
  });

  if (!product) {
    product = await prisma.product.findFirst({
      where: { businessId },
    });
  }

  if (!product) throw new Error('No product found');
  const productId = product.id;
  const destinationCountryId = formData.get('destinationCountryId') as string;
  const destinationCity = (formData.get('destinationCity') as string) || 'Dubai';
  const value = parseFloat((formData.get('value') as string) || '1500000');
  const quantity = parseFloat((formData.get('quantity') as string) || '10');
  const weight = parseFloat((formData.get('weight') as string) || '10000');
  const packages = parseInt((formData.get('packages') as string) || '500', 10);
  const mode = (formData.get('mode') as string) || 'Sea';

  const shipmentNumber = `SHP-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`;

  const shipment = await prisma.shipment.create({
    data: {
      shipmentNumber,
      businessId,
      productId,
      destinationCountryId,
      destinationCity,
      value,
      quantity,
      weight,
      packages,
      mode,
      status: 'Draft',
    },
  });

  const providers = await prisma.provider.findMany({ where: { type: 'FREIGHT' } });
  if (providers.length >= 3) {
    await prisma.quote.createMany({
      data: [
        {
          shipmentId: shipment.id,
          providerId: providers[0].id,
          mode: 'Sea Freight (FCL 20ft Reefer)',
          cost: Math.round(value * 0.08),
          currency: 'INR',
          transitMin: 12,
          transitMax: 15,
          inclusions: 'Port handling, JNPT customs documentation assistance, Cold storage (+4°C)',
          exclusions: 'Destination import duties & tax',
        },
        {
          shipmentId: shipment.id,
          providerId: providers[1].id,
          mode: 'Sea Freight Express (Direct Liner)',
          cost: Math.round(value * 0.10),
          currency: 'INR',
          transitMin: 8,
          transitMax: 10,
          inclusions: 'Factory gate pickup in Palghar, Priority container discharge',
          exclusions: 'Local warehouse demurrage',
        },
        {
          shipmentId: shipment.id,
          providerId: providers[2].id,
          mode: 'Air Cargo Express',
          cost: Math.round(value * 0.18),
          currency: 'INR',
          transitMin: 2,
          transitMax: 3,
          inclusions: 'Direct flight BOM -> DXB, Airport cold store handling',
          exclusions: 'Heavy cargo surcharge',
        },
      ],
    });
  }

  await prisma.trackingEvent.create({
    data: {
      shipmentId: shipment.id,
      status: 'Order Confirmed',
      location: 'Palghar Industrial Estate, Maharashtra',
      note: 'Shipment created and draft export documentation prepared.',
    },
  });

  revalidatePath('/shipments');
}

export async function selectQuoteAction(shipmentId: string, quoteId: string): Promise<void> {
  await prisma.quote.updateMany({
    where: { shipmentId },
    data: { isSelected: false },
  });

  const selectedQuote = await prisma.quote.update({
    where: { id: quoteId },
    data: { isSelected: true },
    include: { provider: true },
  });

  await prisma.shipment.update({
    where: { id: shipmentId },
    data: { status: 'Preparation' },
  });

  await prisma.providerTask.create({
    data: {
      shipmentId,
      providerId: selectedQuote.providerId,
      type: 'FREIGHT',
      status: 'accepted',
      notes: `Quote accepted for ${selectedQuote.mode} at ₹${selectedQuote.cost.toLocaleString('en-IN')}`,
    },
  });

  const chaProvider = await prisma.provider.findFirst({ where: { type: 'CUSTOMS_CHA' } });
  if (chaProvider) {
    await prisma.providerTask.create({
      data: {
        shipmentId,
        providerId: chaProvider.id,
        type: 'CUSTOMS_CHA',
        status: 'requested',
        notes: 'Customs declaration & Shipping Bill filing task created.',
      },
    });
  }

  revalidatePath('/shipments');
  revalidatePath(`/shipments/${shipmentId}`);
}

export async function updateProviderTaskAction(taskId: string, status: string, notes?: string): Promise<void> {
  const task = await prisma.providerTask.update({
    where: { id: taskId },
    data: {
      status,
      notes,
      completedAt: status === 'completed' ? new Date() : null,
    },
  });

  if (task.requirementId && status === 'completed') {
    await prisma.requirement.update({
      where: { id: task.requirementId },
      data: {
        status: 'verified',
        completedAt: new Date(),
        reason: 'Requirement completed & verified by service provider.',
      },
    });
  }

  revalidatePath('/provider');
  revalidatePath('/dashboard');
  revalidatePath('/readiness');
}

export async function addTrackingEventAction(shipmentId: string, status: string, location: string, note?: string): Promise<void> {
  await prisma.trackingEvent.create({
    data: {
      shipmentId,
      status,
      location,
      note,
    },
  });

  await prisma.shipment.update({
    where: { id: shipmentId },
    data: { status },
  });

  revalidatePath('/shipments');
  revalidatePath(`/shipments/${shipmentId}`);
  revalidatePath(`/shipments/${shipmentId}/tracking`);
}

export async function updateRuleAction(ruleId: string, data: { priority?: string; weight?: number; blocksDispatch?: boolean; active?: boolean }): Promise<void> {
  await prisma.rule.update({
    where: { id: ruleId },
    data: {
      ...data,
      version: { increment: 1 },
    },
  });

  revalidatePath('/admin');
  revalidatePath('/dashboard');
  revalidatePath('/readiness');
}

export async function registerUserAction(formData: FormData): Promise<void> {
  const name = formData.get('name') as string;
  const email = formData.get('email') as string;
  const password = (formData.get('password') as string) || 'password123';
  const role = (formData.get('role') as 'MSME' | 'PROVIDER' | 'ADMIN') || 'MSME';
  const businessName = (formData.get('businessName') as string) || `${name} Exports Pvt Ltd`;
  const city = (formData.get('city') as string) || 'Palghar';
  const state = (formData.get('state') as string) || 'Maharashtra';
  const gstNumber = (formData.get('gstNumber') as string) || '';
  const iecCode = (formData.get('iecCode') as string) || '';
  const businessCategory = (formData.get('businessCategory') as string) || '';

  // Check if user already exists
  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    throw new Error('User with this email already exists');
  }

  if (role === 'MSME') {
    // Validate GSTIN & IEC are provided
    if (!gstNumber || !iecCode) {
      throw new Error('GSTIN Number and IEC Code are compulsory fields for MSME exporters.');
    }

    // Server-side GSTIN format verification
    const gstValidation = validateGSTIN(gstNumber);
    if (!gstValidation.valid) {
      throw new Error(`GSTIN Verification Failed: ${gstValidation.error}`);
    }

    // Server-side IEC format verification
    const iecValidation = validateIEC(iecCode);
    if (!iecValidation.valid) {
      throw new Error(`IEC Verification Failed: ${iecValidation.error}`);
    }

    // Validate business category
    if (!businessCategory || !(businessCategory in BUSINESS_TYPE_CONFIGS)) {
      throw new Error('Please select a valid business type (Steel, Food, Agricultural Goods, Diamonds, or Gold).');
    }
  }

  // Create User
  const newUser = await prisma.user.create({
    data: {
      email,
      name,
      passwordHash: password,
      role,
    },
  });

  if (role === 'MSME') {
    const bizType = businessCategory as BusinessType;
    const config = BUSINESS_TYPE_CONFIGS[bizType];

    // Create Business with registered GSTIN and IEC numbers
    const business = await prisma.business.create({
      data: {
        ownerUserId: newUser.id,
        legalName: `${businessName} Pvt Ltd`,
        displayName: businessName,
        businessType: config.businessTypeLabel,
        location: `${city} Industrial Area`,
        city,
        state,
        gstStatus: `Verified (${gstNumber.toUpperCase()})`,
        iecStatus: `Verified (${iecCode})`,
        profileCompletion: 60,
      },
    });

    // Find matching ProductCategory for this business type
    const matchingCategory = await prisma.productCategory.findFirst({
      where: {
        name: { contains: config.categoryMatch },
      },
    });

    const defaultCountry = await prisma.country.findFirst({ where: { isoCode: 'AE' } });

    if (matchingCategory && defaultCountry) {
      // Create default product based on business type
      const product = await prisma.product.create({
        data: {
          businessId: business.id,
          categoryId: matchingCategory.id,
          name: config.defaultProduct.name,
          hsCode: config.defaultProduct.hsCode,
          unit: config.defaultProduct.unit,
          defaultValue: config.defaultProduct.defaultValue,
        },
      });

      const pc = await prisma.productCountry.create({
        data: {
          productId: product.id,
          countryId: defaultCountry.id,
        },
      });

      // --- GSTIN & IEC as under_review requirements (awaiting admin proof verification) ---
      const gstReq = await prisma.requirement.create({
        data: {
          productCountryId: pc.id,
          type: 'document',
          title: 'GSTIN Registration Certificate',
          priority: 'critical',
          status: 'under_review',
          weight: 10,
          reason: `GSTIN number registered: ${gstNumber.toUpperCase()}. Awaiting proof document verification by admin.`,
        },
      });

      // Create placeholder proof document for GSTIN (admin can accept/reject)
      await prisma.document.create({
        data: {
          businessId: business.id,
          requirementId: gstReq.id,
          type: 'GST_CERTIFICATE',
          storageKey: `uploads/gst_proof_${Date.now()}.pdf`,
          originalName: `GSTIN_Proof_${gstNumber.toUpperCase()}.pdf`,
          mimeType: 'application/pdf',
          size: 150000,
          issueDate: new Date(),
          status: 'under_review',
          notes: `GSTIN: ${gstNumber.toUpperCase()} — Format validated. Awaiting admin verification of proof document.`,
        },
      });

      const iecReq = await prisma.requirement.create({
        data: {
          productCountryId: pc.id,
          type: 'document',
          title: 'Import Export Code (IEC) Certificate',
          priority: 'critical',
          status: 'under_review',
          weight: 10,
          reason: `IEC Code registered: ${iecCode}. Awaiting proof document verification by admin.`,
        },
      });

      // Create placeholder proof document for IEC (admin can accept/reject)
      await prisma.document.create({
        data: {
          businessId: business.id,
          requirementId: iecReq.id,
          type: 'IEC_CERTIFICATE',
          storageKey: `uploads/iec_proof_${Date.now()}.pdf`,
          originalName: `IEC_Proof_${iecCode}.pdf`,
          mimeType: 'application/pdf',
          size: 150000,
          issueDate: new Date(),
          status: 'under_review',
          notes: `IEC Code: ${iecCode} — Format validated. Awaiting admin verification of proof document.`,
        },
      });

      // --- Business-type-specific certificates & documents ---
      for (const req of config.requirements) {
        await prisma.requirement.create({
          data: {
            productCountryId: pc.id,
            type: req.type,
            title: req.title,
            priority: req.priority,
            status: 'missing',
            weight: req.weight,
            reason: req.description,
          },
        });
      }

      // --- Business-type-specific packaging & labelling items (some pre-completed for initial score) ---
      for (const item of config.packagingItems) {
        await prisma.packagingItem.create({
          data: {
            productCountryId: pc.id,
            title: item.title,
            type: item.type,
            priority: item.priority,
            mandatory: item.mandatory,
            status: item.initialStatus,
            notes: item.notes,
          },
        });
      }

      // --- Business-type-specific shipment prerequisites (some pre-verified for initial score) ---
      for (const shipReq of config.shipmentPrereqs) {
        await prisma.requirement.create({
          data: {
            productCountryId: pc.id,
            type: shipReq.type,
            title: shipReq.title,
            priority: shipReq.priority,
            status: shipReq.initialStatus,
            weight: shipReq.weight,
            reason: shipReq.description,
            completedAt: shipReq.initialStatus === 'verified' ? new Date() : null,
          },
        });
      }

      // Also generate requirements from any matching global rules
      const rules = await prisma.rule.findMany({
        where: {
          OR: [
            { categoryId: matchingCategory.id, countryId: defaultCountry.id },
            { categoryId: matchingCategory.id, countryId: null },
            { categoryId: null, countryId: defaultCountry.id },
          ],
          active: true,
        },
      });

      for (const rule of rules) {
        // Avoid duplicates — skip if a requirement with same title already exists
        const existingReq = await prisma.requirement.findFirst({
          where: {
            productCountryId: pc.id,
            title: rule.title,
          },
        });
        if (!existingReq) {
          await prisma.requirement.create({
            data: {
              productCountryId: pc.id,
              ruleId: rule.id,
              type: rule.type,
              title: rule.title,
              priority: rule.priority,
              status: 'missing',
              weight: rule.weight,
              reason: rule.description,
            },
          });
        }
      }
    }
  }

  // Switch role and log in
  await switchUserRoleAction(role);
}

export async function deleteUserAction(userId: string): Promise<void> {
  await prisma.user.delete({
    where: { id: userId },
  });

  revalidatePath('/admin');
  revalidatePath('/dashboard');
}

export async function getAllUsers(): Promise<Array<{
  id: string;
  name: string;
  email: string;
  role: 'MSME' | 'PROVIDER' | 'ADMIN';
  displayName: string;
}>> {
  const users = await prisma.user.findMany({
    include: {
      businesses: true,
      providers: true,
    },
    orderBy: { createdAt: 'asc' },
  });

  return users.map((u) => ({
    id: u.id,
    name: u.name,
    email: u.email,
    role: u.role as 'MSME' | 'PROVIDER' | 'ADMIN',
    displayName: u.businesses[0]?.displayName || u.providers[0]?.name || u.name,
  }));
}

export async function updateBusinessRegistrationsAction(formData: FormData): Promise<void> {
  const businessId = formData.get('businessId') as string;
  const gstNumber = formData.get('gstNumber') as string;
  const iecCode = formData.get('iecCode') as string;
  const gstFile = formData.get('gstFile') as File | null;
  const iecFile = formData.get('iecFile') as File | null;

  const updateData: any = {};
  if (gstNumber) {
    updateData.gstStatus = `Active (${gstNumber})`;
  }
  if (iecCode) {
    updateData.iecStatus = `Active (${iecCode})`;
  }

  if (gstNumber && iecCode) {
    updateData.profileCompletion = 100;
  } else if (gstNumber || iecCode) {
    updateData.profileCompletion = 60;
  }

  await prisma.business.update({
    where: { id: businessId },
    data: updateData,
  });

  const business = await prisma.business.findUnique({
    where: { id: businessId },
    include: { products: { include: { destinations: { include: { requirements: true } } } } },
  });

  if (business) {
    for (const p of business.products) {
      for (const dest of p.destinations) {
        for (const req of dest.requirements) {
          if (gstNumber && req.title.toLowerCase().includes('gst')) {
            await prisma.requirement.update({
              where: { id: req.id },
              data: { status: 'verified', reason: `GSTIN verified: ${gstNumber}` },
            });

            const gstSaved = await saveFileLocally(gstFile, 'gst');

            await prisma.document.create({
              data: {
                businessId,
                requirementId: req.id,
                type: 'GST_CERTIFICATE',
                storageKey: gstSaved?.storageKey || `uploads/gst_${Date.now()}.pdf`,
                originalName: gstSaved?.name || gstFile?.name || 'GSTIN_Certificate.pdf',
                mimeType: 'application/pdf',
                size: gstSaved?.size || gstFile?.size || 150000,
                status: 'verified',
                notes: `GSTIN: ${gstNumber}`,
              },
            });
          }

          if (iecCode && req.title.toLowerCase().includes('iec')) {
            await prisma.requirement.update({
              where: { id: req.id },
              data: { status: 'verified', reason: `IEC Code verified: ${iecCode}` },
            });

            const iecSaved = await saveFileLocally(iecFile, 'iec');

            await prisma.document.create({
              data: {
                businessId,
                requirementId: req.id,
                type: 'IEC_CERTIFICATE',
                storageKey: iecSaved?.storageKey || `uploads/iec_${Date.now()}.pdf`,
                originalName: iecSaved?.name || iecFile?.name || 'IEC_Certificate.pdf',
                mimeType: 'application/pdf',
                size: iecSaved?.size || iecFile?.size || 150000,
                status: 'verified',
                notes: `IEC Code: ${iecCode}`,
              },
            });
          }
        }
      }
    }
  }

  revalidatePath('/business');
  revalidatePath('/dashboard');
  revalidatePath('/readiness');
  revalidatePath('/documents');
}



