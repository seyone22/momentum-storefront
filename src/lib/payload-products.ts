import { getPayload } from 'payload';
import configPromise from '@payload-config';
import { PRODUCTS as SEED_PRODUCTS, Product, ProductMediaItem, ProductVariant } from './products';

let seedPromise: Promise<void> | null = null;

async function ensureInitialProductsSeeded() {
  if (seedPromise) return seedPromise;

  seedPromise = (async () => {
    try {
      const payload = await getPayload({ config: configPromise });
      const existing = await payload.find({
        collection: 'products',
        limit: 1,
      });

      if (existing.totalDocs === 0) {
        for (const item of SEED_PRODUCTS) {
          await payload.create({
            collection: 'products',
            data: {
              name: item.name,
              slug: item.slug,
              category: item.category as 'Specialty Denim' | 'Denim Outerwear' | 'Basics',
              priceLkr: item.priceLkr,
              preOrderBatchCap: item.variants.reduce((sum, v) => sum + v.stock, 0),
              description: item.description,
              fabric: item.fabric,
              featuredOnHome: true,
              details: item.details.map((d) => ({ item: d })),
              variants: item.variants.map((v) => ({
                size: v.size,
                sku: `MMTM-${item.id}-${v.size}`,
                stockCap: v.stock,
                sold: 0,
              })),
            },
          });
        }
      }
    } catch (err) {
      console.error('Failed to seed initial products into Payload:', err);
      seedPromise = null;
    }
  })();

  return seedPromise;
}

function mapMedia(media: unknown, fallbackAlt: string): ProductMediaItem | null {
  if (!media || typeof media !== 'object') return null;
  const m = media as { url?: string | null; alt?: string | null };
  if (!m.url) return null;
  return {
    url: m.url,
    alt: m.alt || fallbackAlt,
  };
}

function mapPayloadDocToProduct(doc: Record<string, unknown>): Product {
  const name = String(doc.name ?? '');
  const rawVariants = Array.isArray(doc.variants) ? doc.variants : [];
  const variants: ProductVariant[] = rawVariants.map((v: Record<string, unknown>) => {
    const stockCap = Number(v.stockCap ?? 0);
    const sold = Number(v.sold ?? 0);
    const stock = Math.max(0, stockCap - sold);
    return {
      size: String(v.size ?? '28') as ProductVariant['size'],
      sku: v.sku ? String(v.sku) : undefined,
      stock,
      inStock: stock > 0,
    };
  });

  const rawDetails = Array.isArray(doc.details) ? doc.details : [];
  const details = rawDetails
    .map((d: Record<string, unknown>) => (d?.item ? String(d.item) : ''))
    .filter(Boolean);

  const rawGallery = Array.isArray(doc.gallery) ? doc.gallery : [];
  const gallery = rawGallery
    .map((g: Record<string, unknown>) => mapMedia(g?.image, name))
    .filter((m): m is ProductMediaItem => m !== null);

  return {
    id: String(doc.id ?? ''),
    slug: String(doc.slug ?? ''),
    name,
    category: String(doc.category ?? 'Specialty Denim'),
    priceLkr: Number(doc.priceLkr ?? 0),
    description: String(doc.description ?? ''),
    details,
    fabric: String(doc.fabric ?? ''),
    featuredOnHome: doc.featuredOnHome !== false,
    featuredImage: mapMedia(doc.featuredImage, name),
    gallery,
    variants,
    createdAt: doc.createdAt ? String(doc.createdAt) : undefined,
  };
}

export async function getStorefrontProducts(): Promise<Product[]> {
  try {
    await ensureInitialProductsSeeded();
    const payload = await getPayload({ config: configPromise });
    const res = await payload.find({
      collection: 'products',
      depth: 1,
      limit: 100,
      sort: 'createdAt',
    });

    if (res.docs.length > 0) {
      return res.docs.map((doc) => mapPayloadDocToProduct(doc as unknown as Record<string, unknown>));
    }
  } catch (err) {
    console.error('Error fetching products from Payload:', err);
  }

  return SEED_PRODUCTS;
}

export async function getFeaturedProducts(): Promise<Product[]> {
  const all = await getStorefrontProducts();
  const featured = all.filter((p) => p.featuredOnHome !== false);
  return featured.length > 0 ? featured : all;
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  try {
    await ensureInitialProductsSeeded();
    const payload = await getPayload({ config: configPromise });
    const res = await payload.find({
      collection: 'products',
      where: {
        slug: {
          equals: slug,
        },
      },
      depth: 1,
      limit: 1,
    });

    if (res.docs.length > 0) {
      return mapPayloadDocToProduct(res.docs[0] as unknown as Record<string, unknown>);
    }
  } catch (err) {
    console.error(`Error fetching product slug=${slug} from Payload:`, err);
  }

  return SEED_PRODUCTS.find((p) => p.slug === slug) ?? null;
}
