'use client'

import { useState } from 'react'
import { 
  EyeIcon, 
  EyeSlashIcon, 
  ClipboardIcon, 
  TrashIcon,
  PencilIcon,
  CheckIcon,
  XMarkIcon
} from '@heroicons/react/24/outline'
import { 
  AlertTriangle, 
  AlertCircle, 
  Info, 
  CheckCircle, 
  Clock,
  ShoppingCart,
  Lightbulb,
  Sparkles,
  BellRing,
  MessageCircle,
  Megaphone,
  Flame,
  Package,
  FlaskConical
} from 'lucide-react'
import { createClient } from '@/lib/supabase-client'
import { Announcement, ICONS } from '@/types/announcement'

interface AnnouncementCardProps {
  announcement: Announcement
  onUpdate: (announcement: Announcement) => void
  onDelete: (id: string) => void
  onSuccess: (message: string) => void
  onError: (message: string) => void
  userPlan?: 'free' | 'unlimited'
  hasActiveBar?: boolean
}

const iconComponents = {
  AlertTriangle,
  AlertCircle,
  Info,
  CheckCircle,
  Clock,
  ShoppingCart,
  Lightbulb,
  Sparkles,
  BellRing,
  MessageCircle,
  Megaphone,
  Flame,
  Package,
  FlaskConical,
}

