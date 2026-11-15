import { CollectionCards as CollectionCards_f9c02e79a4aed9a3924487c0cd4cafb1 } from '@payloadcms/next/rsc'
import { ProcessRefundButton as ProcessRefundButton_custom } from '@/components/admin/ProcessRefundButton'
import { WhatsAppPaymentLinkButton as WhatsAppPaymentLinkButton_custom } from '@/components/admin/WhatsAppPaymentLinkButton'

/** @type import('payload').ImportMap */
export const importMap = {
  "@payloadcms/next/rsc#CollectionCards": CollectionCards_f9c02e79a4aed9a3924487c0cd4cafb1,
  "@/components/admin/ProcessRefundButton#ProcessRefundButton": ProcessRefundButton_custom,
  "@/components/admin/WhatsAppPaymentLinkButton#WhatsAppPaymentLinkButton": WhatsAppPaymentLinkButton_custom,
}
