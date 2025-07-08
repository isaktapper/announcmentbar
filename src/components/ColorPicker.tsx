'use client'

interface ColorPickerProps {
  value: string
  onChange: (color: string) => void
  label: string
}

export default function ColorPicker({ value, onChange, label }: ColorPickerProps) {
  const handleColorChange = (newColor: string) => {
    // Ensure color starts with #
    const color = newColor.startsWith('#') ? newColor : `#${newColor}`
    onChange(color)
  }

  const handleHexChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let hex = e.target.value
    // Remove # if user types it
    if (hex.startsWith('#')) {
      hex = hex.slice(1)
    }
    // Only allow valid hex characters
    if (/^[0-9A-Fa-f]*$/.test(hex) && hex.length <= 6) {
      handleColorChange(`#${hex}`)
    }
  }

  const handlePreviewClick = (e: React.MouseEvent) => {
    // Get the position of the color preview box
    const rect = (e.target as HTMLElement).getBoundingClientRect()
    
    // Create a visible but tiny color input positioned over the preview box
    const colorInput = document.createElement('input')
    colorInput.type = 'color'
    colorInput.value = value
    colorInput.style.position = 'fixed'
    colorInput.style.left = `${rect.left}px`
    colorInput.style.top = `${rect.top}px`
    colorInput.style.width = `${rect.width}px`
    colorInput.style.height = `${rect.height}px`
    colorInput.style.opacity = '0'
    colorInput.style.border = 'none'
    colorInput.style.background = 'transparent'
    colorInput.style.cursor = 'pointer'
    colorInput.style.zIndex = '9999'
    document.body.appendChild(colorInput)
    
    colorInput.onchange = (e) => {
      const target = e.target as HTMLInputElement
      handleColorChange(target.value)
      document.body.removeChild(colorInput)
    }
    
    colorInput.onblur = () => {
      // Clean up when focus is lost
      setTimeout(() => {
        if (document.body.contains(colorInput)) {
          document.body.removeChild(colorInput)
        }
      }, 100)
    }
    
    // Focus and trigger the color picker
    colorInput.focus()
    colorInput.click()
  }

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-900">
        {label}
      </label>
      
      <div className="flex items-center gap-3">
        {/* Color Preview */}
        <div
          className="w-12 h-10 rounded-lg border border-gray-200 cursor-pointer shadow-sm"
          style={{ backgroundColor: value }}
          onClick={handlePreviewClick}
        />
        
        {/* Hex Input */}
        <div className="flex-1">
          <input
            type="text"
            value={value.replace('#', '')}
            onChange={handleHexChange}
            className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent text-sm font-mono text-black"
            placeholder="ff0000"
            maxLength={6}
          />
        </div>
      </div>
    </div>
  )
} 