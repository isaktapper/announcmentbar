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
    })
  }

  const handleInputChange = (field: keyof AnnouncementFormData, value: string | boolean) => {
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