import { createClient } from '@/lib/supabase-client'

export async function GET(request: Request, { params }: { params: { slug: string } }) {
  try {
    const supabase = createClient()

    // Get announcement by slug
    const { data: announcement, error } = await supabase
      .from('announcements')
      .select('*')
      .eq('slug', params.slug)
      .single()

    if (error || !announcement) {
      return new Response('Not found', { status: 404 })
    }

    // Get plain text versions of title/message
    const displayTitle = announcement.title.replace(/<[^>]*>/g, '')
    const displayMessage = announcement.message.replace(/<[^>]*>/g, '')

    // Prepare content for carousel type
    let content = null
    if (announcement.type === 'carousel') {
      content = announcement.content.map((item: any) => ({
        ...item,
        title: item.title.replace(/<[^>]*>/g, ''),
        message: item.message.replace(/<[^>]*>/g, ''),
      }))
    }

    // Generate the HTML
    const html = `
      <div 
        id="announcement-bar-${announcement.id}"
        class="w-full relative"
        style="
          background: ${announcement.use_gradient 
            ? `linear-gradient(90deg, ${announcement.background} 0%, ${announcement.background_gradient} 100%)`
            : announcement.background};
          height: ${announcement.bar_height}px;
          font-family: ${announcement.font_family};
        "
      >
        <div 
          class="h-full flex items-center gap-4 px-4 ${
            announcement.text_alignment === 'left'
              ? 'text-left'
              : announcement.text_alignment === 'right'
              ? 'text-right'
              : 'text-center'
          }"
          style="color: ${announcement.text_color}"
        >
          ${announcement.icon !== 'none' && announcement.icon_alignment === 'left'
            ? `<div class="flex-shrink-0">
                <img src="/icons/${announcement.icon}.svg" class="w-5 h-5" />
              </div>`
            : ''
          }

          <div class="flex-1 min-w-0">
            <div class="flex flex-col sm:flex-row items-center gap-2 sm:gap-4 justify-center">
              <div 
                class="font-medium"
                style="font-size: ${announcement.title_font_size}px"
              >
                ${displayTitle}
              </div>

              ${displayMessage
                ? `<div style="font-size: ${announcement.message_font_size}px">
                    ${displayMessage}
                  </div>`
                : ''
              }

              ${announcement.cta_text && announcement.cta_url
                ? `<a
                    href="${announcement.cta_url}"
                    class="inline-flex items-center justify-center font-medium transition-colors ${
                      announcement.cta_size === 'sm'
                        ? 'px-3 py-1.5 text-sm'
                        : announcement.cta_size === 'lg'
                        ? 'px-6 py-3 text-lg'
                        : 'px-4 py-2'
                    } ${
                      announcement.cta_border_radius === 'none'
                        ? ''
                        : announcement.cta_border_radius === 'sm'
                        ? 'rounded'
                        : announcement.cta_border_radius === 'lg'
                        ? 'rounded-lg'
                        : announcement.cta_border_radius === 'pill'
                        ? 'rounded-full'
                        : 'rounded-md'
                    }"
                    style="
                      background-color: ${announcement.cta_bg_color};
                      color: ${announcement.cta_text_color};
                    "
                  >
                    ${announcement.cta_text}
                  </a>`
                : ''
              }
            </div>
          </div>

          ${announcement.icon !== 'none' && announcement.icon_alignment === 'right'
            ? `<div class="flex-shrink-0">
                <img src="/icons/${announcement.icon}.svg" class="w-5 h-5" />
              </div>`
            : ''
          }
        </div>
      </div>
    `

    return new Response(html, {
      headers: {
        'Content-Type': 'text/html',
        'Cache-Control': 'no-cache, no-store, must-revalidate',
      },
    })
  } catch (error) {
    console.error('Error generating announcement bar:', error)
    return new Response('Internal server error', { status: 500 })
  }
} 