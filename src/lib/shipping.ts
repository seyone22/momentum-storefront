export interface ShippingSettingsConfig {
  shippingEnabled: boolean;
  colomboShippingLkr: number;
  outstationShippingLkr: number;
  freeShippingThresholdLkr: number;
  extraPieceThreshold: number;
  extraPieceSurchargeLkr: number;
}

export const DEFAULT_SHIPPING_SETTINGS: ShippingSettingsConfig = {
  shippingEnabled: false,
  colomboShippingLkr: 350,
  outstationShippingLkr: 550,
  freeShippingThresholdLkr: 0,
  extraPieceThreshold: 2,
  extraPieceSurchargeLkr: 150,
};

const METRO_DISTRICTS = new Set(["colombo", "gampaha"]);

export function extractShippingSettings(
  raw?: Record<string, unknown> | null
): ShippingSettingsConfig {
  if (!raw) return { ...DEFAULT_SHIPPING_SETTINGS };
  return {
    shippingEnabled: Boolean(raw.shippingEnabled),
    colomboShippingLkr: Math.max(
      0,
      Number(raw.colomboShippingLkr ?? DEFAULT_SHIPPING_SETTINGS.colomboShippingLkr)
    ),
    outstationShippingLkr: Math.max(
      0,
      Number(raw.outstationShippingLkr ?? DEFAULT_SHIPPING_SETTINGS.outstationShippingLkr)
    ),
    freeShippingThresholdLkr: Math.max(
      0,
      Number(raw.freeShippingThresholdLkr ?? DEFAULT_SHIPPING_SETTINGS.freeShippingThresholdLkr)
    ),
    extraPieceThreshold: Math.max(
      1,
      Math.floor(Number(raw.extraPieceThreshold ?? DEFAULT_SHIPPING_SETTINGS.extraPieceThreshold))
    ),
    extraPieceSurchargeLkr: Math.max(
      0,
      Number(raw.extraPieceSurchargeLkr ?? DEFAULT_SHIPPING_SETTINGS.extraPieceSurchargeLkr)
    ),
  };
}

export interface ShippingCalculationResult {
  shippingLkr: number;
  baseRateLkr: number;
  extraSurchargeLkr: number;
  extraPieces: number;
  zone: "colombo" | "outstation";
  freeShippingApplied: boolean;
  ruleSummary: string;
}

export function calculateShippingLkr(params: {
  subtotalLkr: number;
  itemCount: number;
  district?: string | null;
  settings: ShippingSettingsConfig;
}): ShippingCalculationResult {
  const { subtotalLkr, itemCount, district, settings } = params;
  const normalizedDistrict = (district || "Colombo").trim().toLowerCase();
  const zone: "colombo" | "outstation" = METRO_DISTRICTS.has(normalizedDistrict)
    ? "colombo"
    : "outstation";

  if (!settings.shippingEnabled) {
    return {
      shippingLkr: 0,
      baseRateLkr: 0,
      extraSurchargeLkr: 0,
      extraPieces: 0,
      zone,
      freeShippingApplied: true,
      ruleSummary: "Complimentary Islandwide Delivery",
    };
  }

  if (
    settings.freeShippingThresholdLkr > 0 &&
    subtotalLkr >= settings.freeShippingThresholdLkr
  ) {
    return {
      shippingLkr: 0,
      baseRateLkr: 0,
      extraSurchargeLkr: 0,
      extraPieces: 0,
      zone,
      freeShippingApplied: true,
      ruleSummary: `Free Shipping (Orders LKR ${settings.freeShippingThresholdLkr.toLocaleString()}+)`,
    };
  }

  const baseRateLkr =
    zone === "colombo" ? settings.colomboShippingLkr : settings.outstationShippingLkr;
  const extraPieces = Math.max(0, itemCount - settings.extraPieceThreshold);
  const extraSurchargeLkr = extraPieces * settings.extraPieceSurchargeLkr;
  const shippingLkr = Math.max(0, baseRateLkr + extraSurchargeLkr);

  const zoneLabel = zone === "colombo" ? "Colombo / Gampaha" : "Outstation";
  const ruleSummary =
    extraSurchargeLkr > 0
      ? `${zoneLabel} (incl. ${extraPieces} extra pc weight surcharge)`
      : `${zoneLabel} Standard Courier`;

  return {
    shippingLkr,
    baseRateLkr,
    extraSurchargeLkr,
    extraPieces,
    zone,
    freeShippingApplied: shippingLkr === 0,
    ruleSummary,
  };
}
