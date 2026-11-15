import { CollectionConfig, Where } from 'payload';
import { diffRecord, writeAuditLog } from '../lib/audit';

export const Customers: CollectionConfig = {
  slug: 'customers',
  admin: {
    useAsTitle: 'email',
    defaultColumns: ['name', 'email', 'phone', 'defaultCity', 'createdAt'],
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
          action: operation === 'create' ? 'customer.created' : 'customer.updated',
          entityType: 'customer',
          entityId: doc.id,
          entityRef: String(doc.email || doc.id),
          summary: `Customer ${operation === 'create' ? 'created' : 'updated'}: ${doc.email}`,
          metadata: changes ? { changes } : undefined,
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
          action: 'customer.deleted',
          entityType: 'customer',
          entityId: doc.id,
          entityRef: String(doc.email || doc.id),
          summary: `Customer deleted: ${doc.email}`,
        });
        return doc;
      },
    ],
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
