'use client'

import { useState } from 'react'
import { XMarkIcon } from '@heroicons/react/24/outline'
import { countries } from 'countries-list'

interface TargetingGroupProps {
  pagePaths: string[]
  geoCountries: string[]
  onPagePathsChange: (paths: string[]) => void
  onGeoCountriesChange: (countries: string[]) => void
}

export default function TargetingGroup({
  pagePaths,
  geoCountries,
  onPagePathsChange,
  onGeoCountriesChange,
}: TargetingGroupProps) {
  const [newPath, setNewPath] = useState('')

  // Convert countries object to array of options
  const countryOptions = Object.entries(countries).map(([code, data]) => ({
    code,
    name: data.name,
  }))

  const handleAddPath = (e: React.FormEvent) => {
    e.preventDefault()
    if (newPath.trim()) {
      onPagePathsChange([...pagePaths, newPath.trim()])
      setNewPath('')
    }
  }

  const handleRemovePath = (pathToRemove: string) => {
    onPagePathsChange(pagePaths.filter(path => path !== pathToRemove))
  }

  const handleCountryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedOptions = Array.from(e.target.selectedOptions, option => option.value)
    onGeoCountriesChange(selectedOptions)
  }

  return (
    <div className="space-y-6">
      {/* Page Paths */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Page Paths
        </label>
        <p className="text-sm text-gray-500 mb-4">
          Show this bar only on specific pages. Leave empty to show on all pages.
        </p>

        <form onSubmit={handleAddPath} className="flex gap-2 mb-3">
          <input
            type="text"
            value={newPath}
            onChange={(e) => setNewPath(e.target.value)}
            placeholder="/example-path"
            className="flex-1 px-4 py-2 border border-gray-200 rounded-lg"
          />
          <button
            type="submit"
            disabled={!newPath.trim()}
            className="px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Add Path
          </button>
        </form>

        {pagePaths.length > 0 && (
          <div className="space-y-2">
            {pagePaths.map((path) => (
              <div
                key={path}
                className="flex items-center justify-between px-4 py-2 bg-gray-50 rounded-lg"
              >
                <span className="text-sm text-gray-700">{path}</span>
                <button
                  onClick={() => handleRemovePath(path)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <XMarkIcon className="w-5 h-5" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Geo Targeting */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Country Targeting
        </label>
        <p className="text-sm text-gray-500 mb-4">
          Show this bar only to visitors from specific countries. Leave empty to show to all countries.
        </p>

        <select
          multiple
          value={geoCountries}
          onChange={handleCountryChange}
          className="w-full px-4 py-2 border border-gray-200 rounded-lg"
          size={5}
        >
          {countryOptions.map(({ code, name }) => (
            <option key={code} value={code}>
              {name}
            </option>
          ))}
        </select>
      </div>
    </div>
  )
} 