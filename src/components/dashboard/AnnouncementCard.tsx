'use client'

import React, { useState } from 'react'
import { 
  Edit3, 
  Eye, 
  EyeOff, 
  Trash2, 
  Copy, 
  ExternalLink,
  AlertTriangle,
  AlertCircle,
  Info,
  CheckCircle,
  Clock,
  ChevronDown,
  ChevronUp
} from 'lucide-react'
import { ScribbleStar, ScribbleCircle, ScribbleWave } from '../scribbles/ScribbleElements'
import { Announcement } from '../../types/announcement'
import { createBrowserClient } from '@supabase/ssr'
import { useRouter } from 'next/navigation'

interface AnnouncementCardProps {
  announcement: Announcement
  onUpdate: () => void
}

const iconMap = {
  none: null,
  warning: AlertTriangle,
  alert: AlertCircle,
  info: Info,
  success: CheckCircle,
  schedule: Clock,
}

export default function AnnouncementCard({ announcement, onUpdate }: AnnouncementCardProps) {
  const [showPreview, setShowPreview] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [isUpdating, setIsUpdating] = useState(false)
  const [copySuccess, setCopySuccess] = useState(false)
  
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
  const router = useRouter()
  
  const IconComponent = iconMap[announcement.icon as keyof typeof iconMap]

  const handleToggleVisibility = async () => {
    setIsUpdating(true)
    try {
      const { error } = await supabase
        .from('announcements')
        .update({ visibility: !announcement.visibility })
        .eq('id', announcement.id)
      
      if (error) throw error
      onUpdate()
    } catch (error) {
      console.error('Error updating visibility:', error)
    } finally {
      setIsUpdating(false)
    }
  }

  const handleDelete = async () => {
    setIsUpdating(true)
    try {
      const { error } = await supabase
        .from('announcements')
        .delete()
        .eq('id', announcement.id)
      
      if (error) throw error
      onUpdate()
      setShowDeleteModal(false)
    } catch (error) {
      console.error('Error deleting announcement:', error)
    } finally {
      setIsUpdating(false)
    }
  }

  const copyEmbedScript = async () => {
    const embedScript = `<script src="${window.location.origin}/embed/${announcement.slug}.js"></script>`
    try {
      await navigator.clipboard.writeText(embedScript)
      setCopySuccess(true)
      setTimeout(() => setCopySuccess(false), 2000)
    } catch (error) {
      console.error('Failed to copy:', error)
    }
  }

  const truncateText = (text: string, maxLength: number) => {
    if (text.length <= maxLength) return text
    return text.substring(0, maxLength) + '...'
  }

  const getBackgroundStyle = () => {
    if (announcement.background_gradient) {
      return { background: announcement.background_gradient }
    }
    return { backgroundColor: announcement.background }
  }

  return (
    <>
      <div className="group relative bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden">
        {/* Decorative scribbles */}
        <ScribbleStar className="top-2 right-2 w-4 h-4 text-purple-300 group-hover:text-purple-400 transition-colors" />
        <ScribbleCircle className="bottom-2 left-2 w-6 h-6 text-blue-200 group-hover:text-blue-300 transition-colors" />
        
        <div className="p-6">
          {/* Header */}
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className="relative">
                <div 
                  className="w-10 h-10 rounded-lg flex items-center justify-center text-white"
                  style={getBackgroundStyle()}
                >
                  {IconComponent && <IconComponent className="w-5 h-5" />}
                </div>
                <ScribbleWave className="bottom-0 left-0 w-8 h-2 text-gray-300" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 text-lg">{announcement.title}</h3>
                <div className="flex items-center space-x-2 mt-1">
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                    announcement.visibility 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                                      {announcement.visibility ? (
                    <><Eye className="w-3 h-3 mr-1" /> Active</>
                  ) : (
                    <><EyeOff className="w-3 h-3 mr-1" /> Inactive</>
                  )}
                  </span>
                  <span className="text-xs text-gray-500">
                    {new Date(announcement.created_at).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric'
                    })}
                  </span>
                </div>
              </div>
            </div>
            
            {/* Action buttons */}
            <div className="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <button
                onClick={() => router.push(`/dashboard/edit/${announcement.id}`)}
                className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                title="Edit"
              >
                <Edit3 className="w-4 h-4" />
              </button>
              <button
                onClick={handleToggleVisibility}
                disabled={isUpdating}
                className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors disabled:opacity-50"
                title={`Make ${announcement.visibility ? 'private' : 'public'}`}
              >
                {announcement.visibility ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
              <button
                onClick={() => setShowDeleteModal(true)}
                className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                title="Delete"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Message */}
          <p className="text-gray-600 mb-4 leading-relaxed">
            {truncateText(announcement.message, 120)}
          </p>

          {/* Slug and copy */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-500">Slug:</span>
              <code className="px-2 py-1 bg-gray-100 rounded text-sm font-mono text-gray-700">
                {announcement.slug}
              </code>
              <button
                onClick={copyEmbedScript}
                className={`p-1 rounded transition-colors ${
                  copySuccess 
                    ? 'text-green-600 bg-green-50' 
                    : 'text-gray-400 hover:text-gray-600 hover:bg-gray-50'
                }`}
                title="Copy embed script"
              >
                <Copy className="w-4 h-4" />
              </button>
              {copySuccess && (
                <span className="text-xs text-green-600 font-medium">Copied!</span>
              )}
            </div>
            
            <button
              onClick={() => setShowPreview(!showPreview)}
              className="flex items-center space-x-1 text-sm text-gray-500 hover:text-gray-700 transition-colors"
            >
              <span>Preview</span>
              {showPreview ? (
                <ChevronUp className="w-4 h-4" />
              ) : (
                <ChevronDown className="w-4 h-4" />
              )}
            </button>
          </div>
        </div>

        {/* Preview */}
        {showPreview && (
          <div className="border-t border-gray-200 p-6 bg-gray-50">
            <div className="relative">
              <div 
                className="flex items-center p-4 rounded-lg text-white"
                style={getBackgroundStyle()}
              >
                {IconComponent && <IconComponent className="w-5 h-5 mr-3 flex-shrink-0" />}
                <div>
                  <div className="font-semibold">{announcement.title}</div>
                  <div className="text-sm opacity-90">{announcement.message}</div>
                </div>
              </div>
              <div className="mt-2 text-xs text-gray-500 text-center">
                Live preview of your announcement banner
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Delete confirmation modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-6 max-w-md w-full">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                <Trash2 className="w-5 h-5 text-red-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Delete Announcement</h3>
                <p className="text-sm text-gray-500">This action cannot be undone</p>
              </div>
            </div>
            
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete "{announcement.title}"? This will permanently remove the announcement and any embedded instances will stop working.
            </p>
            
            <div className="flex space-x-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={isUpdating}
                className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors disabled:opacity-50"
              >
                {isUpdating ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
} 