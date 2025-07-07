'use client'

interface ColorPickerProps {
  value: string
  onChange: (color: string) => void
  label: string
  className?: string
}

export default function ColorPicker({ value, onChange, label, className = '' }: ColorPickerProps) {
  return (
    <div className={`space-y-2 ${className}`}>
      <label className="block text-xs font-medium text-gray-700 mb-2">
        {label}
      </label>
      <div className="relative group">
        {/* Color display with hex value */}
        <div 
          className="w-full h-12 rounded-lg border border-gray-200 relative overflow-hidden cursor-pointer transition-all duration-200 hover:shadow-md hover:scale-[1.02]"
          style={{ backgroundColor: value }}
        >
          {/* Subtle gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-black/10"></div>
          
          {/* Hex value display */}
          <div className="absolute inset-x-0 bottom-0 p-2">
            <div className="bg-black/30 backdrop-blur-sm rounded-md px-2 py-1 text-center">
              <span className="text-xs font-mono text-white font-medium tracking-wider">
                {value.toUpperCase()}
              </span>
            </div>
          </div>
        </div>
        
        {/* Hidden native color input */}
        <input
          type="color"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        />
      </div>
    </div>
  )
} 