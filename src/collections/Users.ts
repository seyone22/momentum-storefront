import { CollectionConfig } from 'payload';
import { diffRecord, writeAuditLog } from '../lib/audit';

export const Users: CollectionConfig = {
  slug: 'users',
  admin: {
    useAsTitle: 'email',
  },
  auth: true,
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
          action: operation === 'create' ? 'user.created' : 'user.updated',
          entityType: 'user',
          entityId: doc.id,
          entityRef: String(doc.email || doc.id),
          summary: `Admin user ${operation === 'create' ? 'created' : 'updated'}: ${doc.email}`,
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
          action: 'user.deleted',
          entityType: 'user',
          entityId: doc.id,
          entityRef: String(doc.email || doc.id),
          summary: `Admin user deleted: ${doc.email}`,
        });
        return doc;
      },
    ],
  },
  fields: [
    {
      name: 'name',
      type: 'text',
    },
  ],
};
