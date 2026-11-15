import type { CollectionConfig } from 'payload';

export const Returns: CollectionConfig = {
  slug: 'returns',
  admin: {
    useAsTitle: 'rmaNumber',
    defaultColumns: ['rmaNumber', 'order', 'type', 'status', 'refundStatus', 'refundAmountLkr'],
  },
  hooks: {
    beforeChange: [
      async ({ data, operation }) => {
        if (operation === 'create') {
          if (!data.rmaNumber) {
            data.rmaNumber = `RMA-${Math.floor(100000 + Math.random() * 900000)}`;
          }
          if (typeof data.restockOnComplete !== 'boolean') {
            data.restockOnComplete = data.type === 'size_exchange';
          }
        }
        return data;
      },
    ],
    afterChange: [
      async ({ doc, req, context }) => {
        if (context?.skipRestockHook) return doc;

        if (
          doc.status === 'completed' &&
          doc.restockOnComplete === true &&
          doc.restocked !== true &&
          Array.isArray(doc.items) &&
          doc.items.length > 0
        ) {
          for (const item of doc.items as Array<Record<string, unknown>>) {
            const prodId = Number(item.productId);
            if (Number.isNaN(prodId) || prodId <= 0) continue;

            try {
              const prod = (await req.payload.findByID({
                collection: 'products',
                id: prodId,
                req,
              })) as unknown as Record<string, unknown>;

              const variants = Array.isArray(prod.variants)
                ? (prod.variants as Array<Record<string, unknown>>)
                : [];

              const qty = Math.max(1, Number(item.quantity ?? 1));
              const returnedSize = String(item.size ?? '');
              const exchangeSize = String(item.exchangeSize ?? '');

              const updatedVariants = variants.map((v) => {
                const vSize = String(v.size ?? '');
                let sold = Number(v.sold ?? 0);

                if (vSize === returnedSize) {
                  sold = Math.max(0, sold - qty);
                }
                if (doc.type === 'size_exchange' && exchangeSize && vSize === exchangeSize) {
                  sold = sold + qty;
                }

                return { ...v, sold };
              });

              await req.payload.update({
                collection: 'products',
                id: prodId,
                data: {
                  variants: updatedVariants as never,
                },
                req,
              });
            } catch (err) {
              req.payload.logger.error({ err }, `RMA restock failed for product ${prodId}`);
            }
          }

          await req.payload.update({
            collection: 'returns',
            id: doc.id,
            data: {
              restocked: true,
            },
            context: {
              ...context,
              skipRestockHook: true,
            },
            req,
          });
        }

        return doc;
      },
    ],
  },
  fields: [
    {
      name: 'rmaNumber',
      type: 'text',
      required: true,
      unique: true,
    },
    {
      name: 'order',
      type: 'relationship',
      relationTo: 'orders',
      required: true,
    },
    {
      name: 'type',
      type: 'select',
      required: true,
      defaultValue: 'size_exchange',
      options: [
        { label: 'Size Exchange (7-Day Window)', value: 'size_exchange' },
        { label: 'Defective / Damaged Replacement (48h Claim)', value: 'defective_replacement' },
        { label: 'Refund Claim', value: 'refund_claim' },
      ],
    },
    {
      name: 'status',
      type: 'select',
      required: true,
      defaultValue: 'requested',
      options: [
        { label: 'Requested', value: 'requested' },
        { label: 'Approved for Pickup', value: 'approved' },
        { label: 'Pickup Scheduled (Prompt Xpress)', value: 'pickup_scheduled' },
        { label: 'Received & Inspecting (Ja-Ela)', value: 'received_inspecting' },
        { label: 'Completed', value: 'completed' },
        { label: 'Rejected', value: 'rejected' },
      ],
    },
    {
      name: 'customerName',
      type: 'text',
      required: true,
    },
    {
      name: 'customerPhone',
      type: 'text',
      required: true,
    },
    {
      name: 'customerEmail',
      type: 'email',
    },
    {
      name: 'items',
      type: 'array',
      label: 'Returned / Exchanged Items',
      fields: [
        {
          name: 'productId',
          type: 'text',
        },
        {
          name: 'productName',
          type: 'text',
          required: true,
        },
        {
          name: 'size',
          type: 'text',
          required: true,
        },
        {
          name: 'exchangeSize',
          type: 'text',
          label: 'Requested Replacement Size (if exchange)',
        },
        {
          name: 'quantity',
          type: 'number',
          required: true,
          defaultValue: 1,
        },
        {
          name: 'unitPriceLkr',
          type: 'number',
          required: true,
        },
      ],
    },
    {
      name: 'reason',
      type: 'textarea',
    },
    {
      name: 'evidencePhotos',
      type: 'upload',
      relationTo: 'media',
      hasMany: true,
      label: 'Defect / Condition Evidence Photos',
    },
    {
      name: 'pickupTrackingNumber',
      type: 'text',
      label: 'Prompt Xpress Return Pickup Tracking #',
    },
    {
      name: 'inspectionNotes',
      type: 'textarea',
    },
    {
      name: 'restockOnComplete',
      type: 'checkbox',
      defaultValue: false,
      label: 'Restock returned item(s) when marked Completed',
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'restocked',
      type: 'checkbox',
      defaultValue: false,
      label: 'Inventory Restocked',
      admin: {
        readOnly: true,
        position: 'sidebar',
      },
    },
    {
      name: 'refundAmountLkr',
      type: 'number',
      defaultValue: 0,
      label: 'Refund Amount (LKR)',
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'refundStatus',
      type: 'select',
      defaultValue: 'none',
      options: [
        { label: 'None', value: 'none' },
        { label: 'Pending (Payments.lk)', value: 'pending' },
        { label: 'Succeeded', value: 'succeeded' },
        { label: 'Failed', value: 'failed' },
        { label: 'Canceled', value: 'canceled' },
        { label: 'Manual Bank Transfer', value: 'manual_bank_transfer' },
      ],
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'paymentsLkRefundId',
      type: 'text',
      admin: {
        readOnly: true,
        position: 'sidebar',
      },
    },
    {
      name: 'refundAction',
      type: 'ui',
      admin: {
        position: 'sidebar',
        components: {
          Field: '@/components/admin/ProcessRefundButton#ProcessRefundButton',
        },
      },
    },
  ],
};
