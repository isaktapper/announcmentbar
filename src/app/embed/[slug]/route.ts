import { createClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'

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

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const resolvedParams = await params
    
    // Create Supabase client with service role key to bypass RLS for public embeds
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        }
      }
    )

    // Extract slug and remove .js extension if present
    const slug = resolvedParams.slug.replace(/\.js$/, '')

    // Check if request is asking for the .js file specifically
    const url = new URL(request.url)
    const isJsRequest = url.pathname.endsWith('.js')

    // If not a .js request, return 404
    if (!isJsRequest) {
      return new NextResponse('Not Found', { status: 404 })
    }

    // Fetch announcement by slug
    const { data: announcement, error } = await supabase
      .from('announcements')
      .select('*')
      .eq('slug', slug)
      .eq('visibility', true) // Only active announcements
      .single()

    // If no announcement found or error, return empty script
    if (error || !announcement) {
      const emptyScript = `
        // Announcement not found or inactive
        console.log('Announcement with slug "${slug}" not found or is inactive');
      `
      return new NextResponse(emptyScript, {
        headers: {
          'Content-Type': 'text/javascript',
          'Cache-Control': 'public, max-age=60', // Cache empty responses for 1 minute
        },
      })
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

    // Generate the JavaScript code
    const jsCode = `
(function() {
  const announcement = ${JSON.stringify(announcement)};
  
  ${pageTargetingScript}

  // Check if announcement bar already exists
  if (document.getElementById('announcement-bar-${slug}')) {
    return;
  }

  // Font configuration
  const fontFamily = '${announcement.font_family || 'Work Sans'}';
  const googleFonts = {
    'Work Sans': { cssName: 'Work Sans', weights: '400;500;600', fallback: 'sans-serif' },
    'Inter': { cssName: 'Inter', weights: '400;500;600', fallback: 'sans-serif' },
    'Lato': { cssName: 'Lato', weights: '400;700', fallback: 'sans-serif' },
    'Roboto': { cssName: 'Roboto', weights: '400;500;700', fallback: 'sans-serif' },
    'Rubik': { cssName: 'Rubik', weights: '400;500;600', fallback: 'sans-serif' },
    'Poppins': { cssName: 'Poppins', weights: '400;500;600', fallback: 'sans-serif' },
    'Space Grotesk': { cssName: 'Space+Grotesk', weights: '400;500;600', fallback: 'sans-serif' },
    'DM Sans': { cssName: 'DM+Sans', weights: '400;500;600', fallback: 'sans-serif' },
    'Playfair Display': { cssName: 'Playfair+Display', weights: '400;600;700', fallback: 'serif' },
    'Bricolage Grotesque': { cssName: 'Bricolage+Grotesque', weights: '400;500;600', fallback: 'sans-serif' }
  };

  // Load Google Font if needed
  function loadGoogleFont(fontName) {
    const fontId = 'google-font-' + fontName.replace(/\s+/g, '-').toLowerCase();
    
    // Check if font is already loaded
    if (document.getElementById(fontId)) {
      return;
    }
    
    const fontConfig = googleFonts[fontName];
    if (fontConfig) {
      const link = document.createElement('link');
      link.id = fontId;
      link.rel = 'stylesheet';
      link.href = \`https://fonts.googleapis.com/css2?family=\${fontConfig.cssName}:wght@\${fontConfig.weights}&display=swap\`;
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

     // Create the announcement bar
   function createAnnouncementBar() {
     console.log("Creating announcement bar...");
     const announcementBar = document.createElement('div');
     announcementBar.id = 'announcement-bar-${slug}';
     const isSticky = ${announcement.is_sticky !== false}; // Default to true if undefined
     const positionStyle = isSticky ? 'fixed' : 'relative';
     const isClosable = ${announcement.is_closable === true};
     
     // Announcement type and settings
     const announcementType = '${announcement.type || 'single'}';
     const typeSettings = ${JSON.stringify(announcement.type_settings || {})};
     
     // Typography and layout settings
     const titleFontSize = ${announcement.title_font_size || 16};
     const messageFontSize = ${announcement.message_font_size || 14};
     const textAlignment = '${announcement.text_alignment || 'center'}';
     const selectedFontFamily = getFontFamily(fontFamily);
     
     // URL settings
     const titleUrl = '${announcement.content?.titleUrl || ''}';
     const messageUrl = '${announcement.content?.messageUrl || ''}';
     
     // Calculate layout styles
     const justifyContent = textAlignment === 'left' ? 'flex-start' : textAlignment === 'right' ? 'flex-end' : 'center';
     const contentOrder = '${announcement.icon_alignment || 'left'}' === 'center' ? '0' : '1';
     
     // Create title and message elements with optional links
     const titleElement = titleUrl ? 
       \`<a href="\${titleUrl}" target="_blank" rel="noopener noreferrer" style="color: inherit; text-decoration: underline; text-decoration-color: rgba(255,255,255,0.5);">\${announcement.content?.title || ''}</a>\` :
       '${announcement.content?.title || ''}';
       
     const messageElement = messageUrl ?
       \`<a href="\${messageUrl}" target="_blank" rel="noopener noreferrer" style="color: inherit; text-decoration: underline; text-decoration-color: rgba(255,255,255,0.5);">\${announcement.content?.message || ''}</a>\` :
       '${announcement.content?.message || ''}';

     // Parse carousel content for carousel type
     let carouselItems = [];
     if (announcementType === 'carousel') {
       try {
         const parsedContent = typeof ${JSON.stringify(announcement.content)} === 'string' ? 
           JSON.parse(${JSON.stringify(announcement.content)}) : ${JSON.stringify(announcement.content)};
         carouselItems = Array.isArray(parsedContent) ? parsedContent : [];
       } catch (e) {
         console.warn('Failed to parse carousel content, falling back to single mode');
         carouselItems = [];
       }
     }

     // Create announcement content based on type
     function createAnnouncementContent() {
       if (announcementType === 'marquee') {
         const marqueeSpeed = typeSettings.marquee_speed || 2;
         const marqueeDirection = typeSettings.marquee_direction || 'left';
         const pauseOnHover = typeSettings.marquee_pause_on_hover || false;
         
         const fullContent = titleElement ? 
           \`<span style="font-size: \${titleFontSize}px; font-weight: 600;">\${titleElement}</span> — <span style="font-size: \${messageFontSize}px; opacity: 0.9;">\${messageElement}</span>\` :
           \`<span style="font-size: \${messageFontSize}px; opacity: 0.9;">\${messageElement}</span>\`;
         const animationDirection = marqueeDirection === 'left' ? 'marquee-left-to-right' : 'marquee-right-to-left';
         const animationDuration = (marqueeSpeed === 1 ? 30 : marqueeSpeed === 2 ? 20 : 15) + 's';
         
         return \`
           <div style="
             position: absolute;
             top: 0;
             left: 0;
             right: 0;
             bottom: 0;
             overflow: hidden;
             display: flex;
             align-items: center;
           ">
             <div 
               class="animate-marquee"
               style="
                 display: flex;
                 white-space: nowrap;
                 animation: \${animationDirection} \${animationDuration} linear infinite;
                 width: max-content;
                 \${pauseOnHover ? 'animation-play-state: running;' : ''}
               "
               \${pauseOnHover ? 'onmouseenter="this.style.animationPlayState=\\'paused\\'" onmouseleave="this.style.animationPlayState=\\'running\\'"' : ''}
             >
               <div style="
                 display: flex;
                 align-items: center;
                 gap: 8px;
                 padding-right: 10px;
                 font-size: \${Math.max(titleFontSize, messageFontSize)}px;
                 line-height: 1.3;
                 height: 100%;
               ">
                 \${fullContent}
               </div>
             </div>
           </div>
         \`;
       } else if (announcementType === 'carousel' && carouselItems.length > 0) {
         const carouselSpeed = typeSettings.carousel_speed || 5000;
         const pauseOnHover = typeSettings.carousel_pause_on_hover || false;
         
         // Create carousel items HTML
         const carouselItemsHtml = carouselItems.map((item, index) => {
           const itemTitle = item.title || '';
           const itemMessage = item.message || '';
           const itemTitleUrl = item.titleUrl || '';
           const itemMessageUrl = item.messageUrl || '';
           
           const titleEl = itemTitleUrl ? 
             \`<a href="\${itemTitleUrl}" target="_blank" rel="noopener noreferrer" style="color: inherit; text-decoration: underline; text-decoration-color: rgba(255,255,255,0.5);">\${itemTitle}</a>\` :
             itemTitle;
           
           const messageEl = itemMessageUrl ?
             \`<a href="\${itemMessageUrl}" target="_blank" rel="noopener noreferrer" style="color: inherit; text-decoration: underline; text-decoration-color: rgba(255,255,255,0.5);">\${itemMessage}</a>\` :
             itemMessage;
           
           return \`
             <div class="carousel-item" style="
               width: 100%;
               flex-shrink: 0;
               display: flex;
               flex-direction: column;
               align-items: center;
               justify-content: center;
               gap: 4px;
               line-height: 1.3;
             ">
               \${itemTitle ? \`<div style="text-align: center; font-size: \${titleFontSize}px; font-weight: 600; width: 100%;">\${titleEl}</div>\` : ''}
               \${itemMessage ? \`<div style="text-align: center; font-size: \${messageFontSize}px; opacity: 0.9; width: 100%;">\${messageEl}</div>\` : ''}
             </div>
           \`;
         }).join('');
         
         return \`
           <div id="carousel-container-${slug}" style="
             flex: 1; 
             min-width: 0; 
             overflow: hidden;
             order: \${contentOrder};
           ">
             <div class="carousel-track" style="
               display: flex;
               width: \${carouselItems.length * 100}%;
               transform: translateX(0%);
               transition: transform 0.5s ease-in-out;
               height: 100%;
             ">
               \${carouselItemsHtml}
             </div>
           </div>
         \`;
       } else {
         // Single type (default)
         return \`
           <div style="
             flex: 1; 
             min-width: 0; 
             text-align: \${textAlignment};
             order: \${contentOrder};
           ">
             <div style="
               font-weight: 600; 
               margin-bottom: 2px; 
               font-size: \${titleFontSize}px;
               line-height: 1.3;
             ">\${titleElement}</div>
             <div style="
               opacity: 0.9; 
               font-size: \${messageFontSize}px;
               line-height: 1.4;
             ">\${messageElement}</div>
           </div>
         \`;
       }
     }
     
     announcementBar.innerHTML = \`
      <div style="
        position: \${positionStyle};
        \${isSticky ? 'top: 0;' : ''}
        left: 0;
        right: 0;
        width: 100%;
        z-index: \${isSticky ? '999999' : '100'};
        ${backgroundStyle}
        color: ${announcement.text_color};
        padding: 10px 16px;
        font-family: \${selectedFontFamily};
        box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        transform: translateY(0);
        box-sizing: border-box;
        margin: 0;
        display: flex;
        align-items: center;
        justify-content: \${justifyContent};
        gap: 12px;
        min-height: 40px;
        position: relative;
      ">
        <div style="
          display: flex;
          align-items: center;
          justify-content: \${justifyContent};
          gap: 12px;
          width: 100%;
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 \${isClosable ? '40px' : '20px'} 0 20px;
          box-sizing: border-box;
        ">
          ${iconSvg && announcement.icon_alignment !== 'center' ? `<div style="flex-shrink: 0; width: \${Math.max(titleFontSize, messageFontSize) + 2}px; height: \${Math.max(titleFontSize, messageFontSize) + 2}px; order: ${announcement.icon_alignment === 'right' ? '2' : '0'};">${iconSvg}</div>` : ''}
          \${createAnnouncementContent()}
          ${iconSvg && announcement.icon_alignment === 'center' ? `<div style="flex-shrink: 0; width: \${Math.max(titleFontSize, messageFontSize) + 2}px; height: \${Math.max(titleFontSize, messageFontSize) + 2}px; order: 1;">${iconSvg}</div>` : ''}
        </div>
        \${isClosable ? \`
          <button 
            onclick="this.closest('#announcement-bar-${slug}').remove(); document.body.style.marginTop = '0px';" 
            style="
              position: absolute;
              right: 12px;
              top: 50%;
              transform: translateY(-50%);
              background: none;
              border: none;
              color: ${announcement.text_color};
              font-size: 18px;
              line-height: 1;
              cursor: pointer;
              padding: 4px;
              opacity: 0.7;
              transition: opacity 0.2s ease;
              z-index: 1;
            "
            onmouseover="this.style.opacity='1'"
            onmouseout="this.style.opacity='0.7'"
            title="Close announcement"
          >×</button>
        \` : ''}
      </div>
         \`;
     console.log("announcementBar.innerHTML", announcementBar.innerHTML);

     // Add icon styles and announcement type animations
    const style = document.createElement('style');
    style.textContent = \`
      .announcement-icon {
        width: 100%;
        height: 100%;
        display: block;
      }
      
      /* Marquee animations */
      @keyframes marquee-left-to-right {
        from {
          transform: translateX(-5vw);
        }
        to {
          transform: translateX(5vw);
        }
      }
      
      @keyframes marquee-right-to-left {
        from {
          transform: translateX(5vw);
        }
        to {
          transform: translateX(-5vw);
        }
      }
      
      /* Ensure full width and proper positioning */
      #announcement-bar-${slug} {
        margin: 0 !important;
        width: 100vw !important;
        left: 0 !important;
        right: 0 !important;
        position: \${positionStyle} !important;
        \${isSticky ? 'top: 0 !important;' : ''}
        z-index: \${isSticky ? '999999' : '100'} !important;
      }
      
      /* Inner container styling */
      #announcement-bar-${slug} > div > div {
        min-width: 0 !important;
        flex: 1 !important;
      }
      
      /* Mobile responsiveness */
      @media (max-width: 768px) {
        #announcement-bar-${slug} {
          padding: 8px 16px !important;
        }
        #announcement-bar-${slug} > div {
          padding: 0 16px !important;
        }
        #announcement-bar-${slug} .announcement-icon {
          width: \${Math.max(titleFontSize, messageFontSize)}px !important;
          height: \${Math.max(titleFontSize, messageFontSize)}px !important;
        }
      }
      
      /* Ensure body gets proper spacing */
      body {
        transition: padding-top 0.3s ease !important;
      }
      
      /* Marquee pause on hover */
      .animate-marquee:hover {
        animation-play-state: paused !important;
      }
    \`;
    document.head.appendChild(style);

    // Insert at the beginning of body
    document.body.insertBefore(announcementBar, document.body.firstChild);

    // Initialize carousel functionality
    if (announcementType === 'carousel' && carouselItems.length > 1) {
      let currentIndex = 0;
      let carouselInterval = null;
      let isPaused = false;
      const carouselSpeed = typeSettings.carousel_speed || 5000;
      const pauseOnHover = typeSettings.carousel_pause_on_hover || false;
      
      const carouselTrack = announcementBar.querySelector('.carousel-track');
      const carouselContainer = announcementBar.querySelector('#carousel-container-${slug}');
      
      function rotateCarousel() {
        if (carouselTrack && !isPaused) {
          currentIndex = (currentIndex + 1) % carouselItems.length;
          carouselTrack.style.transform = \`translateX(-\${currentIndex * (100 / carouselItems.length)}%)\`;
        }
      }
      
      function startCarousel() {
        if (carouselInterval) clearInterval(carouselInterval);
        carouselInterval = setInterval(rotateCarousel, carouselSpeed);
      }
      
      function stopCarousel() {
        if (carouselInterval) {
          clearInterval(carouselInterval);
          carouselInterval = null;
        }
      }
      
      // Start the carousel
      startCarousel();
      
      // Add pause on hover functionality
      if (pauseOnHover && carouselContainer) {
        carouselContainer.addEventListener('mouseenter', function() {
          isPaused = true;
          stopCarousel();
        });
        
        carouselContainer.addEventListener('mouseleave', function() {
          isPaused = false;
          startCarousel();
        });
      }
      
      // Clean up on page unload
      window.addEventListener('beforeunload', function() {
        stopCarousel();
      });
    }

     // Simplified single-run spacing with proper height measurement (only for sticky bars)
     const applySpacing = () => {
       if (!isSticky) {
         console.log('📍 Non-sticky bar, skipping spacing application');
         return;
       }
       
       console.log('🚀 Starting spacing application for sticky bar...');
       
               // Wait for element to be properly rendered
        setTimeout(() => {
          // Try multiple height measurement methods
          const rect = announcementBar.getBoundingClientRect();
          const offsetHeight = announcementBar.offsetHeight;
          const scrollHeight = announcementBar.scrollHeight;
          const clientHeight = announcementBar.clientHeight;
          
          console.log('📊 Height measurements:');
          console.log('  - getBoundingClientRect:', rect.height + 'px');
          console.log('  - offsetHeight:', offsetHeight + 'px');
          console.log('  - scrollHeight:', scrollHeight + 'px');
          console.log('  - clientHeight:', clientHeight + 'px');
          
          // Try measuring the inner content div instead
          const innerDiv = announcementBar.querySelector('div');
          let contentHeight = 0;
          if (innerDiv) {
            contentHeight = innerDiv.getBoundingClientRect().height;
            console.log('  - innerDiv height:', contentHeight + 'px');
          }
          
          // Choose the best height measurement
          let barHeight = Math.max(rect.height, offsetHeight, scrollHeight, clientHeight, contentHeight);
          
          // If still 0, calculate from content
          if (barHeight === 0) {
            console.log('🔧 All measurements are 0, calculating from styling...');
            // Calculate from padding (10px top + 10px bottom) + estimated text height
            const padding = 20; // 10px top + 10px bottom from CSS
            const estimatedTextHeight = Math.max(titleFontSize, messageFontSize) * 2.5; // Account for title + message
            barHeight = padding + estimatedTextHeight;
            console.log('📐 Estimated height:', barHeight + 'px');
          }
          
          console.log('🎯 Final chosen height:', barHeight + 'px');
          
          if (barHeight > 0) {
            // Apply margin-top to body
            document.body.style.setProperty('margin-top', barHeight + 'px', 'important');
            console.log('✅ Applied', barHeight + 'px', 'margin-top to body');
            
            // Also set a CSS custom property for potential use by the website
            document.documentElement.style.setProperty('--announcement-bar-height', barHeight + 'px');
            console.log('📝 Set CSS custom property --announcement-bar-height:', barHeight + 'px');
          }
        }, 500); // Wait even longer for full rendering
     };
     
     // Single execution after DOM is ready
     if (document.readyState === 'loading') {
       document.addEventListener('DOMContentLoaded', applySpacing);
     } else {
       applySpacing();
     }
     
     // Monitor size changes with ResizeObserver for dynamic updates
     // TEMPORARY DISABLED to fix infinite loop
     /*
     if (window.ResizeObserver) {
       const resizeObserver = new ResizeObserver(updateSpacing);
       resizeObserver.observe(announcementBar);
     }
     */
     
     // Also try to push down any fixed headers or navigation (only for sticky bars)
     if (isSticky) {
       const commonHeaderSelectors = ['header', 'nav', '.header', '.navigation', '.navbar', '.nav'];
       commonHeaderSelectors.forEach(selector => {
         const elements = document.querySelectorAll(selector);
         elements.forEach(el => {
           const element = el;
           if (window.getComputedStyle(element).position === 'fixed' && 
               window.getComputedStyle(element).top === '0px') {
             element.style.top = barHeight + 'px';
             element.style.transition = 'top 0.3s ease';
           }
         });
       });
     }

    return announcementBar;
  }

  // Wait for DOM to be ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', createAnnouncementBar);
  } else {
    createAnnouncementBar();
  }
})();
`

    return new NextResponse(jsCode, {
      headers: {
        'Content-Type': 'text/javascript',
        'Cache-Control': 'public, max-age=30', // Cache for only 30 seconds for faster updates
        'Access-Control-Allow-Origin': '*', // Allow cross-origin requests
        'Access-Control-Allow-Methods': 'GET',
        'Access-Control-Allow-Headers': 'Content-Type',
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
} 