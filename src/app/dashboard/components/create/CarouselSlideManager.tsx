import { useState, useEffect, useRef } from 'react'
import { CarouselItem } from '@/types/announcement'
import FormattingToolbar from './FormattingToolbar'
import ColorPicker from '@/components/ColorPicker'
import CTASettings from './CTASettings'
import FontSelector from './FontSelector'
import IconSelector from './IconSelector'
import { XMarkIcon } from '@heroicons/react/24/outline'

interface CarouselSlideManagerProps {
  items: CarouselItem[]
  onChange: (items: CarouselItem[]) => void
}

export default function CarouselSlideManager({ items, onChange }: CarouselSlideManagerProps) {
  const [activeSlideIndex, setActiveSlideIndex] = useState(0)

  // Keep a ref to the latest items array to avoid stale closures when
  // multiple rapid updates occur (e.g. formatting title right after typing
  // a message). Without this, the second update could be based on an
  // outdated items snapshot, unintentionally dropping the previous change.
  const itemsRef = useRef<CarouselItem[]>(items)

  // Sync the ref with the newest prop value every render
  useEffect(() => {
    itemsRef.current = items
  }, [items])

  // Keep activeSlideIndex within bounds when items array changes
  useEffect(() => {
    if (activeSlideIndex >= items.length) {
      setActiveSlideIndex(Math.max(0, items.length - 1))
    }
  }, [items.length])

  // Helper function to ensure all items have required fields
  const normalizeCarouselItem = (item: CarouselItem): CarouselItem => ({
    ...item,
    titleFontSize: item.titleFontSize ?? 16,
    messageFontSize: item.messageFontSize ?? 14,
    textAlignment: item.textAlignment ?? 'left',
    icon: item.icon ?? 'none',
    iconAlignment: item.iconAlignment ?? 'left',
    fontFamily: item.fontFamily || 'Work Sans'
  })

  // Normalize items when they change
  const normalizedItems = items.map(normalizeCarouselItem)

  const handleSlideChange = (field: keyof CarouselItem, value: any) => {
    const currentItems = itemsRef.current
    const updatedItems = [...currentItems]
    updatedItems[activeSlideIndex] = {
      ...normalizeCarouselItem(updatedItems[activeSlideIndex]),
      [field]: value,
    }
    onChange(updatedItems)
  }

  const handleAddSlide = () => {
    const newSlide: CarouselItem = {
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
      cta_text_color: '#FFFFFF',
    }

    const updatedItems = [...itemsRef.current, newSlide]
    onChange(updatedItems)
    setActiveSlideIndex(updatedItems.length - 1) // focus the newly added slide
  }

  const handleRemoveSlide = (index: number) => {
    const updatedItems = itemsRef.current.filter((_, i) => i !== index)
    onChange(updatedItems)

    // Adjust the active index if necessary
    if (index <= activeSlideIndex) {
      setActiveSlideIndex(Math.max(0, activeSlideIndex - 1))
    }
  }

  return (
    <div className="space-y-6">
      {/* Slide Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2">
        {normalizedItems.map((_, index) => (
          <div key={index} className="flex items-center">
            <div
              role="button"
              onClick={() => setActiveSlideIndex(index)}
              className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-all cursor-pointer ${
                activeSlideIndex === index
                  ? 'bg-gray-900 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <span>Slide {index + 1}</span>
              {normalizedItems.length > 1 && (
                <div
                  role="button"
                  onClick={(e) => {
                    e.stopPropagation()
                    handleRemoveSlide(index)
                  }}
                  className="p-1 rounded-full hover:bg-gray-700/20 cursor-pointer"
                >
                  <XMarkIcon className="w-4 h-4" />
                </div>
              )}
            </div>
          </div>
        ))}
        <button
          type="button"
          onClick={handleAddSlide}
          className="px-4 py-2 rounded-lg border-2 border-dashed border-gray-300 text-gray-600 hover:border-gray-400 hover:text-gray-900 transition-colors"
        >
          + Add Slide
        </button>
      </div>

      {/* Active Slide Content */}
      <div className="border-2 border-gray-200 rounded-lg bg-white">
        <div className="p-6 space-y-6">
          {/* Title & Message */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Title (Optional)
              </label>
              <FormattingToolbar
                key={`title-${activeSlideIndex}`}
                value={normalizedItems[activeSlideIndex].title}
                onChange={(value) => handleSlideChange('title', value)}
                placeholder="Optional title for this slide"
                rows={2}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Message *
              </label>
              <FormattingToolbar
                key={`message-${activeSlideIndex}`}
                value={normalizedItems[activeSlideIndex].message}
                onChange={(value) => handleSlideChange('message', value)}
                placeholder="Enter message for this slide..."
                required
                rows={3}
              />
            </div>
          </div>

          {/* Typography Settings */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-4">Typography</label>
            <div className="grid grid-cols-2 gap-4">
              {/* Title Font Size */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Title Size: {normalizedItems[activeSlideIndex].titleFontSize}px
                </label>
                <input
                  type="range"
                  min="12"
                  max="32"
                  value={normalizedItems[activeSlideIndex].titleFontSize}
                  onChange={(e) => handleSlideChange('titleFontSize', parseInt(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                />
              </div>

              {/* Message Font Size */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Message Size: {normalizedItems[activeSlideIndex].messageFontSize}px
                </label>
                <input
                  type="range"
                  min="10"
                  max="24"
                  value={normalizedItems[activeSlideIndex].messageFontSize}
                  onChange={(e) => handleSlideChange('messageFontSize', parseInt(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                />
              </div>
            </div>

            {/* Text Alignment */}
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Text Alignment</label>
              <div className="flex gap-2">
                {['left', 'center', 'right'].map((alignment) => (
                  <button
                    key={alignment}
                    type="button"
                    onClick={() => handleSlideChange('textAlignment', alignment)}
                    className={`px-4 py-2 rounded-lg border transition-colors capitalize ${
                      normalizedItems[activeSlideIndex].textAlignment === alignment
                        ? 'border-gray-900 bg-gray-900 text-white'
                        : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    {alignment}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Icon Settings */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-4">Icon</label>
            <div className="space-y-4">
              <IconSelector
                selectedIcon={normalizedItems[activeSlideIndex].icon}
                onSelect={(icon) => handleSlideChange('icon', icon)}
              />
              
              {/* Icon Alignment */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Icon Position</label>
                <div className="flex gap-2">
                  {['left', 'right'].map((alignment) => (
                    <button
                      key={alignment}
                      type="button"
                      onClick={() => handleSlideChange('iconAlignment', alignment)}
                      className={`px-4 py-2 rounded-lg border transition-colors capitalize ${
                        normalizedItems[activeSlideIndex].iconAlignment === alignment
                          ? 'border-gray-900 bg-gray-900 text-white'
                          : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      {alignment}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Background */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-4">Background</label>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id={`useGradient-${activeSlideIndex}`}
                  checked={normalizedItems[activeSlideIndex].useGradient}
                  onChange={(e) => handleSlideChange('useGradient', e.target.checked)}
                  className="w-4 h-4 text-brand-600 border-gray-300 rounded focus:ring-brand-500"
                />
                <label htmlFor={`useGradient-${activeSlideIndex}`} className="text-sm text-gray-700">
                  Use gradient background
                </label>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <ColorPicker
                  value={normalizedItems[activeSlideIndex].background}
                  onChange={(color) => handleSlideChange('background', color)}
                  label={normalizedItems[activeSlideIndex].useGradient ? 'Start Color' : 'Background Color'}
                />
                
                {normalizedItems[activeSlideIndex].useGradient && (
                  <ColorPicker
                    value={normalizedItems[activeSlideIndex].backgroundGradient}
                    onChange={(color) => handleSlideChange('backgroundGradient', color)}
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
              value={normalizedItems[activeSlideIndex].textColor}
              onChange={(color) => handleSlideChange('textColor', color)}
              label="Text Color"
            />
          </div>

          {/* Font Family */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-4">Font</label>
            <FontSelector
              selectedFont={normalizedItems[activeSlideIndex].fontFamily}
              onSelect={(font) => handleSlideChange('fontFamily', font)}
            />
          </div>

          {/* CTA Settings */}
          <CTASettings
            enabled={normalizedItems[activeSlideIndex].cta_enabled}
            text={normalizedItems[activeSlideIndex].cta_text}
            url={normalizedItems[activeSlideIndex].cta_url}
            backgroundColor={normalizedItems[activeSlideIndex].cta_background_color}
            textColor={normalizedItems[activeSlideIndex].cta_text_color}
            onUpdate={(field, value) => handleSlideChange(field as keyof CarouselItem, value)}
          />
        </div>
      </div>
    </div>
  )
} 