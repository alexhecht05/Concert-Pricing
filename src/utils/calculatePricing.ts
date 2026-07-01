import {
  CAPABILITIES,
  PARTS,
  TSHIRT_SIZES,
  type TshirtSize,
} from '../data/pricingData';

// ─── Types ────────────────────────────────────────────────────────────────────

export interface CapabilityInput {
  enabled: boolean;
  /** Primary quantity (apps, servers, certs, workflows) */
  quantity: number;
  /** Compliance only: number of frameworks */
  frameworks?: number;
}

export type CapabilityInputMap = Record<string, CapabilityInput>;

export interface PricingInputs {
  capabilities: CapabilityInputMap;
  partId: string;
  discountPercent: number;
}

export interface BreakdownRow {
  capabilityId: string;
  label: string;
  useCase: string;
  quantity: number;
  frameworks?: number;
  rus: number;
}

export interface PricingResult {
  totalRUs: number;
  breakdown: BreakdownRow[];
  tshirtSize: TshirtSize | null;
  listPrice: number;
  discountedPrice: number;
  partNumber: string;
  partDescription: string;
  pricePerRU: number;
  discountPercent: number;
}

// ─── Core calculation ─────────────────────────────────────────────────────────

export function calculatePricing(inputs: PricingInputs): PricingResult {
  const breakdown: BreakdownRow[] = [];
  let totalRUs = 0;

  for (const cap of CAPABILITIES) {
    const input = inputs.capabilities[cap.id];
    if (!input?.enabled || input.quantity <= 0) continue;

    let rus = 0;

    if (cap.id === 'certificate') {
      // 1 RU per 10 certificates → ceil(n / 10)
      rus = Math.ceil(input.quantity / 10);
    } else if (cap.id === 'compliance') {
      // (frameworks × 3) + (apps × 2)
      const fw = input.frameworks ?? 0;
      rus = fw * (cap.ruPerFramework ?? 3) + input.quantity * cap.ruPerUnit;
    } else if (cap.id === 'apm_essentials') {
      // 1 RU per 7 servers → ceil(n / 7)
      rus = Math.ceil(input.quantity / 7);
    } else if (cap.id === 'apm_standard') {
      // 1 RU per 2 servers → ceil(n / 2)
      rus = Math.ceil(input.quantity / 2);
    } else if (cap.id === 'optimization') {
      // 1 RU per 5 servers → ceil(n / 5)
      rus = Math.ceil(input.quantity / 5);
    } else {
      rus = input.quantity * cap.ruPerUnit;
    }

    if (rus > 0) {
      breakdown.push({
        capabilityId: cap.id,
        label: cap.label,
        useCase: cap.useCase,
        quantity: input.quantity,
        frameworks: cap.id === 'compliance' ? (input.frameworks ?? 0) : undefined,
        rus,
      });
      totalRUs += rus;
    }
  }

  // Round total RUs up to nearest integer
  totalRUs = Math.ceil(totalRUs);

  // Match T-shirt size: find the smallest size >= totalRUs, or largest if over all
  const tshirtSize =
    TSHIRT_SIZES.find((s) => totalRUs <= s.rus) ??
    TSHIRT_SIZES[TSHIRT_SIZES.length - 1];

  // Pricing
  const part = PARTS.find((p) => p.partNumber === inputs.partId) ?? PARTS[0];
  const listPrice = totalRUs * part.pricePerRU;
  const discountedPrice = listPrice * (1 - inputs.discountPercent / 100);

  return {
    totalRUs,
    breakdown,
    tshirtSize: totalRUs > 0 ? tshirtSize : null,
    listPrice,
    discountedPrice,
    partNumber: part.partNumber,
    partDescription: part.description,
    pricePerRU: part.pricePerRU,
    discountPercent: inputs.discountPercent,
  };
}
