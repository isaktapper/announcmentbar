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
import { AnnouncementFormData, Template, CarouselItem } from '@/types/announcement'
import IconSelector from '../../components/create/IconSelector'
import FontSelector from '../../components/create/FontSelector'
import TemplatePicker from '../../components/create/TemplatePicker'
import LivePreview from '../../components/create/LivePreview'
import ColorPicker from '@/components/ColorPicker'
import FormattingToolbar from '../../components/create/FormattingToolbar'
import SectionCard from '../../components/create/SectionCard'
import GeoSelector from '../../components/create/GeoSelector'
import CTASettings from '../../components/create/CTASettings'
import { LivePreviewProps } from '../../components/create/LivePreview'
import CarouselSlideManager from '../../components/create/CarouselSlideManager'
import { Crown } from 'lucide-react'
import { getUserPlan } from '@/lib/user-utils'

export default function CreateCarouselClient() {
  const router = useRouter()
  const { toasts, success, error, removeToast } = useToast()
  const [loading, setLoading] = useState(false)
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null)
  const [openSections, setOpenSections] = useState<string[]>(['general'])
  const [showScheduling, setShowScheduling] = useState(false)
  const [userPlan, setUserPlan] = useState<'free' | 'unlimited'>('free')
  const [planLoading, setPlanLoading] = useState(true)

  useEffect(() => {
    const fetchUserPlanAndBars = async () => {
      try {
        const supabase = createClient()
        const { data: { user } } = await supabase.auth.getUser()
        if (user) {
          const plan = await getUserPlan(user.id)
          setUserPlan(plan)
          if (plan === 'free') {
            // Fetch bars for this user
            const { data: bars } = await supabase
              .from('announcements')
              .select('id, visibility')
              .eq('user_id', user.id)
            if (bars && bars.some(bar => bar.visibility)) {
              error('You can only have 1 active bar on the Free plan. Disable one to create another or upgrade your plan.')
              router.replace('/dashboard')
              return
            }
          }
        }
      } catch (error) {
        setUserPlan('free')
      } finally {
        setPlanLoading(false)
      }
    }
    fetchUserPlanAndBars()
  }, [])

  const toggleSection = (sectionId: string) => {
    setOpenSections(prev => 
      prev.includes(sectionId) 
        ? prev.filter(id => id !== sectionId)
        : [...prev, sectionId]
    )
  }

  const initialFormData: AnnouncementFormData = {
    bar_name: '',
    title: '',
    message: '',
    icon: 'none',
    background: '#FFFFFF',
    backgroundGradient: '#FFFFFF',
    useGradient: false,
    textColor: '#000000',
    visibility: true,
    isSticky: false,
    titleFontSize: 16,
    messageFontSize: 14,
    textAlignment: 'left',
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
    barHeight: 48,
    carouselItems: [{
      title: '',
      message: '',
      background: '#FFFFFF',
      backgroundGradient: '#FFFFFF',
      useGradient: false,
      textColor: '#000000',
      fontFamily: 'Work Sans',
      titleFontSize: 16,
      messageFontSize: 14,
      textAlignment: 'left',
      icon: 'none',
      iconAlignment: 'left',
      cta_enabled: false,
      cta_text: '',
      cta_url: '',
      cta_background_color: '#000000',
      cta_text_color: '#FFFFFF'
    }],
    fontFamily: 'Work Sans',
    geoCountries: [],
    pagePaths: [],
    scheduledStart: null,
    scheduledEnd: null,
    cta_enabled: false,
    cta_text: '',
    cta_url: '',
    cta_background_color: '#000000',
    cta_text_color: '#FFFFFF',
    allowed_domain: '',
  }

  const [formData, setFormData] = useState<AnnouncementFormData>(initialFormData)
  const [previewData, setPreviewData] = useState<AnnouncementFormData>(formData)

  useEffect(() => {
    const timer = setTimeout(() => {
      setPreviewData(formData)
    }, 150)
    return () => clearTimeout(timer)
  }, [formData])

  // Add this effect to handle visibility when scheduling changes
  useEffect(() => {
    if (formData.scheduledStart || formData.scheduledEnd) {
      handleInputChange('visibility', false)
    }
  }, [formData.scheduledStart, formData.scheduledEnd])

  // Update the scheduling toggle to also handle visibility
  const handleSchedulingToggle = (enabled: boolean) => {
    setShowScheduling(enabled)
    if (!enabled) {
      // Clear scheduling when disabled
      handleInputChange('scheduledStart', null)
      handleInputChange('scheduledEnd', null)
      handleInputChange('visibility', true)
    } else {
      // Set visibility to false when scheduling is enabled
      handleInputChange('visibility', false)
    }
  }

  const handleDateChange = (field: 'scheduledStart' | 'scheduledEnd', value: string) => {
    // If value is empty, set to null, otherwise convert to ISO string
    const dateValue = value ? new Date(value).toISOString() : null
    handleInputChange(field, dateValue)
  }

  const handleInputChange = (
    field: keyof AnnouncementFormData,
    value: AnnouncementFormData[keyof AnnouncementFormData]
  ) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
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
      scheduledEnd: template.scheduledEnd,
      cta_enabled: template.cta_enabled,
      cta_text: template.cta_text,
      cta_url: template.cta_url,
      cta_background_color: template.cta_background_color,
      cta_text_color: template.cta_text_color,
      allowed_domain: template.allowed_domain || '',
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.carouselItems[0]?.message?.trim() || !formData.bar_name.trim()) return

    try {
      setLoading(true)

      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) {
        error('You must be logged in to create an announcement')
        return
      }

      const content = {
        items: formData.carouselItems.map(item => ({
          title: item.title,
          message: item.message,
          background: item.background,
          backgroundGradient: item.backgroundGradient,
          useGradient: item.useGradient,
          textColor: item.textColor,
          fontFamily: item.fontFamily,
          titleFontSize: item.titleFontSize,
          messageFontSize: item.messageFontSize,
          textAlignment: item.textAlignment,
          icon: item.icon,
          iconAlignment: item.iconAlignment,
          cta_enabled: Boolean(item.cta_enabled),
          cta_text: item.cta_text,
          cta_url: item.cta_url,
          cta_background_color: item.cta_background_color,
          cta_text_color: item.cta_text_color
        }))
      }

      const newAnnouncement = {
        bar_name: formData.bar_name,
        user_id: user.id,
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
        slug: generateSlug(),
        scheduledStart: formData.scheduledStart,
        scheduledEnd: formData.scheduledEnd,
        cta_enabled: Boolean(formData.cta_enabled),
        cta_text: formData.cta_text || '',
        cta_url: formData.cta_url || '',
        cta_background_color: formData.cta_background_color || '#000000',
        cta_text_color: formData.cta_text_color || '#FFFFFF',
        allowed_domain: formData.allowed_domain?.trim() || null,
      }

      const { error: insertError } = await supabase
        .from('announcements')
        .insert([newAnnouncement])

      if (insertError) {
        throw insertError
      }

      success('Bar created successfully!')
      router.push('/dashboard')
    } catch (err) {
      console.error('Error creating announcement:', err)
      error('Failed to create announcement')
    } finally {
      setLoading(false)
    }
  }

  const generateSlug = () => {
    return Math.random().toString(36).substring(2, 8)
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
              <h1 className="text-2xl font-bold text-gray-900">Create Bar</h1>
              <p className="text-sm text-gray-500 mt-1">
                Design a beautiful bar for your website
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
            subtitle="Basic bar settings and template"
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

              {/* Template Picker */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-4">Choose a Template</label>
                <TemplatePicker
                  selectedTemplate={selectedTemplate}
                  onSelect={handleTemplateSelect}
                  typeFilter="carousel"
                />
              </div>
            </div>
          </SectionCard>

          {/* Content & Appearance Section */}
          <SectionCard
            id="content"
            title="Content & Appearance"
            subtitle="Your announcement content and visual settings"
            icon={DocumentTextIcon}
            isOpen={openSections.includes('content')}
            onToggle={() => toggleSection('content')}
          >
            <div className="space-y-6">
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
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                />
                <p className="mt-1 text-sm text-gray-500">
                  Adjusts the height of the entire announcement bar
                </p>
              </div>

              <CarouselSlideManager
                items={formData.carouselItems}
                onChange={(items) => handleInputChange('carouselItems', items)}
                userPlan={userPlan}
                planLoading={planLoading}
              />
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
              {/* Carousel Settings */}
              <div className="space-y-4">
                <h3 className="font-medium text-gray-900">Carousel Settings</h3>
                {/* Rotation Speed */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Rotation Speed: {(formData.typeSettings.carousel_speed || 5000) / 1000}s
                  </label>
                  <input
                    type="range"
                    min="2000"
                    max="10000"
                    step="500"
                    value={formData.typeSettings.carousel_speed || 5000}
                    onChange={(e) => handleInputChange('typeSettings', {
                      ...formData.typeSettings,
                      carousel_speed: parseInt(e.target.value)
                    })}
                    className="w-full"
                  />
                  <p className="mt-1 text-sm text-gray-500">
                    Time each slide is shown before rotating to the next one
                  </p>
                </div>
                {/* Pause on Hover */}
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                  <div>
                    <div className="font-medium text-gray-900">Pause on Hover</div>
                    <div className="text-sm text-gray-500">Stop rotation when users hover over the bar</div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.typeSettings.carousel_pause_on_hover}
                      onChange={(e) => handleInputChange('typeSettings', {
                        ...formData.typeSettings,
                        carousel_pause_on_hover: e.target.checked
                      })}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-gray-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-black"></div>
                  </label>
                </div>
              </div>

              <div className="border-t border-gray-200 my-6"></div>

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
              {planLoading ? (
                <div className="h-16 bg-gray-100 rounded-xl animate-pulse w-full" />
              ) : userPlan === 'free' ? (
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-200 mb-4">
                  <div>
                    <div className="font-medium text-gray-400">Schedule Bar</div>
                    <div className="text-sm text-gray-300">Set when the bar goes live and expires</div>
                  </div>
                  <div className="flex items-center gap-1 min-w-[90px]" style={{ fontFamily: 'Work Sans, sans-serif', fontWeight: 600 }}>
                    <Crown className="w-4 h-4 align-middle text-yellow-600" />
                    <span className="text-xs font-semibold leading-none align-middle text-yellow-600">Unlimited</span>
                  </div>
                </div>
              ) : (
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
              )}
              {userPlan !== 'free' && showScheduling && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Start Date (optional)
                    </label>
                    <input
                      type="datetime-local"
                      value={formData.scheduledStart ? formData.scheduledStart.slice(0, 16) : ''}
                      onChange={(e) => handleDateChange('scheduledStart', e.target.value)}
                      className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm text-gray-900 placeholder-gray-400 focus:border-black focus:ring-1 focus:ring-black transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      End Date (optional)
                    </label>
                    <input
                      type="datetime-local"
                      value={formData.scheduledEnd ? formData.scheduledEnd.slice(0, 16) : ''}
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
              {planLoading ? (
                <div className="h-12 bg-gray-100 rounded-xl animate-pulse w-full mb-2" />
              ) : userPlan === 'free' ? (
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-200 mb-2">
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">Show on these paths</label>
                    <div className="text-sm text-gray-300">Target specific pages for your bar</div>
                  </div>
                  <div className="flex items-center gap-1 min-w-[90px]" style={{ fontFamily: 'Work Sans, sans-serif', fontWeight: 600 }}>
                    <Crown className="w-4 h-4 align-middle text-yellow-600" />
                    <span className="text-xs font-semibold leading-none align-middle text-yellow-600">Unlimited</span>
                  </div>
                </div>
              ) : (
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
              )}

              {/* Country Targeting */}
              {planLoading ? (
                <div className="h-12 bg-gray-100 rounded-xl animate-pulse w-full" />
              ) : userPlan === 'free' ? (
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-200">
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">Country Targeting</label>
                    <div className="text-sm text-gray-300">Show your bar only in specific countries</div>
                  </div>
                  <div className="flex items-center gap-1 min-w-[90px]" style={{ fontFamily: 'Work Sans, sans-serif', fontWeight: 600 }}>
                    <Crown className="w-4 h-4 align-middle text-yellow-600" />
                    <span className="text-xs font-semibold leading-none align-middle text-yellow-600">Unlimited</span>
                  </div>
                </div>
              ) : (
                <div className="relative">
                  <GeoSelector
                    initialCountries={formData.geoCountries}
                    onCountriesChange={(countries) => handleInputChange('geoCountries', countries)}
                  />
                </div>
              )}
            </div>
          </SectionCard>

          {/* Submit Button */}
          <form onSubmit={handleSubmit}>
            <div className="flex justify-center pt-2">
              <button
                type="submit"
                disabled={loading || !formData.carouselItems[0]?.message?.trim() || !formData.bar_name.trim()}
                className="px-6 py-3 bg-[#FFFFC5] text-black font-medium rounded-lg hover:bg-yellow-200 focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                {loading ? 'Creating...' : 'Create Bar'}
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