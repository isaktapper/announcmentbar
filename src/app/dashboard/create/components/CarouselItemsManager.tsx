'use client'

import { TrashIcon, PlusIcon } from '@heroicons/react/24/outline'
import { AnnouncementContentItem } from '@/types/announcement'
import FormattingToolbar from './FormattingToolbar'

interface CarouselItemsManagerProps {
  items: AnnouncementContentItem[]
  onChange: (items: AnnouncementContentItem[]) => void
}

export default function CarouselItemsManager({ items, onChange }: CarouselItemsManagerProps) {
  const addItem = () => {
    const newItem: AnnouncementContentItem = {
      title: '',
      message: '',
      titleUrl: '',
      messageUrl: ''
    }
    onChange([...items, newItem])
  }

  const removeItem = (index: number) => {
    onChange(items.filter((_, i) => i !== index))
  }

  const updateItem = (index: number, field: keyof AnnouncementContentItem, value: string) => {
    const updatedItems = items.map((item, i) => 
      i === index ? { ...item, [field]: value } : item
    )
    onChange(updatedItems)
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h4 className="text-sm font-medium text-gray-900">Carousel Items</h4>
          <p className="text-xs text-gray-500">Add multiple announcements to rotate between</p>
        </div>
        <button
          type="button"
          onClick={addItem}
          className="inline-flex items-center gap-1 px-3 py-1.5 text-sm font-medium text-indigo-600 bg-indigo-50 rounded-lg hover:bg-indigo-100 transition-colors"
        >
          <PlusIcon className="w-4 h-4" />
          Add Item
        </button>
      </div>

      {items.length === 0 && (
        <div className="text-center py-8 text-gray-500 text-sm">
          <p>No carousel items yet. Add your first item to get started.</p>
        </div>
      )}

      <div className="space-y-4">
        {items.map((item, index) => (
          <div key={index} className="border border-gray-200 rounded-lg p-4 bg-gray-50">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-medium text-gray-700">Item {index + 1}</span>
              {items.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeItem(index)}
                  className="text-red-600 hover:text-red-800 transition-colors"
                >
                  <TrashIcon className="w-4 h-4" />
                </button>
              )}
            </div>

            <div className="space-y-4">
              {/* Title */}
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  Title (Optional)
                </label>
                <FormattingToolbar
                  value={item.title}
                  onChange={(value) => updateItem(index, 'title', value)}
                  placeholder="Optional title for this carousel item"
                  rows={2}
                />
              </div>

              {/* Message */}
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  Message *
                </label>
                <FormattingToolbar
                  value={item.message}
                  onChange={(value) => updateItem(index, 'message', value)}
                  placeholder="Announcement message for this item"
                  required
                  rows={3}
                />
              </div>

              {/* URLs */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-2">
                    Title Link (Optional)
                  </label>
                  <input
                    type="url"
                    value={item.titleUrl || ''}
                    onChange={(e) => updateItem(index, 'titleUrl', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm"
                    placeholder="https://example.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-2">
                    Message Link (Optional)
                  </label>
                  <input
                    type="url"
                    value={item.messageUrl || ''}
                    onChange={(e) => updateItem(index, 'messageUrl', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm"
                    placeholder="https://example.com"
                  />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
} 