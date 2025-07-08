'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeftIcon } from '@heroicons/react/24/outline'
import { createClient } from '@/lib/supabase-client'
import { useToast } from '@/hooks/useToast'
import { ToastContainer } from '@/components/Toast'
import { AnnouncementFormData, Template, AnnouncementType, AnnouncementContentItem } from '@/types/announcement'
import IconSelector from './components/IconSelector'
import TemplatePicker from './components/TemplatePicker'
import LivePreview from './components/LivePreview'
import ColorPicker from '@/components/ColorPicker'
import FormattingToolbar from './components/FormattingToolbar'

export default function CreateAnnouncementPage() {
  const router = useRouter()
  const { toasts, success, error, removeToast } = useToast()
  const [loading, setLoading] = useState(false)
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null)
  
  const [formData, setFormData] = useState<AnnouncementFormData>({
    title: '',
    message: '',
    icon: 'none',
    background: '#3B82F6',
    backgroundGradient: '#1D4ED8',
    useGradient: false,
    textColor: '#FFFFFF',
    visibility: true,
    isSticky: true,
    titleFontSize: 16,
    messageFontSize: 14,
    titleUrl: '',
    messageUrl: '',
    textAlignment: 'center',
    iconAlignment: 'left',
    isClosable: false,
    type: 'single',
    typeSettings: {},
    barHeight: 60,
    carouselItems: [{ title: '', message: '', titleUrl: '', messageUrl: '' }],
  })

  // Debounced state for live preview
  const [previewData, setPreviewData] = useState<AnnouncementFormData>(formData)

  // Debounce preview updates for text inputs
  useEffect(() => {
    const timer = setTimeout(() => {
      setPreviewData(formData)
    }, 150) // 150ms delay for text inputs

    return () => clearTimeout(timer)
  }, [formData.title, formData.message, formData])

  // Immediate updates for non-text changes
  useEffect(() => {
    setPreviewData(formData)
  }, [formData])

  // Check authentication
  useEffect(() => {
    const checkAuth = async () => {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) {
        router.push('/auth/login')
      }
    }
    
    checkAuth()
  }, [router])

  const generateSlug = () => {
    return Math.random().toString(36).substring(2, 8)
  }

  const handleTemplateSelect = useCallback((template: Template) => {
    setSelectedTemplate(template.id)
    setFormData({
      title: template.title,
      message: template.message,
      icon: template.icon,
      background: template.background,
      backgroundGradient: template.backgroundGradient || '#1D4ED8',
      useGradient: template.useGradient,
      textColor: template.textColor,
      visibility: true,
      isSticky: template.isSticky,
      titleFontSize: template.titleFontSize,
      messageFontSize: template.messageFontSize,
      titleUrl: template.titleUrl || '',
      messageUrl: template.messageUrl || '',
      textAlignment: template.textAlignment,
      iconAlignment: template.iconAlignment,
      isClosable: template.isClosable,
      type: template.type,
      typeSettings: template.typeSettings,
      barHeight: template.barHeight || 60,
      carouselItems: template.carouselItems || [{ title: '', message: '', titleUrl: '', messageUrl: '' }],
    })
  }, [])

  const handleInputChange = useCallback((field: keyof AnnouncementFormData, value: string | boolean | number | AnnouncementType) => {
    setFormData(prev => {
      const newData = { ...prev, [field]: value }
      
      // Prevent marquee selection (disabled feature)
      if (field === 'type' && value === 'marquee') {
        newData.type = 'single'
      }
      
      // When switching to carousel, force text alignment to center since left/right are disabled
      if (field === 'type' && value === 'carousel' && (prev.textAlignment === 'left' || prev.textAlignment === 'right')) {
        newData.textAlignment = 'center'
      }
      
      return newData
    })
    if (selectedTemplate) {
      setSelectedTemplate(null) // Clear template selection when user modifies
    }
  }, [selectedTemplate])

  const handleTypeSettingsChange = useCallback((key: string, value: unknown) => {
    setFormData(prev => ({
      ...prev,
      typeSettings: { ...prev.typeSettings, [key]: value }
    }))
  }, [])

  const updateCarouselItem = useCallback((index: number, field: keyof AnnouncementContentItem, value: string) => {
    setFormData(prev => {
      const newItems = [...(prev.carouselItems || [])]
      // Säkerställ att alla fält behålls genom att merge med defaults
      const currentItem = newItems[index] || { title: '', message: '', titleUrl: '', messageUrl: '' }
      newItems[index] = {
        ...currentItem,
        [field]: value
      }
      return { ...prev, carouselItems: newItems }
    })
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Validate based on announcement type
    if (formData.type === 'carousel') {
      if (!formData.carouselItems || formData.carouselItems.length === 0) {
        error('Please add at least one carousel item')
        return
      }
      // Check if all carousel items have messages
      const hasEmptyMessage = formData.carouselItems.some(item => {
        const div = document.createElement('div')
        div.innerHTML = item.message || ''
        const plainText = (div.textContent || div.innerText || '').trim()
        return !plainText
      })
      if (hasEmptyMessage) {
        error('All carousel items must have a message')
        return
      }
    } else {
      // For single/marquee, check message
      const div = document.createElement('div')
      div.innerHTML = formData.message || ''
      const plainMessage = (div.textContent || div.innerText || '').trim()
      if (!plainMessage) {
        error('Please fill in the message field')
        return
      }
    }

    setLoading(true)

    try {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) {
        error('You must be logged in to create announcements')
        return
      }

      // Always prepare content in JSON format
      let content
      if (formData.type === 'carousel') {
        content = formData.carouselItems || []
      } else {
        // Single/Marquee content as JSON object
        content = {
          title: formData.title || '',
          message: formData.message || '',
          titleUrl: formData.titleUrl || '',
          messageUrl: formData.messageUrl || ''
        }
      }

      // For backward compatibility, still populate individual fields from JSON content
      let displayTitle = ''
      let displayMessage = ''
      
      if (formData.type === 'carousel') {
        // For carousel, use first item for display fields
        const firstItem = formData.carouselItems?.[0]
        if (firstItem) {
          const titleDiv = document.createElement('div')
          titleDiv.innerHTML = firstItem.title || ''
          displayTitle = titleDiv.textContent || titleDiv.innerText || ''
          
          const messageDiv = document.createElement('div')
          messageDiv.innerHTML = firstItem.message || ''
          displayMessage = messageDiv.textContent || messageDiv.innerText || ''
        }
      } else {
        // For single/marquee, extract plain text for display fields
        const titleDiv = document.createElement('div')
        titleDiv.innerHTML = formData.title || ''
        displayTitle = titleDiv.textContent || titleDiv.innerText || ''
        
        const messageDiv = document.createElement('div')
        messageDiv.innerHTML = formData.message || ''
        displayMessage = messageDiv.textContent || messageDiv.innerText || ''
      }

      const newAnnouncement = {
        user_id: user.id,
        title: displayTitle, // Plain text for backward compatibility
        message: displayMessage, // Plain text for backward compatibility
        icon: formData.icon,
        background: formData.background,
        background_gradient: formData.useGradient ? formData.backgroundGradient : null,
        use_gradient: formData.useGradient,
        text_color: formData.textColor,
        visibility: formData.visibility,
        is_sticky: formData.isSticky,
        title_font_size: formData.titleFontSize,
        message_font_size: formData.messageFontSize,
        title_url: formData.titleUrl || null,
        message_url: formData.messageUrl || null,
        text_alignment: formData.textAlignment,
        icon_alignment: formData.iconAlignment,
        is_closable: formData.isClosable,
        type: formData.type,
        type_settings: formData.typeSettings,
        bar_height: formData.barHeight,
        content: content, // All formatted content stored here
        slug: generateSlug(),
      }

      const { error: insertError } = await supabase
        .from('announcements')
        .insert([newAnnouncement])

      if (insertError) {
        error(`Creation failed: ${insertError.message}`)
        return
      }

      success('Announcement created successfully!')
      router.push('/dashboard')
    } catch {
      error('Failed to create announcement')
    } finally {
      setLoading(false)
    }
  }



  const addCarouselItem = () => {
    if (formData.carouselItems && formData.carouselItems.length >= 3) {
      error('Maximum 3 carousel items allowed')
      return
    }
    setFormData(prev => ({
      ...prev,
      carouselItems: [...(prev.carouselItems || []), { title: '', message: '', titleUrl: '', messageUrl: '' }]
    }))
  }



  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-6">
            <div className="flex items-center gap-4">
              <button
                onClick={() => router.push('/dashboard')}
                className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
              >
                <ArrowLeftIcon className="w-5 h-5" />
                <span className="font-medium">Back to Dashboard</span>
              </button>
            </div>
            <div className="text-center">
              <h1 className="text-2xl font-bold text-gray-900">Create Announcement</h1>
              <p className="text-sm text-gray-500 mt-1">
                Design a beautiful announcement for your website
              </p>
            </div>
            <div className="w-32"></div> {/* Spacer for centering */}
          </div>
        </div>
      </div>

      {/* Sticky Live Preview */}
      <div className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-3" style={{ minHeight: '100px' }}>
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-sm font-semibold text-gray-900">Live Preview</h2>
              <div className="flex items-center gap-2 text-xs">
                <div className={`w-2 h-2 rounded-full ${
                  previewData.visibility ? 'bg-green-500' : 'bg-gray-400'
                }`}></div>
                <span className="text-gray-600">
                  {previewData.visibility ? 'Visible' : 'Hidden'}
                </span>
              </div>
            </div>
            <div className="rounded-lg overflow-hidden">
              <LivePreview 
                type={previewData.type}
                title={previewData.title}
                message={previewData.message}
                titleUrl={previewData.titleUrl}
                messageUrl={previewData.messageUrl}
                backgroundColor={previewData.background}
                backgroundGradient={previewData.backgroundGradient}
                useGradient={previewData.useGradient}
                textColor={previewData.textColor}
                linkColor={previewData.textColor}
                borderColor="#e5e7eb"
                buttonColor="#3b82f6"
                buttonTextColor="#ffffff"
                fontFamily="system-ui"
                fontSize={Math.max(previewData.titleFontSize || 16, previewData.messageFontSize || 14)}
                titleFontSize={previewData.titleFontSize || 16}
                messageFontSize={previewData.messageFontSize || 14}
                textAlignment={previewData.textAlignment || 'center'}
                showLeftIcon={previewData.iconAlignment === 'left' && previewData.icon !== 'none'}
                showRightIcon={previewData.iconAlignment === 'right' && previewData.icon !== 'none'}
                leftIcon={previewData.iconAlignment === 'left' ? previewData.icon : ''}
                rightIcon={previewData.iconAlignment === 'right' ? previewData.icon : ''}
                              showButton={false}
              buttonText=""
              showCloseButton={previewData.isClosable}
                borderStyle="solid"
                borderWidth={1}
                showDivider={true}
                dividerColor="#d1d5db"
                marqueeSpeed={previewData.typeSettings.marquee_speed || 2}
                marqueeDirection={previewData.typeSettings.marquee_direction || 'left'}
                pauseOnHover={
                  previewData.type === 'marquee' 
                    ? previewData.typeSettings.marquee_pause_on_hover || false
                    : previewData.type === 'carousel'
                    ? previewData.typeSettings.carousel_pause_on_hover || false
                    : false
                }
                carouselItems={previewData.carouselItems || []}
                carouselRotationSpeed={(previewData.typeSettings.carousel_speed || 5000) / 1000}
                barHeight={previewData.barHeight}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6">

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* 2. Announcement Type Section */}
          <div className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm">
            <div className="space-y-4">
              <div>
                <h3 className="text-base font-semibold text-gray-900 mb-1">Announcement Type</h3>
                <p className="text-xs text-gray-500">Choose how your announcement will be displayed</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {/* Single Type */}
                <label className="relative cursor-pointer">
                  <input
                    type="radio"
                    name="type"
                    value="single"
                    checked={formData.type === 'single'}
                    onChange={(e) => handleInputChange('type', e.target.value as AnnouncementType)}
                    className="sr-only peer"
                  />
                  <div className="p-3 border-2 border-gray-200 rounded-lg peer-checked:border-indigo-500 peer-checked:bg-indigo-50 transition-all hover:bg-gray-50">
                    <div className="w-6 h-6 bg-indigo-100 rounded-md mb-2 flex items-center justify-center">
                      <div className="w-3 h-3 bg-indigo-600 rounded"></div>
                    </div>
                    <h4 className="font-medium text-gray-900 text-sm mb-0.5">Single</h4>
                    <p className="text-xs text-gray-500">Default static bar</p>
                  </div>
                </label>

                {/* Carousel Type */}
                <label className="relative cursor-pointer">
                  <input
                    type="radio"
                    name="type"
                    value="carousel"
                    checked={formData.type === 'carousel'}
                    onChange={(e) => handleInputChange('type', e.target.value as AnnouncementType)}
                    className="sr-only peer"
                  />
                  <div className="p-3 border-2 border-gray-200 rounded-lg peer-checked:border-indigo-500 peer-checked:bg-indigo-50 transition-all hover:bg-gray-50">
                    <div className="w-6 h-6 bg-orange-100 rounded-md mb-2 flex items-center justify-center">
                      <div className="flex gap-0.5">
                        <div className="w-1.5 h-1.5 bg-orange-600 rounded"></div>
                        <div className="w-1.5 h-1.5 bg-orange-400 rounded"></div>
                        <div className="w-1.5 h-1.5 bg-orange-300 rounded"></div>
                      </div>
                    </div>
                    <h4 className="font-medium text-gray-900 text-sm mb-0.5">Carousel</h4>
                    <p className="text-xs text-gray-500">Rotates multiple bars</p>
                  </div>
                </label>

                {/* Marquee Type - Disabled */}
                <div className="relative">
                  <label className="relative cursor-not-allowed opacity-60">
                    <input
                      type="radio"
                      name="type"
                      value="marquee"
                      disabled
                      className="sr-only peer"
                    />
                    <div className="p-3 border-2 border-gray-200 rounded-lg bg-gray-50">
                      <div className="w-6 h-6 bg-green-100 rounded-md mb-2 flex items-center justify-center">
                        <div className="w-3 h-0.5 bg-green-600 rounded"></div>
                      </div>
                      <h4 className="font-medium text-gray-900 text-sm mb-0.5">Marquee</h4>
                      <p className="text-xs text-gray-500">Scrolling text</p>
                    </div>
                  </label>
                  <div 
                    className="absolute -top-1 -right-1 px-2 py-1 text-xs font-medium text-gray-800 rounded-full border border-gray-300"
                    style={{ backgroundColor: '#FFFFC5' }}
                  >
                    Coming Soon
                  </div>
                </div>
              </div>

              {/* Type-specific settings */}
              {formData.type === 'carousel' && (
                <div className="p-3 bg-orange-50 rounded-lg border border-orange-200">
                  <h5 className="font-medium text-gray-900 text-sm mb-2">Carousel Settings</h5>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Rotation Speed: {(formData.typeSettings.carousel_speed || 5000) / 1000}s
                      </label>
                      <input
                        type="range"
                        min="2"
                        max="10"
                        step="0.5"
                        value={(formData.typeSettings.carousel_speed || 5000) / 1000}
                        onChange={(e) => handleTypeSettingsChange('carousel_speed', parseFloat(e.target.value) * 1000)}
                        className="w-full"
                      />
                    </div>
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="carousel_pause"
                        checked={formData.typeSettings.carousel_pause_on_hover || false}
                        onChange={(e) => handleTypeSettingsChange('carousel_pause_on_hover', e.target.checked)}
                        className="w-4 h-4 text-orange-600 border-gray-300 rounded focus:ring-orange-500"
                      />
                      <label htmlFor="carousel_pause" className="ml-2 text-sm text-gray-700">
                        Pause on hover
                      </label>
                    </div>
                  </div>
                </div>
              )}

              {formData.type === 'marquee' && (
                <div className="p-3 bg-green-50 rounded-lg border border-green-200">
                  <h5 className="font-medium text-gray-900 text-sm mb-2">Marquee Settings</h5>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Speed</label>
                      <select
                        value={formData.typeSettings.marquee_speed || 2}
                        onChange={(e) => handleTypeSettingsChange('marquee_speed', parseInt(e.target.value))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500"
                      >
                        <option value={1}>Slow (30s to cross)</option>
                        <option value={2}>Normal (20s to cross)</option>
                        <option value={3}>Fast (15s to cross)</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Direction</label>
                      <select
                        value={formData.typeSettings.marquee_direction || 'left'}
                        onChange={(e) => handleTypeSettingsChange('marquee_direction', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500"
                      >
                        <option value="left">Left to Right</option>
                        <option value="right">Right to Left</option>
                      </select>
                    </div>
                  </div>
                  <div className="mt-3 flex items-center">
                    <input
                      type="checkbox"
                      id="marquee_pause"
                      checked={formData.typeSettings.marquee_pause_on_hover || false}
                      onChange={(e) => handleTypeSettingsChange('marquee_pause_on_hover', e.target.checked)}
                      className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
                    />
                    <label htmlFor="marquee_pause" className="ml-2 text-sm text-gray-700">
                      Pause on hover
                    </label>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Templates */}
          <div className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm">
            <TemplatePicker
              selectedTemplate={selectedTemplate}
              onSelect={handleTemplateSelect}
            />
          </div>

          {/* 3. Announcement Content Section */}
          <div className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm">
            <div className="space-y-4">
              <div>
                <h3 className="text-base font-semibold text-gray-900 mb-1">Announcement Content</h3>
                <p className="text-xs text-gray-500">Write your announcement message and customize formatting</p>
              </div>



              {/* Carousel Items - All Visible */}
              {formData.type === 'carousel' ? (
                <div className="space-y-4">
                  {formData.carouselItems?.map((item, index) => (
                    <div key={index} className="p-4 border-2 border-gray-200 rounded-lg bg-white">
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="font-medium text-gray-900">Item {index + 1}</h4>
                        {formData.carouselItems && formData.carouselItems.length > 1 && (
                          <button
                            type="button"
                            onClick={() => {
                              setFormData(prev => ({
                                ...prev,
                                carouselItems: (prev.carouselItems || []).filter((_, i) => i !== index)
                              }))
                            }}
                            className="text-red-600 hover:text-red-800 text-sm"
                          >
                            Remove
                          </button>
                        )}
                      </div>
                      
                      <div className="space-y-3">
                        {/* Title */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Title (Optional)
                          </label>
                          <FormattingToolbar
                            value={item.title}
                            onChange={(value) => updateCarouselItem(index, 'title', value)}
                            placeholder="Optional title for this item"
                            rows={2}
                          />
                        </div>

                        {/* Message */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Message *
                          </label>
                          <FormattingToolbar
                            value={item.message}
                            onChange={(value) => updateCarouselItem(index, 'message', value)}
                            placeholder="Enter message for this item..."
                            required
                            rows={3}
                          />
                        </div>

                        {/* URLs */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Title URL (Optional)
                            </label>
                            <input
                              type="url"
                              value={item.titleUrl || ''}
                              onChange={(e) => updateCarouselItem(index, 'titleUrl', e.target.value)}
                              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm"
                              placeholder="https://example.com"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Message URL (Optional)
                            </label>
                            <input
                              type="url"
                              value={item.messageUrl || ''}
                              onChange={(e) => updateCarouselItem(index, 'messageUrl', e.target.value)}
                              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm"
                              placeholder="https://example.com"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  {/* Add Item Button */}
                  {(!formData.carouselItems || formData.carouselItems.length < 3) && (
                    <button
                      type="button"
                      onClick={addCarouselItem}
                      className="w-full p-4 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-gray-400 hover:text-gray-700 transition-colors"
                    >
                      <svg className="w-5 h-5 mx-auto mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                      </svg>
                      Add Item ({formData.carouselItems?.length || 0}/3)
                    </button>
                  )}
                </div>
              ) : (
                // Single/Marquee Content
                <div className="space-y-4">
                  {/* Title */}
                  <div>
                    <label htmlFor="title" className="block text-sm font-medium text-gray-900 mb-2">
                      Title (Optional)
                    </label>
                    <FormattingToolbar
                      value={formData.title}
                      onChange={(value) => handleInputChange('title', value)}
                      placeholder="Optional title for your announcement"
                      rows={2}
                    />
                  </div>

                  {/* Message */}
                  <div>
                    <label htmlFor="message" className="block text-sm font-medium text-gray-900 mb-2">
                      Message *
                    </label>
                    <FormattingToolbar
                      value={formData.message}
                      onChange={(value) => handleInputChange('message', value)}
                      placeholder="Enter your announcement message..."
                      required
                      rows={4}
                    />
                  </div>

                  {/* URLs */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="titleUrl" className="block text-sm font-medium text-gray-900 mb-2">
                        Title URL (Optional)
                      </label>
                      <input
                        type="url"
                        id="titleUrl"
                        value={formData.titleUrl || ''}
                        onChange={(e) => handleInputChange('titleUrl', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all text-gray-900 placeholder-gray-500"
                        placeholder="https://example.com"
                      />
                    </div>
                    <div>
                      <label htmlFor="messageUrl" className="block text-sm font-medium text-gray-900 mb-2">
                        Message URL (Optional)
                      </label>
                      <input
                        type="url"
                        id="messageUrl"
                        value={formData.messageUrl || ''}
                        onChange={(e) => handleInputChange('messageUrl', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all text-gray-900 placeholder-gray-500"
                        placeholder="https://example.com"
                      />
                    </div>
                  </div>
                </div>
              )}



              {/* Icon Selector */}
              <IconSelector
                selectedIcon={formData.icon}
                onSelect={(icon) => handleInputChange('icon', icon)}
              />
            </div>
          </div>

          {/* 4. Appearance Section */}
          <div className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm">
            <div className="space-y-4">
              <div>
                <h3 className="text-base font-semibold text-gray-900 mb-1">Appearance</h3>
                <p className="text-xs text-gray-500">Customize colors, sizing, and positioning</p>
              </div>

              {/* Background Options */}
              <div className="space-y-4">
                <label className="block text-sm font-medium text-gray-900">
                  Background
                </label>
                
                {/* Gradient Toggle */}
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    id="useGradient"
                    checked={formData.useGradient}
                    onChange={(e) => handleInputChange('useGradient', e.target.checked)}
                    className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                  />
                  <label htmlFor="useGradient" className="text-sm text-gray-700">
                    Use gradient background
                  </label>
                </div>

                {/* Color Pickers */}
                <div className="grid grid-cols-2 gap-4">
                  <ColorPicker
                    value={formData.background}
                    onChange={(color) => handleInputChange('background', color)}
                    label={formData.useGradient ? 'Start Color' : 'Background Color'}
                  />
                  
                  {formData.useGradient && (
                    <ColorPicker
                      value={formData.backgroundGradient || '#1D4ED8'}
                      onChange={(color) => handleInputChange('backgroundGradient', color)}
                      label="End Color"
                    />
                  )}
                </div>
              </div>

              {/* Text Color */}
              <ColorPicker
                value={formData.textColor}
                onChange={(color) => handleInputChange('textColor', color)}
                label="Text and Icon Color"
              />

              {/* Bar Height Slider */}
              <div className="space-y-2">
                <label htmlFor="barHeight" className="block text-sm font-medium text-gray-900">
                  Bar Height: {formData.barHeight}px
                </label>
                <input
                  type="range"
                  id="barHeight"
                  min="40"
                  max="120"
                  value={formData.barHeight}
                  onChange={(e) => handleInputChange('barHeight', parseInt(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                />
              </div>

              {/* Font Size Sliders */}
              <div className="space-y-4">
                <label className="block text-sm font-medium text-gray-900">
                  Font Sizes
                </label>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Title Font Size */}
                  <div>
                    <label htmlFor="titleFontSize" className="block text-sm font-medium text-gray-700 mb-2">
                      Title Size: {formData.titleFontSize}px
                    </label>
                    <input
                      type="range"
                      id="titleFontSize"
                      min="12"
                      max="24"
                      value={formData.titleFontSize}
                      onChange={(e) => handleInputChange('titleFontSize', parseInt(e.target.value))}
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                    />
                  </div>

                  {/* Message Font Size */}
                  <div>
                    <label htmlFor="messageFontSize" className="block text-sm font-medium text-gray-700 mb-2">
                      Message Size: {formData.messageFontSize}px
                    </label>
                    <input
                      type="range"
                      id="messageFontSize"
                      min="10"
                      max="20"
                      value={formData.messageFontSize}
                      onChange={(e) => handleInputChange('messageFontSize', parseInt(e.target.value))}
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                    />
                  </div>
                </div>
              </div>

              {/* Alignment Controls */}
              <div className="space-y-4">
                <label className="block text-sm font-medium text-gray-900">
                  Alignment
                </label>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Text Alignment */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Text Alignment
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      {(['left', 'center', 'right'] as const).map((alignment) => {
                        const isDisabled = formData.type === 'carousel' && (alignment === 'left' || alignment === 'right')
                        const isSelected = formData.textAlignment === alignment
                        
                        return (
                          <button
                            key={alignment}
                            type="button"
                            onClick={() => !isDisabled && handleInputChange('textAlignment', alignment)}
                            disabled={isDisabled}
                            className={`px-4 py-2 text-sm font-medium rounded-lg border transition-all ${
                              isDisabled
                                ? 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed'
                                : isSelected
                                ? 'bg-indigo-600 text-white border-indigo-600'
                                : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'
                            }`}
                          >
                            {alignment.charAt(0).toUpperCase() + alignment.slice(1)}
                          </button>
                        )
                      })}
                    </div>
                  </div>

                  {/* Icon Alignment */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Icon Alignment
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      {(['left', 'right'] as const).map((alignment) => (
                        <button
                          key={alignment}
                          type="button"
                          onClick={() => handleInputChange('iconAlignment', alignment)}
                          className={`px-4 py-2 text-sm font-medium rounded-lg border transition-all ${
                            formData.iconAlignment === alignment
                              ? 'bg-indigo-600 text-white border-indigo-600'
                              : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'
                          }`}
                        >
                          {alignment.charAt(0).toUpperCase() + alignment.slice(1)}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Toggle Options */}
              <div className="space-y-4">
                <label className="block text-sm font-medium text-gray-900">
                  Options
                </label>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Close Button Toggle */}
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                    <div>
                      <div className="font-medium text-gray-900">Close Button</div>
                      <div className="text-sm text-gray-500">Allow users to dismiss</div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.isClosable}
                        onChange={(e) => handleInputChange('isClosable', e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                    </label>
                  </div>

                  {/* Sticky Position Toggle */}
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                    <div>
                      <div className="font-medium text-gray-900">Sticky Position</div>
                      <div className="text-sm text-gray-500">Stay at top when scrolling</div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.isSticky}
                        onChange={(e) => handleInputChange('isSticky', e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                    </label>
                  </div>
                </div>

                {/* Visibility Toggle */}
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                  <div>
                    <div className="font-medium text-gray-900">Visibility</div>
                    <div className="text-sm text-gray-500">Whether this announcement is active</div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.visibility}
                      onChange={(e) => handleInputChange('visibility', e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-center pt-2">
            <button
              type="submit"
              disabled={loading || !formData.message.trim()}
              className="px-6 py-3 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              {loading ? 'Creating...' : 'Create Announcement'}
            </button>
          </div>
        </form>
      </div>

      {/* Toast Container */}
      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </div>
  )
} 