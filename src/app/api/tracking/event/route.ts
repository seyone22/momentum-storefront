import { NextRequest, NextResponse } from "next/server";
import { getPayload } from "payload";
import configPromise from "@payload-config";
import { sendMetaCapiEvent } from "@/lib/meta-capi";

const ALLOWED_EVENTS = new Set([
  "ViewContent",
  "ViewSizeChart",
  "AddToCart",
  "InitiateCheckout",
  "Purchase",
]);

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const eventName = typeof body?.eventName === "string" ? body.eventName.trim() : "";
    const eventId = typeof body?.eventId === "string" ? body.eventId.trim() : "";

    if (!eventName || !ALLOWED_EVENTS.has(eventName) || !eventId) {
      return NextResponse.json(
        { error: "Valid eventName and eventId are required" },
        { status: 400 }
      );
    }

    const forwardedFor = req.headers.get("x-forwarded-for");
    const clientIpAddress = forwardedFor
      ? forwardedFor.split(",")[0].trim()
      : req.headers.get("x-real-ip") || undefined;
    const clientUserAgent = req.headers.get("user-agent") || undefined;

    let pixelIdOverride: string | null = null;
    try {
      const payload = await getPayload({ config: configPromise });
      const settings = await payload.findGlobal({ slug: "store-settings" });
      if (settings?.metaPixelId) {
        pixelIdOverride = String(settings.metaPixelId);
      }
    } catch {
      // Fallback to META_PIXEL_ID env var inside sendMetaCapiEvent
    }

    const result = await sendMetaCapiEvent({
      eventName,
      eventId,
      eventSourceUrl:
        typeof body?.eventSourceUrl === "string" ? body.eventSourceUrl : undefined,
      actionSource: "website",
      pixelIdOverride,
      userData: {
        email: body?.userData?.email ?? null,
        phone: body?.userData?.phone ?? null,
        name: body?.userData?.name ?? null,
        city: body?.userData?.city ?? null,
        externalId: body?.userData?.externalId ?? null,
        fbp: typeof body?.fbp === "string" ? body.fbp : null,
        fbc: typeof body?.fbc === "string" ? body.fbc : null,
        clientIpAddress: clientIpAddress ?? null,
        clientUserAgent: clientUserAgent ?? null,
      },
      customData: body?.customData || undefined,
    });

    return NextResponse.json({
      success: true,
      eventId: result.eventId,
      sent: result.sent,
      skipped: result.skipped ?? false,
    });
  } catch (err) {
    console.error("[/api/tracking/event] Error:", err);
    return NextResponse.json(
      { error: "Failed to process tracking event" },
      { status: 500 }
    );
  }
}
