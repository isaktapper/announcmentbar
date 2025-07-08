'use client'

import { AlertTriangle, AlertCircle, Info, CheckCircle, Clock } from 'lucide-react'
import { Template, ICONS } from '@/types/announcement'

interface TemplatePickerProps {
  selectedTemplate: string | null
  onSelect: (template: Template) => void
}

const iconComponents = {
  AlertTriangle,
  AlertCircle,
  Info,
  CheckCircle,
  Clock,
}

const templates: Template[] = [
  {
    id: 'alert',
    name: 'Alert',
    title: 'Important System Alert',
    message: 'We are experiencing some issues. Our team is working to resolve this quickly.',
    icon: 'alert',
    background: '#EF4444',
    textColor: '#FFFFFF',
    useGradient: false,
    isSticky: true,
    titleFontSize: 16,
    messageFontSize: 14,
    titleUrl: '',
    messageUrl: '',
    textAlignment: 'center',
    iconAlignment: 'left',
    isClosable: false, // Critical alerts shouldn't be dismissible
    type: 'single',
    typeSettings: {},
    barHeight: 60,
    carouselItems: [{ title: 'Important System Alert', message: 'We are experiencing some issues. Our team is working to resolve this quickly.', titleUrl: '', messageUrl: '' }],
    fontFamily: 'Work Sans',
  },
  {
    id: 'maintenance',
    name: 'Planned Maintenance',
    title: 'Scheduled Maintenance',
    message: 'We will be performing maintenance from 2:00 AM to 4:00 AM UTC. Service may be temporarily unavailable.',
    icon: 'schedule',
    background: '#F59E0B',
    textColor: '#FFFFFF',
    useGradient: false,
    isSticky: true,
    titleFontSize: 16,
    messageFontSize: 14,
    titleUrl: '',
    messageUrl: '',
    textAlignment: 'center',
    iconAlignment: 'left',
    isClosable: true, // Maintenance notices can be dismissed
    type: 'single',
    typeSettings: {},
    barHeight: 60,
    carouselItems: [{ title: 'Scheduled Maintenance', message: 'We will be performing maintenance from 2:00 AM to 4:00 AM UTC. Service may be temporarily unavailable.', titleUrl: '', messageUrl: '' }],
    fontFamily: 'Work Sans',
  },
  {
    id: 'promo',
    name: 'Promo',
    title: '🎉 Special Offer!',
    message: 'Get 50% off your next purchase. Limited time offer - don\'t miss out!',
    icon: 'success',
    background: '#10B981',
    backgroundGradient: '#059669',
    textColor: '#FFFFFF',
    useGradient: true,
    isSticky: false, // Promo messages might not need to be sticky
    titleFontSize: 18, // Slightly larger for promotions
    messageFontSize: 15,
    titleUrl: '',
    messageUrl: '',
    textAlignment: 'center',
    iconAlignment: 'left',
    isClosable: true, // Promotions can be dismissed
    type: 'single', // Single type since marquee is disabled
    typeSettings: {
              marquee_speed: 2,
      marquee_direction: 'left',
      marquee_pause_on_hover: true,
    },
    barHeight: 70,
    carouselItems: [{ title: '🎉 Special Offer!', message: 'Get 50% off your next purchase. Limited time offer - don\'t miss out!', titleUrl: '', messageUrl: '' }],
    fontFamily: 'Work Sans',
  },
]

export default function TemplatePicker({ selectedTemplate, onSelect }: TemplatePickerProps) {
  return (
    <div className="space-y-3">
      <div>
        <label className="block text-base font-semibold text-gray-900 mb-1">
          Quick Templates
        </label>
        <p className="text-xs text-gray-500">
          Choose a template to get started quickly
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {templates.map((template) => {
          const IconComponent = iconComponents[ICONS[template.icon as keyof typeof ICONS] as keyof typeof iconComponents]
          const isSelected = selectedTemplate === template.id
          
          return (
            <button
              key={template.id}
              type="button"
              onClick={() => onSelect(template)}
              className={`text-left p-3 rounded-lg border-2 transition-all ${
                isSelected
                  ? 'border-brand-500 bg-brand-50'
                  : 'border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50'
              }`}
            >
              <div className="space-y-2">
                {/* Template Preview */}
                <div
                  className="w-full p-2 rounded text-center text-sm"
                  style={{
                    background: template.useGradient && template.backgroundGradient
                      ? `linear-gradient(135deg, ${template.background}, ${template.backgroundGradient})`
                      : template.background,
                    color: template.textColor,
                  }}
                >
                  <div className="flex items-center justify-center gap-1.5 mb-0.5">
                    <IconComponent className="w-3 h-3" />
                    <span className="font-medium text-xs truncate">{template.title}</span>
                  </div>
                  <div className="text-xs opacity-90 line-clamp-1">
                    {template.message}
                  </div>
                </div>
                
                {/* Template Name */}
                <div className="text-center">
                  <span className={`text-xs font-medium ${
                    isSelected ? 'text-brand-700' : 'text-gray-900'
                  }`}>
                    {template.name}
                  </span>
                </div>
              </div>
            </button>
          )
        })}
      </div>
    </div>
  )
} 