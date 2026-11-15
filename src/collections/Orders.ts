import { CollectionConfig } from 'payload';
import { sendMetaCapiEvent } from '../lib/meta-capi';

export const Orders: CollectionConfig = {
  slug: 'orders',
  admin: {
    useAsTitle: 'orderNumber',
    defaultColumns: ['orderNumber', 'customerName', 'totalLkr', 'paymentStatus', 'fulfillmentStatus'],
  },
  hooks: {
    beforeChange: [
      async ({ data, operation }) => {
        if (operation === 'create' && !data.orderNumber) {
          data.orderNumber = `MMTM-${Math.floor(100000 + Math.random() * 900000)}`;
        }
        if (
          (!data.totalLkr || Number(data.totalLkr) <= 0) &&
          Array.isArray(data.items) &&
          data.items.length > 0
        ) {
          data.totalLkr = (data.items as Array<Record<string, unknown>>).reduce(
            (sum, item) =>
              sum + Math.max(1, Number(item.quantity ?? 1)) * Math.max(0, Number(item.unitPriceLkr ?? 0)),
            0
          );
        }
        return data;
      },
    ],
    afterChange: [
      async ({ doc, req, context }) => {
        if (context?.skipCapiHook) return doc;

        if (doc.paymentStatus === 'paid' && doc.capiPurchaseSent !== true) {
          let pixelIdOverride: string | null = null;
          try {
            const settings = (await req.payload.findGlobal({
              slug: 'store-settings',
              req,
            })) as unknown as Record<string, unknown>;
            if (settings?.metaPixelId) {
              pixelIdOverride = String(settings.metaPixelId);
            }
          } catch {
            // Fallback to env META_PIXEL_ID
          }

          const eventId = `purchase_${String(doc.orderNumber || doc.id)}`;
          const items = Array.isArray(doc.items)
            ? (doc.items as Array<Record<string, unknown>>)
            : [];

          const result = await sendMetaCapiEvent({
            eventName: 'Purchase',
            eventId,
            actionSource:
              doc.paymentRail === 'Bank Transfer (WhatsApp)' ? 'chat' : 'website',
            userData: {
              email: doc.customerEmail ? String(doc.customerEmail) : null,
              phone: doc.customerPhone ? String(doc.customerPhone) : null,
              name: doc.customerName ? String(doc.customerName) : null,
              city: doc.city ? String(doc.city) : null,
              externalId: String(doc.orderNumber || doc.id),
              fbp: doc.fbp ? String(doc.fbp) : null,
              fbc: doc.fbc ? String(doc.fbc) : null,
            },
            customData: {
              currency: 'LKR',
              value: Number(doc.totalLkr ?? 0),
              order_id: String(doc.orderNumber || doc.id),
              content_type: 'product',
              contents: items.map((i) => ({
                id: String(i.productId || i.productName || 'item'),
                quantity: Math.max(1, Number(i.quantity ?? 1)),
                item_price: Number(i.unitPriceLkr ?? 0),
              })),
            },
            pixelIdOverride,
          });

          if (result.sent) {
            await req.payload.update({
              collection: 'orders',
              id: doc.id,
              data: {
                capiPurchaseSent: true,
                capiPurchaseEventId: eventId,
              },
              context: {
                ...context,
                skipCapiHook: true,
              },
              req,
            });
          }
        }

        return doc;
      },
    ],
  },
  fields: [
    {
      name: 'orderNumber',
      type: 'text',
      unique: true,
      admin: {
        description: 'Auto-generated (MMTM-XXXXXX) if left blank.',
      },
    },
    {
      name: 'customer',
      type: 'relationship',
      relationTo: 'customers',
      label: 'Customer Account',
      admin: {
        position: 'sidebar',
      },
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
      name: 'shippingAddress',
      type: 'text',
      required: true,
    },
    {
      name: 'city',
      type: 'text',
      required: true,
    },
    {
      name: 'totalLkr',
      type: 'number',
      defaultValue: 0,
      admin: {
        description: 'Leave as 0 to auto-calculate from Ordered Items.',
      },
    },
    {
      name: 'paymentRail',
      type: 'select',
      options: ['Payments.lk', 'Bank Transfer (WhatsApp)', 'Koko / Mintpay'],
      defaultValue: 'Payments.lk',
    },
    {
      name: 'paymentStatus',
      type: 'select',
      options: ['pending', 'paid', 'failed', 'partially_refunded', 'refunded'],
      defaultValue: 'pending',
    },
    {
      name: 'paymentsLkCheckoutId',
      type: 'text',
      admin: {
        readOnly: true,
        position: 'sidebar',
      },
    },
    {
      name: 'paymentsLkPaymentId',
      type: 'text',
      admin: {
        readOnly: true,
        position: 'sidebar',
      },
    },
    {
      name: 'refundedLkr',
      type: 'number',
      defaultValue: 0,
      admin: {
        readOnly: true,
        position: 'sidebar',
      },
    },
    {
      name: 'paymentLinkUrl',
      type: 'text',
      label: 'WhatsApp Payment Link',
      admin: {
        readOnly: true,
        position: 'sidebar',
      },
    },
    {
      name: 'paymentLinkAction',
      type: 'ui',
      admin: {
        position: 'sidebar',
        components: {
          Field: '@/components/admin/WhatsAppPaymentLinkButton#WhatsAppPaymentLinkButton',
        },
      },
    },
    {
      name: 'capiPurchaseSent',
      type: 'checkbox',
      defaultValue: false,
      label: 'Meta CAPI Purchase Sent',
      admin: {
        readOnly: true,
        position: 'sidebar',
      },
    },
    {
      name: 'capiPurchaseEventId',
      type: 'text',
      label: 'Meta CAPI Event ID',
      admin: {
        readOnly: true,
        position: 'sidebar',
      },
    },
    {
      name: 'utmSource',
      type: 'text',
      label: 'UTM Source',
      admin: {
        readOnly: true,
        position: 'sidebar',
      },
    },
    {
      name: 'utmMedium',
      type: 'text',
      label: 'UTM Medium',
      admin: {
        readOnly: true,
        position: 'sidebar',
      },
    },
    {
      name: 'utmCampaign',
      type: 'text',
      label: 'UTM Campaign',
      admin: {
        readOnly: true,
        position: 'sidebar',
      },
    },
    {
      name: 'utmContent',
      type: 'text',
      label: 'UTM Content',
      admin: {
        readOnly: true,
        position: 'sidebar',
      },
    },
    {
      name: 'utmTerm',
      type: 'text',
      label: 'UTM Term',
      admin: {
        readOnly: true,
        position: 'sidebar',
      },
    },
    {
      name: 'fbclid',
      type: 'text',
      label: 'Meta fbclid',
      admin: {
        readOnly: true,
        position: 'sidebar',
      },
    },
    {
      name: 'fbp',
      type: 'text',
      label: 'Meta _fbp Cookie',
      admin: {
        readOnly: true,
        position: 'sidebar',
      },
    },
    {
      name: 'fbc',
      type: 'text',
      label: 'Meta _fbc Cookie',
      admin: {
        readOnly: true,
        position: 'sidebar',
      },
    },
    {
      name: 'fulfillmentStatus',
      type: 'select',
      options: ['pre_order_placed', 'payment_verified', 'in_production', 'dispatched'],
      defaultValue: 'pre_order_placed',
    },
    {
      name: 'promptTrackingNumber',
      type: 'text',
      label: 'Prompt Xpress Tracking #',
    },
    {
      name: 'items',
      type: 'array',
      label: 'Ordered Items',
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
  ],
};
