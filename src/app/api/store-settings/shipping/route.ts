import { NextResponse } from "next/server";
import { getPayload } from "payload";
import configPromise from "@payload-config";
import { DEFAULT_SHIPPING_SETTINGS, extractShippingSettings } from "@/lib/shipping";

export async function GET() {
  try {
    const payload = await getPayload({ config: configPromise });
    const settings = await payload.findGlobal({ slug: "store-settings" });
    return NextResponse.json(
      extractShippingSettings(settings as unknown as Record<string, unknown>)
    );
  } catch {
    return NextResponse.json(DEFAULT_SHIPPING_SETTINGS);
  }
}
