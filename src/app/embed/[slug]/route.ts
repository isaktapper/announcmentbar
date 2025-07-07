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
     announcementBar.innerHTML = \`
      <div style="
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        z-index: 9999;
        ${backgroundStyle}
        color: ${announcement.text_color};
        padding: 12px 20px;
        text-align: center;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        font-size: 14px;
        line-height: 1.4;
        box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        transform: translateY(-100%);
        transition: transform 0.3s ease-in-out;
      ">
        <div style="
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          max-width: 1200px;
          margin: 0 auto;
        ">
          ${iconSvg ? `<div style="flex-shrink: 0; width: 18px; height: 18px;">${iconSvg}</div>` : ''}
          <div style="flex: 1; min-width: 0;">
            <div style="font-weight: 600; margin-bottom: 2px;">${announcement.title}</div>
            <div style="opacity: 0.9;">${announcement.message}</div>
          </div>
        </div>
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
      
      @media (max-width: 768px) {
        #announcement-bar-${slug} > div {
          padding: 10px 16px !important;
          font-size: 13px !important;
        }
        #announcement-bar-${slug} .announcement-icon {
          width: 16px !important;
          height: 16px !important;
        }
      }
    \`;
    document.head.appendChild(style);

    // Insert at the beginning of body
    document.body.insertBefore(announcementBar, document.body.firstChild);

         // Add body padding to prevent content overlap
     const currentPaddingTop = parseInt(window.getComputedStyle(document.body).paddingTop) || 0;
     announcementBar.style.transform = 'translateY(0)';
     const barHeight = announcementBar.offsetHeight;
     announcementBar.style.transform = 'translateY(-100%)';
     document.body.style.paddingTop = (currentPaddingTop + barHeight) + 'px';

    // Animate in
    setTimeout(() => {
      announcementBar.style.transform = 'translateY(0)';
    }, 100);

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
        'Cache-Control': 'public, max-age=300', // Cache for 5 minutes
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