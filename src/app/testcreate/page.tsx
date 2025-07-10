'use client'

import { useState, useEffect } from 'react'
import { Switch } from '@headlessui/react'
import { 
  DocumentTextIcon, 
  PaintBrushIcon, 
  AdjustmentsHorizontalIcon,
  GlobeAltIcon,
  Squares2X2Icon,
  ChevronUpIcon,
  ChevronDownIcon
} from '@heroicons/react/24/outline'

interface Section {
  id: string
  title: string
  icon: React.ElementType
  isOpen: boolean
}

export default function TestCreatePage() {
  const [sections, setSections] = useState<Section[]>([
    { id: 'general', title: 'General', icon: Squares2X2Icon, isOpen: true },
    { id: 'content', title: 'Content', icon: DocumentTextIcon, isOpen: true },
    { id: 'appearance', title: 'Appearance', icon: PaintBrushIcon, isOpen: true },
    { id: 'options', title: 'Options', icon: AdjustmentsHorizontalIcon, isOpen: true },
    { id: 'targeting', title: 'Targeting', icon: GlobeAltIcon, isOpen: true },
  ])
  const [origin, setOrigin] = useState('')

  useEffect(() => {
    setOrigin(window.location.origin)
  }, [])

  const toggleSection = (id: string) => {
    setSections(prev => prev.map(section => 
      section.id === id ? { ...section, isOpen: !section.isOpen } : section
    ))
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Live Preview Banner - Fixed at top */}
      <div className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">Live Preview</h2>
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-500">Desktop View</span>
              <Switch
                checked={true}
                onChange={() => {}}
                className="bg-brand-500 relative inline-flex h-6 w-11 items-center rounded-full"
              >
                <span className="translate-x-6 inline-block h-4 w-4 transform rounded-full bg-white transition" />
              </Switch>
            </div>
          </div>
          <div className="mt-4 p-4 bg-yellow-400 text-black rounded-lg">
            <div className="text-center">
              <div className="font-semibold mb-1">Welcome to our Spring Sale! 🌸</div>
              <div className="text-sm mb-2">Get 20% off on all products using code SPRING20</div>
              <button className="px-4 py-1.5 bg-black text-white rounded-md text-sm font-medium">
                Shop Now
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-6">
          {sections.map(section => (
            <div key={section.id} className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
              <button
                onClick={() => toggleSection(section.id)}
                className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <section.icon className="w-5 h-5 text-gray-400" />
                  <h2 className="text-lg font-medium text-gray-900">{section.title}</h2>
                </div>
                {section.isOpen ? (
                  <ChevronUpIcon className="w-5 h-5 text-gray-400" />
                ) : (
                  <ChevronDownIcon className="w-5 h-5 text-gray-400" />
                )}
              </button>

              {section.isOpen && (
                <div className="px-6 pb-6">
                  {section.id === 'general' && (
                    <div className="space-y-6">
                      {/* Bar Type */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Bar Type</label>
                        <div className="flex gap-4">
                          <button className="px-4 py-2 bg-brand-50 text-brand-700 border-2 border-brand-500 rounded-lg font-medium">
                            Static
                          </button>
                          <button className="px-4 py-2 bg-white text-gray-700 border-2 border-gray-200 rounded-lg font-medium">
                            Carousel
                          </button>
                        </div>
                      </div>

                      {/* Template Picker */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Choose a Template</label>
                        <div className="grid grid-cols-2 gap-4">
                          {[1, 2, 3, 4].map(i => (
                            <div key={i} className="aspect-[3/1] rounded-lg border-2 border-gray-200 hover:border-brand-500 cursor-pointer" />
                          ))}
                        </div>
                      </div>

                      {/* Slug Preview */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Your banner will show at:</label>
                        <code className="block w-full px-4 py-2 bg-gray-50 text-gray-600 rounded-lg font-mono text-sm">
                          {origin}/embed/spring-sale-2024.js
                        </code>
                      </div>
                    </div>
                  )}

                  {section.id === 'content' && (
                    <div className="space-y-6">
                      {/* Title & Message */}
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
                          <input
                            type="text"
                            placeholder="Welcome to our Spring Sale! 🌸"
                            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Message</label>
                          <textarea
                            placeholder="Get 20% off on all products using code SPRING20"
                            rows={2}
                            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent"
                          />
                        </div>
                      </div>

                      {/* CTA Button */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-4">Call-to-Action Button</label>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-xs text-gray-500 mb-1">Button Text</label>
                            <input
                              type="text"
                              placeholder="Shop Now"
                              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent"
                            />
                          </div>
                          <div>
                            <label className="block text-xs text-gray-500 mb-1">Button URL</label>
                            <input
                              type="text"
                              placeholder="https://..."
                              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent"
                            />
                          </div>
                        </div>
                        <div className="mt-4">
                          <label className="block text-xs text-gray-500 mb-1">Button Style</label>
                          <div className="flex gap-4">
                            <button className="px-4 py-2 bg-black text-white rounded-lg text-sm font-medium">
                              Filled
                            </button>
                            <button className="px-4 py-2 bg-white text-black border-2 border-black rounded-lg text-sm font-medium">
                              Outline
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* Typography */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-4">Typography</label>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-xs text-gray-500 mb-1">Font Family</label>
                            <select className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent">
                              <option>Inter</option>
                              <option>Roboto</option>
                              <option>Open Sans</option>
                            </select>
                          </div>
                          <div>
                            <label className="block text-xs text-gray-500 mb-1">Text Alignment</label>
                            <select className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent">
                              <option>Center</option>
                              <option>Left</option>
                              <option>Right</option>
                            </select>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {section.id === 'appearance' && (
                    <div className="space-y-6">
                      {/* Colors */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-4">Colors</label>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-xs text-gray-500 mb-1">Background Color</label>
                            <div className="flex gap-2">
                              <input
                                type="color"
                                value="#FFEB3B"
                                className="h-10 w-10 rounded cursor-pointer"
                              />
                              <input
                                type="text"
                                value="#FFEB3B"
                                className="flex-1 px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent font-mono"
                              />
                            </div>
                          </div>
                          <div>
                            <label className="block text-xs text-gray-500 mb-1">Text Color</label>
                            <div className="flex gap-2">
                              <input
                                type="color"
                                value="#000000"
                                className="h-10 w-10 rounded cursor-pointer"
                              />
                              <input
                                type="text"
                                value="#000000"
                                className="flex-1 px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent font-mono"
                              />
                            </div>
                          </div>
                        </div>
                        <div className="mt-4">
                          <label className="flex items-center gap-2">
                            <Switch
                              checked={false}
                              onChange={() => {}}
                              className="bg-gray-200 relative inline-flex h-6 w-11 items-center rounded-full"
                            >
                              <span className="translate-x-1 inline-block h-4 w-4 transform rounded-full bg-white transition" />
                            </Switch>
                            <span className="text-sm text-gray-700">Use gradient background</span>
                          </label>
                        </div>
                      </div>

                      {/* Style */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-4">Style</label>
                        <div className="grid grid-cols-3 gap-4">
                          <div>
                            <label className="block text-xs text-gray-500 mb-1">Border Radius</label>
                            <input
                              type="number"
                              value={8}
                              min={0}
                              max={20}
                              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent"
                            />
                          </div>
                          <div>
                            <label className="block text-xs text-gray-500 mb-1">Padding</label>
                            <input
                              type="number"
                              value={16}
                              min={0}
                              max={40}
                              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent"
                            />
                          </div>
                          <div>
                            <label className="block text-xs text-gray-500 mb-1">Shadow</label>
                            <select className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent">
                              <option>None</option>
                              <option>Small</option>
                              <option>Medium</option>
                              <option>Large</option>
                            </select>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {section.id === 'options' && (
                    <div className="space-y-6">
                      {/* Toggles */}
                      <div className="space-y-4">
                        <label className="flex items-center justify-between">
                          <span className="text-sm text-gray-700">Show close button</span>
                          <Switch
                            checked={true}
                            onChange={() => {}}
                            className="bg-brand-500 relative inline-flex h-6 w-11 items-center rounded-full"
                          >
                            <span className="translate-x-6 inline-block h-4 w-4 transform rounded-full bg-white transition" />
                          </Switch>
                        </label>
                        <label className="flex items-center justify-between">
                          <span className="text-sm text-gray-700">Make bar sticky</span>
                          <Switch
                            checked={false}
                            onChange={() => {}}
                            className="bg-gray-200 relative inline-flex h-6 w-11 items-center rounded-full"
                          >
                            <span className="translate-x-1 inline-block h-4 w-4 transform rounded-full bg-white transition" />
                          </Switch>
                        </label>
                        <label className="flex items-center justify-between opacity-50 cursor-not-allowed">
                          <span className="text-sm text-gray-700">Bar visibility</span>
                          <Switch
                            checked={true}
                            onChange={() => {}}
                            disabled
                            className="bg-brand-500 relative inline-flex h-6 w-11 items-center rounded-full"
                          >
                            <span className="translate-x-6 inline-block h-4 w-4 transform rounded-full bg-white transition" />
                          </Switch>
                        </label>
                      </div>

                      {/* Schedule */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-4">Schedule (Disabled in demo)</label>
                        <div className="grid grid-cols-2 gap-4 opacity-50">
                          <div>
                            <label className="block text-xs text-gray-500 mb-1">Start Date</label>
                            <input
                              type="datetime-local"
                              disabled
                              className="w-full px-4 py-2 border border-gray-200 rounded-lg bg-gray-50 cursor-not-allowed"
                            />
                          </div>
                          <div>
                            <label className="block text-xs text-gray-500 mb-1">End Date</label>
                            <input
                              type="datetime-local"
                              disabled
                              className="w-full px-4 py-2 border border-gray-200 rounded-lg bg-gray-50 cursor-not-allowed"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {section.id === 'targeting' && (
                    <div className="space-y-6">
                      {/* Geo Targeting */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Geo Targeting (Disabled in demo)</label>
                        <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                          <p className="text-sm text-gray-500">Select countries where this bar should be shown</p>
                          <button disabled className="mt-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm text-gray-400 cursor-not-allowed">
                            Select Countries
                          </button>
                        </div>
                      </div>

                      {/* Page Targeting */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Page Targeting (Disabled in demo)</label>
                        <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                          <p className="text-sm text-gray-500">Choose which pages this bar should appear on</p>
                          <button disabled className="mt-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm text-gray-400 cursor-not-allowed">
                            Configure Pages
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </main>
    </div>
  )
} 