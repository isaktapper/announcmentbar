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
  FlaskConical,
  Globe,
  File,
  PanelLeftOpen
} from 'lucide-react'
import { ICONS } from '@/types/announcement'
import { AnnouncementFormData, CTABorderRadius, CTASize } from '@/types/announcement'

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
  formData: AnnouncementFormData
}

const getSizeClasses = (size: CTASize = 'md') => {
  switch (size) {
    case 'sm':
      return 'px-3 py-1.5 text-sm'
    case 'lg':
      return 'px-6 py-3 text-lg'
    default:
      return 'px-4 py-2'
  }
}

const getBorderRadiusClasses = (radius: CTABorderRadius = 'md') => {
  switch (radius) {
    case 'none':
      return ''
    case 'sm':
      return 'rounded'
    case 'md':
      return 'rounded-md'
    case 'lg':
      return 'rounded-lg'
    case 'pill':
      return 'rounded-full'
  }
}

export default function LivePreview({ formData }: LivePreviewProps) {
  const {
    title,
    message,
    icon,
    background,
    backgroundGradient,
    useGradient,
    textColor,
    textAlignment,
    iconAlignment,
    barHeight,
    fontFamily,
    ctaText,
    ctaUrl,
    ctaTextColor,
    ctaBgColor,
    ctaBorderRadius,
    ctaSize,
  } = formData

  const getIcon = () => {
    switch (icon) {
      case 'globe':
        return <Globe className="w-5 h-5" />
      case 'file':
        return <File className="w-5 h-5" />
      case 'window':
        return <PanelLeftOpen className="w-5 h-5" />
      default:
        return null
    }
  }

  const getBackgroundStyle = () => {
    if (useGradient && backgroundGradient) {
      return {
        background: `linear-gradient(90deg, ${background} 0%, ${backgroundGradient} 100%)`,
      }
    }
    return { background }
  }

  const getTextAlignmentClass = () => {
    switch (textAlignment) {
      case 'left':
        return 'text-left'
      case 'right':
        return 'text-right'
      default:
        return 'text-center'
    }
  }

  return (
    <div
      className="w-full relative"
      style={{
        ...getBackgroundStyle(),
        height: barHeight,
        fontFamily,
      }}
    >
      <div
        className={`h-full flex items-center gap-4 px-4 ${getTextAlignmentClass()}`}
        style={{ color: textColor }}
      >
        {/* Icon */}
        {icon !== 'none' && iconAlignment === 'left' && (
          <div className="flex-shrink-0">{getIcon()}</div>
        )}

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-4 justify-center">
            {/* Title */}
            <div
              className="font-medium"
              style={{ fontSize: formData.titleFontSize }}
              dangerouslySetInnerHTML={{ __html: title }}
            />

            {/* Message */}
            {message && (
              <div
                style={{ fontSize: formData.messageFontSize }}
                dangerouslySetInnerHTML={{ __html: message }}
              />
            )}

            {/* CTA Button */}
            {ctaText && ctaUrl && (
              <a
                href={ctaUrl}
                className={`inline-flex items-center justify-center font-medium transition-colors ${getSizeClasses(
                  ctaSize
                )} ${getBorderRadiusClasses(ctaBorderRadius)}`}
                style={{
                  backgroundColor: ctaBgColor,
                  color: ctaTextColor,
                }}
                onClick={(e) => e.preventDefault()}
              >
                {ctaText}
              </a>
            )}
          </div>
        </div>

        {/* Icon */}
        {icon !== 'none' && iconAlignment === 'right' && (
          <div className="flex-shrink-0">{getIcon()}</div>
        )}
      </div>
    </div>
  )
} 