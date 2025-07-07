import { createClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'

// Icon mapping for the JavaScript output
const ICON_SVG_MAP = {
  warning: `<svg class="announcement-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><path d="M12 9v4"/><path d="m12 17 .01 0"/></svg>`,
  alert: `<svg class="announcement-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 8v4"/><path d="m12 16 .01 0"/></svg>`,
  info: `<svg class="announcement-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="m12 8 .01 0"/></svg>`,
  success: `<svg class="announcement-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"/><path d="m9 12 2 2 4-4"/></svg>`,
  schedule: `<svg class="announcement-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12,6 12,12 16,14"/></svg>`,
}

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
  // Check if announcement bar already exists
  if (document.getElementById('announcement-bar-${slug}')) {
    return;
  }

     // Create the announcement bar
   function createAnnouncementBar() {
     console.log("Creating announcement bar...");
     const announcementBar = document.createElement('div');
     announcementBar.id = 'announcement-bar-${slug}';
     const isSticky = ${announcement.is_sticky !== false}; // Default to true if undefined
     const positionStyle = isSticky ? 'fixed' : 'relative';
     const isClosable = ${announcement.is_closable === true};
     
     // Typography and layout settings
     const titleFontSize = ${announcement.title_font_size || 16};
     const messageFontSize = ${announcement.message_font_size || 14};
     const textAlignment = '${announcement.text_alignment || 'center'}';
     const iconAlignment = '${announcement.icon_alignment || 'left'}';
     
     // URL settings
     const titleUrl = '${announcement.title_url || ''}';
     const messageUrl = '${announcement.message_url || ''}';
     
     // Calculate layout styles
     const justifyContent = textAlignment === 'left' ? 'flex-start' : textAlignment === 'right' ? 'flex-end' : 'center';
     const iconOrder = iconAlignment === 'right' ? '2' : iconAlignment === 'center' ? '1' : '0';
     const contentOrder = iconAlignment === 'center' ? '0' : '1';
     
     // Create title and message elements with optional links
     const titleElement = titleUrl ? 
       \`<a href="\${titleUrl}" target="_blank" rel="noopener noreferrer" style="color: inherit; text-decoration: underline; text-decoration-color: rgba(255,255,255,0.5);">${announcement.title.replace(/'/g, "\\'")}</a>\` :
       '${announcement.title.replace(/'/g, "\\'")}';
       
     const messageElement = messageUrl ?
       \`<a href="\${messageUrl}" target="_blank" rel="noopener noreferrer" style="color: inherit; text-decoration: underline; text-decoration-color: rgba(255,255,255,0.5);">${announcement.message.replace(/'/g, "\\'")}</a>\` :
       '${announcement.message.replace(/'/g, "\\'")}';
     
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
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
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
          \${${iconSvg ? `iconSvg` : `''`} && iconAlignment !== 'center' ? \`<div style="flex-shrink: 0; width: 18px; height: 18px; order: \${iconOrder};">\${${iconSvg ? `iconSvg` : `''`}}</div>\` : ''}
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
          \${${iconSvg ? `iconSvg` : `''`} && iconAlignment === 'center' ? \`<div style="flex-shrink: 0; width: 18px; height: 18px; order: \${iconOrder};">\${${iconSvg ? `iconSvg` : `''`}}</div>\` : ''}
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

     // Add icon styles
    const style = document.createElement('style');
    style.textContent = \`
      .announcement-icon {
        width: 100%;
        height: 100%;
        display: block;
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
          width: 16px !important;
          height: 16px !important;
        }
      }
      
      /* Ensure body gets proper spacing */
      body {
        transition: padding-top 0.3s ease !important;
      }
    \`;
    document.head.appendChild(style);

    // Insert at the beginning of body
    document.body.insertBefore(announcementBar, document.body.firstChild);

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