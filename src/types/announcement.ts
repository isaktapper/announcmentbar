export interface Announcement {
  id: string
  user_id: string
  title: string
  message: string
  icon: string
  background: string
  background_gradient?: string
  text_color: string
  visibility: boolean
  is_sticky: boolean
  slug: string
  created_at: string
}

export interface AnnouncementFormData {
  title: string
  message: string
  icon: string
  background: string
  backgroundGradient?: string
  useGradient: boolean
  textColor: string
  visibility: boolean
  isSticky: boolean
}

export interface Template {
  id: string
  name: string
  title: string
  message: string
  icon: string
  background: string
  backgroundGradient?: string
  textColor: string
  useGradient: boolean
  isSticky: boolean
}

export const ICONS = {
  none: 'None',
  warning: 'AlertTriangle',
  alert: 'AlertCircle', 
  info: 'Info',
  success: 'CheckCircle',
  schedule: 'Clock',
} as const

export type IconType = keyof typeof ICONS 