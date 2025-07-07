import React from 'react'

export const ScribbleUnderline = ({ className = "" }: { className?: string }) => (
  <svg 
    className={`absolute ${className}`} 
    viewBox="0 0 120 8" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg"
  >
    <path 
      d="M2 4C20 2 40 6 60 3C80 1 100 5 118 4" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round"
      opacity="0.6"
    />
  </svg>
)

export const ScribbleArrow = ({ className = "" }: { className?: string }) => (
  <svg 
    className={`absolute ${className}`} 
    viewBox="0 0 24 24" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg"
  >
    <path 
      d="M3 12C3 12 5 10 8 12C11 14 13 10 16 12C19 14 21 12 21 12" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round"
      opacity="0.4"
    />
    <path 
      d="M18 9L21 12L18 15" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round"
      opacity="0.4"
    />
  </svg>
)

export const ScribbleStar = ({ className = "" }: { className?: string }) => (
  <svg 
    className={`absolute ${className}`} 
    viewBox="0 0 16 16" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg"
  >
    <path 
      d="M8 1L8.5 6.5L14 7L8.5 7.5L8 13L7.5 7.5L2 7L7.5 6.5L8 1Z" 
      stroke="currentColor" 
      strokeWidth="1.5" 
      strokeLinecap="round" 
      strokeLinejoin="round"
      opacity="0.5"
    />
  </svg>
)

export const ScribbleCircle = ({ className = "" }: { className?: string }) => (
  <svg 
    className={`absolute ${className}`} 
    viewBox="0 0 20 20" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg"
  >
    <path 
      d="M2 10C2 6 4 2 10 2C16 2 18 6 18 10C18 14 16 18 10 18C4 18 2 14 2 10Z" 
      stroke="currentColor" 
      strokeWidth="1.5" 
      strokeLinecap="round"
      opacity="0.3"
    />
  </svg>
)

export const ScribbleHeart = ({ className = "" }: { className?: string }) => (
  <svg 
    className={`absolute ${className}`} 
    viewBox="0 0 20 18" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg"
  >
    <path 
      d="M10 16C10 16 2 10 2 6C2 4 4 2 6 2C8 2 10 4 10 6C10 4 12 2 14 2C16 2 18 4 18 6C18 10 10 16 10 16Z" 
      stroke="currentColor" 
      strokeWidth="1.5" 
      strokeLinecap="round" 
      strokeLinejoin="round"
      opacity="0.4"
    />
  </svg>
)

export const ScribbleWave = ({ className = "" }: { className?: string }) => (
  <svg 
    className={`absolute ${className}`} 
    viewBox="0 0 40 8" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg"
  >
    <path 
      d="M2 4C8 2 12 6 16 4C20 2 24 6 28 4C32 2 36 6 38 4" 
      stroke="currentColor" 
      strokeWidth="1.5" 
      strokeLinecap="round"
      opacity="0.3"
    />
  </svg>
) 