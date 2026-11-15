import { CollectionConfig } from 'payload';

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
