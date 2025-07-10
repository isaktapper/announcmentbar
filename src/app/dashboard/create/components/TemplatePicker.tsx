'use client'

import { Template } from '@/types/announcement'

interface TemplatePickerProps {
  selectedTemplate: string | null
  onSelect: (template: Template) => void
}

const templates: Template[] = [
  {
    id: 'default',
    title: '',
    message: 'Welcome to our store! 🎉',
    icon: 'none',
    background: '#FFFFC5',
    useGradient: false,
    textColor: '#1F2937',
    isSticky: true,
    titleFontSize: 16,
    messageFontSize: 14,
    textAlignment: 'center',
    iconAlignment: 'left',
    isClosable: false,
    type: 'single',
    typeSettings: {},
    barHeight: 60,
    carouselItems: [{ title: '', message: '' }],
    pagePaths: [],
    geoCountries: [],
    scheduledStart: null,
    scheduledEnd: null,
    fontFamily: 'Work Sans',
    visibility: true
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
    typeSettings: {},
    barHeight: 60,
    carouselItems: [{ title: '', message: '' }],
    pagePaths: [],
    geoCountries: [],
    scheduledStart: null,
    scheduledEnd: null,
    fontFamily: 'Work Sans',
    visibility: true
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
    typeSettings: {},
    barHeight: 60,
    carouselItems: [{ title: '', message: '' }],
    pagePaths: [],
    geoCountries: [],
    scheduledStart: null,
    scheduledEnd: null,
    fontFamily: 'Work Sans',
    visibility: true
  }
]

export default function TemplatePicker({ selectedTemplate, onSelect }: TemplatePickerProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {templates.map((template) => (
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
              {template.title && <div className="font-medium mb-0.5">{template.title}</div>}
              <div>{template.message}</div>
                  </div>
                </div>
                
                {/* Template Name */}
          <div className="font-medium text-gray-900">
            {template.id.charAt(0).toUpperCase() + template.id.slice(1)}
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