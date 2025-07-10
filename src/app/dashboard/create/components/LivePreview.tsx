'use client'

import React, { useState, useEffect } from 'react'
import { XMarkIcon } from '@heroicons/react/24/outline'
import { 
  AlertTriangle, 
  AlertCircle, 
  Info, 
  CheckCircle, 
  Clock, 
  X,
  ShoppingCart,
  Lightbulb,
  Sparkles,
  BellRing,
  MessageCircle,
  Megaphone,
  Flame,
  Package,
  FlaskConical
} from 'lucide-react'
import { ICONS } from '@/types/announcement'

interface CarouselItem {
  title: string
  message: string
  titleUrl?: string
  messageUrl?: string
}

interface LivePreviewProps {
  type: 'single' | 'marquee' | 'carousel'
  title: string
  message: string
  titleUrl?: string
  messageUrl?: string
  backgroundColor: string
  backgroundGradient?: string
  useGradient?: boolean
  textColor: string
  linkColor: string
  borderColor: string
  buttonColor: string
  buttonTextColor: string
  fontFamily: string
  fontSize: number
  titleFontSize: number
  messageFontSize: number
  textAlignment: 'left' | 'center' | 'right'
  showLeftIcon: boolean
  showRightIcon: boolean
  leftIcon: string
  rightIcon: string
  showButton: boolean
  buttonText: string
  showCloseButton: boolean
  borderStyle: string
  borderWidth: number
  showDivider: boolean
  dividerColor: string
  marqueeSpeed: number
  marqueeDirection: 'left' | 'right'
  pauseOnHover: boolean
  carouselItems: CarouselItem[]
  carouselRotationSpeed: number
  barHeight: number
}

