import { CollectionConfig, Where } from 'payload';

export const Customers: CollectionConfig = {
  slug: 'customers',
  admin: {
    useAsTitle: 'email',
    defaultColumns: ['name', 'email', 'phone', 'defaultCity', 'createdAt'],
  },
  auth: {
    tokenExpiration: 60 * 60 * 24 * 14, // 14 days
    maxLoginAttempts: 5,
    lockTime: 10 * 60 * 1000, // 10 minutes
  },
  access: {
    create: () => true,
    read: ({ req }) => {
      if (!req.user) return false;
      if (req.user.collection === 'users') return true;
      if (req.user.collection === 'customers') {
        const where: Where = { id: { equals: req.user.id } };
        return where;
      }
      return false;
    },
    update: ({ req }) => {
      if (!req.user) return false;
      if (req.user.collection === 'users') return true;
      if (req.user.collection === 'customers') {
        const where: Where = { id: { equals: req.user.id } };
        return where;
      }
      return false;
    },
    delete: ({ req }) => req.user?.collection === 'users',
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
    },
    {
      name: 'phone',
      type: 'text',
      label: 'Phone Number',
    },
    {
      name: 'defaultAddress',
      type: 'textarea',
      label: 'Default Delivery Address',
    },
    {
      name: 'defaultCity',
      type: 'text',
      label: 'Default City',
    },
    {
      name: 'defaultDistrict',
      type: 'text',
      label: 'Default District',
    },
    {
      name: 'defaultPostalCode',
      type: 'text',
      label: 'Default Postal / Zip Code',
    },
    {
      name: 'marketingEmailOptIn',
      type: 'checkbox',
      defaultValue: false,
      label: 'Marketing Emails Opt-In',
    },
  ],
};
