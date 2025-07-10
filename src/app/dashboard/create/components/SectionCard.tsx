'use client'

import React from 'react'

interface SectionCardProps {
  id: string
  title: string
  subtitle: string
  icon: React.ElementType
  children: React.ReactNode
  isOpen: boolean
  onToggle: () => void
}

export default function SectionCard({ 
  id,
  title, 
  subtitle, 
  icon: Icon, 
  children, 
  isOpen, 
  onToggle 
}: SectionCardProps) {
  return (
    <div className="mb-4">
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200"
        data-section-id={id}
      >
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center">
            <Icon className="w-5 h-5 text-gray-600" />
          </div>
          <div>
            <h3 className="text-base font-medium text-gray-900">{title}</h3>
            <p className="text-sm text-gray-500">{subtitle}</p>
          </div>
        </div>
        <svg
          className={`w-5 h-5 text-gray-400 transition-transform ${isOpen ? 'transform rotate-180' : ''}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      {isOpen && (
        <div className="px-4 py-3 border-t border-gray-200">
          {children}
        </div>
      )}
    </div>
  )
} 