// Add CTA types
export type CTABorderRadius = 'none' | 'sm' | 'md' | 'lg' | 'pill'
export type CTASize = 'sm' | 'md' | 'lg'

export type AnnouncementType = 'single' | 'carousel' | 'marquee'

// Font family options with Google Fonts
export type FontFamily = 
  | 'Work Sans'
  | 'Inter' 
  | 'Lato'
  | 'Roboto'
  | 'Rubik'
  | 'Poppins'
  | 'Space Grotesk'
  | 'DM Sans'
  | 'Playfair Display'
  | 'Bricolage Grotesque'

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
  text_alignment: 'left' | 'center' | 'right'
  icon_alignment: 'left' | 'right'
  is_closable: boolean
  type: AnnouncementType
  type_settings: AnnouncementTypeSettings
  slug: string
  created_at: string
  bar_height: number
  content?: unknown
  font_family: FontFamily
  geo_countries?: string[]
  page_paths?: string[]
  // New CTA fields
  cta_text?: string
  cta_url?: string
  cta_text_color?: string
  cta_bg_color?: string
  cta_border_radius?: 'none' | 'sm' | 'md' | 'lg' | 'pill'
  cta_size?: 'sm' | 'md' | 'lg'
}

export interface AnnouncementContentItem {
  title: string
  message: string
}

export interface AnnouncementFormData {
  title: string
  message: string
  icon: string
  background: string
  backgroundGradient: string
  useGradient: boolean
  textColor: string
  visibility: boolean
  isSticky: boolean
  titleFontSize: number
  messageFontSize: number
  textAlignment: 'left' | 'center' | 'right'
  iconAlignment: 'left' | 'right'
  isClosable: boolean
  type: AnnouncementType
  typeSettings: AnnouncementTypeSettings
  barHeight: number
  carouselItems: AnnouncementContentItem[]
  fontFamily: FontFamily
  geoCountries: string[]
  pagePaths: string[]
  scheduledStart: string | null
  scheduledEnd: string | null
  // New CTA fields
  ctaText?: string
  ctaUrl?: string
  ctaTextColor?: string
  ctaBgColor?: string
  ctaBorderRadius?: CTABorderRadius
  ctaSize?: CTASize
}

export interface Template {
  id: string
  title: string
  message: string
  icon: string
  background: string
  backgroundGradient?: string
  useGradient: boolean
  textColor: string
  isSticky: boolean
  titleFontSize: number
  messageFontSize: number
  textAlignment: 'left' | 'center' | 'right'
  iconAlignment: 'left' | 'right'
  isClosable: boolean
  type: AnnouncementType
  typeSettings: AnnouncementTypeSettings
  barHeight?: number
  carouselItems?: AnnouncementContentItem[]
  fontFamily?: FontFamily
  geo_countries?: string[]
  page_paths?: string[]
  scheduled_start?: string | null
  scheduled_end?: string | null
  // New CTA fields
  cta_text?: string
  cta_url?: string
  cta_text_color?: string
  cta_bg_color?: string
  cta_border_radius?: CTABorderRadius
  cta_size?: CTASize
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