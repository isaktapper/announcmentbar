'use client'

import { Template } from '@/types/announcement'

interface TemplatePickerProps {
  selectedTemplate: string | null
  onSelect: (template: Template) => void
  typeFilter?: 'single' | 'carousel' | 'marquee'
}

const templates: Template[] = [
  // --- SINGLE TEMPLATES ---
  {
    id: 'default',
    title: '',
    message: 'Welcome to our store! 🎉',
    icon: 'none',
    background: '#FFFFC5',
    useGradient: false,
    backgroundGradient: '#FFFFC5',
    textColor: '#1F2937',
    isSticky: true,
    titleFontSize: 16,
    messageFontSize: 14,
    textAlignment: 'center',
    iconAlignment: 'left',
    isClosable: false,
    type: 'single',
    typeSettings: {
      marquee_speed: 50,
      marquee_direction: 'left',
      marquee_pause_on_hover: true,
      carousel_speed: 5000,
      carousel_pause_on_hover: true,
    },
    barHeight: 60,
    carouselItems: [{ title: '', message: '', background: '#FFFFC5', backgroundGradient: '#FFFFC5', useGradient: false, textColor: '#1F2937', fontFamily: 'Work Sans', titleFontSize: 16, messageFontSize: 14, textAlignment: 'center', icon: 'none', iconAlignment: 'left', cta_enabled: false, cta_text: '', cta_url: '', cta_background_color: '#000000', cta_text_color: '#FFFFFF' }],
    pagePaths: [],
    geoCountries: [],
    scheduledStart: null,
    scheduledEnd: null,
    fontFamily: 'Work Sans',
    cta_enabled: false,
    cta_text: '',
    cta_url: '',
    cta_background_color: '#000000',
    cta_text_color: '#FFFFFF',
    allowed_domain: '',
  },
  {
    id: 'sale',
    title: '🎉 Flash Sale!',
    message: 'Get 20% off all products today',
    icon: 'none',
    background: '#FEE2E2',
    useGradient: true,
    backgroundGradient: '#FEE2E2',
    textColor: '#991B1B',
    isSticky: true,
    titleFontSize: 16,
    messageFontSize: 14,
    textAlignment: 'center',
    iconAlignment: 'left',
    isClosable: true,
    type: 'single',
    typeSettings: {
      marquee_speed: 50,
      marquee_direction: 'left',
      marquee_pause_on_hover: true,
      carousel_speed: 5000,
      carousel_pause_on_hover: true,
    },
    barHeight: 60,
    carouselItems: [{ title: '', message: '', background: '#FEE2E2', backgroundGradient: '#FEE2E2', useGradient: true, textColor: '#991B1B', fontFamily: 'Work Sans', titleFontSize: 16, messageFontSize: 14, textAlignment: 'center', icon: 'none', iconAlignment: 'left', cta_enabled: false, cta_text: '', cta_url: '', cta_background_color: '#000000', cta_text_color: '#FFFFFF' }],
    pagePaths: [],
    geoCountries: [],
    scheduledStart: null,
    scheduledEnd: null,
    fontFamily: 'Work Sans',
    cta_enabled: false,
    cta_text: '',
    cta_url: '',
    cta_background_color: '#000000',
    cta_text_color: '#FFFFFF',
    allowed_domain: '',
  },
  {
    id: 'announcement',
    title: '📢 New Feature',
    message: 'Check out our latest updates',
    icon: 'none',
    background: '#E0F2FE',
    useGradient: true,
    backgroundGradient: '#DBEAFE',
    textColor: '#1E40AF',
    isSticky: true,
    titleFontSize: 16,
    messageFontSize: 14,
    textAlignment: 'center',
    iconAlignment: 'left',
    isClosable: true,
    type: 'single',
    typeSettings: {
      marquee_speed: 50,
      marquee_direction: 'left',
      marquee_pause_on_hover: true,
      carousel_speed: 5000,
      carousel_pause_on_hover: true,
    },
    barHeight: 60,
    carouselItems: [{ title: '', message: '', background: '#E0F2FE', backgroundGradient: '#DBEAFE', useGradient: true, textColor: '#1E40AF', fontFamily: 'Work Sans', titleFontSize: 16, messageFontSize: 14, textAlignment: 'center', icon: 'none', iconAlignment: 'left', cta_enabled: false, cta_text: '', cta_url: '', cta_background_color: '#000000', cta_text_color: '#FFFFFF' }],
    pagePaths: [],
    geoCountries: [],
    scheduledStart: null,
    scheduledEnd: null,
    fontFamily: 'Work Sans',
    cta_enabled: false,
    cta_text: '',
    cta_url: '',
    cta_background_color: '#000000',
    cta_text_color: '#FFFFFF',
    allowed_domain: '',
  },
  // --- CAROUSEL TEMPLATES ---
  {
    id: 'carousel-default',
    title: '🚚 Free Shipping',
    message: 'On all orders over $50',
    icon: 'none',
    background: '#FFF7ED',
    useGradient: false,
    backgroundGradient: '#FFF7ED',
    textColor: '#92400E',
    isSticky: true,
    titleFontSize: 16,
    messageFontSize: 14,
    textAlignment: 'center',
    iconAlignment: 'left',
    isClosable: false,
    type: 'carousel',
    typeSettings: {
      marquee_speed: 50,
      marquee_direction: 'left',
      marquee_pause_on_hover: true,
      carousel_speed: 5000,
      carousel_pause_on_hover: true,
    },
    barHeight: 60,
    carouselItems: [
      { title: '🚚 Free Shipping', message: 'On all orders over $50', background: '#FFF7ED', backgroundGradient: '#FFF7ED', useGradient: false, textColor: '#92400E', fontFamily: 'Work Sans', titleFontSize: 16, messageFontSize: 14, textAlignment: 'center', icon: 'none', iconAlignment: 'left', cta_enabled: false, cta_text: '', cta_url: '', cta_background_color: '#000000', cta_text_color: '#FFFFFF' },
      { title: '🎁 Gift Cards', message: 'Now available!', background: '#FEF9C3', backgroundGradient: '#FEF9C3', useGradient: false, textColor: '#92400E', fontFamily: 'Work Sans', titleFontSize: 16, messageFontSize: 14, textAlignment: 'center', icon: 'none', iconAlignment: 'left', cta_enabled: false, cta_text: '', cta_url: '', cta_background_color: '#000000', cta_text_color: '#FFFFFF' }
    ],
    pagePaths: [],
    geoCountries: [],
    scheduledStart: null,
    scheduledEnd: null,
    fontFamily: 'Work Sans',
    cta_enabled: false,
    cta_text: '',
    cta_url: '',
    cta_background_color: '#000000',
    cta_text_color: '#FFFFFF',
    allowed_domain: '',
    displayName: 'Shopper Highlights',
  },
  {
    id: 'carousel-sale',
    title: '🔥 Flash Sale',
    message: 'Up to 50% off selected items',
    icon: 'none',
    background: '#FEE2E2',
    useGradient: true,
    backgroundGradient: '#FECACA',
    textColor: '#991B1B',
    isSticky: true,
    titleFontSize: 16,
    messageFontSize: 14,
    textAlignment: 'center',
    iconAlignment: 'left',
    isClosable: true,
    type: 'carousel',
    typeSettings: {
      marquee_speed: 50,
      marquee_direction: 'left',
      marquee_pause_on_hover: true,
      carousel_speed: 5000,
      carousel_pause_on_hover: true,
    },
    barHeight: 60,
    carouselItems: [
      { title: '🔥 Flash Sale', message: 'Up to 50% off selected items', background: '#FEE2E2', backgroundGradient: '#FECACA', useGradient: true, textColor: '#991B1B', fontFamily: 'Work Sans', titleFontSize: 16, messageFontSize: 14, textAlignment: 'center', icon: 'none', iconAlignment: 'left', cta_enabled: true, cta_text: 'Shop now', cta_url: '#', cta_background_color: '#991B1B', cta_text_color: '#FFFFFF' },
      { title: '🕒 Limited Time', message: 'Sale ends tonight!', background: '#FECACA', backgroundGradient: '#FEE2E2', useGradient: true, textColor: '#991B1B', fontFamily: 'Work Sans', titleFontSize: 16, messageFontSize: 14, textAlignment: 'center', icon: 'none', iconAlignment: 'left', cta_enabled: false, cta_text: '', cta_url: '', cta_background_color: '#991B1B', cta_text_color: '#FFFFFF' }
    ],
    pagePaths: [],
    geoCountries: [],
    scheduledStart: null,
    scheduledEnd: null,
    fontFamily: 'Work Sans',
    cta_enabled: false,
    cta_text: '',
    cta_url: '',
    cta_background_color: '#000000',
    cta_text_color: '#FFFFFF',
    allowed_domain: '',
    displayName: 'Super Sale Carousel',
  },
  {
    id: 'carousel-feature',
    title: '✨ New Feature',
    message: 'Try our new dashboard!',
    icon: 'none',
    background: '#E0F2FE',
    useGradient: true,
    backgroundGradient: '#DBEAFE',
    textColor: '#1E40AF',
    isSticky: true,
    titleFontSize: 16,
    messageFontSize: 14,
    textAlignment: 'center',
    iconAlignment: 'left',
    isClosable: true,
    type: 'carousel',
    typeSettings: {
      marquee_speed: 50,
      marquee_direction: 'left',
      marquee_pause_on_hover: true,
      carousel_speed: 5000,
      carousel_pause_on_hover: true,
    },
    barHeight: 60,
    carouselItems: [
      { title: '✨ New Feature', message: 'Try our new dashboard!', background: '#E0F2FE', backgroundGradient: '#DBEAFE', useGradient: true, textColor: '#1E40AF', fontFamily: 'Work Sans', titleFontSize: 16, messageFontSize: 14, textAlignment: 'center', icon: 'none', iconAlignment: 'left', cta_enabled: true, cta_text: 'Learn more', cta_url: '#', cta_background_color: '#1E40AF', cta_text_color: '#FFFFFF' },
      { title: '💡 Tips', message: 'Check out our help center', background: '#DBEAFE', backgroundGradient: '#E0F2FE', useGradient: true, textColor: '#1E40AF', fontFamily: 'Work Sans', titleFontSize: 16, messageFontSize: 14, textAlignment: 'center', icon: 'none', iconAlignment: 'left', cta_enabled: false, cta_text: '', cta_url: '', cta_background_color: '#1E40AF', cta_text_color: '#FFFFFF' },
      { title: '🔔 Updates', message: 'Stay tuned for more!', background: '#E0F2FE', backgroundGradient: '#DBEAFE', useGradient: true, textColor: '#1E40AF', fontFamily: 'Work Sans', titleFontSize: 16, messageFontSize: 14, textAlignment: 'center', icon: 'none', iconAlignment: 'left', cta_enabled: false, cta_text: '', cta_url: '', cta_background_color: '#1E40AF', cta_text_color: '#FFFFFF' }
    ],
    pagePaths: [],
    geoCountries: [],
    scheduledStart: null,
    scheduledEnd: null,
    fontFamily: 'Work Sans',
    cta_enabled: false,
    cta_text: '',
    cta_url: '',
    cta_background_color: '#000000',
    cta_text_color: '#FFFFFF',
    allowed_domain: '',
    displayName: 'Feature Highlights',
  },
]

