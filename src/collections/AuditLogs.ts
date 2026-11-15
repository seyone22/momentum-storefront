import { CollectionConfig } from 'payload';

export const AuditLogs: CollectionConfig = {
  slug: 'audit-logs',
  admin: {
    useAsTitle: 'action',
    defaultColumns: ['createdAt', 'action', 'entityType', 'entityRef', 'actorEmail', 'status'],
    description: 'Immutable system-wide audit trail for orders, inventory, returns, auth, webhooks, and settings.',
  },
  access: {
    read: ({ req }) => req.user?.collection === 'users',
    create: () => false, // Append-only via server-side overrideAccess
    update: () => false, // Immutable
    delete: () => false, // Immutable
  },
  fields: [
    {
      name: 'action',
      type: 'text',
      required: true,
      index: true,
    },
    {
      name: 'entityType',
      type: 'select',
      required: true,
      index: true,
      options: [
        'order',
        'product',
        'return',
        'customer',
        'user',
        'store-settings',
        'media',
        'webhook',
        'tracking',
      ],
    },
    {
      name: 'entityId',
      type: 'text',
    },
    {
      name: 'entityRef',
      type: 'text',
      index: true,
    },
    {
      name: 'actorType',
      type: 'select',
      defaultValue: 'system',
      options: ['admin', 'customer', 'system', 'webhook', 'guest'],
    },
    {
      name: 'actorId',
      type: 'text',
    },
    {
      name: 'actorEmail',
      type: 'text',
      index: true,
    },
    {
      name: 'ipAddress',
      type: 'text',
    },
    {
      name: 'userAgent',
      type: 'text',
    },
    {
      name: 'status',
      type: 'select',
      defaultValue: 'success',
      options: ['success', 'failure', 'skipped'],
    },
    {
      name: 'summary',
      type: 'text',
      required: true,
    },
    {
      name: 'metadata',
      type: 'json',
    },
  ],
};