export default function AnnouncementCard({ 
  announcement, 
  onUpdate, 
  onDelete, 
  onSuccess, 
  onError,
  userPlan = 'free',
  hasActiveBar = false
}: AnnouncementCardProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [editData, setEditData] = useState({
    title: (() => {
      const div = document.createElement('div')
      div.innerHTML = (announcement.content && announcement.content.title) || ''
      return div.textContent || div.innerText || ''
    })(),
    message: (() => {
      const div = document.createElement('div')
      div.innerHTML = (announcement.content && announcement.content.message) || ''
      return div.textContent || div.innerText || ''
    })(),
    background: announcement.background,
    background_gradient: announcement.background_gradient,
    text_color: announcement.text_color,
  })
  const [loading, setLoading] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)

  const handleEdit = () => {
    setIsEditing(true)
    setEditData({
      title: (announcement.content && announcement.content.title) || '',
      message: (announcement.content && announcement.content.message) || '',
      background: announcement.background,
      background_gradient: announcement.background_gradient,
      text_color: announcement.text_color,
    })
  }

  const handleCancelEdit = () => {
    setIsEditing(false)
    setEditData({
      title: (announcement.content && announcement.content.title) || '',
      message: (announcement.content && announcement.content.message) || '',
      background: announcement.background,
      background_gradient: announcement.background_gradient,
      text_color: announcement.text_color,
    })
  }

  const handleSave = async () => {
    setLoading(true)
    try {
      const supabase = createClient()
      
      const { data, error } = await supabase
        .from('announcements')
        .update({
          content: {
            title: editData.title,
            message: editData.message,
            titleUrl: announcement.content?.titleUrl || '',
            messageUrl: announcement.content?.messageUrl || ''
          },
          background: editData.background,
          text_color: editData.text_color,
        })
        .eq('id', announcement.id)
        .select()
        .single()

      if (error) {
        onError(error.message)
        return
      }

      onUpdate(data)
      setIsEditing(false)
      onSuccess('Bar updated successfully')
    } catch {
      onError('Failed to update bar')
    } finally {
      setLoading(false)
    }
  }

  const handleToggleVisibility = async () => {
    setLoading(true)
    try {
      const supabase = createClient()
      
      const { data, error } = await supabase
        .from('announcements')
        .update({ visibility: !announcement.visibility })
        .eq('id', announcement.id)
        .select()
        .single()

      if (error) {
        onError(error.message)
        return
      }

      onUpdate(data)
              onSuccess(`Bar ${data.visibility ? 'enabled' : 'disabled'}`)
    } catch {
      onError('Failed to toggle visibility')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    setLoading(true)
    try {
      const supabase = createClient()
      
      const { error } = await supabase
        .from('announcements')
        .delete()
        .eq('id', announcement.id)

      if (error) {
        onError(error.message)
        return
      }

      onDelete(announcement.id)
              onSuccess('Bar deleted successfully')
    } catch {
              onError('Failed to delete bar')
    } finally {
      setLoading(false)
      setShowDeleteConfirm(false)
    }
  }

  const handleCopyEmbed = async () => {
    const embedCode = `<script src="${window.location.origin}/embed/${announcement.slug}.js" defer></script>`
    
    try {
      await navigator.clipboard.writeText(embedCode)
      onSuccess('Embed code copied to clipboard!')
    } catch {
      // Fallback for browsers that don't support clipboard API
      const textArea = document.createElement('textarea')
      textArea.value = embedCode
      document.body.appendChild(textArea)
      textArea.select()
      document.execCommand('copy')
      document.body.removeChild(textArea)
      onSuccess('Embed code copied to clipboard!')
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setEditData(prev => ({ ...prev, [name]: value }))
  }

  const getBackgroundStyle = () => {
    const background = isEditing ? editData.background : announcement.background
    const gradient = isEditing ? editData.background_gradient : announcement.background_gradient
    
    if (gradient) {
      return `linear-gradient(135deg, ${background}, ${gradient})`
    }
    return background
  }

  const IconComponent = announcement.icon && ICONS[announcement.icon as keyof typeof ICONS] 
    ? iconComponents[ICONS[announcement.icon as keyof typeof ICONS] as keyof typeof iconComponents]
    : null

  return (
    <div className="bg-white shadow rounded-lg overflow-hidden">
      {/* Preview */}
      <div
        className="p-4 relative"
        style={{
          background: getBackgroundStyle(),
          color: isEditing ? editData.text_color : announcement.text_color,
          minHeight: '40px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: announcement.text_alignment === 'left' ? 'flex-start' : 
                         announcement.text_alignment === 'right' ? 'flex-end' : 'center',
          paddingRight: announcement.is_closable ? '48px' : '16px',
        }}
      >
        {isEditing ? (
          <div className="space-y-2">
            <input
              type="text"
              name="title"
              value={editData.title}
              onChange={handleInputChange}
              className="w-full bg-transparent border border-current rounded px-2 py-1 font-semibold text-center placeholder-current placeholder-opacity-70"
              placeholder="Title"
            />
            <textarea
              name="message"
              value={editData.message}
              onChange={handleInputChange}
              rows={2}
              className="w-full bg-transparent border border-current rounded px-2 py-1 text-sm text-center resize-none placeholder-current placeholder-opacity-70"
              placeholder="Message"
            />
          </div>
        ) : (
          <div className="flex items-center gap-3 w-full">
            {/* Icon - Left alignment */}
            {IconComponent && announcement.icon_alignment === 'left' && (
              <div 
                className="flex-shrink-0"
                style={{ 
                  order: '0',
                  width: `${Math.max(announcement.title_font_size || 16, announcement.message_font_size || 14) + 2}px`,
                  height: `${Math.max(announcement.title_font_size || 16, announcement.message_font_size || 14) + 2}px`
                }}
              >
                <IconComponent style={{ width: '100%', height: '100%' }} />
              </div>
            )}
            
            {/* Content */}
            <div 
              className="flex-1 min-w-0"
              style={{ 
                textAlign: announcement.text_alignment || 'center',
                order: '1'
              }}
            >
              <div 
                className="font-semibold"
                style={{ 
                  fontSize: `${announcement.title_font_size || 16}px`,
                  lineHeight: 1.3,
                  marginBottom: '2px'
                }}
              >
                {announcement.content?.titleUrl ? (
                  <a 
                    href={announcement.content.titleUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    style={{ 
                      color: 'inherit', 
                      textDecoration: 'underline',
                      textDecorationColor: 'rgba(255,255,255,0.5)'
                    }}
                  >
                    {(() => {
                      const div = document.createElement('div')
                      div.innerHTML = announcement.content.title
                      return div.textContent || div.innerText || ''
                    })()}
                  </a>
                ) : (
                  (() => {
                    const div = document.createElement('div')
                    div.innerHTML = announcement.content?.title || ''
                    return div.textContent || div.innerText || ''
                  })()
                )}
              </div>
              <div 
                className="opacity-90"
                style={{ 
                  fontSize: `${announcement.message_font_size || 14}px`,
                  lineHeight: 1.4
                }}
              >
                {announcement.content?.messageUrl ? (
                  <a 
                    href={announcement.content.messageUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    style={{ 
                      color: 'inherit', 
                      textDecoration: 'underline',
                      textDecorationColor: 'rgba(255,255,255,0.5)'
                    }}
                  >
                    {(() => {
                      const div = document.createElement('div')
                      div.innerHTML = announcement.content.message
                      return div.textContent || div.innerText || ''
                    })()}
                  </a>
                ) : (
                  (() => {
                    const div = document.createElement('div')
                    div.innerHTML = announcement.content?.message || ''
                    return div.textContent || div.innerText || ''
                  })()
                )}
              </div>
            </div>

            {/* Icon - Right alignment */}
            {IconComponent && announcement.icon_alignment === 'right' && (
              <div 
                className="flex-shrink-0"
                style={{ 
                  order: '2',
                  width: `${Math.max(announcement.title_font_size || 16, announcement.message_font_size || 14) + 2}px`,
                  height: `${Math.max(announcement.title_font_size || 16, announcement.message_font_size || 14) + 2}px`
                }}
              >
                <IconComponent style={{ width: '100%', height: '100%' }} />
              </div>
            )}

            {/* Close button */}
            {announcement.is_closable && (
              <div
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-lg opacity-70 text-current"
                title="Close announcement"
              >
                ×
              </div>
            )}
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        {isEditing && (
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Background
              </label>
              <input
                type="color"
                name="background"
                value={editData.background}
                onChange={handleInputChange}
                className="w-full h-8 rounded border-gray-300"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Text Color
              </label>
              <input
                type="color"
                name="text_color"
                value={editData.text_color}
                onChange={handleInputChange}
                className="w-full h-8 rounded border-gray-300"
              />
            </div>
          </div>
        )}

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-sm font-medium text-gray-700">Slug:</span>
              <span className="ml-2 text-sm text-gray-900 font-mono bg-gray-100 px-2 py-1 rounded">
                {announcement.slug}
              </span>
            </div>
            <div className="flex items-center space-x-1">
              {announcement.visibility ? (
                <EyeIcon className="h-4 w-4 text-green-500" />
              ) : (
                <EyeSlashIcon className="h-4 w-4 text-gray-400" />
              )}
              <span className="text-sm text-gray-600">
                {announcement.visibility ? 'Visible' : 'Hidden'}
              </span>
            </div>
          </div>

          <div className="text-xs text-gray-500">
            Created: {new Date(announcement.created_at).toLocaleDateString()}
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-2 pt-2">
            {isEditing ? (
              <>
                <button
                  onClick={handleSave}
                  disabled={loading || !editData.title || !editData.message}
                  className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50"
                >
                  <CheckIcon className="h-3 w-3 mr-1" />
                  {loading ? 'Saving...' : 'Save'}
                </button>
                <button
                  onClick={handleCancelEdit}
                  disabled={loading}
                  className="inline-flex items-center px-3 py-1.5 border border-gray-300 text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-500"
                >
                  <XMarkIcon className="h-3 w-3 mr-1" />
                  Cancel
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={handleEdit}
                  className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded text-white bg-brand-600 hover:bg-brand-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-500"
                >
                  <PencilIcon className="h-3 w-3 mr-1" />
                  Edit
                </button>
                
                <button
                  onClick={handleToggleVisibility}
                  disabled={
                    loading ||
                    (userPlan === 'free' && hasActiveBar && !announcement.visibility)
                  }
                  title={
                    userPlan === 'free' && hasActiveBar && !announcement.visibility
                      ? 'You can only have 1 active bar on the Free plan. Disable another bar to activate this one.'
                      : undefined
                  }
                  className={`inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded text-white focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                    announcement.visibility
                      ? 'bg-yellow-600 hover:bg-yellow-700 focus:ring-yellow-500'
                      : 'bg-green-600 hover:bg-green-700 focus:ring-green-500'
                  } ${
                    userPlan === 'free' && hasActiveBar && !announcement.visibility
                      ? 'opacity-50 cursor-not-allowed'
                      : ''
                  }`}
                >
                  {announcement.visibility ? (
                    <EyeSlashIcon className="h-3 w-3 mr-1" />
                  ) : (
                    <EyeIcon className="h-3 w-3 mr-1" />
                  )}
                  {loading ? 'Loading...' : (announcement.visibility ? 'Hide' : 'Show')}
                </button>

                <button
                  onClick={handleCopyEmbed}
                  className="inline-flex items-center px-3 py-1.5 border border-gray-300 text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-500"
                >
                  <ClipboardIcon className="h-3 w-3 mr-1" />
                  Copy Embed
                </button>

                {showDeleteConfirm ? (
                  <div className="flex items-center space-x-2">
                    <span className="text-xs text-red-600">Are you sure?</span>
                    <button
                      onClick={handleDelete}
                      disabled={loading}
                      className="inline-flex items-center px-2 py-1 border border-transparent text-xs font-medium rounded text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                    >
                      {loading ? 'Deleting...' : 'Yes'}
                    </button>
                    <button
                      onClick={() => setShowDeleteConfirm(false)}
                      className="inline-flex items-center px-2 py-1 border border-gray-300 text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-500"
                    >
                      No
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => setShowDeleteConfirm(true)}
                    className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                  >
                    <TrashIcon className="h-3 w-3 mr-1" />
                    Delete
                  </button>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
} 