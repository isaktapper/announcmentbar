import { createClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'
import { BorderRadiusStyle } from '@/types/announcement'

// Icon mapping for the JavaScript output
const ICON_SVG_MAP = {
  warning: `<svg class="announcement-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><path d="M12 9v4"/><path d="m12 17 .01 0"/></svg>`,
  alert: `<svg class="announcement-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 8v4"/><path d="m12 16 .01 0"/></svg>`,
  info: `<svg class="announcement-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="m12 8 .01 0"/></svg>`,
  success: `<svg class="announcement-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"/><path d="m9 12 2 2 4-4"/></svg>`,
  schedule: `<svg class="announcement-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12,6 12,12 16,14"/></svg>`,
  // Premium icons
  shopping: `<svg class="announcement-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="8" cy="21" r="1"/><circle cx="19" cy="21" r="1"/><path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"/></svg>`,
  lightbulb: `<svg class="announcement-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 12 2v0a6 6 0 0 0-6 6c0 1.3.5 2.6 1.5 3.5.8.8 1.3 1.5 1.5 2.5"/><path d="M9 18h6"/><path d="M10 22h4"/></svg>`,
  sparkles: `<svg class="announcement-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.582a.5.5 0 0 1 0 .962L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z"/><path d="M20 3v4"/><path d="M22 5h-4"/><path d="M4 17v2"/><path d="M5 18H3"/></svg>`,
  bell: `<svg class="announcement-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/><path d="M4 2C2.8 3.7 2 5.7 2 8"/><path d="M22 8c0-2.3-.8-4.3-2-6"/></svg>`,
  message: `<svg class="announcement-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z"/></svg>`,
  megaphone: `<svg class="announcement-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 11v3a1 1 0 0 0 1 1h3l3 3V7l-3 3H4a1 1 0 0 0-1 1Z"/><path d="M21 6v12a2 2 0 0 1-2 2H7"/><path d="M11 19v-8l6-6v12l-6-6Z"/></svg>`,
  flame: `<svg class="announcement-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"/></svg>`,
  package: `<svg class="announcement-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><path d="M12 2v8l8 4-8-4-8 4 8-4z"/></svg>`,
  flask: `<svg class="announcement-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 2v6l-4 8a2 2 0 0 0 2 3h10a2 2 0 0 0 2-3l-4-8V2"/><path d="M12 2v6"/><path d="M12 16l.01 0"/></svg>`,
}

// Add page targeting check
const pageTargetingScript = `
  // Check if announcement has page targeting
  if (announcement.page_paths?.length && !announcement.page_paths.some((path) => window.location.pathname.includes(path))) {
    return;
  }
`

const getBorderRadiusValue = (style: BorderRadiusStyle): string => {
  switch (style) {
    case 'sharp':
      return '0px'
    case 'soft':
      return '6px'
    case 'pill':
      return '9999px'
    default:
      return '6px' // Default to soft
  }
}

const getButtonSizeClasses = (size: 'small' | 'medium' | 'large') => {
  switch (size) {
    case 'small':
      return 'text-xs px-2.5 py-1.5'
    case 'medium':
      return 'text-sm px-3.5 py-2'
    case 'large':
      return 'text-base px-4 py-2.5'
    default:
      return 'text-sm px-3.5 py-2'
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  // Allow both /embed/mySlug and /embed/mySlug.js so existing embed tags continue to work
  const rawSlug = params.slug || '';
  const slug = rawSlug.replace(/\.js$/i, '');

  console.log("🔍 Received embed request for slug:", rawSlug, "→ sanitized:", slug);
  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )

    const { data: announcement, error } = await supabase
      .from('announcements')
      .select('*')
      .eq('slug', slug)
      .eq('visibility', true)
      .single()

    console.log("📦 Supabase result:", { announcement, error });

    if (!announcement) {
      console.log('No announcement found for slug:', params.slug);
      return new NextResponse('Not found', { status: 404 })
    }

    const {
      title,
      message,
      icon,
      background,
      backgroundGradient,
      useGradient,
      textColor,
      visibility,
      isSticky,
      titleFontSize,
      messageFontSize,
      textAlignment,
      iconAlignment,
      isClosable,
      type,
      typeSettings,
      barHeight,
      carouselItems,
      fontFamily,
      cta_enabled,
      cta_text,
      cta_url,
      cta_size,
      cta_border_radius,
      cta_background_color,
      cta_text_color
    } = announcement

    const renderCTAButton = () => {
      if (!cta_enabled || !cta_text) return ''

      const buttonClasses = `
        ${getButtonSizeClasses(cta_size)}
        inline-flex items-center justify-center
        transition-colors duration-200
        hover:opacity-90
      `.trim();

      return `
        <a 
          href="${cta_url}"
          target="_blank"
          rel="noopener noreferrer"
          class="${buttonClasses}"
          style="
            background-color: ${cta_background_color};
            color: ${cta_text_color};
            border-radius: ${getBorderRadiusValue(cta_border_radius as BorderRadiusStyle)};
          "
        >
          ${cta_text}
        </a>
      `
    }

    // Check geo targeting if enabled
    if (announcement.geo_countries && announcement.geo_countries.length > 0) {
      try {
        // Get visitor's IP address
        const ip = request.headers.get('x-forwarded-for')?.split(',')[0] || 
                  request.headers.get('x-real-ip') ||
                  '127.0.0.1'

        // Skip geo check for localhost/development
        if (ip === '127.0.0.1' || ip === 'localhost') {
          console.log('Skipping geo check for localhost')
        } else {
          // Call ipapi.co for geolocation
          const geoResponse = await fetch(`https://ipapi.co/${ip}/json/`)
          const geoData = await geoResponse.json()

          // If country doesn't match, return empty script
          if (!announcement.geo_countries.includes(geoData.country_code)) {
            const emptyScript = `
              // Announcement not available in your region
              console.log('Announcement not available in your region');
            `
            return new NextResponse(emptyScript, {
              headers: {
                'Content-Type': 'text/javascript',
                'Cache-Control': 'public, max-age=60',
              },
            })
          }
        }
      } catch (geoError) {
        console.error('Error checking geolocation:', geoError)
        // On geo service error, show the announcement (fail open)
      }
    }

    // Generate the background style
    const backgroundStyle = announcement.background_gradient
      ? `background: linear-gradient(135deg, ${announcement.background}, ${announcement.background_gradient});`
      : `background: ${announcement.background};`

    // Get icon SVG if available
  
    const iconSvg = announcement.icon && announcement.icon !== 'none' 
      ? ICON_SVG_MAP[announcement.icon as keyof typeof ICON_SVG_MAP] || ''
      : ''

    // Prepare announcement data for the embed script so that title / message are always present
    const serializedAnnouncement = {
      ...announcement,
      // Normalized / camelCase duplicates for the embed script
      title: (announcement as any).title ?? (announcement.content?.title ?? ''),
      message: (announcement as any).message ?? (announcement.content?.message ?? ''),
      backgroundGradient: announcement.background_gradient,
      useGradient: announcement.use_gradient,
      textColor: announcement.text_color,
      fontFamily: announcement.font_family,
      isSticky: announcement.is_sticky,
      isClosable: announcement.is_closable,
      barHeight: announcement.bar_height,
      iconAlignment: announcement.icon_alignment,
      carouselItems:
        (announcement as any).carouselItems ?? (announcement as any).carousel_items ?? (announcement.content?.items ?? []),
      iconSvg: iconSvg,
    }

    const jsCode = `
(function() {
  const announcement = ${JSON.stringify(serializedAnnouncement)};
  const iconSvg = announcement.iconSvg;
  const slug = "${slug}";
  
  ${pageTargetingScript}

  // Check if announcement bar already exists
  if (document.getElementById('announcement-bar-' + slug)) {
    return;
  }

  // Font configuration
  const fontFamily = '${announcement.font_family || 'Work Sans'}';
  const googleFonts = {
    'Work Sans': { cssName: 'Work Sans', weights: '400;500;600', fallback: 'sans-serif' },
    'Inter': { cssName: 'Inter', weights: '400;500;600', fallback: 'sans-serif' },
    'Roboto': { cssName: 'Roboto', weights: '400;500;600', fallback: 'sans-serif' },
    'Open Sans': { cssName: 'Open Sans', weights: '400;500;600', fallback: 'sans-serif' },
    'Poppins': { cssName: 'Poppins', weights: '400;500;600', fallback: 'sans-serif' },
    'Lato': { cssName: 'Lato', weights: '400;500;600', fallback: 'sans-serif' },
    'DM Sans': { cssName: 'DM+Sans', weights: '400;500;600', fallback: 'sans-serif' },
    'Nunito': { cssName: 'Nunito', weights: '400;500;600', fallback: 'sans-serif' },
    'IBM Plex Sans': { cssName: 'IBM+Plex+Sans', weights: '400;500;600', fallback: 'sans-serif' },
    'Space Grotesk': { cssName: 'Space+Grotesk', weights: '400;500;600', fallback: 'sans-serif' }
  };

  // Load Google Font if needed
  function loadGoogleFont(fontName) {
    const fontId = 'google-font-' + fontName.replace(/\\s+/g, '-').toLowerCase();
    
    // Check if font is already loaded
    if (document.getElementById(fontId)) {
      return;
    }
    
    const fontConfig = googleFonts[fontName];
    if (fontConfig) {
      const link = document.createElement('link');
      link.id = fontId;
      link.rel = 'stylesheet';
      link.href = \`https://fonts.googleapis.com/css2?family=\${fontConfig.cssName}:wght@\${fontConfig.weights}&display=swap\`
      document.head.appendChild(link);
    }
  }

  // Load the selected font
  if (fontFamily && googleFonts[fontFamily]) {
    loadGoogleFont(fontFamily);
  }

  // Get font CSS with fallback
  function getFontFamily(fontName) {
    const fontConfig = googleFonts[fontName];
    if (fontConfig) {
      return \`"\${fontConfig.cssName}", \${fontConfig.fallback}\`;
    }
    return '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
  }

  // Generate the announcement HTML
  function generateAnnouncementHTML(announcement) {
    const {
      title,
      message,
      background,
      backgroundGradient,
      useGradient,
      textColor,
      textAlignment,
      icon,
      iconAlignment,
      isClosable,
      type,
      typeSettings,
      barHeight,
      carouselItems,
      fontFamily,
      titleFontSize,
      messageFontSize,
      cta_enabled,
      cta_text,
      cta_url,
      cta_size,
      cta_rounded,
      cta_background_color,
      cta_text_color,
      cta_border_radius
    } = announcement;

    function getContentClasses() {
      const baseClasses = 'flex items-center';
      const alignmentClasses = {
        left: 'justify-start',
        center: 'justify-center',
        right: 'justify-end'
      };
      return \`\${baseClasses} \${alignmentClasses[textAlignment]}\`;
    }

    function getContentWrapperClasses() {
      const baseClasses = 'flex';
      const directionClasses = textAlignment === 'left' ? 'flex-row items-center gap-2' : 'flex-col items-center gap-1';
      return \`\${baseClasses} \${directionClasses}\`;
    }

    function renderCTAButton(announcement) {
      if (!announcement.cta_enabled || !announcement.cta_text) return ''

      const buttonClasses = \`
        ${getButtonSizeClasses(announcement.cta_size)}
        inline-flex items-center justify-center
        transition-colors duration-200
        hover:opacity-90
        focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-500
      \`.trim();

      return \`
        <button 
          class="\${buttonClasses}"
          style="
            background-color: \${announcement.cta_background_color};
            color: \${announcement.cta_text_color};
            border-radius: \${getBorderRadiusValue(announcement.cta_border_radius)};
          "
        >
          \${announcement.cta_text}
        </button>
      \`
    }

    function renderIcon() {
      if (!iconSvg) return '';
      return '<span class="announcement-inline-icon" style="display:inline-flex;align-items:center;">' + iconSvg + '</span>';
    }

    function renderContent() {
      if (type === 'carousel' && carouselItems?.length > 0) {
        const carouselContent = carouselItems.map((item, index) => \`
          <div 
            class="announcement-carousel-item" 
            data-index="\${index}"
            style="
              position: absolute;
              top: 0;
              left: 0;
              width: 100%;
              transition: transform 0.4s ease-in-out, opacity 0.4s ease-in-out;
              transform: translateX(\${index === 0 ? '0' : '100%'});
              opacity: \${index === 0 ? '1' : '0'};
              \${item.background ? \`background-color: \${item.background};\` : ''}
              \${item.useGradient ? \`background: linear-gradient(to right, \${item.background}, \${item.backgroundGradient});\` : ''}
              \${item.textColor ? \`color: \${item.textColor};\` : ''}
              \${item.fontFamily ? \`font-family: \${getFontFamily(item.fontFamily)};\` : ''}
            "
          >
            <div class="\${getContentWrapperClasses()}">
              \${item.title ? \`<span style="font-size: \${titleFontSize}px">\${item.title}</span>\` : ''}
              <span style="font-size: \${messageFontSize}px">\${item.message}</span>
            </div>
          </div>
        \`).join('')

        const carouselIndicators = '';

        return '<div class="announcement-carousel relative h-full" style="overflow:hidden;width:100%;">' +
               carouselContent +
               carouselIndicators +
               '</div>';
      }

      const leftIcon = iconAlignment === 'left' ? renderIcon() : '';
      const rightIcon = iconAlignment === 'right' ? renderIcon() : '';

      return '<div class="' + getContentWrapperClasses() + '">' +
             leftIcon +
             (title ? '<span style="font-size: ' + titleFontSize + 'px">' + title + '</span>' : '') +
             '<span style="font-size: ' + messageFontSize + 'px">' + message + '</span>' +
             rightIcon +
             renderCTAButton(announcement) +
             '</div>';
    }

    return renderContent();
  }

  // Create the announcement bar
  const announcementBar = document.createElement('div');
  announcementBar.id = 'announcement-bar-' + slug;

  // Apply core styles
  const baseStyles = [
    'width: 100%',
    'display: flex',
    'justify-content: center',
    'align-items: center',
    'height: ' + (announcement.barHeight || 60) + 'px',
    'padding: 0',
    'box-sizing: border-box',
    'z-index: 999999',
    'font-family: ' + getFontFamily(announcement.fontFamily),
    announcement.useGradient && announcement.backgroundGradient
      ? 'background: linear-gradient(135deg, ' + announcement.background + ', ' + announcement.backgroundGradient + ')'
      : 'background: ' + announcement.background,
    'color: ' + announcement.textColor,
    announcement.isSticky ? 'position: fixed; top: 0; left: 0;' : 'position: relative;',
  ].filter(Boolean).join(';');

  announcementBar.setAttribute('style', baseStyles);

  // Expose bar height as CSS var for host page convenience
  document.documentElement.style.setProperty('--announcement-bar-height', (announcement.barHeight || 60) + 'px');

  // If sticky, push body down so it doesn't overlap
  if (announcement.isSticky) {
    const currentMarginTop = parseFloat(getComputedStyle(document.body).marginTop) || 0;
    document.body.style.marginTop = (currentMarginTop + (announcement.barHeight || 60)) + 'px';
  }

  announcementBar.innerHTML = generateAnnouncementHTML(announcement);

  // Add close button if announcement is closable
  if (announcement.isClosable) {
    announcementBar.style.position = announcement.isSticky ? 'fixed' : 'relative';
    const closeBtn = document.createElement('button');
    closeBtn.innerHTML = '&times;';
    closeBtn.setAttribute('aria-label','Close');
    closeBtn.style.cssText = 'position:absolute;right:8px;top:50%;transform:translateY(-50%);background:transparent;border:none;font-size:20px;line-height:1;color:' + announcement.textColor + ';cursor:pointer;';
    closeBtn.addEventListener('click', function(){
      announcementBar.remove();
      if (announcement.isSticky) {
        document.body.style.marginTop = '';
      }
    });
    announcementBar.appendChild(closeBtn);
  }
  document.body.insertBefore(announcementBar, document.body.firstChild);

  // Handle carousel functionality
  if (announcement.type === 'carousel' && announcement.carouselItems?.length > 1) {
    let currentIndex = 0;
    let isHovered = false;
    let rotationInterval;

    function rotateCarousel() {
      const items = announcementBar.querySelectorAll('.announcement-carousel-item');
      const indicators = announcementBar.querySelectorAll('.announcement-carousel-indicator');

      const prevIndex = currentIndex;

      // Slide out previous
      items[prevIndex].style.transform = 'translateX(-100%)';
      items[prevIndex].style.opacity = '0';
      if (indicators.length) indicators[prevIndex].style.opacity = '0.3';

      // Determine next index
      currentIndex = (currentIndex + 1) % items.length;

      // Position next slide right off-screen before sliding in (only first cycle needs initial state but ok to set each time)
      items[currentIndex].style.transform = 'translateX(100%)';
      items[currentIndex].style.opacity = '0';

      // trigger reflow to ensure transition
      void items[currentIndex].offsetWidth;

      // Slide in next
      items[currentIndex].style.transform = 'translateX(0)';
      items[currentIndex].style.opacity = '1';
      if (indicators.length) indicators[currentIndex].style.opacity = '1';

      // After animation finishes (~400ms), move prev slide to right so it can slide in next rotation
      setTimeout(() => {
        items[prevIndex].style.transform = 'translateX(100%)';
      }, 450);
    }

    function startRotation() {
      if (!isHovered) {
        rotationInterval = setInterval(rotateCarousel, announcement.type_settings?.carousel_speed || 5000);
      }
    }

    function stopRotation() {
      clearInterval(rotationInterval);
    }

    // Handle hover pause
    if (announcement.type_settings?.carousel_pause_on_hover) {
      announcementBar.addEventListener('mouseenter', () => {
        isHovered = true;
        stopRotation();
      });
      
      announcementBar.addEventListener('mouseleave', () => {
        isHovered = false;
        startRotation();
      });
    }

    // Start initial rotation
    startRotation();
  }
})();`
;

  // Debug: output first 300 chars of generated JS
  console.log('📜 jsCode preview:', jsCode.slice(0, 300));

    return new NextResponse(jsCode, {
      headers: {
        'Content-Type': 'text/javascript',
        'Cache-Control': 'public, max-age=60',
      },
    })

  } catch (error) {
    console.error('Error generating embed script:', error)
    
    const errorScript = `
      // Error loading announcement
      console.error('Failed to load announcement: ${error}');
    `
    
    return new NextResponse(errorScript, {
      status: 500,
      headers: {
        'Content-Type': 'text/javascript',
        'Cache-Control': 'no-cache',
      },
    })
  }
  console.log('Route execution ended');
} 