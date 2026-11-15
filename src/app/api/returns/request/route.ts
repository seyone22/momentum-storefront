import { NextRequest, NextResponse } from "next/server";
import { getPayload } from "payload";
import configPromise from "@payload-config";

function normalizePhone(phone: string): string {
  const digits = phone.replace(/\D/g, "");
  return digits.length >= 9 ? digits.slice(-9) : digits;
}

export async function POST(req: NextRequest) {
  try {
    const contentType = req.headers.get("content-type") || "";
    let orderNumber = "";
    let customerPhone = "";
    let type: "size_exchange" | "defective_replacement" | "refund_claim" = "size_exchange";
    let itemSize = "";
    let exchangeSize = "";
    let productName = "";
    let productId = "";
    let quantity = 1;
    let unitPriceLkr = 0;
    let reason = "";
    const uploadedFiles: File[] = [];

    if (contentType.includes("multipart/form-data")) {
      const formData = await req.formData();
      orderNumber = String(formData.get("orderNumber") || "").trim().toUpperCase();
      customerPhone = String(formData.get("customerPhone") || "").trim();
      const rawType = String(formData.get("type") || "size_exchange");
      if (
        rawType === "size_exchange" ||
        rawType === "defective_replacement" ||
        rawType === "refund_claim"
      ) {
        type = rawType;
      }
      productId = String(formData.get("productId") || "").trim();
      productName = String(formData.get("productName") || "").trim();
      itemSize = String(formData.get("size") || "").trim();
      exchangeSize = String(formData.get("exchangeSize") || "").trim();
      quantity = Math.max(1, Number(formData.get("quantity") || 1));
      unitPriceLkr = Math.max(0, Number(formData.get("unitPriceLkr") || 0));
      reason = String(formData.get("reason") || "").trim();

      const files = formData.getAll("photos");
      for (const f of files) {
        if (f instanceof File && f.size > 0) {
          if (!f.type.startsWith("image/")) {
            return NextResponse.json(
              { error: "Only image files are allowed for defect evidence." },
              { status: 400 }
            );
          }
          if (f.size > 5 * 1024 * 1024) {
            return NextResponse.json(
              { error: "Each evidence photo must be under 5 MB." },
              { status: 400 }
            );
          }
          uploadedFiles.push(f);
        }
      }
      if (uploadedFiles.length > 3) {
        return NextResponse.json(
          { error: "You can upload up to 3 evidence photos." },
          { status: 400 }
        );
      }
    } else {
      const body = await req.json();
      orderNumber = String(body.orderNumber || "").trim().toUpperCase();
      customerPhone = String(body.customerPhone || "").trim();
      if (
        body.type === "size_exchange" ||
        body.type === "defective_replacement" ||
        body.type === "refund_claim"
      ) {
        type = body.type;
      }
      productId = String(body.productId || "").trim();
      productName = String(body.productName || "").trim();
      itemSize = String(body.size || "").trim();
      exchangeSize = String(body.exchangeSize || "").trim();
      quantity = Math.max(1, Number(body.quantity || 1));
      unitPriceLkr = Math.max(0, Number(body.unitPriceLkr || 0));
      reason = String(body.reason || "").trim();
    }

    if (!orderNumber || !customerPhone || !reason) {
      return NextResponse.json(
        { error: "Order number, phone number, and reason are required." },
        { status: 400 }
      );
    }

    const payload = await getPayload({ config: configPromise });
    const found = await payload.find({
      collection: "orders",
      where: {
        orderNumber: { equals: orderNumber },
      },
      limit: 1,
    });

    if (found.docs.length === 0) {
      return NextResponse.json({ error: "Order not found." }, { status: 404 });
    }

    const orderDoc = found.docs[0] as unknown as Record<string, unknown>;
    if (normalizePhone(String(orderDoc.customerPhone || "")) !== normalizePhone(customerPhone)) {
      return NextResponse.json(
        { error: "Phone number does not match this order." },
        { status: 403 }
      );
    }

    const orderItems = Array.isArray(orderDoc.items)
      ? (orderDoc.items as Array<Record<string, unknown>>)
      : [];
    const matchedItem =
      orderItems.find(
        (i) =>
          (!productName || String(i.productName) === productName) &&
          (!itemSize || String(i.size) === itemSize)
      ) || orderItems[0];

    if (!matchedItem && !productName) {
      return NextResponse.json(
        { error: "No ordered item found to attach to this return request." },
        { status: 400 }
      );
    }

    // Upload evidence photos to Payload Media (persisted in momentum-media S3 bucket)
    const mediaIds: number[] = [];
    for (const file of uploadedFiles) {
      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      const uploaded = await payload.create({
        collection: "media",
        data: {
          alt: `RMA Evidence for ${orderNumber}`,
        },
        file: {
          data: buffer,
          mimetype: file.type,
          name: `${orderNumber}-${Date.now()}-${file.name.replace(/[^a-zA-Z0-9._-]/g, "_")}`,
          size: file.size,
        },
      });
      mediaIds.push(Number(uploaded.id));
    }

    const rmaNumber = `RMA-${Math.floor(100000 + Math.random() * 900000)}`;
    const createdRma = await payload.create({
      collection: "returns",
      data: {
        rmaNumber,
        order: Number(orderDoc.id),
        type,
        status: "requested",
        customerName: String(orderDoc.customerName || "Customer"),
        customerPhone: String(orderDoc.customerPhone || customerPhone),
        customerEmail: orderDoc.customerEmail ? String(orderDoc.customerEmail) : undefined,
        items: [
          {
            productId: String(matchedItem?.productId ?? productId ?? ""),
            productName: String(matchedItem?.productName ?? productName),
            size: String(matchedItem?.size ?? itemSize ?? "N/A"),
            exchangeSize: type === "size_exchange" ? exchangeSize || undefined : undefined,
            quantity: Number(matchedItem?.quantity ?? quantity ?? 1),
            unitPriceLkr: Number(matchedItem?.unitPriceLkr ?? unitPriceLkr ?? 0),
          },
        ],
        reason,
        evidencePhotos: mediaIds.length > 0 ? mediaIds : undefined,
        restockOnComplete: type === "size_exchange",
        refundAmountLkr:
          type === "refund_claim"
            ? Number(matchedItem?.unitPriceLkr ?? orderDoc.totalLkr ?? 0)
            : 0,
        refundStatus: "none",
      },
    });

    return NextResponse.json({
      success: true,
      rmaNumber: createdRma.rmaNumber,
      status: createdRma.status,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to submit return request";
    console.error("RMA request error:", error);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
