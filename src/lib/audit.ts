import { getPayload, Payload } from "payload";
import configPromise from "@payload-config";

export type AuditEntityType =
  | "order"
  | "product"
  | "return"
  | "customer"
  | "user"
  | "store-settings"
  | "media"
  | "webhook"
  | "tracking";

export type AuditActorType = "admin" | "customer" | "system" | "webhook" | "guest";

export interface WriteAuditLogParams {
  payload?: Payload;
  headers?: Headers;
  reqUser?: {
    id?: string | number;
    email?: string;
    collection?: string;
  } | null;
  action: string;
  entityType: AuditEntityType;
  entityId?: string | number | null;
  entityRef?: string | null;
  actorType?: AuditActorType;
  actorId?: string | number | null;
  actorEmail?: string | null;
  status?: "success" | "failure" | "skipped";
  summary: string;
  metadata?: Record<string, unknown>;
}

const SENSITIVE_KEYS = new Set([
  "password",
  "hash",
  "salt",
  "resetPasswordToken",
  "resetPasswordExpiration",
  "resetPasswordRequestedAt",
  "sessions",
  "updatedAt",
  "createdAt",
]);

export function extractRequestMeta(headers?: Headers): {
  ipAddress?: string;
  userAgent?: string;
} {
  if (!headers) return {};
  const forwardedFor = headers.get("x-forwarded-for");
  const ipAddress = forwardedFor
    ? forwardedFor.split(",")[0].trim()
    : headers.get("x-real-ip") || undefined;
  const userAgent = headers.get("user-agent")?.slice(0, 300) || undefined;
  return { ipAddress, userAgent };
}

export function diffRecord(
  prev: Record<string, unknown> | undefined | null,
  next: Record<string, unknown> | undefined | null
): Record<string, { from: unknown; to: unknown }> {
  if (!prev || !next) return {};
  const changes: Record<string, { from: unknown; to: unknown }> = {};
  const keys = new Set([...Object.keys(prev), ...Object.keys(next)]);

  for (const key of keys) {
    if (SENSITIVE_KEYS.has(key)) continue;
    const before = prev[key];
    const after = next[key];
    if (JSON.stringify(before) !== JSON.stringify(after)) {
      changes[key] = { from: before ?? null, to: after ?? null };
    }
  }
  return changes;
}

export async function writeAuditLog(params: WriteAuditLogParams): Promise<void> {
  try {
    const payload = params.payload || (await getPayload({ config: configPromise }));
    const reqMeta = extractRequestMeta(params.headers);

    let actorType: AuditActorType = params.actorType || "system";
    let actorId = params.actorId != null ? String(params.actorId) : undefined;
    let actorEmail = params.actorEmail || undefined;

    if (params.reqUser) {
      actorType =
        params.reqUser.collection === "users"
          ? "admin"
          : params.reqUser.collection === "customers"
          ? "customer"
          : actorType;
      if (!actorId && params.reqUser.id != null) {
        actorId = String(params.reqUser.id);
      }
      if (!actorEmail && params.reqUser.email) {
        actorEmail = String(params.reqUser.email);
      }
    }

    await payload.create({
      collection: "audit-logs",
      overrideAccess: true,
      data: {
        action: params.action,
        entityType: params.entityType,
        entityId: params.entityId != null ? String(params.entityId) : undefined,
        entityRef: params.entityRef || undefined,
        actorType,
        actorId,
        actorEmail,
        ipAddress: reqMeta.ipAddress,
        userAgent: reqMeta.userAgent,
        status: params.status || "success",
        summary: params.summary.slice(0, 500),
        metadata: params.metadata || undefined,
      },
    });
  } catch (err) {
    console.error("[AuditLog] Failed to persist audit entry:", params.action, err);
  }
}
