import './globals.css'
import '@fontsource/manrope/400.css'
import '@fontsource/manrope/500.css'
import '@fontsource/manrope/600.css'
import '@fontsource/manrope/700.css'
import '@fontsource/space-grotesk/400.css'
import '@fontsource/space-grotesk/500.css'
import '@fontsource/space-grotesk/600.css'
import '@fontsource/space-grotesk/700.css'

export const metadata = {
      title: 'Yello',
    description: 'Create and manage beautiful bars for your website',
  icons: {
    icon: '/favicon_final_2.png',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="h-full">
      <body className="h-full font-sans antialiased bg-gray-50" style={{ fontFamily: 'Manrope, system-ui, sans-serif' }}>
        {children}
      </body>
    </html>
  )
}
