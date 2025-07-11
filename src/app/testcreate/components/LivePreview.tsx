'use client'

import { useState, useEffect, useCallback } from 'react'
import { EnhancedCarouselItem } from '@/types/announcement'

interface LivePreviewProps {
  type: 'static' | 'carousel'
  staticContent?: {
    title?: string
    message: string
    backgroundColor: string
    textColor: string
    fontFamily: string
    textAlignment: 'left' | 'center' | 'right'
    cta?: {
      enabled: boolean
      text: string
      url: string
      size: 'small' | 'medium' | 'large'
      borderRadius: 'sharp' | 'soft' | 'pill'
      backgroundColor: string
      textColor: string
    }
  }
  carouselItems?: EnhancedCarouselItem[]
  carouselSpeed?: number
  pauseOnHover?: boolean
}

export default function LivePreview({
  type,
  staticContent,
  carouselItems = [],
  carouselSpeed = 5000,
  pauseOnHover = true
}: LivePreviewProps) {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [isPaused, setIsPaused] = useState(false)

  const nextSlide = useCallback(() => {
    if (carouselItems.length <= 1) return
    setCurrentSlide(current => (current + 1) % carouselItems.length)
  }, [carouselItems.length])

  useEffect(() => {
    if (type !== 'carousel' || carouselItems.length <= 1 || isPaused) return

    const interval = setInterval(nextSlide, carouselSpeed)
    return () => clearInterval(interval)
  }, [type, carouselItems.length, carouselSpeed, isPaused, nextSlide])

  const getButtonClasses = (size: 'small' | 'medium' | 'large', borderRadius: 'sharp' | 'soft' | 'pill') => {
    const baseClasses = 'font-medium transition-colors'
    const sizeClasses = {
      small: 'px-3 py-1 text-sm',
      medium: 'px-4 py-1.5 text-sm',
      large: 'px-5 py-2 text-base'
    } as const
    const radiusClasses = {
      sharp: 'rounded-none',
      soft: 'rounded-md',
      pill: 'rounded-full'
    } as const
    return `${baseClasses} ${sizeClasses[size]} ${radiusClasses[borderRadius]}`
  }

  const renderContent = () => {
    if (type === 'static' && staticContent) {
      return (
        <div 
          className="w-full"
          style={{ 
            backgroundColor: staticContent.backgroundColor,
            color: staticContent.textColor,
            fontFamily: staticContent.fontFamily
          }}
        >
          <div className={`p-4 text-${staticContent.textAlignment}`}>
            {staticContent.title && (
              <div className="font-semibold mb-1">{staticContent.title}</div>
            )}
            <div className={staticContent.title ? 'text-sm mb-2' : 'mb-2'}>
              {staticContent.message}
            </div>
            {staticContent.cta?.enabled && (
              <a 
                href={staticContent.cta.url}
                target="_blank"
                rel="noopener noreferrer"
                className={getButtonClasses(staticContent.cta.size, staticContent.cta.borderRadius)}
                style={{
                  backgroundColor: staticContent.cta.backgroundColor,
                  color: staticContent.cta.textColor
                }}
              >
                {staticContent.cta.text}
              </a>
            )}
          </div>
        </div>
      )
    }

    if (type === 'carousel' && carouselItems.length > 0) {
      const currentItem = carouselItems[currentSlide]
      return (
        <div 
          className="w-full relative"
          onMouseEnter={() => pauseOnHover && setIsPaused(true)}
          onMouseLeave={() => pauseOnHover && setIsPaused(false)}
        >
          <div
            className="w-full"
            style={{ 
              backgroundColor: currentItem.backgroundColor,
              color: currentItem.textColor,
              fontFamily: currentItem.fontFamily
            }}
          >
            <div className={`p-4 text-${currentItem.textAlignment}`}>
              {currentItem.title && (
                <div className="font-semibold mb-1">{currentItem.title}</div>
              )}
              <div className={currentItem.title ? 'text-sm mb-2' : 'mb-2'}>
                {currentItem.message}
              </div>
              {currentItem.cta?.enabled && (
                <a 
                  href={currentItem.cta.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={getButtonClasses(currentItem.cta.size, currentItem.cta.borderRadius)}
                  style={{
                    backgroundColor: currentItem.cta.backgroundColor,
                    color: currentItem.cta.textColor
                  }}
                >
                  {currentItem.cta.text}
                </a>
              )}
            </div>
          </div>

          {/* Carousel Navigation Dots */}
          {carouselItems.length > 1 && (
            <div className="absolute bottom-1 left-0 right-0 flex justify-center gap-1">
              {carouselItems.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentSlide(index)}
                  className={`w-1.5 h-1.5 rounded-full transition-all ${
                    index === currentSlide 
                      ? 'bg-current opacity-80' 
                      : 'bg-current opacity-40 hover:opacity-60'
                  }`}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>
          )}
        </div>
      )
    }

    return null
  }

  return (
    <div className="w-full rounded-lg overflow-hidden shadow-sm">
      {renderContent()}
    </div>
  )
} 