const LivePreview = React.memo(function LivePreview({
  type,
  title,
  message,
  titleUrl,
  messageUrl,
  backgroundColor,
  backgroundGradient,
  useGradient,
  textColor,
  linkColor,
  borderColor,
  buttonColor,
  buttonTextColor,
  fontFamily,
  fontSize,
  titleFontSize,
  messageFontSize,
  textAlignment,
  showLeftIcon,
  showRightIcon,
  leftIcon,
  rightIcon,
  showButton,
  buttonText,
  showCloseButton,
  borderStyle,
  borderWidth,
  showDivider,
  dividerColor,
  marqueeSpeed,
  marqueeDirection,
  pauseOnHover,
  carouselItems,
  carouselRotationSpeed,
  barHeight
}: LivePreviewProps) {
  const [currentCarouselIndex, setCurrentCarouselIndex] = useState(0)
  const [isVisible, setIsVisible] = useState(true)
  const [isCarouselPaused, setIsCarouselPaused] = useState(false)

  // Load Google Fonts dynamically
  useEffect(() => {
    if (fontFamily) {
      const link = document.createElement('link')
      link.href = `https://fonts.googleapis.com/css2?family=${fontFamily.replace(/\s+/g, '+')}:wght@400;500;600;700&display=swap`
      link.rel = 'stylesheet'
      document.head.appendChild(link)

      return () => {
        // Clean up by removing the link when component unmounts or font changes
        document.head.removeChild(link)
      }
    }
  }, [fontFamily])

  // Get background style (solid or gradient)
  const getBackgroundStyle = () => {
    if (useGradient && backgroundGradient) {
      return `linear-gradient(135deg, ${backgroundColor}, ${backgroundGradient})`
    }
    return backgroundColor
  }

  // Auto-rotate carousel items
  useEffect(() => {
    if (type === 'carousel' && carouselItems && carouselItems.length > 1 && !isCarouselPaused) {
      const interval = setInterval(() => {
        setCurrentCarouselIndex(prev => (prev + 1) % carouselItems.length)
      }, carouselRotationSpeed * 1000)
      
      return () => clearInterval(interval)
    }
  }, [type, carouselItems, carouselRotationSpeed, isCarouselPaused])

  if (!isVisible) return null

  // Get current content based on type
  const getCurrentContent = () => {
    if (type === 'carousel' && carouselItems && carouselItems.length > 0) {
      const currentItem = carouselItems[currentCarouselIndex] || carouselItems[0]
      return {
        title: currentItem.title || '',
        message: currentItem.message || '',
        titleUrl: currentItem.titleUrl,
        messageUrl: currentItem.messageUrl
      }
    }
    return { title, message, titleUrl, messageUrl }
  }

  const currentContent = getCurrentContent()

  const borderStyles = {
    solid: 'solid',
    dashed: 'dashed',
    dotted: 'dotted'
  }

  const iconStyle = {
    width: '16px',
    height: '16px',
    display: 'inline-block'
  }

  const iconComponents = {
    None: X,
    AlertTriangle,
    AlertCircle,
    Info,
    CheckCircle,
    Clock,
    ShoppingCart,
    Lightbulb,
    Sparkles,
    BellRing,
    MessageCircle,
    Megaphone,
    Flame,
    Package,
    FlaskConical,
  }

  const createIconElement = (icon: string) => {
    if (!icon || icon === 'none') {
      return null
    }
    
    // Map icon key to component name using ICONS mapping
    const componentName = ICONS[icon as keyof typeof ICONS]
    const IconComponent = componentName ? iconComponents[componentName as keyof typeof iconComponents] : null
    
    if (IconComponent) {
      return <IconComponent style={iconStyle} />
    }
    
    // Default fallback for custom text/emojis
    return <span style={iconStyle}>{icon}</span>
  }

  // Render content based on type
  const renderContent = () => {
    const baseContentStyle = {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '8px',
      color: textColor,
      fontFamily: fontFamily,
      fontSize: `${fontSize}px`,
      height: `${barHeight}px`,
      width: '100%',
    }
    
    const contentPadding = {
      paddingLeft: showLeftIcon ? '40px' : '16px',
      paddingRight: (showRightIcon || showCloseButton) ? '40px' : '16px',
    }

    if (type === 'marquee') {
      // For marquee, return null here - we'll handle it in the main container
      return null
    }

    // Single content - title above message
    if (type === 'single') {
      // Map text alignment to flex alignment
      const getFlexAlignment = () => {
        switch (textAlignment) {
          case 'left': return 'flex-start'
          case 'right': return 'flex-end'
          case 'center': return 'center'
          default: return 'center'
        }
      }

      return (
        <div style={{
          ...baseContentStyle,
          ...contentPadding,
          flexDirection: 'column',
          gap: '4px',
          justifyContent: 'center',
          alignItems: getFlexAlignment(),
          fontSize: 'inherit' // Remove fontSize from container
        }}>
          {currentContent.title && (
            <div style={{ 
              textAlign: textAlignment,
              fontSize: `${titleFontSize}px`,
              fontFamily: fontFamily,
              color: textColor,
              width: '100%'
            }}>
              {currentContent.titleUrl ? (
                <a 
                  href={currentContent.titleUrl} 
                  style={{ color: linkColor, textDecoration: 'none' }}
                  dangerouslySetInnerHTML={{ __html: currentContent.title }}
                />
              ) : (
                <span dangerouslySetInnerHTML={{ __html: currentContent.title }} />
              )}
            </div>
          )}
          {currentContent.message && (
            <div style={{ 
              textAlign: textAlignment,
              fontSize: `${messageFontSize}px`,
              fontFamily: fontFamily,
              color: textColor,
              width: '100%'
            }}>
              {currentContent.messageUrl ? (
                <a 
                  href={currentContent.messageUrl} 
                  style={{ color: linkColor, textDecoration: 'none' }}
                  dangerouslySetInnerHTML={{ __html: currentContent.message }}
                />
              ) : (
                <span dangerouslySetInnerHTML={{ __html: currentContent.message }} />
              )}
            </div>
          )}
        </div>
      )
    }

    // Carousel content - sliding animation (one item at a time)
    if (type === 'carousel' && carouselItems && carouselItems.length > 0) {
      // Get carousel pause on hover setting
      const carouselPauseOnHover = pauseOnHover // This comes from typeSettings.carousel_pause_on_hover
      
      return (
        <div 
          style={{
            ...baseContentStyle,
            padding: 0,
            overflow: 'hidden'
          }}
          onMouseEnter={() => carouselPauseOnHover && setIsCarouselPaused(true)}
          onMouseLeave={() => carouselPauseOnHover && setIsCarouselPaused(false)}
        >
          <div
            style={{
              display: 'flex',
              width: `${carouselItems.length * 100}%`,
              transform: `translateX(-${currentCarouselIndex * 100}%)`,
              transition: 'transform 0.5s ease-in-out',
              height: '100%'
            }}
          >
            {carouselItems.map((item, index) => (
              <div
                key={index}
                style={{
                  width: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '4px',
                  paddingLeft: showLeftIcon ? '40px' : '16px',
                  paddingRight: (showRightIcon || showCloseButton) ? '40px' : '16px',
                  color: textColor,
                  fontFamily: fontFamily,
                  flexShrink: 0
                }}
              >
                {item.title && (
                  <div style={{ 
                    textAlign: 'center',
                    fontSize: `${titleFontSize}px`,
                    fontFamily: fontFamily,
                    color: textColor,
                    width: '100%'
                  }}>
                    {item.titleUrl ? (
                      <a 
                        href={item.titleUrl} 
                        style={{ color: linkColor, textDecoration: 'none' }}
                        dangerouslySetInnerHTML={{ __html: item.title }}
                      />
                    ) : (
                      <span dangerouslySetInnerHTML={{ __html: item.title }} />
                    )}
                  </div>
                )}
                {item.message && (
                  <div style={{ 
                    textAlign: 'center',
                    fontSize: `${messageFontSize}px`,
                    fontFamily: fontFamily,
                    color: textColor,
                    width: '100%'
                  }}>
                    {item.messageUrl ? (
                      <a 
                        href={item.messageUrl} 
                        style={{ color: linkColor, textDecoration: 'none' }}
                        dangerouslySetInnerHTML={{ __html: item.message }}
                      />
                    ) : (
                      <span dangerouslySetInnerHTML={{ __html: item.message }} />
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )
    }

    // Fallback for single/other content
    return (
      <div style={{...baseContentStyle, ...contentPadding}}>
        {currentContent.title && (
          <span>
            {currentContent.titleUrl ? (
              <a 
                href={currentContent.titleUrl} 
                style={{ color: linkColor, textDecoration: 'none' }}
                dangerouslySetInnerHTML={{ __html: currentContent.title }}
              />
            ) : (
              <span dangerouslySetInnerHTML={{ __html: currentContent.title }} />
            )}
          </span>
        )}
        {currentContent.title && currentContent.message && showDivider && (
          <span style={{ color: dividerColor }}>|</span>
        )}
        {currentContent.message && (
          <span>
            {currentContent.messageUrl ? (
              <a 
                href={currentContent.messageUrl} 
                style={{ color: linkColor, textDecoration: 'none' }}
                dangerouslySetInnerHTML={{ __html: currentContent.message }}
              />
            ) : (
              <span dangerouslySetInnerHTML={{ __html: currentContent.message }} />
            )}
          </span>
        )}
      </div>
    )
  }

  return (
    <>
      <style jsx global>{`
        @keyframes marquee-left-to-right {
          0% { transform: translateX(-5vw); }
          100% { transform: translateX(5vw); }
        }
        @keyframes marquee-right-to-left {
          0% { transform: translateX(5vw); }
          100% { transform: translateX(-5vw); }
        }
        .animate-marquee.pausable:hover {
          animation-play-state: paused !important;
        }
      `}</style>
      
      <div className="sticky top-4 z-10 mb-6">
        <h3 className="font-medium text-gray-900 mb-3 text-center">Live Preview</h3>
          <div 
            className="relative w-full overflow-hidden"
            style={{
              background: getBackgroundStyle(),
              borderColor,
              borderStyle: borderStyles[borderStyle as keyof typeof borderStyles],
              borderWidth: `${borderWidth}px`,
              height: `${barHeight}px`,
            }}
          >
            {/* Left Icon */}
            {showLeftIcon && leftIcon && (
              <div 
                className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10"
                style={{ color: textColor }}
              >
                {createIconElement(leftIcon)}
              </div>
            )}

            {/* Right Icon */}
            {showRightIcon && rightIcon && (
              <div 
                className="absolute right-4 top-1/2 transform -translate-y-1/2 z-10"
                style={{ color: textColor }}
              >
                {createIconElement(rightIcon)}
              </div>
            )}

            {/* Close Button */}
            {showCloseButton && (
              <button
                onClick={() => setIsVisible(false)}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 z-10 hover:opacity-70"
                style={{ color: textColor }}
              >
                <XMarkIcon className="w-4 h-4" />
              </button>
            )}

          {/* Marquee Content */}
            {type === 'marquee' && (
              <div className="absolute inset-0 overflow-hidden flex items-center">
                <div
                  className={`animate-marquee ${pauseOnHover ? 'pausable' : ''}`}
                  style={{
                    display: 'flex',
                    whiteSpace: 'nowrap',
                    animation: `${marqueeDirection === 'left' ? 'marquee-left-to-right' : 'marquee-right-to-left'} ${marqueeSpeed === 1 ? 30 : marqueeSpeed === 2 ? 20 : 15}s linear infinite`,
                    width: 'max-content'
                  }}
                >
                  {/* Content with spacing */}
                  <div 
                    className="flex items-center gap-2"
                    style={{
                      paddingRight: '10px',
                      color: textColor,
                      fontFamily: fontFamily,
                      height: `${barHeight}px`
                    }}
                  >
                    {getCurrentContent().title && (
                      <span style={{ fontSize: `${titleFontSize}px`, fontWeight: '600' }}>
                        {getCurrentContent().titleUrl ? (
                          <a 
                            href={getCurrentContent().titleUrl} 
                            style={{ color: linkColor, textDecoration: 'none' }}
                            dangerouslySetInnerHTML={{ __html: getCurrentContent().title }}
                          />
                        ) : (
                          <span dangerouslySetInnerHTML={{ __html: getCurrentContent().title }} />
                        )}
                      </span>
                    )}
                    {getCurrentContent().title && getCurrentContent().message && showDivider && (
                      <span style={{ color: dividerColor }}>|</span>
                    )}
                    {getCurrentContent().message && (
                      <span style={{ fontSize: `${messageFontSize}px`, opacity: '0.9' }}>
                        {getCurrentContent().messageUrl ? (
                          <a 
                            href={getCurrentContent().messageUrl} 
                            style={{ color: linkColor, textDecoration: 'none' }}
                            dangerouslySetInnerHTML={{ __html: getCurrentContent().message }}
                          />
                        ) : (
                          <span dangerouslySetInnerHTML={{ __html: getCurrentContent().message }} />
                        )}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Main Content */}
            {renderContent()}

            {/* Action Button */}
            {showButton && buttonText && (
              <div className="px-4 py-2 border-t" style={{ borderColor: dividerColor }}>
                <button
                  style={{
                    backgroundColor: buttonColor,
                    color: buttonTextColor,
                    fontFamily: fontFamily,
                    fontSize: `${fontSize - 2}px`
                  }}
                  className="px-4 py-2 rounded hover:opacity-90 transition-opacity"
                >
                  {buttonText}
                </button>
              </div>
            )}
        </div>
      </div>
    </>
  )
})

export default LivePreview 