import { CollectionConfig } from 'payload';

export const Orders: CollectionConfig = {
  slug: 'orders',
  admin: {
    useAsTitle: 'orderNumber',
    defaultColumns: ['orderNumber', 'customerName', 'totalLkr', 'paymentStatus', 'fulfillmentStatus'],
  },
  fields: [
    {
      name: 'orderNumber',
      type: 'text',
      required: true,
      unique: true,
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
      required: true,
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
      options: ['pending', 'paid', 'failed', 'refunded'],
      defaultValue: 'pending',
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
  ],
};
