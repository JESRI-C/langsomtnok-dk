import type { ComponentType } from 'react'
import { template as contactFormNotification } from './contact-form-notification'
import { template as cancellationConfirmation } from './cancellation-confirmation'
import { template as cancellationNotification } from './cancellation-notification'

export interface TemplateEntry {
  component: ComponentType<any>
  subject: string | ((data: Record<string, any>) => string)
  displayName?: string
  previewData?: Record<string, any>
  /** Fixed recipient — overrides caller-provided recipientEmail when set. */
  to?: string
}

export const TEMPLATES: Record<string, TemplateEntry> = {
  'contact-form-notification': contactFormNotification,
  'cancellation-confirmation': cancellationConfirmation,
  'cancellation-notification': cancellationNotification,
}
