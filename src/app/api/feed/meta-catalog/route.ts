import { NextRequest, NextResponse } from "next/server";
import { getPayload } from "payload";
import configPromise from "@payload-config";

function escapeCsv(val: unknown): string {
  const s = String(val ?? "").replace(/\r?\n/g, " ");
  if (s.includes(",") || s.includes('"')) {
    return `"${s.replace(/"/g, '""')}"`;
  }
  return s;
}

function resolveMediaUrl(media: unknown, origin: string): string {
  if (!media || typeof media !== "object") return "";
  const url = (media as { url?: string | null }).url;
  if (!url) return "";
  if (url.startsWith("http://") || url.startsWith("https://")) return url;
  return `${origin}${url.startsWith("/") ? "" : "/"}${url}`;
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const format = searchParams.get("format") || "csv";
    const availabilityOverride = searchParams.get("availability");

    const forwardedHost = req.headers.get("x-forwarded-host") || req.headers.get("host");
    const forwardedProto = req.headers.get("x-forwarded-proto") || "https";
    const origin = forwardedHost
      ? `${forwardedProto}://${forwardedHost}`
      : req.nextUrl.origin;

    const payload = await getPayload({ config: configPromise });

    let configuredAvailability = "in stock";
    try {
      const settings = (await payload.findGlobal({
        slug: "store-settings",
      })) as unknown as Record<string, unknown>;
      if (settings?.catalogAvailabilityMode) {
        configuredAvailability = String(settings.catalogAvailabilityMode);
      }
    } catch {
      configuredAvailability = "in stock";
    }

    const inStockLabel =
      availabilityOverride === "preorder"
        ? "available for order"
        : availabilityOverride === "instock"
          ? "in stock"
          : configuredAvailability;

    const productsResult = await payload.find({
      collection: "products",
      depth: 1,
      limit: 200,
    });

    const rows: Array<Record<string, string>> = [];

    for (const rawDoc of productsResult.docs) {
      const doc = rawDoc as unknown as Record<string, unknown>;
      const slug = String(doc.slug || doc.id);
      const name = String(doc.name || "Momentum Denim");
      const description = String(
        doc.description || `${name} — Limited drop specialty denim by Momentum Clothing.`
      );
      const priceLkr = Number(doc.priceLkr ?? 0);
      const priceStr = `${priceLkr.toFixed(2)} LKR`;
      const productUrl = `${origin}/product/${slug}`;
      const mainImage = resolveMediaUrl(doc.featuredImage, origin);

      const galleryArr = Array.isArray(doc.gallery) ? doc.gallery : [];
      const additionalImages = galleryArr
        .map((g: Record<string, unknown>) => resolveMediaUrl(g?.image, origin))
        .filter(Boolean)
        .join(",");

      const variants = Array.isArray(doc.variants)
        ? (doc.variants as Array<Record<string, unknown>>)
        : [];

      if (variants.length === 0) {
        rows.push({
          id: slug,
          item_group_id: slug,
          title: name,
          description,
          availability: inStockLabel,
          condition: "new",
          price: priceStr,
          link: productUrl,
          image_link: mainImage,
          additional_image_link: additionalImages,
          brand: "Momentum Clothing",
          size: "Standard",
          google_product_category: "Apparel & Accessories > Clothing > Pants > Jeans",
        });
        continue;
      }

      for (const variant of variants) {
        const size = String(variant.size || "28");
        const sku = String(variant.sku || `${slug}-${size}`);
        const stockCap = Number(variant.stockCap ?? 0);
        const sold = Number(variant.sold ?? 0);
        const remaining = Math.max(0, stockCap - sold);

        rows.push({
          id: sku,
          item_group_id: slug,
          title: `${name} — Size ${size}`,
          description,
          availability: remaining > 0 ? inStockLabel : "out of stock",
          condition: "new",
          price: priceStr,
          link: productUrl,
          image_link: mainImage,
          additional_image_link: additionalImages,
          brand: "Momentum Clothing",
          size,
          google_product_category: "Apparel & Accessories > Clothing > Pants > Jeans",
        });
      }
    }

    if (format === "json") {
      return NextResponse.json(
        {
          availabilityMode: inStockLabel,
          count: rows.length,
          items: rows,
        },
        {
          headers: {
            "Cache-Control": "public, s-maxage=300, stale-while-revalidate=600",
          },
        }
      );
    }

    const headers = [
      "id",
      "item_group_id",
      "title",
      "description",
      "availability",
      "condition",
      "price",
      "link",
      "image_link",
      "additional_image_link",
      "brand",
      "size",
      "google_product_category",
    ];

    const csvLines = [
      headers.join(","),
      ...rows.map((row) => headers.map((h) => escapeCsv(row[h])).join(",")),
    ];

    return new NextResponse(csvLines.join("\n"), {
      status: 200,
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": 'inline; filename="momentum-meta-catalog.csv"',
        "Cache-Control": "public, s-maxage=300, stale-while-revalidate=600",
      },
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to generate catalog feed";
    console.error("Meta catalog feed error:", error);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
