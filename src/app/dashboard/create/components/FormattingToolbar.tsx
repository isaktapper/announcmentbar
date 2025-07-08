'use client'

import { useState, useRef, useEffect, useCallback } from 'react'

interface FormattingToolbarProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  required?: boolean
  rows?: number
}

export default function FormattingToolbar({ 
  value, 
  onChange, 
  placeholder, 
  required = false,
  rows = 4 
}: FormattingToolbarProps) {
  const editorRef = useRef<HTMLDivElement>(null)
  const [isFocused, setIsFocused] = useState(false)
  const isUserInputRef = useRef(false)

  // Convert HTML to plain text for validation
  const getPlainText = useCallback((html: string) => {
    const div = document.createElement('div')
    div.innerHTML = html
    return div.textContent || div.innerText || ''
  }, [])

  // Initialize content on mount and handle external value changes
  useEffect(() => {
    if (editorRef.current) {
      const currentHTML = editorRef.current.innerHTML
      const targetHTML = value || ''
      
      // Only update if this is not from user input and content actually differs
      if (!isUserInputRef.current && currentHTML !== targetHTML) {
        editorRef.current.innerHTML = targetHTML
      }
      
      // Reset the user input flag
      isUserInputRef.current = false
    }
  }, [value])

  // Handle keyboard shortcuts
  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.metaKey || e.ctrlKey) {
      switch (e.key.toLowerCase()) {
        case 'b':
          e.preventDefault()
          applyFormatting('bold')
          break
        case 'i':
          e.preventDefault()
          applyFormatting('italic')
          break
        case 'u':
          e.preventDefault()
          applyFormatting('underline')
          break
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Apply formatting using document.execCommand
  const applyFormatting = useCallback((command: string) => {
    if (!editorRef.current) return
    
    editorRef.current.focus()
    
    try {
      // Use document.execCommand for basic formatting
      switch (command) {
        case 'bold':
          document.execCommand('bold', false)
          break
        case 'italic':
          document.execCommand('italic', false)
          break
        case 'underline':
          document.execCommand('underline', false)
          break
      }
      
      // Trigger change event
      isUserInputRef.current = true
      const newValue = editorRef.current.innerHTML
      onChange(newValue)
          } catch (err) {
        console.error('Error applying formatting:', err)
    }
  }, [onChange])

  // Handle content changes
  const handleInput = useCallback(() => {
    if (editorRef.current) {
      isUserInputRef.current = true
      const newValue = editorRef.current.innerHTML
      onChange(newValue)
    }
  }, [onChange])

  // Handle paste events to clean up pasted content
  const handlePaste = useCallback((e: React.ClipboardEvent) => {
    e.preventDefault()
    
    const paste = e.clipboardData.getData('text/plain')
    const selection = window.getSelection()
    
    if (selection && selection.rangeCount > 0) {
      const range = selection.getRangeAt(0)
      range.deleteContents()
      range.insertNode(document.createTextNode(paste))
      range.collapse(false)
      selection.removeAllRanges()
      selection.addRange(range)
      
      isUserInputRef.current = true
      handleInput()
    }
  }, [handleInput])

  const formatButtons = [
    {
      name: 'Bold',
      icon: () => <strong className="text-sm font-bold">B</strong>,
      action: () => applyFormatting('bold'),
      shortcut: 'Ctrl+B',
    },
    {
      name: 'Italic', 
      icon: () => <em className="text-sm italic font-medium">I</em>,
      action: () => applyFormatting('italic'),
      shortcut: 'Ctrl+I',
    },
    {
      name: 'Underline',
      icon: () => <span className="text-sm font-medium underline">U</span>,
      action: () => applyFormatting('underline'),
      shortcut: 'Ctrl+U',
    },
  ]

  // Check if editor is empty for placeholder display
  const isEmpty = !value || getPlainText(value).trim() === ''

  return (
    <div className="border border-gray-200 rounded-xl overflow-hidden">
      {/* Formatting Toolbar */}
      <div className="bg-gray-50 px-3 py-2 border-b border-gray-200 flex items-center gap-1">
        {formatButtons.map((button) => {
          const IconComponent = button.icon
          return (
            <button
              key={button.name}
              type="button"
              onClick={button.action}
              className="p-1.5 rounded hover:bg-gray-200 transition-colors text-gray-600 hover:text-gray-900"
              title={`${button.name} (${button.shortcut})`}
            >
              <IconComponent />
            </button>
          )
        })}
        <div className="h-4 w-px bg-gray-300 mx-2"></div>
        <span className="text-xs text-gray-500">Select text and click to format, or use keyboard shortcuts</span>
      </div>
      
      {/* Rich Text Editor */}
      <div className="relative">
        {isEmpty && !isFocused && (
          <div 
            className="absolute top-3 left-4 text-gray-500 pointer-events-none text-sm"
            style={{ fontSize: '14px' }}
          >
            {placeholder}
          </div>
        )}
        <div
          ref={editorRef}
          contentEditable
          suppressContentEditableWarning
          onInput={handleInput}
          onKeyDown={handleKeyDown}
          onPaste={handlePaste}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          className="w-full px-4 py-3 text-gray-900 focus:outline-none resize-none min-h-[100px] overflow-y-auto"
          style={{ 
            minHeight: `${rows * 24}px`,
            maxHeight: '200px',
            lineHeight: '1.5',
            direction: 'ltr',
            textAlign: 'left',
            unicodeBidi: 'plaintext'
          }}
          data-required={required}
        />
      </div>
    </div>
  )
} 