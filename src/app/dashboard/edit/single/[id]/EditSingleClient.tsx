'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
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
import { AnnouncementFormData } from '@/types/announcement'
import IconSelector from '../../../components/create/IconSelector'
import FontSelector from '../../../components/create/FontSelector'
import TemplatePicker from '../../../components/create/TemplatePicker'
import LivePreview from '../../../components/create/LivePreview'
import ColorPicker from '@/components/ColorPicker'
import FormattingToolbar from '../../../components/create/FormattingToolbar'
import SectionCard from '../../../components/create/SectionCard'
import GeoSelector from '../../../components/create/GeoSelector'
import CTASettings from '../../../components/create/CTASettings'

interface EditSingleClientProps {
  announcement: any // Replace with proper type
}

export default function EditSingleClient({ announcement }: EditSingleClientProps) {
  const router = useRouter()
  const { toasts, success, error, removeToast } = useToast()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState<AnnouncementFormData | null>(null)
  const [previewData, setPreviewData] = useState<AnnouncementFormData | null>(null)
  const [openSections, setOpenSections] = useState<string[]>(['general'])
  const [showScheduling, setShowScheduling] = useState(false)

  const toggleSection = (sectionId: string) => {
    setOpenSections(prev => 
      prev.includes(sectionId) 
        ? prev.filter(id => id !== sectionId)
        : [...prev, sectionId]
    )
  }

  useEffect(() => {
    // Convert the announcement data to form data format
    const formData: AnnouncementFormData = {
      bar_name: announcement.bar_name,
      title: announcement.content.title || '',
      message: announcement.content.message || '',
      icon: announcement.icon,
      background: announcement.background,
      backgroundGradient: announcement.background_gradient || '#FFFFFF',
      useGradient: announcement.use_gradient,
      textColor: announcement.text_color,
      visibility: announcement.visibility,
      isSticky: announcement.is_sticky,
      titleFontSize: announcement.title_font_size,
      messageFontSize: announcement.message_font_size,
      textAlignment: announcement.text_alignment,
      iconAlignment: announcement.icon_alignment,
      isClosable: announcement.is_closable,
      type: announcement.type,
      typeSettings: announcement.type_settings,
      barHeight: announcement.bar_height,
      carouselItems: [],
      fontFamily: announcement.font_family,
      geoCountries: announcement.geo_countries,
      pagePaths: announcement.page_paths,
      scheduledStart: announcement.scheduledStart,
      scheduledEnd: announcement.scheduledEnd,
      cta_enabled: announcement.cta_enabled,
      cta_text: announcement.cta_text,
      cta_url: announcement.cta_url,
      cta_background_color: announcement.cta_background_color,
      cta_text_color: announcement.cta_text_color,
      allowed_domain: announcement.allowed_domain?.trim() || null,
    }

    setFormData(formData)
    setPreviewData(formData)
    setShowScheduling(!!announcement.scheduledStart || !!announcement.scheduledEnd)
  }, [announcement])

  // Update preview data when form data changes
  useEffect(() => {
    if (formData) {
      const timer = setTimeout(() => {
        setPreviewData(formData)
      }, 150)
      return () => clearTimeout(timer)
    }
  }, [formData])

  const handleDateChange = (field: 'scheduledStart' | 'scheduledEnd', value: string) => {
    // If value is empty, set to null, otherwise convert to ISO string
    const dateValue = value ? new Date(value).toISOString() : null
    handleInputChange(field, dateValue)
  }

  // Helper function to convert UTC time to local time for datetime-local input
  const formatDateTimeLocal = (utcString: string | null) => {
    if (!utcString) return ''
    const date = new Date(utcString)
    // Get local timezone offset and adjust
    const offsetMs = date.getTimezoneOffset() * 60000
    const localDate = new Date(date.getTime() - offsetMs)
    return localDate.toISOString().slice(0, 16)
  }

  const handleInputChange = (
    field: keyof AnnouncementFormData,
    value: AnnouncementFormData[keyof AnnouncementFormData]
  ) => {
    if (!formData) return
    setFormData(prev => ({
      ...prev!,
      [field]: value
    }))
  }

  // Toggle scheduling and clear dates if disabled
  const handleSchedulingToggle = (enabled: boolean) => {
    setShowScheduling(enabled)
    if (!enabled) {
      handleInputChange('scheduledStart', null)
      handleInputChange('scheduledEnd', null)
      handleInputChange('visibility', true)
    } else {
      handleInputChange('visibility', false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData || !formData.message.trim()) return

    try {
      setLoading(true)

      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) {
        error('You must be logged in to update an announcement')
        return
      }

      // Format content for single announcement
      const content = {
        title: formData.title,
        message: formData.message
      }

      const updatedAnnouncement = {
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
        "scheduledStart": formData.scheduledStart,
        "scheduledEnd": formData.scheduledEnd,
        cta_enabled: formData.cta_enabled,
        cta_text: formData.cta_text || '',
        cta_url: formData.cta_url || '',
        cta_background_color: formData.cta_background_color || '#000000',
        cta_text_color: formData.cta_text_color || '#FFFFFF',
        allowed_domain: formData.allowed_domain,
      }

      const { error: updateError } = await supabase
        .from('announcements')
        .update(updatedAnnouncement)
        .eq('id', announcement.id)

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

  if (!formData || !previewData) {
    return <div>Loading...</div>
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
                Update your announcement bar
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
              backgroundColor={previewData.background}
              backgroundGradient={previewData.backgroundGradient}
              useGradient={previewData.useGradient}
              textColor={previewData.textColor}
              linkColor={previewData.textColor}
              borderColor={previewData.textColor}
              buttonColor={previewData.textColor}
              buttonTextColor={previewData.background}
              fontFamily={previewData.fontFamily}
              fontSize={Math.max(previewData.titleFontSize || 16, previewData.messageFontSize || 14)}
              titleFontSize={previewData.titleFontSize || 16}
              messageFontSize={previewData.messageFontSize || 14}
              textAlignment={previewData.textAlignment || 'center'}
              showLeftIcon={previewData.icon !== 'none' && previewData.iconAlignment === 'left'}
              showRightIcon={previewData.icon !== 'none' && previewData.iconAlignment === 'right'}
              leftIcon={previewData.icon}
              rightIcon={previewData.icon}
              showButton={false}
              buttonText=""
              showCloseButton={previewData.isClosable}
              borderStyle="solid"
              borderWidth={0}
              showDivider={false}
              dividerColor={previewData.textColor}
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
              cta_enabled={previewData.cta_enabled}
              cta_text={previewData.cta_text}
              cta_url={previewData.cta_url}
              cta_background_color={previewData.cta_background_color}
              cta_text_color={previewData.cta_text_color}
              iconAlignment={previewData.iconAlignment}
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
            subtitle="Basic bar settings"
            icon={Squares2X2Icon}
            isOpen={openSections.includes('general')}
            onToggle={() => toggleSection('general')}
          >
            <div className="space-y-6">
              {/* Bar Name Input */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Bar Name *
                </label>
                <input
                  type="text"
                  value={formData.bar_name}
                  onChange={(e) => handleInputChange('bar_name', e.target.value)}
                  placeholder="Enter a name to identify this bar"
                  className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm text-gray-900 placeholder-gray-400 focus:border-black focus:ring-1 focus:ring-black transition-colors"
                  required
                />
                <p className="mt-1 text-sm text-gray-500">
                  This name is for your reference only and won't be shown to users
                </p>
              </div>
              {/* Allowed Domain Input */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Allowed domain
                </label>
                <input
                  type="text"
                  value={formData.allowed_domain || ''}
                  onChange={(e) => handleInputChange('allowed_domain', e.target.value)}
                  placeholder="example.com"
                  className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm text-gray-900 placeholder-gray-400 focus:border-black focus:ring-1 focus:ring-black transition-colors"
                />
                <p className="mt-1 text-sm text-gray-500">
                  The bar will only be shown on this domain. Enter without https:// or www.
                </p>
              </div>
            </div>
          </SectionCard>
          {/* Content Section */}
          <SectionCard
            id="content"
            title="Content"
            subtitle="Your announcement message and formatting"
            icon={DocumentTextIcon}
            isOpen={openSections.includes('content')}
            onToggle={() => toggleSection('content')}
          >
            <div className="space-y-6">
              {/* Title */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
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
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Message *
                </label>
                <FormattingToolbar
                  value={formData.message}
                  onChange={(value) => handleInputChange('message', value)}
                  placeholder="Enter your announcement message"
                  required
                  rows={3}
                />
              </div>

              {/* Icon */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-4">Icon</label>
                <IconSelector
                  selectedIcon={formData.icon}
                  onSelect={(icon) => handleInputChange('icon', icon)}
                />
              </div>

              {/* Icon Alignment */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Icon Alignment</label>
                <div className="flex gap-2">
                  {['left', 'right'].map((alignment) => (
                    <button
                      key={alignment}
                      type="button"
                      onClick={() => handleInputChange('iconAlignment', alignment)}
                      className={`px-4 py-2 rounded-lg border transition-colors capitalize ${
                        formData.iconAlignment === alignment
                          ? 'border-gray-900 bg-gray-900 text-white'
                          : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      {alignment}
                    </button>
                  ))}
                </div>
              </div>

              {/* CTA Settings */}
              <CTASettings
                enabled={formData.cta_enabled}
                text={formData.cta_text}
                url={formData.cta_url}
                backgroundColor={formData.cta_background_color}
                textColor={formData.cta_text_color}
                onUpdate={(field, value) => handleInputChange(field as keyof AnnouncementFormData, value)}
              />

              {/* Text Alignment */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-4">Text Alignment</label>
                <div className="flex gap-4">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      value="left"
                      checked={formData.textAlignment === 'left'}
                      onChange={(e) => handleInputChange('textAlignment', e.target.value)}
                      className="w-4 h-4 text-brand-600 border-gray-300 focus:ring-brand-500"
                    />
                    <span className="ml-2 text-sm text-gray-700">Left</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      value="center"
                      checked={formData.textAlignment === 'center'}
                      onChange={(e) => handleInputChange('textAlignment', e.target.value)}
                      className="w-4 h-4 text-brand-600 border-gray-300 focus:ring-brand-500"
                    />
                    <span className="ml-2 text-sm text-gray-700">Center</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      value="right"
                      checked={formData.textAlignment === 'right'}
                      onChange={(e) => handleInputChange('textAlignment', e.target.value)}
                      className="w-4 h-4 text-brand-600 border-gray-300 focus:ring-brand-500"
                    />
                    <span className="ml-2 text-sm text-gray-700">Right</span>
                  </label>
                </div>
              </div>

              {/* Font */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-4">Font</label>
                <FontSelector
                  selectedFont={formData.fontFamily}
                  onSelect={(font) => handleInputChange('fontFamily', font)}
                />
              </div>

              {/* Font Sizes */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Title Font Size: {formData.titleFontSize}px
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
                    Message Font Size: {formData.messageFontSize}px
                  </label>
                  <input
                    type="range"
                    min="12"
                    max="24"
                    value={formData.messageFontSize}
                    onChange={(e) => handleInputChange('messageFontSize', parseInt(e.target.value))}
                    className="w-full"
                  />
                </div>
              </div>
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
                  <div className="font-medium text-gray-900">Schedule Bar</div>
                  <div className="text-sm text-gray-500">Set when the bar goes live and expires</div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={showScheduling}
                    onChange={(e) => handleSchedulingToggle(e.target.checked)}
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
                      value={formatDateTimeLocal(formData.scheduledStart)}
                      onChange={(e) => handleDateChange('scheduledStart', e.target.value)}
                      className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm text-gray-900 placeholder-gray-400 focus:border-black focus:ring-1 focus:ring-black transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-900 mb-2">End Date & Time</label>
                    <input
                      type="datetime-local"
                      value={formatDateTimeLocal(formData.scheduledEnd)}
                      onChange={(e) => handleDateChange('scheduledEnd', e.target.value)}
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
              {/* Path Targeting */}
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
                        className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-brand-500 focus:ring-brand-500 sm:text-sm bg-white text-gray-900 pl-4"
                      />
                      <button
                        type="button"
                        onClick={() => handleInputChange('pagePaths', formData.pagePaths.filter((_, i) => i !== index))}
                        className="p-2 text-gray-400 hover:text-gray-600"
                      >
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() => handleInputChange('pagePaths', [...formData.pagePaths, ''])}
                    className="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-500"
                  >
                    Add Path
                  </button>
                </div>
              </div>

              {/* Country Targeting */}
              <div className="relative">
                <GeoSelector
                  initialCountries={formData.geoCountries}
                  onCountriesChange={(countries) => handleInputChange('geoCountries', countries)}
                />
              </div>
            </div>
          </SectionCard>

          {/* Submit Button */}
          <form onSubmit={handleSubmit}>
            <div className="flex justify-center pt-2">
              <button
                type="submit"
                disabled={loading || !formData.message.trim()}
                className="px-6 py-3 bg-[#FFFFC5] text-black font-medium rounded-lg hover:bg-yellow-200 focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                {loading ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </form>
        </div>
      </main>

      {/* Toast Container */}
      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </div>
  )
} 