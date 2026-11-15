'use client';

import React, { useState } from 'react';
import { useDocumentInfo, useFormFields } from '@payloadcms/ui';

export const ProcessRefundButton: React.FC = () => {
  const { id } = useDocumentInfo();
  const refundAmountField = useFormFields(([fields]) => fields.refundAmountLkr);
  const refundStatusField = useFormFields(([fields]) => fields.refundStatus);
  const paymentsLkRefundIdField = useFormFields(([fields]) => fields.paymentsLkRefundId);

  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const refundStatus = String(refundStatusField?.value || 'none');
  const refundAmount = Number(refundAmountField?.value || 0);
  const existingRefundId = String(paymentsLkRefundIdField?.value || '');

  if (!id) {
    return (
      <div style={{ fontSize: '12px', color: '#666', padding: '8px 0' }}>
        Save this RMA record first to enable refund processing.
      </div>
    );
  }

  const handleIssueRefund = async () => {
    setError(null);
    setMessage(null);

    if (!refundAmount || refundAmount <= 0) {
      setError('Enter a Refund Amount (LKR) above 0 and save first.');
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch(`/api/admin/returns/${id}/refund`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amountLkr: refundAmount }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Refund failed');
      }

      setMessage(data.message || 'Refund initiated. Refreshing...');
      setTimeout(() => window.location.reload(), 900);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Refund error');
    } finally {
      setIsLoading(false);
    }
  };

  const canIssue =
    refundStatus === 'none' || refundStatus === 'failed' || refundStatus === 'canceled';

  return (
    <div
      style={{
        border: '1px solid #e5e5e0',
        padding: '12px',
        background: '#fafaf8',
        marginTop: '8px',
      }}
    >
      <div style={{ fontSize: '11px', fontWeight: 600, textTransform: 'uppercase', marginBottom: '8px' }}>
        Refund Execution
      </div>

      {existingRefundId && (
        <div style={{ fontSize: '11px', fontFamily: 'monospace', marginBottom: '8px', color: '#444' }}>
          Ref: {existingRefundId}
        </div>
      )}

      <button
        type="button"
        onClick={handleIssueRefund}
        disabled={isLoading || !canIssue}
        style={{
          width: '100%',
          padding: '8px 12px',
          background: canIssue ? '#111' : '#ccc',
          color: '#fff',
          border: 'none',
          cursor: canIssue && !isLoading ? 'pointer' : 'not-allowed',
          fontSize: '11px',
          textTransform: 'uppercase',
          letterSpacing: '0.12em',
        }}
      >
        {isLoading
          ? 'Processing...'
          : canIssue
            ? `Issue Refund (LKR ${refundAmount.toLocaleString()})`
            : `Refund ${refundStatus}`}
      </button>

      {message && (
        <div style={{ fontSize: '11px', color: '#166534', marginTop: '8px' }}>{message}</div>
      )}
      {error && (
        <div style={{ fontSize: '11px', color: '#b91c1c', marginTop: '8px' }}>{error}</div>
      )}
    </div>
  );
};
