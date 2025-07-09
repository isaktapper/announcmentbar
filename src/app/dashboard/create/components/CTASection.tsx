'use client'

import { useState } from 'react'
import { CTABorderRadius, CTASize } from '@/types/announcement'
import ColorPicker from '@/components/ColorPicker'

interface CTASectionProps {
  ctaText?: string
  ctaUrl?: string
  ctaTextColor?: string
  ctaBgColor?: string
  ctaBorderRadius?: CTABorderRadius
  ctaSize?: CTASize
  onChange: (values: {
    ctaText?: string
    ctaUrl?: string
    ctaTextColor?: string
    ctaBgColor?: string
    ctaBorderRadius?: CTABorderRadius
    ctaSize?: CTASize
  }) => void
}

const borderRadiusOptions: { value: CTABorderRadius; label: string }[] = [
  { value: 'none', label: 'None' },
  { value: 'sm', label: 'Small' },
  { value: 'md', label: 'Medium' },
  { value: 'lg', label: 'Large' },
  { value: 'pill', label: 'Pill' },
]

const sizeOptions: { value: CTASize; label: string }[] = [
  { value: 'sm', label: 'Small' },
  { value: 'md', label: 'Medium' },
  { value: 'lg', label: 'Large' },
]

const getSizeClasses = (size: CTASize = 'md') => {
  switch (size) {
    case 'sm':
      return 'px-3 py-1.5 text-sm'
    case 'lg':
      return 'px-6 py-3 text-lg'
    default:
      return 'px-4 py-2'
  }
}

const getBorderRadiusClasses = (radius: CTABorderRadius = 'md') => {
  switch (radius) {
    case 'none':
      return ''
    case 'sm':
      return 'rounded'
    case 'md':
      return 'rounded-md'
    case 'lg':
      return 'rounded-lg'
    case 'pill':
      return 'rounded-full'
  }
}

export default function CTASection({
  ctaText,
  ctaUrl,
  ctaTextColor = '#FFFFFF',
  ctaBgColor = '#000000',
  ctaBorderRadius = 'md',
  ctaSize = 'md',
  onChange,
}: CTASectionProps) {
  const [showCTA, setShowCTA] = useState(Boolean(ctaText || ctaUrl))

  const handleChange = (field: string, value: string) => {
    onChange({
      ctaText,
      ctaUrl,
      ctaTextColor,
      ctaBgColor,
      ctaBorderRadius,
      ctaSize,
      [field]: value,
    })
  }

  if (!showCTA) {
    return (
      <div className="space-y-4">
        <h3 className="text-lg font-medium text-gray-900">Call-to-action (CTA)</h3>
        <button
          type="button"
          onClick={() => setShowCTA(true)}
          className="w-full px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-500"
        >
          Add CTA
        </button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium text-gray-900">Call-to-action (CTA)</h3>
        <button
          type="button"
          onClick={() => {
            setShowCTA(false)
            onChange({
              ctaText: undefined,
              ctaUrl: undefined,
              ctaTextColor: '#FFFFFF',
              ctaBgColor: '#000000',
              ctaBorderRadius: 'md',
              ctaSize: 'md',
            })
          }}
          className="text-sm text-gray-500 hover:text-gray-700"
        >
          Remove CTA
        </button>
      </div>

      <div className="space-y-4">
        {/* Button Text */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Button Text</label>
          <input
            type="text"
            value={ctaText || ''}
            onChange={(e) => handleChange('ctaText', e.target.value)}
            placeholder="e.g., Learn More"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-brand-500 focus:ring-brand-500 sm:text-sm"
          />
        </div>

        {/* Button URL */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Button URL</label>
          <input
            type="url"
            value={ctaUrl || ''}
            onChange={(e) => handleChange('ctaUrl', e.target.value)}
            placeholder="https://example.com"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-brand-500 focus:ring-brand-500 sm:text-sm"
          />
        </div>

        {/* Colors */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <ColorPicker
              value={ctaTextColor}
              onChange={(color) => handleChange('ctaTextColor', color)}
              label="Text Color"
            />
          </div>
          <div>
            <ColorPicker
              value={ctaBgColor}
              onChange={(color) => handleChange('ctaBgColor', color)}
              label="Background Color"
            />
          </div>
        </div>

        {/* Button Size */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Button Size</label>
          <select
            value={ctaSize}
            onChange={(e) => handleChange('ctaSize', e.target.value as CTASize)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-brand-500 focus:ring-brand-500 sm:text-sm"
          >
            {sizeOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        {/* Button Shape */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Button Shape</label>
          <select
            value={ctaBorderRadius}
            onChange={(e) => handleChange('ctaBorderRadius', e.target.value as CTABorderRadius)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-brand-500 focus:ring-brand-500 sm:text-sm"
          >
            {borderRadiusOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        {/* Live Preview */}
        <div className="pt-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">Preview</label>
          <div className="flex justify-center p-4 bg-gray-50 rounded-lg">
            <a
              href={ctaUrl || '#'}
              className={`inline-flex items-center justify-center font-medium transition-colors ${getSizeClasses(
                ctaSize
              )} ${getBorderRadiusClasses(ctaBorderRadius)}`}
              style={{
                backgroundColor: ctaBgColor,
                color: ctaTextColor,
              }}
              onClick={(e) => e.preventDefault()}
            >
              {ctaText || 'Button Text'}
            </a>
          </div>
        </div>
      </div>
    </div>
  )
} 