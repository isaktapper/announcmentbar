export type AnnouncementType = 'single' | 'carousel' | 'marquee'

export interface AnnouncementTypeSettings {
  // Carousel settings
  carousel_speed?: number // milliseconds between rotations
  carousel_pause_on_hover?: boolean
  // Marquee settings  
  marquee_speed?: number // pixels per second
  marquee_direction?: 'left' | 'right'
  marquee_pause_on_hover?: boolean
}

export interface Announcement {
  id: string
  user_id: string
  title: string
  message: string
  icon: string
  background: string
  background_gradient?: string
  use_gradient?: boolean
  text_color: string
  visibility: boolean
  is_sticky: boolean
  title_font_size: number
  message_font_size: number
  title_url?: string
  message_url?: string
  text_alignment: 'left' | 'center' | 'right'
  icon_alignment: 'left' | 'right' // Removed 'center'
  is_closable: boolean
  type: AnnouncementType
  type_settings: AnnouncementTypeSettings
  slug: string
  created_at: string
  bar_height: number
  content?: unknown // JSONB content for carousel items
}

export interface AnnouncementContentItem {
  title: string
  message: string
  titleUrl?: string
  messageUrl?: string
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
  titleFontSize: number
  messageFontSize: number
  titleUrl?: string
  messageUrl?: string
  textAlignment: 'left' | 'center' | 'right'
  iconAlignment: 'left' | 'right' // Removed 'center'
  isClosable: boolean
  type: AnnouncementType
  typeSettings: AnnouncementTypeSettings
  barHeight: number
  // New: Content management for carousel
  carouselItems?: AnnouncementContentItem[]
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
  titleFontSize: number
  messageFontSize: number
  titleUrl?: string
  messageUrl?: string
  textAlignment: 'left' | 'center' | 'right'
  iconAlignment: 'left' | 'right' // Removed 'center'
  isClosable: boolean
  type: AnnouncementType
  typeSettings: AnnouncementTypeSettings
  barHeight: number
  carouselItems?: AnnouncementContentItem[]
}

export const ICONS = {
  none: 'None',
  warning: 'AlertTriangle',
  alert: 'AlertCircle', 
  info: 'Info',
  success: 'CheckCircle',
  schedule: 'Clock',
  // Premium icons
  shopping: 'ShoppingCart',
  lightbulb: 'Lightbulb',
  sparkles: 'Sparkles',
  bell: 'BellRing',
  message: 'MessageCircle',
  megaphone: 'Megaphone',
  flame: 'Flame',
  package: 'Package',
  flask: 'FlaskConical',
} as const

export type IconType = keyof typeof ICONS 