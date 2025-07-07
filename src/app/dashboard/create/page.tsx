'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeftIcon } from '@heroicons/react/24/outline'
import { createClient } from '@/lib/supabase-client'
import { useToast } from '@/hooks/useToast'
import { ToastContainer } from '@/components/Toast'
import { AnnouncementFormData, Template } from '@/types/announcement'
import IconSelector from './components/IconSelector'
import TemplatePicker from './components/TemplatePicker'
import LivePreview from './components/LivePreview'
import ColorPicker from '@/components/ColorPicker'

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
  })

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

  const handleTemplateSelect = (template: Template) => {
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
    })
  }

  const handleInputChange = (field: keyof AnnouncementFormData, value: string | boolean | number) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    if (selectedTemplate) {
      setSelectedTemplate(null) // Clear template selection when user modifies
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.title.trim() || !formData.message.trim()) {
      error('Please fill in all required fields')
      return
    }

    setLoading(true)

    try {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) {
        error('You must be logged in to create announcements')
        return
      }

      const newAnnouncement = {
        user_id: user.id,
        title: formData.title,
        message: formData.message,
        icon: formData.icon,
        background: formData.background,
        background_gradient: formData.useGradient ? formData.backgroundGradient : null,
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
        slug: generateSlug(),
      }

      const { error: insertError } = await supabase
        .from('announcements')
        .insert([newAnnouncement])

      if (insertError) {
        error(insertError.message)
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

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Create Announcement</h1>
              <p className="text-sm text-gray-500 mt-1">
                Design a beautiful announcement for your website
              </p>
            </div>
            <div className="w-32"></div> {/* Spacer for centering */}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Form Section */}
          <div className="space-y-8">
            {/* Templates */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <TemplatePicker
                selectedTemplate={selectedTemplate}
                onSelect={handleTemplateSelect}
              />
            </div>

            {/* Content Form */}
            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Content</h3>
                  </div>

                  {/* Title */}
                  <div>
                    <label htmlFor="title" className="block text-sm font-medium text-gray-900 mb-2">
                      Title *
                    </label>
                    <input
                      type="text"
                      id="title"
                      value={formData.title}
                      onChange={(e) => handleInputChange('title', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all text-gray-900 placeholder-gray-500"
                      placeholder="Enter announcement title"
                      required
                    />
                  </div>

                  {/* Message */}
                  <div>
                    <label htmlFor="message" className="block text-sm font-medium text-gray-900 mb-2">
                      Message *
                    </label>
                    <textarea
                      id="message"
                      rows={3}
                      value={formData.message}
                      onChange={(e) => handleInputChange('message', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all text-gray-900 placeholder-gray-500 resize-none"
                      placeholder="Enter your announcement message"
                      required
                    />
                  </div>

                  {/* Icon Selector */}
                  <IconSelector
                    selectedIcon={formData.icon}
                    onSelect={(icon) => handleInputChange('icon', icon)}
                  />

                  {/* Typography Controls */}
                  <div className="space-y-4">
                    <label className="block text-sm font-medium text-gray-900">
                      Text Sizes
                    </label>
                    
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
                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
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
                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                      />
                    </div>
                  </div>

                  {/* Link URLs */}
                  <div className="space-y-4">
                    <label className="block text-sm font-medium text-gray-900">
                      Clickable Links (Optional)
                    </label>
                    
                    {/* Title URL */}
                    <div>
                      <label htmlFor="titleUrl" className="block text-sm font-medium text-gray-700 mb-2">
                        Title Link URL
                      </label>
                      <input
                        type="url"
                        id="titleUrl"
                        value={formData.titleUrl || ''}
                        onChange={(e) => handleInputChange('titleUrl', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all text-gray-900 placeholder-gray-500"
                        placeholder="https://example.com (makes title clickable)"
                      />
                    </div>

                    {/* Message URL */}
                    <div>
                      <label htmlFor="messageUrl" className="block text-sm font-medium text-gray-700 mb-2">
                        Message Link URL
                      </label>
                      <input
                        type="url"
                        id="messageUrl"
                        value={formData.messageUrl || ''}
                        onChange={(e) => handleInputChange('messageUrl', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all text-gray-900 placeholder-gray-500"
                        placeholder="https://example.com (makes message clickable)"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Appearance Form */}
              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Appearance</h3>
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
                    label="Text and Icon Colour"
                  />

                  {/* Visibility Toggle */}
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                    <div>
                      <div className="font-medium text-gray-900">Visibility</div>
                      <div className="text-sm text-gray-500">
                        Whether this announcement is active
                      </div>
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

                  {/* Sticky Position Toggle */}
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                    <div>
                      <div className="font-medium text-gray-900">Sticky Position</div>
                      <div className="text-sm text-gray-500">
                        Whether the announcement bar stays at the top when scrolling
                      </div>
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

                  {/* Closable Toggle */}
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                    <div>
                      <div className="font-medium text-gray-900">Closable</div>
                      <div className="text-sm text-gray-500">
                        Allow users to dismiss the announcement with an X button
                      </div>
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

                  {/* Alignment Controls */}
                  <div className="space-y-4">
                    <label className="block text-sm font-medium text-gray-900">
                      Alignment
                    </label>
                    
                    {/* Text Alignment */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Text Alignment
                      </label>
                      <div className="grid grid-cols-3 gap-2">
                        {(['left', 'center', 'right'] as const).map((alignment) => (
                          <button
                            key={alignment}
                            type="button"
                            onClick={() => handleInputChange('textAlignment', alignment)}
                            className={`px-4 py-2 text-sm font-medium rounded-lg border transition-all ${
                              formData.textAlignment === alignment
                                ? 'bg-indigo-600 text-white border-indigo-600'
                                : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'
                            }`}
                          >
                            {alignment.charAt(0).toUpperCase() + alignment.slice(1)}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Icon Alignment */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Icon Alignment
                      </label>
                      <div className="grid grid-cols-3 gap-2">
                        {(['left', 'center', 'right'] as const).map((alignment) => (
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
              </div>

              {/* Submit Button */}
              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={loading || !formData.title.trim() || !formData.message.trim()}
                  className="px-8 py-3 bg-indigo-600 text-white font-medium rounded-xl hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                  {loading ? 'Creating...' : 'Create Announcement'}
                </button>
              </div>
            </form>
          </div>

          {/* Preview Section */}
          <div className="lg:sticky lg:top-8 h-fit">
            <LivePreview formData={formData} />
          </div>
        </div>
      </div>

      {/* Toast Container */}
      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </div>
  )
} 