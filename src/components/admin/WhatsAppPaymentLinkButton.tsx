'use client';

import React, { useState } from 'react';
import { useDocumentInfo, useFormFields } from '@payloadcms/ui';

function formatSriLankaWaPhone(raw: string): string {
  const digits = raw.replace(/\D/g, '');
  if (digits.startsWith('94')) return digits;
  if (digits.startsWith('0') && digits.length >= 10) return `94${digits.slice(1)}`;
  return digits;
}

export const WhatsAppPaymentLinkButton: React.FC = () => {
  const { id } = useDocumentInfo();
  const orderNumberField = useFormFields(([fields]) => fields.orderNumber);
  const customerNameField = useFormFields(([fields]) => fields.customerName);
  const customerPhoneField = useFormFields(([fields]) => fields.customerPhone);
  const totalLkrField = useFormFields(([fields]) => fields.totalLkr);
  const paymentStatusField = useFormFields(([fields]) => fields.paymentStatus);
  const paymentLinkUrlField = useFormFields(([fields]) => fields.paymentLinkUrl);

  const [generatedUrl, setGeneratedUrl] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const orderNumber = String(orderNumberField?.value || '');
  const customerName = String(customerNameField?.value || 'Customer');
  const customerPhone = String(customerPhoneField?.value || '');
  const totalLkr = Number(totalLkrField?.value || 0);
  const paymentStatus = String(paymentStatusField?.value || 'pending');
  const activeUrl = generatedUrl || String(paymentLinkUrlField?.value || '');

  if (!id) {
    return (
      <div style={{ fontSize: '12px', color: '#666', padding: '8px 0' }}>
        Save this order first to generate a one-click WhatsApp Payments.lk link.
      </div>
    );
  }

  const isLocked =
    paymentStatus === 'paid' ||
    paymentStatus === 'refunded' ||
    paymentStatus === 'partially_refunded';

  const handleGenerate = async () => {
    setError(null);
    setCopied(false);
    setIsLoading(true);
    try {
      const res = await fetch(`/api/admin/orders/${id}/payment-link`, {
        method: 'POST',
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to generate link');
      }
      setGeneratedUrl(data.url);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Could not generate payment link.');
    } finally {
      setIsLoading(false);
    }
  };

  const whatsappText = `Hi ${customerName}, here is your secure Momentum Clothing checkout link for Order ${orderNumber} (LKR ${totalLkr.toLocaleString()}): ${activeUrl}`;
  const waPhone = formatSriLankaWaPhone(customerPhone);
  const whatsappHref = waPhone
    ? `https://wa.me/${waPhone}?text=${encodeURIComponent(whatsappText)}`
    : `https://wa.me/?text=${encodeURIComponent(whatsappText)}`;

  const handleCopy = async () => {
    if (!activeUrl) return;
    await navigator.clipboard.writeText(activeUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      style={{
        border: '1px solid #e5e5e0',
        padding: '12px',
        background: '#fafaf8',
        marginTop: '8px',
      }}
    >
      <div
        style={{
          fontSize: '11px',
          fontWeight: 600,
          textTransform: 'uppercase',
          marginBottom: '8px',
        }}
      >
        WhatsApp 1-Click Checkout
      </div>

      <button
        type="button"
        onClick={handleGenerate}
        disabled={isLoading || isLocked}
        style={{
          width: '100%',
          padding: '8px 12px',
          background: isLocked ? '#ccc' : '#111',
          color: '#fff',
          border: 'none',
          cursor: isLocked || isLoading ? 'not-allowed' : 'pointer',
          fontSize: '11px',
          textTransform: 'uppercase',
          letterSpacing: '0.12em',
        }}
      >
        {isLoading
          ? 'Generating...'
          : isLocked
            ? `Order ${paymentStatus}`
            : activeUrl
              ? 'Regenerate Payments.lk Link'
              : 'Generate Payments.lk Link'}
      </button>

      {activeUrl && (
        <div style={{ marginTop: '10px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <input
            type="text"
            readOnly
            value={activeUrl}
            onClick={(e) => e.currentTarget.select()}
            style={{
              width: '100%',
              fontSize: '11px',
              fontFamily: 'monospace',
              padding: '6px 8px',
              border: '1px solid #d4d4d0',
              background: '#fff',
            }}
          />
          <div style={{ display: 'flex', gap: '6px' }}>
            <button
              type="button"
              onClick={handleCopy}
              style={{
                flex: 1,
                padding: '6px 8px',
                background: '#fff',
                color: '#111',
                border: '1px solid #111',
                cursor: 'pointer',
                fontSize: '10px',
                textTransform: 'uppercase',
                letterSpacing: '0.1em',
              }}
            >
              {copied ? 'Copied!' : 'Copy Link'}
            </button>
            <a
              href={whatsappHref}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                flex: 1,
                padding: '6px 8px',
                background: '#166534',
                color: '#fff',
                textAlign: 'center',
                textDecoration: 'none',
                fontSize: '10px',
                textTransform: 'uppercase',
                letterSpacing: '0.1em',
              }}
            >
              Open WhatsApp
            </a>
          </div>
        </div>
      )}

      {error && (
        <div style={{ fontSize: '11px', color: '#b91c1c', marginTop: '8px' }}>{error}</div>
      )}
    </div>
  );
};
