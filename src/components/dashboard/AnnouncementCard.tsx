'use client'

import React, { useState } from 'react'
import { 
  TrashIcon,
  ClipboardIcon,
  CheckIcon,
} from '@heroicons/react/24/outline'
import { Clock } from 'lucide-react'
import { Switch } from '@headlessui/react'
import { createBrowserClient } from '@supabase/ssr'
import { useRouter } from 'next/navigation'
import { Announcement } from '../../types/announcement'

interface AnnouncementCardProps {
  announcement: Announcement
  onUpdate: () => void
}

export default function AnnouncementCard({ announcement, onUpdate }: AnnouncementCardProps) {
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [isUpdating, setIsUpdating] = useState(false)
  const [copySuccess, setCopySuccess] = useState(false)
  
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
  const router = useRouter()

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
    const embedScript = `<script src="${window.location.origin}/embed/${announcement.slug}.js" defer></script>`
    try {
      await navigator.clipboard.writeText(embedScript)
      setCopySuccess(true)
      setTimeout(() => setCopySuccess(false), 2000)
    } catch (error) {
      console.error('Failed to copy:', error)
    }
  }

  const truncateText = (text: string, maxLength: number) => {
    // First strip HTML tags
    const div = document.createElement('div')
    div.innerHTML = text
    const plainText = div.textContent || div.innerText || ''
    
    // Then truncate
    if (plainText.length <= maxLength) return plainText
    return plainText.substring(0, maxLength) + '...'
  }

  return (
    <>
      <div className="group bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all duration-200 p-4">
        <div className="flex flex-col h-full max-h-[150px]">
          {/* Header with Title and Status */}
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-medium text-gray-900 truncate pr-4">
              {(() => {
                const div = document.createElement('div')
                div.innerHTML = (announcement.content && announcement.content.title) || 'Untitled Bar'
                return div.textContent || div.innerText || 'Untitled Bar'
              })()}
            </h3>
            <div className="flex items-center gap-2">
              <span className={`text-xs ${announcement.visibility ? 'text-green-600' : 'text-gray-400'}`}>
                {announcement.visibility ? 'Active' : 'Inactive'}
                  </span>
              <Switch
                checked={announcement.visibility}
                onChange={handleToggleVisibility}
                disabled={isUpdating}
                className={`${
                  announcement.visibility ? 'bg-green-500' : 'bg-gray-200'
                } relative inline-flex h-5 w-9 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50`}
              >
                <span
                  className={`${
                    announcement.visibility ? 'translate-x-5' : 'translate-x-1'
                  } inline-block h-3 w-3 transform rounded-full bg-white transition-transform`}
                />
              </Switch>
            </div>
          </div>

          {/* Message Preview */}
          <p className="text-sm text-gray-600 mb-3 line-clamp-2">
            {truncateText((announcement.content && announcement.content.message) || '', 120)}
          </p>

          {/* Bottom Section with Slug and Actions */}
          <div className="flex items-center justify-between mt-auto pt-2 border-t border-gray-100">
            {/* Slug with Copy Button */}
            <div className="flex items-center gap-2">
              <code className="text-xs text-gray-500 bg-gray-50 px-2 py-1 rounded">
                {announcement.slug}
              </code>
              {announcement.scheduledStart && (
                <div className="group relative">
                  <div className="flex items-center gap-1 text-xs text-gray-500">
                    <Clock className="w-3.5 h-3.5" />
                    <span>Scheduled</span>
                  </div>
                  <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-900 text-white text-xs rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 whitespace-nowrap">
                    {`Active from ${new Date(announcement.scheduledStart).toLocaleString()} to ${announcement.scheduledEnd ? new Date(announcement.scheduledEnd).toLocaleString() : 'indefinitely'}`}
                  </div>
                </div>
              )}
              <button
                onClick={copyEmbedScript}
                className="text-gray-400 hover:text-gray-600 transition-colors"
                title={copySuccess ? 'Copied!' : 'Copy embed code'}
              >
                {copySuccess ? (
                  <CheckIcon className="w-4 h-4 text-green-500" />
                ) : (
                  <ClipboardIcon className="w-4 h-4" />
                )}
              </button>
            </div>
            
            {/* Action Buttons */}
            <div className="flex items-center gap-2">
            <button
                onClick={() => router.push(`/dashboard/edit/${announcement.id}`)}
                className="px-3 py-1 text-sm font-medium text-gray-700 hover:text-gray-900 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
            >
                Edit
            </button>
              <button
                onClick={() => setShowDeleteModal(true)}
                className="p-1 text-gray-400 hover:text-red-500 transition-colors"
                title="Delete"
              >
                <TrashIcon className="w-4 h-4" />
                  </button>
            </div>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-6 max-w-md w-full">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Delete Bar</h3>
            <p className="text-gray-600 mb-4">
              Are you sure you want to delete &quot;{(() => {
                const div = document.createElement('div')
                div.innerHTML = (announcement.content && announcement.content.title) || 'Untitled Bar'
                return div.textContent || div.innerText || 'Untitled Bar'
              })()}&quot;? This will permanently remove the bar and any embedded instances will stop working.
            </p>
            <div className="flex gap-3">
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