export default function TemplatePicker({ selectedTemplate, onSelect, typeFilter }: TemplatePickerProps) {
  const filteredTemplates = typeFilter ? templates.filter(t => t.type === typeFilter) : templates
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {filteredTemplates.map((template) => (
            <button
              key={template.id}
              type="button"
              onClick={() => onSelect(template)}
          className={`group relative p-4 border-2 rounded-lg text-left transition-all ${
            selectedTemplate === template.id
              ? 'border-brand-500 bg-brand-50 ring-2 ring-brand-500 ring-offset-2'
              : 'border-gray-200 hover:border-gray-300'
              }`}
            >
          {/* Preview */}
                <div
            className="h-16 rounded-lg mb-3 flex items-center justify-center text-sm px-3"
                  style={{
                    background: template.useGradient && template.backgroundGradient
                ? `linear-gradient(to right, ${template.background}, ${template.backgroundGradient})`
                      : template.background,
                    color: template.textColor,
                  }}
                >
            <div className="text-center">
              {template.type === 'carousel' ? (
                <>
                  <div className="font-medium mb-0.5">{template.displayName || template.title}</div>
                  <div className="truncate text-xs opacity-80 font-semibold">
                    {template.carouselItems[0]?.title}
                  </div>
                </>
              ) : (
                <>
                  {template.title && <div className="font-medium mb-0.5">{template.title}</div>}
                  <div>{template.message}</div>
                </>
              )}
            </div>
                </div>
                
                {/* Template Name */}
          <div className="font-medium text-gray-900">
            {template.displayName || (template.id.charAt(0).toUpperCase() + template.id.slice(1))}
          </div>

          {/* Selected Indicator */}
          {selectedTemplate === template.id && (
            <div className="absolute top-2 right-2 w-6 h-6 bg-brand-500 rounded-full flex items-center justify-center">
              <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              </div>
          )}
            </button>
      ))}
    </div>
  )
} 