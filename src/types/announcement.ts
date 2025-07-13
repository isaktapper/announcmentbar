export type AnnouncementType = 'single' | 'carousel' | 'marquee'

// Font family options with Google Fonts
export type FontFamily = string

export type BorderRadiusStyle = 'sharp' | 'soft' | 'pill'

export interface CTASettings {
  enabled: boolean
  text: string
  url: string
  backgroundColor: string
  textColor: string
}

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
  bar_name: string
  background: string
  background_gradient?: string
  use_gradient?: boolean
  text_color: string
  visibility: boolean
  is_sticky: boolean
  title_font_size: number
  message_font_size: number
  text_alignment: 'left' | 'center' | 'right'
  icon_alignment: 'left' | 'right' // Removed 'center'
  icon: string
  is_closable: boolean
  type: AnnouncementType
  type_settings: AnnouncementTypeSettings
  slug: string
  created_at: string
  bar_height: number
  content: {
    title: string
    message: string
    titleUrl?: string
    messageUrl?: string
  }
  font_family: FontFamily
  geo_countries?: string[] // Added: Array of country codes for geo targeting
  page_paths?: string[]
  scheduledStart?: string | null // Added: Start time for scheduled announcements
  scheduledEnd?: string | null // Added: End time for scheduled announcements
}

export interface AnnouncementContentItem {
  title: string
  message: string
}

export interface CarouselItem {
  title: string
  message: string
  background: string
  backgroundGradient: string
  useGradient: boolean
  textColor: string
  fontFamily: string
  titleFontSize: number
  messageFontSize: number
  textAlignment: 'left' | 'center' | 'right'
  icon: string
  iconAlignment: 'left' | 'right'
  cta_enabled: boolean
  cta_text: string
  cta_url: string
  cta_background_color: string
  cta_text_color: string
}

export interface EnhancedCarouselItem extends CarouselItem {
  textColor: string
  backgroundColor: string
  fontFamily: FontFamily
  textAlignment: 'left' | 'center' | 'right'
  cta: CTASettings
}

export interface AnnouncementFormData {
  bar_name: string;
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
  type: 'single' | 'carousel' | 'marquee'
  typeSettings: {
    marquee_speed: number
    marquee_direction: 'left' | 'right'
    marquee_pause_on_hover: boolean
    carousel_speed: number
    carousel_pause_on_hover: boolean
  }
  barHeight: number
  carouselItems: CarouselItem[]
  fontFamily: string
  geoCountries: string[]
  pagePaths: string[]
  scheduledStart: string | null
  scheduledEnd: string | null
  cta_enabled: boolean
  cta_text: string
  cta_url: string
  cta_background_color: string
  cta_text_color: string
}

export interface Template {
  id: string
  title: string
  message: string
  icon: string
  background: string
  backgroundGradient: string
  useGradient: boolean
  textColor: string
  isSticky: boolean
  titleFontSize: number
  messageFontSize: number
  textAlignment: 'left' | 'center' | 'right'
  iconAlignment: 'left' | 'right'
  isClosable: boolean
  type: AnnouncementType
  typeSettings: {
    marquee_speed: number
    marquee_direction: 'left' | 'right'
    marquee_pause_on_hover: boolean
    carousel_speed: number
    carousel_pause_on_hover: boolean
  }
  barHeight: number
  carouselItems: CarouselItem[]
  fontFamily: FontFamily
  geoCountries: string[]
  pagePaths: string[]
  scheduledStart: string | null
  scheduledEnd: string | null
  cta_enabled: boolean
  cta_text: string
  cta_url: string
  cta_background_color: string
  cta_text_color: string
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