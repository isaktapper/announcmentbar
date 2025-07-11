'use client'

import { useState } from 'react'
import { TrashIcon, PlusIcon, ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline'
import { EnhancedCarouselItem, FontFamily, CTASettings, BorderRadiusStyle } from '@/types/announcement'
import ColorPicker from '@/components/ColorPicker'

interface CarouselSlideManagerProps {
  items: EnhancedCarouselItem[]
  onChange: (items: EnhancedCarouselItem[]) => void
}

const defaultCTASettings: CTASettings = {
  enabled: false,
  text: '',
  url: '',
  size: 'medium',
  borderRadius: 'soft',
  backgroundColor: '#000000',
  textColor: '#FFFFFF'
}

const defaultCarouselItem: EnhancedCarouselItem = {
  title: '',
  message: '',
  textColor: '#000000',
  backgroundColor: '#FFFFFF',
  fontFamily: 'Inter',
  textAlignment: 'center',
  cta: defaultCTASettings
}

export default function CarouselSlideManager({ items, onChange }: CarouselSlideManagerProps) {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [showScrollLeft, setShowScrollLeft] = useState(false)
  const [showScrollRight, setShowScrollRight] = useState(false)

  const addItem = () => {
    const newItem = { ...defaultCarouselItem }
    onChange([...items, newItem])
    setCurrentSlide(items.length) // Switch to the new slide
  }

  const removeItem = (index: number) => {
    onChange(items.filter((_, i) => i !== index))
    setCurrentSlide(Math.min(currentSlide, items.length - 2))
  }

  const updateItem = (index: number, updates: Partial<EnhancedCarouselItem>) => {
    const updatedItems = items.map((item, i) => 
      i === index ? { ...item, ...updates } : item
    )
    onChange(updatedItems)
  }

  const updateCTA = (index: number, updates: Partial<CTASettings>) => {
    const updatedItems = items.map((item, i) => 
      i === index ? { ...item, cta: { ...item.cta, ...updates } } : item
    )
    onChange(updatedItems)
  }

  // Handle tab scroll visibility
  const handleTabsScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const target = e.currentTarget
    setShowScrollLeft(target.scrollLeft > 0)
    setShowScrollRight(target.scrollLeft < target.scrollWidth - target.clientWidth)
  }

  // Scroll tabs
  const scrollTabs = (direction: 'left' | 'right') => {
    const tabsContainer = document.getElementById('carousel-tabs')
    if (!tabsContainer) return
    
    const scrollAmount = 200
    const targetScroll = tabsContainer.scrollLeft + (direction === 'left' ? -scrollAmount : scrollAmount)
    tabsContainer.scrollTo({ left: targetScroll, behavior: 'smooth' })
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h4 className="text-sm font-medium text-gray-900">Carousel Slides</h4>
          <p className="text-xs text-gray-500">Add and customize multiple slides to rotate between</p>
        </div>
        <button
          type="button"
          onClick={addItem}
          className="inline-flex items-center gap-1 px-3 py-1.5 text-sm font-medium text-brand-600 bg-brand-50 rounded-lg hover:bg-brand-100 transition-colors"
        >
          <PlusIcon className="w-4 h-4" />
          Add Slide
        </button>
      </div>

      {items.length === 0 && (
        <div className="text-center py-8 text-gray-500 text-sm">
          <p>No slides yet. Add your first slide to get started.</p>
        </div>
      )}

      {items.length > 0 && (
        <div className="space-y-4">
          {/* Horizontal Tabs Navigation */}
          <div className="relative">
            {showScrollLeft && (
              <button
                onClick={() => scrollTabs('left')}
                className="absolute left-0 top-0 bottom-0 z-10 px-2 bg-gradient-to-r from-white to-white/50"
              >
                <ChevronLeftIcon className="w-5 h-5 text-gray-500" />
              </button>
            )}
            
            <div
              id="carousel-tabs"
              className="flex overflow-x-auto scrollbar-hide gap-2 px-1 relative"
              onScroll={handleTabsScroll}
            >
              {items.map((item, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentSlide(index)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg whitespace-nowrap transition-colors ${
                    index === currentSlide
                      ? 'bg-brand-50 text-brand-700 border-2 border-brand-500'
                      : 'bg-white text-gray-700 border-2 border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <span className="text-sm font-medium">Slide {index + 1}</span>
                  {items.length > 1 && (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation()
                        removeItem(index)
                      }}
                      className="p-0.5 text-red-600 hover:text-red-800 transition-colors rounded-full hover:bg-red-50"
                    >
                      <TrashIcon className="w-4 h-4" />
                    </button>
                  )}
                </button>
              ))}
            </div>

            {showScrollRight && (
              <button
                onClick={() => scrollTabs('right')}
                className="absolute right-0 top-0 bottom-0 z-10 px-2 bg-gradient-to-l from-white to-white/50"
              >
                <ChevronRightIcon className="w-5 h-5 text-gray-500" />
              </button>
            )}
          </div>

          {/* Current Slide Content */}
          <div className="bg-white border border-gray-200 rounded-lg p-6 space-y-6">
            {/* Content Section */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Title (Optional)</label>
                <input
                  type="text"
                  value={items[currentSlide].title}
                  onChange={(e) => updateItem(currentSlide, { title: e.target.value })}
                  placeholder="Optional title for this slide"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-brand-500 focus:border-brand-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Message *</label>
                <textarea
                  value={items[currentSlide].message}
                  onChange={(e) => updateItem(currentSlide, { message: e.target.value })}
                  placeholder="Message for this slide"
                  rows={3}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-brand-500 focus:border-brand-500"
                />
              </div>
            </div>

            {/* Styling Section */}
            <div className="space-y-4">
              <h5 className="text-sm font-medium text-gray-900">Slide Styling</h5>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Text Color</label>
                  <ColorPicker
                    value={items[currentSlide].textColor}
                    onChange={(color: string) => updateItem(currentSlide, { textColor: color })}
                    label="Text Color"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Background Color</label>
                  <ColorPicker
                    value={items[currentSlide].backgroundColor}
                    onChange={(color: string) => updateItem(currentSlide, { backgroundColor: color })}
                    label="Background Color"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Font Family</label>
                  <select
                    value={items[currentSlide].fontFamily}
                    onChange={(e) => updateItem(currentSlide, { fontFamily: e.target.value as FontFamily })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-brand-500 focus:border-brand-500"
                  >
                    <option value="Inter">Inter</option>
                    <option value="Work Sans">Work Sans</option>
                    <option value="Roboto">Roboto</option>
                    <option value="Open Sans">Open Sans</option>
                    <option value="Poppins">Poppins</option>
                    <option value="Lato">Lato</option>
                    <option value="DM Sans">DM Sans</option>
                    <option value="Nunito">Nunito</option>
                    <option value="IBM Plex Sans">IBM Plex Sans</option>
                    <option value="Space Grotesk">Space Grotesk</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Text Alignment</label>
                  <select
                    value={items[currentSlide].textAlignment}
                    onChange={(e) => updateItem(currentSlide, { textAlignment: e.target.value as 'left' | 'center' | 'right' })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-brand-500 focus:border-brand-500"
                  >
                    <option value="left">Left</option>
                    <option value="center">Center</option>
                    <option value="right">Right</option>
                  </select>
                </div>
              </div>
            </div>

            {/* CTA Section */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h5 className="text-sm font-medium text-gray-900">Call to Action Button</h5>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={items[currentSlide].cta.enabled}
                    onChange={(e) => updateCTA(currentSlide, { enabled: e.target.checked })}
                    className="rounded border-gray-300 text-brand-600 focus:ring-brand-500"
                  />
                  <span className="ml-2 text-sm text-gray-500">Enable CTA</span>
                </label>
              </div>

              {items[currentSlide].cta.enabled && (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Button Text</label>
                      <input
                        type="text"
                        value={items[currentSlide].cta.text}
                        onChange={(e) => updateCTA(currentSlide, { text: e.target.value })}
                        placeholder="e.g., Learn More"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-brand-500 focus:border-brand-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Button URL</label>
                      <input
                        type="url"
                        value={items[currentSlide].cta.url}
                        onChange={(e) => updateCTA(currentSlide, { url: e.target.value })}
                        placeholder="https://..."
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-brand-500 focus:border-brand-500"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Button Size</label>
                      <select
                        value={items[currentSlide].cta.size}
                        onChange={(e) => updateCTA(currentSlide, { size: e.target.value as 'small' | 'medium' | 'large' })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-brand-500 focus:border-brand-500"
                      >
                        <option value="small">Small</option>
                        <option value="medium">Medium</option>
                        <option value="large">Large</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Border Radius</label>
                      <select
                        value={items[currentSlide].cta.borderRadius}
                        onChange={(e) => updateCTA(currentSlide, { borderRadius: e.target.value as BorderRadiusStyle })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-brand-500 focus:border-brand-500"
                      >
                        <option value="sharp">Sharp</option>
                        <option value="soft">Soft</option>
                        <option value="pill">Pill</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Button Color</label>
                      <ColorPicker
                        value={items[currentSlide].cta.backgroundColor}
                        onChange={(color: string) => updateCTA(currentSlide, { backgroundColor: color })}
                        label="Button Color"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Button Text Color</label>
                      <ColorPicker
                        value={items[currentSlide].cta.textColor}
                        onChange={(color: string) => updateCTA(currentSlide, { textColor: color })}
                        label="Button Text Color"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
} 