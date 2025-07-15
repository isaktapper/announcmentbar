'use client'

import React, { useState, useEffect } from 'react'
import { 
  TrashIcon,
  ClipboardIcon,
  CheckIcon,
  ClockIcon,
  DocumentDuplicateIcon,
  PencilIcon,
} from '@heroicons/react/24/outline'
import { Clock } from 'lucide-react'
import { Switch } from '@headlessui/react'
import { createBrowserClient } from '@supabase/ssr'
import { useRouter } from 'next/navigation'
import { Announcement } from '../../types/announcement'

interface AnnouncementCardProps {
  announcement: Announcement
  onUpdate: (announcement: Announcement) => void
  onDelete: (id: string) => void
  onSuccess: (message: string) => void
  onError: (message: string) => void
  userPlan?: 'free' | 'unlimited'
  hasActiveBar?: boolean
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
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [isUpdating, setIsUpdating] = useState(false)
  const [copySuccess, setCopySuccess] = useState(false)
  const [isClient, setIsClient] = useState(false)
  const [isToggleHovered, setIsToggleHovered] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])
  
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
      onUpdate(announcement)
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
      onDelete(announcement.id)
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

  const handleCopyEmbedScript = async () => {
    const embedScript = `<script src="${window.location.origin}/embed/${announcement.slug}.js" defer></script>`;
    try {
      await navigator.clipboard.writeText(embedScript);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    } catch (error) {
      console.error('Failed to copy embed script:', error);
    }
  }

  const handleEdit = () => {
    const editPath = announcement.type === 'single' 
      ? `/dashboard/edit/single/${announcement.id}`
      : `/dashboard/edit/carousel/${announcement.id}`
    router.push(editPath)
  }

  return (
    <>
      <div className="group bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all duration-200 p-4">
        <div className="flex flex-col h-full max-h-[150px]">
          {/* Title */}
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-base font-medium text-gray-900">
              {announcement.bar_name}
            </h3>
            <div className="flex items-center gap-2">
              <span className={`text-xs ${announcement.visibility ? 'text-green-600' : 'text-gray-400'}`}>
                {announcement.visibility ? 'Active' : 'Inactive'}
                  </span>
                <div
                  className="relative flex items-center"
                  onMouseEnter={() => setIsToggleHovered(true)}
                  onMouseLeave={() => setIsToggleHovered(false)}
                >
                  <Switch
                    checked={announcement.visibility}
                    onChange={handleToggleVisibility}
                    disabled={
                      isUpdating ||
                      (userPlan === 'free' && hasActiveBar && !announcement.visibility)
                    }
                    className={`${
                      announcement.visibility ? 'bg-green-500' : 'bg-gray-200'
                    } relative inline-flex h-5 w-9 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50 ${
                      userPlan === 'free' && hasActiveBar && !announcement.visibility
                        ? 'cursor-not-allowed'
                        : ''
                    }`}
                  >
                    <span
                      className={`${
                        announcement.visibility ? 'translate-x-5' : 'translate-x-1'
                      } inline-block h-3 w-3 transform rounded-full bg-white transition-transform`}
                    />
                  </Switch>
                  {/* Custom Tooltip */}
                  {userPlan === 'free' && hasActiveBar && !announcement.visibility && isToggleHovered && (
                    <div className="absolute -top-10 left-1/2 -translate-x-1/2 z-50 px-3 py-2 bg-yellow-100 text-yellow-900 text-xs rounded shadow-lg whitespace-nowrap font-semibold border border-yellow-300">
                      You can only have 1 active bar on the Free plan. Upgrade to Unlimited for unlimited bars.
                    </div>
                  )}
                </div>
              </div>
          </div>

          {/* Bottom Section with Type, Slug and Actions */}
          <div className="flex items-center justify-between mt-auto pt-2 border-t border-gray-100">
            {/* Type and Slug */}
            <div className="flex items-center gap-2">
              {/* Bar Type */}
              <span className="text-xs font-medium px-2 py-1 bg-gray-100 text-gray-700 rounded-full capitalize">
                {announcement.type}
              </span>

              {/* Slug with Copy Button */}
              <code className={`text-xs px-2 py-1 rounded flex items-center gap-1 ${copySuccess ? 'bg-green-100 text-green-800' : 'bg-gray-50 text-gray-500'}`}
                title={copySuccess ? 'Copied!' : 'Copy embed script'}
              >
                {copySuccess ? 'Copied!' : announcement.slug}
                <button
                  onClick={handleCopyEmbedScript}
                  className={`text-gray-400 hover:text-gray-600 ${copySuccess ? 'text-green-500' : ''}`}
                  title={copySuccess ? 'Copied!' : 'Copy embed script'}
                >
                  {copySuccess ? <CheckIcon className="w-3 h-3" /> : <DocumentDuplicateIcon className="w-3 h-3" />}
                </button>
              </code>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2">
              {/* Scheduling Status */}
              {(announcement.scheduledStart || announcement.scheduledEnd) && (
                <div className="relative group">
                  <div className="p-1.5 text-blue-600 bg-blue-50 rounded-md">
                    <ClockIcon className="w-4 h-4" />
                  </div>
                  <div className="absolute bottom-full right-0 mb-2 w-64 p-3 bg-gray-900 text-white text-sm rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-10">
                    <div className="font-medium mb-1">Scheduled Bar</div>
                    {announcement.scheduledStart && (
                      <div className="text-gray-300 text-xs">
                        Starts: {isClient ? new Date(announcement.scheduledStart).toLocaleString() : announcement.scheduledStart}
                      </div>
                    )}
                    {announcement.scheduledEnd && (
                      <div className="text-gray-300 text-xs">
                        Ends: {isClient ? new Date(announcement.scheduledEnd).toLocaleString() : announcement.scheduledEnd}
                      </div>
                    )}
                    <div className="mt-2 text-xs text-gray-400">
                      Bar will automatically activate at the scheduled time
                    </div>
                  </div>
                </div>
              )}
              
              <button
                onClick={handleEdit}
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
        <div className="fixed inset-0 bg-[rgba(30,41,59,0.32)] flex items-center justify-center z-50 p-4">
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