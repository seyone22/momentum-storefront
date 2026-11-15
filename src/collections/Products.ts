import { CollectionConfig } from 'payload';
import { diffRecord, writeAuditLog } from '../lib/audit';

export const Products: CollectionConfig = {
  slug: 'products',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'category', 'priceLkr', 'preOrderBatchCap'],
  },
  hooks: {
    afterChange: [
      async ({ doc, previousDoc, operation, req }) => {
        const changes =
          operation === 'update'
            ? diffRecord(
                previousDoc as unknown as Record<string, unknown>,
                doc as unknown as Record<string, unknown>
              )
            : undefined;
        await writeAuditLog({
          payload: req.payload,
          headers: req.headers,
          reqUser: req.user as { id?: string | number; email?: string; collection?: string } | null,
          action: operation === 'create' ? 'product.created' : 'product.updated',
          entityType: 'product',
          entityId: doc.id,
          entityRef: String(doc.slug || doc.name || doc.id),
          summary: `Product ${operation === 'create' ? 'created' : 'updated'}: ${doc.name}`,
          metadata: changes ? { changes } : { priceLkr: doc.priceLkr },
        });
        return doc;
      },
    ],
    afterDelete: [
      async ({ doc, req }) => {
        await writeAuditLog({
          payload: req.payload,
          headers: req.headers,
          reqUser: req.user as { id?: string | number; email?: string; collection?: string } | null,
          action: 'product.deleted',
          entityType: 'product',
          entityId: doc.id,
          entityRef: String(doc.slug || doc.name || doc.id),
          summary: `Product deleted: ${doc.name}`,
        });
        return doc;
      },
    ],
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
    },
    {
      name: 'category',
      type: 'select',
      options: ['Specialty Denim', 'Denim Outerwear', 'Basics'],
      defaultValue: 'Specialty Denim',
    },
    {
      name: 'priceLkr',
      type: 'number',
      required: true,
      label: 'Price (LKR)',
    },
    {
      name: 'preOrderBatchCap',
      type: 'number',
      label: 'Batch Limit (Cap)',
      defaultValue: 100,
    },
    {
      name: 'description',
      type: 'textarea',
    },
    {
      name: 'fabric',
      type: 'text',
    },
    {
      name: 'featuredOnHome',
      type: 'checkbox',
      label: 'Feature on Landing Page',
      defaultValue: true,
    },
    {
      name: 'featuredImage',
      type: 'upload',
      relationTo: 'media',
      label: 'Primary Product Photo',
    },
    {
      name: 'gallery',
      type: 'array',
      label: 'Additional Photos',
      fields: [
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
          required: true,
        },
      ],
    },
    {
      name: 'details',
      type: 'array',
      label: 'Garment Specifications',
      fields: [
        {
          name: 'item',
          type: 'text',
          required: true,
        },
      ],
    },
    {
      name: 'variants',
      type: 'array',
      fields: [
        {
          name: 'size',
          type: 'select',
          options: ['26', '27', '28', '29', '30', '32'],
          required: true,
        },
        {
          name: 'sku',
          type: 'text',
          required: true,
        },
        {
          name: 'stockCap',
          type: 'number',
          required: true,
          defaultValue: 20,
        },
        {
          name: 'sold',
          type: 'number',
          defaultValue: 0,
        },
      ],
    },
  ],
};
