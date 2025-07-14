'use client'

import React, { useState, useEffect, useRef } from 'react'
import { CarouselItem } from '@/types/announcement'
import { 
  InformationCircleIcon,
  XMarkIcon 
} from '@heroicons/react/24/outline'

import * as LucideIcons from 'lucide-react'
import { ICONS } from '@/types/announcement'

export interface LivePreviewProps {
  type: 'single' | 'carousel' | 'marquee'
  title?: string
  message: string
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
  leftIcon?: string
  rightIcon?: string
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
  cta_enabled: boolean
  cta_text: string
  cta_url: string
  cta_background_color: string
  cta_text_color: string
  iconAlignment: 'left' | 'right'
}

export default function LivePreview({
  type,
  title,
  message,
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
  barHeight,
  cta_enabled,
  cta_text,
  cta_url,
  cta_background_color,
  cta_text_color,
  iconAlignment
}: LivePreviewProps) {
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0)
  const [isPaused, setIsPaused] = useState(false)
  const rotationInterval = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    // Adjust index if slides removed
    if (type === 'carousel' && currentSlideIndex >= carouselItems.length) {
      setCurrentSlideIndex(Math.max(0, carouselItems.length - 1))
    }
  }, [carouselItems.length, type])

  // Handle carousel rotation
  useEffect(() => {
    if (type === 'carousel' && carouselItems.length > 1 && !isPaused) {
      rotationInterval.current = setInterval(() => {
        setCurrentSlideIndex(prev => (prev + 1) % carouselItems.length)
      }, carouselRotationSpeed * 1000)

      return () => {
        if (rotationInterval.current) {
          clearInterval(rotationInterval.current)
        }
      }
    }
  }, [type, carouselItems.length, carouselRotationSpeed, isPaused])

  // Dynamically load Google Font for preview
  useEffect(() => {
    if (!fontFamily) return;
    const fontId = 'google-font-' + fontFamily.replace(/\s|\+/g, '-').toLowerCase();
    if (!document.getElementById(fontId)) {
      const link = document.createElement('link');
      link.id = fontId;
      link.rel = 'stylesheet';
      link.href = `https://fonts.googleapis.com/css2?family=${fontFamily.replace(/ /g, '+')}:wght@400;500;600&display=swap`;
      document.head.appendChild(link);
    }
  }, [fontFamily]);

  // Get current slide content
  const getCurrentContent = () => {
    if (type === 'carousel' && carouselItems.length > 0) {
      // Ensure currentSlideIndex is within bounds
      const safeIndex = Math.min(currentSlideIndex, carouselItems.length - 1)
      const currentSlide = carouselItems[safeIndex]
      return {
        title: currentSlide.title,
        message: currentSlide.message,
        backgroundColor: currentSlide.background || backgroundColor,
        backgroundGradient: currentSlide.backgroundGradient || backgroundGradient,
        useGradient: currentSlide.useGradient ?? useGradient,
        textColor: currentSlide.textColor || textColor,
        fontFamily: currentSlide.fontFamily || fontFamily,
        textAlignment: currentSlide.textAlignment || textAlignment,
        icon: currentSlide.icon || 'none',
        iconAlignment: currentSlide.iconAlignment || iconAlignment,
        cta_enabled: currentSlide.cta_enabled,
        cta_text: currentSlide.cta_text,
        cta_url: currentSlide.cta_url,
        cta_background_color: currentSlide.cta_background_color,
        cta_text_color: currentSlide.cta_text_color,
        titleFontSize: currentSlide.titleFontSize,
        messageFontSize: currentSlide.messageFontSize,
      }
    }
    return {
      title,
      message,
      backgroundColor,
      backgroundGradient,
      useGradient,
      textColor,
      fontFamily,
      textAlignment,
      icon: leftIcon || rightIcon || 'none',
      iconAlignment,
      cta_enabled,
      cta_text,
      cta_url,
      cta_background_color,
      cta_text_color,
      titleFontSize,
      messageFontSize,
    }
  }

  const content = getCurrentContent()

  // CTA properties derived from content (slide) or fallback to props
  const activeCtaEnabled = type === 'carousel' ? content.cta_enabled : cta_enabled
  const activeCtaText = type === 'carousel' ? content.cta_text : cta_text
  const activeCtaUrl = type === 'carousel' ? content.cta_url : cta_url
  const activeCtaBg = type === 'carousel' ? content.cta_background_color : cta_background_color
  const activeCtaTextColor = type === 'carousel' ? content.cta_text_color : cta_text_color

  // Determine icon visibility dynamically based on the current content
  const displayLeftIcon = content.icon !== 'none' && content.iconAlignment === 'left'
  const displayRightIcon = content.icon !== 'none' && content.iconAlignment === 'right'

  const getIcon = (iconName: string | undefined | null): React.ReactElement | null => {
    if (!iconName || iconName === 'none') return null;

    // Use mapping defined in types to resolve Lucide component name
    const componentName = ICONS[iconName as keyof typeof ICONS]
    // Dynamically retrieve the Lucide component
    const LucideComponent = (LucideIcons as any)[componentName]

    if (LucideComponent) {
      return <LucideComponent className="w-5 h-5" />
    }

    // Fallback to Heroicons info icon if something goes wrong
    return <InformationCircleIcon className="w-5 h-5" />
  }

  const buttonHeight = Math.max(barHeight - 16, 24);
  const buttonFontSize = Math.max(14, Math.min(buttonHeight * 0.45, 28));

  return (
    <div
      className="relative w-full overflow-hidden"
      onMouseEnter={() => pauseOnHover && setIsPaused(true)}
      onMouseLeave={() => pauseOnHover && setIsPaused(false)}
      style={{
        height: `${barHeight}px`,
        background: content.useGradient 
          ? `linear-gradient(to right, ${content.backgroundColor}, ${content.backgroundGradient})` 
          : content.backgroundColor,
        color: content.textColor,
        fontFamily: content.fontFamily,
        transition: 'all 0.3s ease-in-out'
      }}
    >
      <div className="h-full flex items-center px-4 sm:px-6 w-full">
        {/* Dynamic grouping for icon / text / CTA (animated) */}
        <div
          key={currentSlideIndex}
          className={`slide-in-right flex items-center gap-3 flex-1 w-full ${
            content.textAlignment === 'center'
              ? 'justify-center'
              : content.textAlignment === 'right'
              ? 'justify-end'
              : 'justify-start'
          }`}
          style={{ height: '100%' }}
        >
          {/* Left icon (if any) */}
          {displayLeftIcon && (
            <div className="flex-shrink-0" style={{ color: content.textColor }}>
              {getIcon(content.icon)}
            </div>
          )}

          {/* CTA before text when right-aligned */}
          {content.textAlignment === 'right' && activeCtaEnabled && activeCtaText && activeCtaUrl && (
            <a
              href={activeCtaUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium transition-colors inline-flex items-center justify-center text-sm"
              style={{ 
                backgroundColor: activeCtaBg, 
                color: activeCtaTextColor,
                borderRadius: '4px',
                padding: '8px 16px',
                whiteSpace: 'nowrap',
                textDecoration: 'none',
                marginLeft: '16px',
              }}
            >
              {activeCtaText}
            </a>
          )}

          {/* Text block */}
          <div
            className={`min-w-0 ${
              content.textAlignment === 'center'
                ? 'text-center'
                : content.textAlignment === 'right'
                ? 'text-right'
                : 'text-left'
            }`}
            style={{ height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}
          >
            {content.title && (
              <div
                className="mb-0.5"
                style={{ fontSize: `${content.titleFontSize || titleFontSize}px` }}
                dangerouslySetInnerHTML={{ __html: content.title }}
              />
            )}
            <div
              style={{ fontSize: `${content.messageFontSize || messageFontSize}px` }}
              dangerouslySetInnerHTML={{ __html: content.message }}
            />
          </div>

          {/* CTA after text when left/center aligned */}
          {content.textAlignment !== 'right' && activeCtaEnabled && activeCtaText && activeCtaUrl && (
            <a
              href={activeCtaUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium transition-colors inline-flex items-center justify-center text-sm"
              style={{ 
                backgroundColor: activeCtaBg, 
                color: activeCtaTextColor,
                borderRadius: '4px',
                padding: '8px 16px',
                whiteSpace: 'nowrap',
                textDecoration: 'none',
                marginLeft: '16px',
              }}
            >
              {activeCtaText}
            </a>
          )}

          {/* Right icon (if any) */}
          {displayRightIcon && (
            <div className="flex-shrink-0" style={{ color: content.textColor }}>
              {getIcon(content.icon)}
            </div>
          )}
        </div>

        {/* Close button always at far right (static) */}
        {showCloseButton && (
          <button className="p-1 ml-4 rounded-lg hover:bg-black/5 transition-colors">
            <XMarkIcon className="w-5 h-5" style={{ color: content.textColor }} />
          </button>
        )}
      </div>

      {/* Removed progress indicators per user request */}
    </div>
  )
} 