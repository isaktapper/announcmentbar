import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Custom yellow brand palette
        brand: {
          50: '#FFFFC5',  // Primary brand color - very light yellow
          100: '#FFF7A0', // Slightly darker for gradients
          200: '#F7F089', // Hover/active state
          300: '#F0E968', // Darker hover
          400: '#E8E147', // Even darker
          500: '#E0DA26', // Medium yellow
          600: '#D8D305', // Darker yellow
          700: '#B8B304', // Dark yellow
          800: '#989303', // Very dark yellow
          900: '#787302', // Darkest yellow
        },
        // Override Tailwind's default colors to use our brand
        primary: {
          50: '#FFFFC5',
          100: '#FFF7A0',
          200: '#F7F089',
          300: '#F0E968',
          400: '#E8E147',
          500: '#E0DA26',
          600: '#D8D305',
          700: '#B8B304',
          800: '#989303',
          900: '#787302',
        }
      },
      backgroundImage: {
        'brand-gradient': 'linear-gradient(135deg, #FFFFC5, #FFF7A0)',
        'brand-gradient-alt': 'linear-gradient(135deg, #FFFFC5, #FFF5A2, #FFF0A0)',
      }
    },
  },
  plugins: [],
}
export default config 