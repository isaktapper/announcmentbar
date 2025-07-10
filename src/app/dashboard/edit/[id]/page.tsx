'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { 
  ArrowLeftIcon,
  DocumentTextIcon,
  PaintBrushIcon,
  AdjustmentsHorizontalIcon,
  GlobeAltIcon,
  Squares2X2Icon,
} from '@heroicons/react/24/outline'
import { createClient } from '@/lib/supabase-client'
import { useToast } from '@/hooks/useToast'
import { ToastContainer } from '@/components/Toast'
import { AnnouncementFormData, Template, CarouselItem } from '@/types/announcement'
import IconSelector from '../../create/components/IconSelector'
import FontSelector from '../../create/components/FontSelector'
import TemplatePicker from '../../create/components/TemplatePicker'
import LivePreview from '../../create/components/LivePreview'
import ColorPicker from '@/components/ColorPicker'
import FormattingToolbar from '../../create/components/FormattingToolbar'
import SectionCard from '../../create/components/SectionCard'
import GeoSelector from '../../create/components/GeoSelector'

export default function EditAnnouncementPage() {
  const router = useRouter()
  const params = useParams()
  const { toasts, success, error, removeToast } = useToast()
  const [loading, setLoading] = useState(false)
  const [initialLoading, setInitialLoading] = useState(true)
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null)
  
  // Section visibility state
  const [openSections, setOpenSections] = useState<string[]>(['general'])

  const toggleSection = (sectionId: string) => {
    setOpenSections(prev => 
      prev.includes(sectionId) 
        ? prev.filter(id => id !== sectionId)
        : [...prev, sectionId]
    )
  }

  const [formData, setFormData] = useState<AnnouncementFormData>({
    title: '',
    message: '',
    icon: 'none',
    background: '#FFFFC5',
    backgroundGradient: '#FFF7A0',
    useGradient: false,
    textColor: '#1F2937',
    visibility: true,
    isSticky: true,
    titleFontSize: 16,
    messageFontSize: 14,
    textAlignment: 'center',
    iconAlignment: 'left',
    isClosable: false,
    type: 'single',
    typeSettings: {
      marquee_speed: 2,
      marquee_direction: 'left',
      marquee_pause_on_hover: true,
      carousel_speed: 5,
      carousel_pause_on_hover: true
    },
    barHeight: 60,
    carouselItems: [{ title: '', message: '' }],
    fontFamily: 'Work Sans',
    geoCountries: [],
    pagePaths: [],
    scheduledStart: null,
    scheduledEnd: null
  })

  // Debounced state for live preview
  const [previewData, setPreviewData] = useState<AnnouncementFormData>(formData)

  // Single effect to update preview data - simplified logic
  useEffect(() => {
    if (!initialLoading) {
      // For text inputs, use debouncing
      const timer = setTimeout(() => {
        setPreviewData(formData)
      }, 150)

      return () => clearTimeout(timer)
    }
  }, [formData, initialLoading])

  // Load announcement data
  useEffect(() => {
    const loadAnnouncement = async () => {
      if (!params.id) return

      try {
        const supabase = createClient()
        const { data: { user } } = await supabase.auth.getUser()
        
        if (!user) {
          router.push('/auth/login')
          return
        }

        const { data, error: fetchError } = await supabase
          .from('announcements')
          .select('*')
          .eq('id', params.id)
          .eq('user_id', user.id)
          .single()

        if (fetchError) {
          console.error('Failed to load announcement:', fetchError)
          router.push('/dashboard')
          return
        }

        // Parse content and handle different formats
        const parsedContent = data.content || null

        // Set form data based on content format
        let newFormData
        if (data.type === 'carousel' && Array.isArray(parsedContent)) {
          // Carousel with array of items
          newFormData = {
            title: '',
            message: '',
            icon: data.icon || 'none',
            background: data.background || '#3B82F6',
            backgroundGradient: data.background_gradient || '#1D4ED8',
            useGradient: data.use_gradient || false,
            textColor: data.text_color || '#FFFFFF',
            visibility: data.visibility ?? true,
            isSticky: data.is_sticky ?? true,
            titleFontSize: data.title_font_size || 16,
            messageFontSize: data.message_font_size || 14,
            titleUrl: '',
            messageUrl: '',
            textAlignment: data.text_alignment || 'center',
            iconAlignment: data.icon_alignment || 'left',
            isClosable: data.is_closable || false,
            type: data.type === 'marquee' ? 'single' : (data.type || 'single'), // Convert marquee to single
            typeSettings: data.type_settings || {},
            barHeight: data.bar_height || 60,
            carouselItems: parsedContent,
            fontFamily: data.font_family || 'Work Sans',
            geoCountries: data.geo_countries || [], // Added: Load geo targeting
            pagePaths: data.page_paths || [], // Added: Load page targeting
            scheduledStart: data.scheduled_start || null,
            scheduledEnd: data.scheduled_end || null,
          }
        } else {
          // Single/Marquee with JSON object
          newFormData = {
            title: parsedContent?.title || '',
            message: parsedContent?.message || '',
            icon: data.icon || 'none',
            background: data.background || '#3B82F6',
            backgroundGradient: data.background_gradient || '#1D4ED8',
            useGradient: data.use_gradient || false,
            textColor: data.text_color || '#FFFFFF',
            visibility: data.visibility ?? true,
            isSticky: data.is_sticky ?? true,
            titleFontSize: data.title_font_size || 16,
            messageFontSize: data.message_font_size || 14,
            titleUrl: parsedContent?.titleUrl || '',
            messageUrl: parsedContent?.messageUrl || '',
            textAlignment: data.text_alignment || 'center',
            iconAlignment: data.icon_alignment || 'left',
            isClosable: data.is_closable || false,
            type: data.type === 'marquee' ? 'single' : (data.type || 'single'), // Convert marquee to single
            typeSettings: data.type_settings || {},
            barHeight: data.bar_height || 60,
            carouselItems: [{ title: '', message: '', titleUrl: '', messageUrl: '' }],
            fontFamily: data.font_family || 'Work Sans',
            geoCountries: data.geo_countries || [], // Added: Load geo targeting
            pagePaths: data.page_paths || [], // Added: Load page targeting
            scheduledStart: data.scheduled_start || null,
            scheduledEnd: data.scheduled_end || null,
          }
        }

        console.log('Loading announcement data (should only appear once):', newFormData)
        setFormData(newFormData)
        setPreviewData(newFormData)
      } catch (loadError) {
        console.error('Failed to load announcement:', loadError)
        router.push('/dashboard')
      } finally {
        setInitialLoading(false)
      }
    }

    if (params.id) {
      loadAnnouncement()
    }
  }, [params.id, router])

  const handleInputChange = (field: keyof AnnouncementFormData, value: string | boolean | number | string[]) => {
    setFormData(prev => {
      const newData = { ...prev, [field]: value }
      
      // Prevent marquee selection (disabled feature)
      if (field === 'type' && value === 'marquee') {
        newData.type = 'single'
        return newData
      }
      
      // When switching to carousel, force text alignment to center since left/right are disabled
      if (field === 'type' && value === 'carousel' && (prev.textAlignment === 'left' || prev.textAlignment === 'right')) {
        newData.textAlignment = 'center'
      }
      
      return newData
    })
    
    // Clear template selection when user modifies (in separate effect to avoid dependency issues)
    if (selectedTemplate) {
      setSelectedTemplate(null)
    }
  }

  const handleCarouselItemChange = (index: number, field: keyof CarouselItem, value: string) => {
    setFormData(prev => {
      const newItems = [...(prev.carouselItems || [])]
      newItems[index] = {
        ...newItems[index],
        [field]: value
      }
      return { ...prev, carouselItems: newItems }
    })
  }

  const handleAddCarouselItem = () => {
    if (formData.carouselItems && formData.carouselItems.length >= 3) {
      error('Maximum 3 carousel items allowed')
      return
    }
    setFormData(prev => ({
      ...prev,
      carouselItems: [...(prev.carouselItems || []), { title: '', message: '', titleUrl: '', messageUrl: '' }]
    }))
  }

  const handleRemoveCarouselItem = (index: number) => {
    setFormData(prev => ({
      ...prev,
      carouselItems: prev.carouselItems?.filter((_, i) => i !== index) || []
    }))
  }

  const handleTemplateSelect = (template: Template) => {
    setSelectedTemplate(template.id)
    setFormData({
      ...formData,
      title: template.title,
      message: template.message,
      icon: template.icon,
      background: template.background,
      backgroundGradient: template.backgroundGradient,
      useGradient: template.useGradient,
      textColor: template.textColor,
      isSticky: template.isSticky,
      titleFontSize: template.titleFontSize,
      messageFontSize: template.messageFontSize,
      textAlignment: template.textAlignment,
      iconAlignment: template.iconAlignment,
      isClosable: template.isClosable,
      type: template.type,
      typeSettings: template.typeSettings,
      barHeight: template.barHeight,
      carouselItems: template.carouselItems,
      fontFamily: template.fontFamily,
      geoCountries: template.geoCountries,
      pagePaths: template.pagePaths,
      scheduledStart: template.scheduledStart,
      scheduledEnd: template.scheduledEnd
    })
  }

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
        error('You must be logged in to update bars')
        return
      }

      // Format content based on type
      let content
      if (formData.type === 'carousel') {
        content = formData.carouselItems.map(item => ({
          title: item.title,
          message: item.message,
          titleUrl: item.titleUrl,
          messageUrl: item.messageUrl
        }))
      } else {
        content = {
          title: formData.title,
          message: formData.message,
          titleUrl: formData.titleUrl,
          messageUrl: formData.messageUrl
        }
      }

      const { error: updateError } = await supabase
        .from('announcements')
        .update({
          icon: formData.icon,
          background: formData.background,
          background_gradient: formData.useGradient ? formData.backgroundGradient : null,
          use_gradient: formData.useGradient,
          text_color: formData.textColor,
          visibility: formData.visibility,
          is_sticky: formData.isSticky,
          title_font_size: formData.titleFontSize,
          message_font_size: formData.messageFontSize,
          text_alignment: formData.textAlignment,
          icon_alignment: formData.iconAlignment,
          is_closable: formData.isClosable,
          type: formData.type,
          type_settings: formData.typeSettings,
          bar_height: formData.barHeight,
          content: content,
          font_family: formData.fontFamily,
          geo_countries: formData.geoCountries,
          page_paths: formData.pagePaths,
          scheduled_start: formData.scheduledStart || null,
          scheduled_end: formData.scheduledEnd || null
        })
        .eq('id', params.id)
        .eq('user_id', user.id)

      if (updateError) {
        throw updateError
      }

      success('Bar updated successfully!')
      router.push('/dashboard')
    } catch (err) {
      console.error('Error updating announcement:', err)
      error('Failed to update announcement')
    } finally {
      setLoading(false)
    }
  }

  const [showScheduling, setShowScheduling] = useState(false)

  useEffect(() => {
    // Initialize showScheduling based on whether there are scheduled dates
    setShowScheduling(Boolean(formData.scheduledStart || formData.scheduledEnd))
  }, [formData.scheduledStart, formData.scheduledEnd])

  if (initialLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
                          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading announcement...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-12">
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
              <h1 className="text-2xl font-bold text-gray-900">Edit Bar</h1>
              <p className="text-sm text-gray-500 mt-1">
                Update your bar design
              </p>
            </div>
            <div className="w-32"></div> {/* Spacer for centering */}
          </div>
        </div>
      </div>

      {/* Sticky Live Preview */}
      <div className="sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-6 max-w-4xl mx-auto mt-4">
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
              fontFamily={previewData.fontFamily}
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
              marqueeSpeed={Number(previewData.typeSettings.marquee_speed) || 2}
              marqueeDirection={(previewData.typeSettings.marquee_direction as 'left' | 'right') || 'left'}
              pauseOnHover={
                previewData.type === 'marquee' 
                ? Boolean(previewData.typeSettings.marquee_pause_on_hover) || false
                : previewData.type === 'carousel'
                ? Boolean(previewData.typeSettings.carousel_pause_on_hover) || false
                : false
              }
              carouselItems={previewData.carouselItems || []}
              carouselRotationSpeed={Number(previewData.typeSettings.carousel_speed || 5000) / 1000}
              barHeight={previewData.barHeight}
            />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-6">
          {/* General Section */}
          <SectionCard
            id="general"
            title="General"
            subtitle="Basic bar settings and template"
            icon={Squares2X2Icon}
            isOpen={openSections.includes('general')}
            onToggle={() => toggleSection('general')}
          >
            <div className="space-y-6">
              {/* Bar Type */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Bar Type</label>
                <div className="grid grid-cols-3 gap-4">
                  <button
                    type="button"
                    onClick={() => handleInputChange('type', 'single')}
                    className={`p-4 border-2 rounded-lg text-left transition-all ${
                      formData.type === 'single'
                        ? 'border-brand-500 bg-brand-50 ring-2 ring-brand-500 ring-offset-2'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="w-8 h-8 bg-gray-100 rounded-lg mb-2 flex items-center justify-center">
                      <div className="w-4 h-4 bg-gray-400 rounded"></div>
                    </div>
                    <div className="font-medium text-gray-900 mb-1">Single</div>
                    <div className="text-sm text-gray-500">Static message bar</div>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleInputChange('type', 'carousel')}
                    className={`p-4 border-2 rounded-lg text-left transition-all ${
                      formData.type === 'carousel'
                        ? 'border-brand-500 bg-brand-50 ring-2 ring-brand-500 ring-offset-2'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="w-8 h-8 bg-gray-100 rounded-lg mb-2 flex items-center justify-center">
                      <div className="w-4 h-4 bg-gray-400 rounded-full"></div>
                    </div>
                    <div className="font-medium text-gray-900 mb-1">Carousel</div>
                    <div className="text-sm text-gray-500">Rotating messages</div>
                  </button>

                  <div className="relative">
                    <button
                      type="button"
                      disabled
                      className="w-full p-4 border-2 border-gray-200 rounded-lg text-left opacity-60"
                    >
                      <div className="w-8 h-8 bg-gray-100 rounded-lg mb-2 flex items-center justify-center">
                        <div className="w-4 h-0.5 bg-gray-400 rounded"></div>
                      </div>
                      <div className="font-medium text-gray-900 mb-1">Marquee</div>
                      <div className="text-sm text-gray-500">Scrolling text</div>
                    </button>
                    <div className="absolute -top-2 -right-2 px-2 py-1 text-xs font-medium bg-[#FFFFC5] text-black rounded-full border border-yellow-300">
                      Coming Soon
                    </div>
                  </div>
                </div>
              </div>

              {/* Template Picker */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-4">Choose a Template</label>
                <TemplatePicker
                  selectedTemplate={selectedTemplate}
                  onSelect={handleTemplateSelect}
                />
              </div>
            </div>
          </SectionCard>

          {/* Content Section */}
          <SectionCard
            id="content"
            title="Content"
            subtitle="Message and formatting"
            icon={DocumentTextIcon}
            isOpen={openSections.includes('content')}
            onToggle={() => toggleSection('content')}
          >
            <div className="space-y-6">
              {formData.type === 'carousel' ? (
                <div className="space-y-4">
                  {formData.carouselItems?.map((item, index) => (
                    <div key={index} className="p-4 border-2 border-gray-200 rounded-lg bg-white">
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="font-medium text-gray-900">Item {index + 1}</h4>
                        {formData.carouselItems && formData.carouselItems.length > 1 && (
                          <button
                            type="button"
                            onClick={() => handleRemoveCarouselItem(index)}
                            className="text-red-600 hover:text-red-800 text-sm"
                          >
                            Remove
                          </button>
                        )}
                      </div>
                      
                      <div className="space-y-3">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Title (Optional)
                          </label>
                          <FormattingToolbar
                            value={item.title}
                            onChange={(value) => handleCarouselItemChange(index, 'title', value)}
                            placeholder="Optional title for this item"
                            rows={2}
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Message *
                          </label>
                          <FormattingToolbar
                            value={item.message}
                            onChange={(value) => handleCarouselItemChange(index, 'message', value)}
                            placeholder="Enter message for this item..."
                            required
                            rows={3}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  <button
                    type="button"
                    onClick={handleAddCarouselItem}
                    disabled={formData.carouselItems && formData.carouselItems.length >= 3}
                    className="w-full py-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-gray-400 hover:text-gray-900 transition-colors disabled:opacity-50 disabled:hover:border-gray-300 disabled:hover:text-gray-600"
                  >
                    Add Carousel Item
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Title (Optional)
                    </label>
                    <FormattingToolbar
                      value={formData.title}
                      onChange={(value) => handleInputChange('title', value)}
                      placeholder="Optional title for your bar"
                      rows={2}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Message *
                    </label>
                    <FormattingToolbar
                      value={formData.message}
                      onChange={(value) => handleInputChange('message', value)}
                      placeholder="Enter your bar message..."
                      required
                      rows={4}
                    />
                  </div>
                </div>
              )}

              {/* Typography */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-4">Typography</label>
                <div className="space-y-4">
                  <FontSelector
                    selectedFont={formData.fontFamily}
                    onSelect={(font) => handleInputChange('fontFamily', font)}
                  />

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Title Size: {formData.titleFontSize}px
                      </label>
                      <input
                        type="range"
                        min="12"
                        max="24"
                        value={formData.titleFontSize}
                        onChange={(e) => handleInputChange('titleFontSize', parseInt(e.target.value))}
                        className="w-full"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Message Size: {formData.messageFontSize}px
                      </label>
                      <input
                        type="range"
                        min="10"
                        max="20"
                        value={formData.messageFontSize}
                        onChange={(e) => handleInputChange('messageFontSize', parseInt(e.target.value))}
                        className="w-full"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Text Alignment */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Text Alignment
                </label>
                <div className="grid grid-cols-3 gap-4">
                  <button
                    type="button"
                    onClick={() => handleInputChange('textAlignment', 'left')}
                    disabled={formData.type === 'carousel'}
                    className={`px-4 py-2 border rounded-lg ${
                      formData.textAlignment === 'left'
                        ? 'border-brand-500 bg-brand-50 text-brand-700'
                        : 'border-gray-200 text-gray-700 hover:border-gray-300'
                    } disabled:opacity-50`}
                  >
                    Left
                  </button>
                  <button
                    type="button"
                    onClick={() => handleInputChange('textAlignment', 'center')}
                    className={`px-4 py-2 border rounded-lg ${
                      formData.textAlignment === 'center'
                        ? 'border-brand-500 bg-brand-50 text-brand-700'
                        : 'border-gray-200 text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    Center
                  </button>
                  <button
                    type="button"
                    onClick={() => handleInputChange('textAlignment', 'right')}
                    disabled={formData.type === 'carousel'}
                    className={`px-4 py-2 border rounded-lg ${
                      formData.textAlignment === 'right'
                        ? 'border-brand-500 bg-brand-50 text-brand-700'
                        : 'border-gray-200 text-gray-700 hover:border-gray-300'
                    } disabled:opacity-50`}
                  >
                    Right
                  </button>
                </div>
                {formData.type === 'carousel' && (
                  <p className="text-xs text-gray-500 mt-1">
                    Left/Right alignment disabled for carousel
                  </p>
                )}
              </div>

              {/* Icon Selector */}
              <IconSelector
                selectedIcon={formData.icon}
                onSelect={(icon) => handleInputChange('icon', icon)}
              />

              {/* Icon Alignment - Only show if an icon is selected */}
              {formData.icon !== 'none' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Icon Position
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => handleInputChange('iconAlignment', 'left')}
                      className={`flex items-center justify-center gap-2 px-4 py-2.5 text-sm rounded-lg border transition-all ${
                        formData.iconAlignment === 'left'
                          ? 'border-brand-500 bg-brand-50 text-brand-700'
                          : 'bg-white border-gray-200 text-gray-700 hover:border-gray-300'
                      }`}
                    >
                      <span className="text-lg">=</span>
                      <span>Left</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleInputChange('iconAlignment', 'right')}
                      className={`flex items-center justify-center gap-2 px-4 py-2.5 text-sm rounded-lg border transition-all ${
                        formData.iconAlignment === 'right'
                          ? 'border-brand-500 bg-brand-50 text-brand-700'
                          : 'bg-white border-gray-200 text-gray-700 hover:border-gray-300'
                      }`}
                    >
                      <span>Right</span>
                      <span className="text-lg">=</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </SectionCard>

          {/* Appearance Section */}
          <SectionCard
            id="appearance"
            title="Appearance"
            subtitle="Colors, sizing, and positioning"
            icon={PaintBrushIcon}
            isOpen={openSections.includes('appearance')}
            onToggle={() => toggleSection('appearance')}
          >
            <div className="space-y-6">
              {/* Background */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-4">Background</label>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      id="useGradient"
                      checked={formData.useGradient}
                      onChange={(e) => handleInputChange('useGradient', e.target.checked)}
                      className="w-4 h-4 text-brand-600 border-gray-300 rounded focus:ring-brand-500"
                    />
                    <label htmlFor="useGradient" className="text-sm text-gray-700">
                      Use gradient background
                    </label>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <ColorPicker
                      value={formData.background}
                      onChange={(color) => handleInputChange('background', color)}
                      label={formData.useGradient ? 'Start Color' : 'Background Color'}
                    />
                    
                    {formData.useGradient && (
                      <ColorPicker
                        value={formData.backgroundGradient || '#FFF7A0'}
                        onChange={(color) => handleInputChange('backgroundGradient', color)}
                        label="End Color"
                      />
                    )}
                  </div>
                </div>
              </div>

              {/* Text Color */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-4">Text Color</label>
                <ColorPicker
                  value={formData.textColor}
                  onChange={(color) => handleInputChange('textColor', color)}
                  label="Text Color"
                />
              </div>

              {/* Bar Height */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Bar Height: {formData.barHeight}px
                </label>
                <input
                  type="range"
                  min="40"
                  max="120"
                  value={formData.barHeight}
                  onChange={(e) => handleInputChange('barHeight', parseInt(e.target.value))}
                  className="w-full"
                />
              </div>
            </div>
          </SectionCard>

          {/* Options Section */}
          <SectionCard
            id="options"
            title="Options"
            subtitle="Behavior, scheduling, and display settings"
            icon={AdjustmentsHorizontalIcon}
            isOpen={openSections.includes('options')}
            onToggle={() => toggleSection('options')}
          >
            <div className="space-y-6">
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
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-gray-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-black"></div>
                  </label>
                </div>

                {/* Sticky Position Toggle */}
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                  <div>
                    <div className="font-medium text-gray-900">Sticky Position</div>
                    <div className="text-sm text-gray-500">Keep bar visible while scrolling</div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.isSticky}
                      onChange={(e) => handleInputChange('isSticky', e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-gray-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-black"></div>
                  </label>
                </div>
              </div>

              {/* Scheduling */}
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                <div>
                  <div className="font-medium text-gray-900">Schedule Announcement</div>
                  <div className="text-sm text-gray-500">Set when the bar goes live and expires</div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={showScheduling}
                    onChange={(e) => {
                      setShowScheduling(e.target.checked)
                      if (!e.target.checked) {
                        handleInputChange('scheduledStart', '')
                        handleInputChange('scheduledEnd', '')
                      }
                    }}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-gray-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-black"></div>
                </label>
              </div>

              {showScheduling && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-900 mb-2">Start Date & Time</label>
                    <input
                      type="datetime-local"
                      value={formData.scheduledStart || ''}
                      onChange={(e) => handleInputChange('scheduledStart', e.target.value)}
                      className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm text-gray-900 placeholder-gray-400 focus:border-black focus:ring-1 focus:ring-black transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-900 mb-2">End Date & Time</label>
                    <input
                      type="datetime-local"
                      value={formData.scheduledEnd || ''}
                      onChange={(e) => handleInputChange('scheduledEnd', e.target.value)}
                      className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm text-gray-900 placeholder-gray-400 focus:border-black focus:ring-1 focus:ring-black transition-colors"
                    />
                  </div>
                </div>
              )}
            </div>
          </SectionCard>

          {/* Targeting Section */}
          <SectionCard
            id="targeting"
            title="Targeting"
            subtitle="Control where your bar appears"
            icon={GlobeAltIcon}
            isOpen={openSections.includes('targeting')}
            onToggle={() => toggleSection('targeting')}
          >
            <div className="space-y-6">
              {/* Page Targeting */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Show on these paths
                </label>
                <div className="space-y-2">
                  {formData.pagePaths.map((path, index) => (
                    <div key={index} className="flex gap-2">
                      <input
                        type="text"
                        value={path}
                        onChange={(e) => handleInputChange('pagePaths', [...formData.pagePaths.slice(0, index), e.target.value, ...formData.pagePaths.slice(index + 1)])}
                        placeholder={index === 0 ? "Ex. /products or /dashboard" : "/"}
                        className="flex-1 px-3 py-2 bg-white border border-gray-300 rounded-lg text-sm text-gray-900 placeholder:text-gray-400/60 focus:ring-2 focus:ring-brand-500 focus:border-transparent"
                      />
                      <button
                        type="button"
                        onClick={() => handleInputChange('pagePaths', formData.pagePaths.filter((_, i) => i !== index))}
                        className="p-2 text-gray-400 hover:text-gray-600"
                      >
                        <span className="text-xl">×</span>
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() => handleInputChange('pagePaths', [...formData.pagePaths, ''])}
                    className="px-4 py-2 border border-gray-300 rounded-lg text-sm text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-500"
                  >
                    Add Path
                  </button>
                </div>
              </div>

              {/* Geo Targeting */}
              <div className="relative">
                <GeoSelector
                  initialCountries={formData.geoCountries}
                  onCountriesChange={(countries) => handleInputChange('geoCountries', countries)}
                />
              </div>
            </div>
          </SectionCard>

          {/* Submit Button */}
          <div className="flex justify-center pt-2">
            <button
              type="submit"
              onClick={handleSubmit}
              disabled={loading}
              className="px-6 py-3 bg-[#FFFFC5] text-black font-medium rounded-lg hover:bg-yellow-200 focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              {loading ? 'Updating...' : 'Update Bar'}
            </button>
          </div>
        </div>
      </main>

      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </div>
  )
} 