'use client'

import { Switch } from '@headlessui/react'
import ColorPicker from '@/components/ColorPicker'
import { AnnouncementFormData } from '@/types/announcement'

interface CTASettingsProps {
  enabled: boolean
  text: string
  url: string
  backgroundColor: string
  textColor: string
  onUpdate: (field: keyof AnnouncementFormData, value: any) => void
}

export default function CTASettings({
  enabled,
  text,
  url,
  backgroundColor,
  textColor,
  onUpdate
}: CTASettingsProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h4 className="text-sm font-medium text-gray-900">Call-to-Action Button</h4>
          <p className="text-sm text-gray-500">Add a clickable button to your announcement</p>
        </div>
        <Switch
          checked={enabled}
          onChange={(value) => onUpdate('cta_enabled', value)}
          className={`${
            enabled ? 'bg-gray-900' : 'bg-gray-200'
          } relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2`}
        >
          <span
            className={`${
              enabled ? 'translate-x-6' : 'translate-x-1'
            } inline-block h-4 w-4 transform rounded-full bg-white transition-transform`}
          />
        </Switch>
      </div>

      {enabled && (
        <>
          <div className="h-px bg-gray-200 my-4" /> {/* Top divider */}
          <div className="space-y-4 pt-2">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Button Text</label>
              <input
                type="text"
                value={text}
                onChange={(e) => onUpdate('cta_text', e.target.value)}
                placeholder="Ex. Learn More"
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:ring-brand-500 focus:border-brand-500 bg-white text-gray-900"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">URL</label>
              <input
                type="url"
                value={url}
                onChange={(e) => onUpdate('cta_url', e.target.value)}
                placeholder="https://"
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:ring-brand-500 focus:border-brand-500 bg-white text-gray-900"
              />
            </div>

            <div className="space-y-3">
              <div>
                <ColorPicker
                  value={backgroundColor}
                  onChange={(color) => onUpdate('cta_background_color', color)}
                  label="Button Color"
                />
              </div>
              <div>
                <ColorPicker
                  value={textColor}
                  onChange={(color) => onUpdate('cta_text_color', color)}
                  label="Button Text"
                />
              </div>
            </div>
          </div>
          <div className="h-px bg-gray-200 my-4" /> {/* Bottom divider */}
        </>
      )}
    </div>
  )
} 