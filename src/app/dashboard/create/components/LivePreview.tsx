'use client'

import { AlertTriangle, AlertCircle, Info, CheckCircle, Clock } from 'lucide-react'
import { AnnouncementFormData, ICONS } from '@/types/announcement'

interface LivePreviewProps {
  formData: AnnouncementFormData
}

const iconComponents = {
  None: null,
  AlertTriangle,
  AlertCircle,
  Info,
  CheckCircle,
  Clock,
}

export default function LivePreview({ formData }: LivePreviewProps) {
  const IconComponent = iconComponents[ICONS[formData.icon as keyof typeof ICONS] as keyof typeof iconComponents]

  const getBackgroundStyle = () => {
    if (formData.useGradient && formData.backgroundGradient) {
      return `linear-gradient(135deg, ${formData.background}, ${formData.backgroundGradient})`
    }
    return formData.background
  }

  const getIconSize = () => {
    const baseSize = Math.max(formData.titleFontSize || 16, formData.messageFontSize || 14)
    return baseSize + 2
  }

  const getJustifyContent = () => {
    switch (formData.textAlignment) {
      case 'left': return 'flex-start'
      case 'right': return 'flex-end'
      default: return 'center'
    }
  }

  const getIconOrder = () => {
    switch (formData.iconAlignment) {
      case 'right': return '2'
      case 'center': return '1' 
      default: return '0'
    }
  }

  const getContentOrder = () => {
    return formData.iconAlignment === 'center' ? '0' : '1'
  }

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-1">Live Preview</h3>
        <p className="text-sm text-gray-500">
          See how your announcement will appear to visitors
        </p>
      </div>

      {/* Mock Website Container */}
      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
        {/* Mock Browser Header */}
        <div className="bg-gray-50 px-4 py-2 border-b border-gray-200">
          <div className="flex items-center gap-2">
            <div className="flex gap-1">
              <div className="w-3 h-3 bg-red-400 rounded-full"></div>
              <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
              <div className="w-3 h-3 bg-green-400 rounded-full"></div>
            </div>
            <div className="flex-1 bg-white border border-gray-200 rounded px-3 py-1 text-xs text-gray-500">
              https://your-website.com
            </div>
          </div>
        </div>

        {/* Announcement Bar */}
        {formData.visibility && (
          <div
            className="px-4 py-2.5 relative"
            style={{
              background: getBackgroundStyle(),
              color: formData.textColor,
              minHeight: '40px',
            }}
          >
            <div 
              className="flex items-center gap-3 max-w-4xl mx-auto"
              style={{
                justifyContent: getJustifyContent(),
                paddingRight: formData.isClosable ? '32px' : '16px',
              }}
            >
              {/* Icon - Non-center alignment */}
              {formData.icon && formData.icon !== 'none' && IconComponent && formData.iconAlignment !== 'center' && (
                <div style={{ order: getIconOrder(), flexShrink: 0 }}>
                  <IconComponent 
                    style={{ 
                      width: `${getIconSize()}px`, 
                      height: `${getIconSize()}px` 
                    }} 
                  />
                </div>
              )}
              
              {/* Content */}
              <div 
                className="flex-1 min-w-0"
                style={{ 
                  textAlign: formData.textAlignment as any,
                  order: getContentOrder()
                }}
              >
                {formData.title && (
                  <div 
                    className="font-semibold mb-0.5"
                    style={{ 
                      fontSize: `${formData.titleFontSize || 16}px`,
                      lineHeight: 1.3
                    }}
                  >
                    {formData.titleUrl ? (
                      <a 
                        href={formData.titleUrl} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        style={{ 
                          color: 'inherit', 
                          textDecoration: 'underline',
                          textDecorationColor: 'rgba(255,255,255,0.5)'
                        }}
                      >
                        {formData.title}
                      </a>
                    ) : (
                      formData.title
                    )}
                  </div>
                )}
                {formData.message && (
                  <div 
                    className="opacity-90"
                    style={{ 
                      fontSize: `${formData.messageFontSize || 14}px`,
                      lineHeight: 1.4
                    }}
                  >
                    {formData.messageUrl ? (
                      <a 
                        href={formData.messageUrl} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        style={{ 
                          color: 'inherit', 
                          textDecoration: 'underline',
                          textDecorationColor: 'rgba(255,255,255,0.5)'
                        }}
                      >
                        {formData.message}
                      </a>
                    ) : (
                      formData.message
                    )}
                  </div>
                )}
              </div>

              {/* Icon - Center alignment */}
              {formData.icon && formData.icon !== 'none' && IconComponent && formData.iconAlignment === 'center' && (
                <div style={{ order: 1, flexShrink: 0 }}>
                  <IconComponent 
                    style={{ 
                      width: `${getIconSize()}px`, 
                      height: `${getIconSize()}px` 
                    }} 
                  />
                </div>
              )}
            </div>

            {/* Close button */}
            {formData.isClosable && (
              <button
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-lg opacity-70 hover:opacity-100 transition-opacity"
                style={{ color: formData.textColor }}
                title="Close announcement"
              >
                ×
              </button>
            )}
          </div>
        )}

        {/* Mock Website Content */}
        <div className="p-8 space-y-6">
          <div className="space-y-2">
            <div className="h-8 bg-gray-200 rounded-lg w-1/2"></div>
            <div className="h-4 bg-gray-100 rounded w-3/4"></div>
            <div className="h-4 bg-gray-100 rounded w-2/3"></div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="space-y-3">
                <div className="h-32 bg-gray-100 rounded-lg"></div>
                <div className="h-4 bg-gray-200 rounded w-full"></div>
                <div className="h-3 bg-gray-100 rounded w-2/3"></div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Visibility Status */}
      <div className="flex items-center gap-2 text-sm">
        <div className={`w-2 h-2 rounded-full ${
          formData.visibility ? 'bg-green-500' : 'bg-gray-400'
        }`}></div>
        <span className="text-gray-600">
          Announcement is {formData.visibility ? 'visible' : 'hidden'}
        </span>
      </div>
    </div>
  )
} 