'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { Search, X } from 'lucide-react'
import { countries } from 'countries-list'
import ReactDOM from 'react-dom'

interface GeoSelectorProps {
  initialCountries?: string[]
  onCountriesChange: (countries: string[]) => void
}

const countryOptions = Object.entries(countries).map(([code, data]) => ({
  code,
  name: data.name,
}))

export default function GeoSelector({ initialCountries = [], onCountriesChange }: GeoSelectorProps) {
  const [inputValue, setInputValue] = useState('')
  const [suggestions, setSuggestions] = useState<typeof countryOptions>([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const [dropdownPos, setDropdownPos] = useState<{top: number, left: number, width: number}>({top: 0, left: 0, width: 0})
  const [selectedCountries, setSelectedCountries] = useState<string[]>(initialCountries)
  
  useEffect(() => {
    if (inputValue.trim() === '') {
      setSuggestions([])
      return
    }
    const val = inputValue.toLowerCase()
    setSuggestions(
      countryOptions.filter(
        (c) =>
          !selectedCountries.includes(c.code) &&
          (c.name.toLowerCase().includes(val) || c.code.toLowerCase().includes(val))
      ).slice(0, 10)
    )
  }, [inputValue, selectedCountries])

  // Calculate dropdown position for portal (always above)
  const updateDropdownPos = useCallback(() => {
    if (inputRef.current) {
      const rect = inputRef.current.getBoundingClientRect()
      const dropdownHeight = Math.min(suggestions.length * 56, 288) // 56px per item, max 288px (max-h-72)
      setDropdownPos({
        top: rect.top + window.scrollY - dropdownHeight,
        left: rect.left + window.scrollX,
        width: rect.width
      })
    }
  }, [suggestions.length])

  useEffect(() => {
    if (showSuggestions) {
      updateDropdownPos()
      window.addEventListener('resize', updateDropdownPos)
      window.addEventListener('scroll', updateDropdownPos, true)
      return () => {
        window.removeEventListener('resize', updateDropdownPos)
        window.removeEventListener('scroll', updateDropdownPos, true)
      }
    }
  }, [showSuggestions, updateDropdownPos])

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value)
    setShowSuggestions(true)
  }

  const handleAddCountry = (country: { code: string; name: string }) => {
    if (!selectedCountries.includes(country.code)) {
      const newCountries = [...selectedCountries, country.code]
      setSelectedCountries(newCountries)
      onCountriesChange(newCountries)
    }
    setInputValue('')
    setSuggestions([])
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (suggestions.length > 0 && (e.key === 'Tab' || e.key === 'Enter')) {
      e.preventDefault()
      handleAddCountry(suggestions[0])
    } else if (e.key === 'Backspace' && inputValue === '' && selectedCountries.length > 0) {
      onCountriesChange(selectedCountries.slice(0, -1))
    }
  }

  const handleRemoveCountry = (code: string) => {
    const newCountries = selectedCountries.filter((c) => c !== code)
    setSelectedCountries(newCountries)
    onCountriesChange(newCountries)
  }

  // Portal dropdown
  const dropdown = showSuggestions && suggestions.length > 0 && typeof window !== 'undefined'
    ? ReactDOM.createPortal(
        <ul
          className="z-[9999] bg-white border border-gray-300 rounded-xl shadow-xl max-h-72 overflow-auto"
          style={{
            position: 'absolute',
            top: dropdownPos.top,
            left: dropdownPos.left,
            width: dropdownPos.width,
          }}
        >
          {suggestions.map((country) => (
            <li
              key={country.code}
              className="px-5 py-3 cursor-pointer hover:bg-brand-50 text-base font-semibold text-gray-900 flex items-center justify-between transition-colors"
              onMouseDown={() => handleAddCountry(country)}
            >
              <span>{country.name}</span>
              <span className="text-gray-400 text-sm ml-4">{country.code}</span>
            </li>
          ))}
        </ul>,
        document.body
      )
    : null

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">Country Targeting</label>
      <p className="text-sm text-gray-500 mb-2">Type to add countries. Leave empty to show to all countries.</p>
      <div className="relative">
        <div className="flex flex-wrap gap-2 mb-2">
          {selectedCountries.map((code) => {
            const country = countryOptions.find((c) => c.code === code)
            return (
              <span key={code} className="inline-flex items-center bg-gray-100 rounded-full px-3 py-1 text-sm text-gray-800">
                {country ? country.name : code}
                <button
                  type="button"
                  className="ml-2 text-gray-400 hover:text-gray-600 focus:outline-none"
                  onClick={() => handleRemoveCountry(code)}
                  tabIndex={-1}
                >
                  <X className="w-4 h-4" />
                </button>
              </span>
            )
          })}
        </div>
        <div className="relative">
          <input
            ref={inputRef}
            type="text"
            value={inputValue}
            onChange={handleInput}
            onFocus={() => setShowSuggestions(true)}
            onBlur={() => setTimeout(() => setShowSuggestions(false), 100)}
            onKeyDown={handleKeyDown}
            placeholder="Type a country name or code..."
            className="w-full pl-10 py-2 border border-gray-200 rounded-lg text-sm text-gray-900 placeholder:text-gray-400 focus:ring-2 focus:ring-brand-500 focus:border-transparent"
          />
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
        </div>
        {dropdown}
      </div>
    </div>
  )
} 