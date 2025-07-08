'use client'

import { useState } from 'react'
import { ClipboardDocumentIcon, CheckIcon } from '@heroicons/react/24/outline'

export default function InstallationGuide() {
  const [copied, setCopied] = useState(false)

  const handleCopy = async (text: string) => {
    await navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-4xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-semibold text-gray-900 mb-8">Installation Guide</h1>
        
        {/* Step 1 */}
        <div className="mb-12">
          <h2 className="text-xl font-medium text-gray-900 mb-4">
            <span className="inline-block bg-[#FFFFC5] rounded-full w-8 h-8 text-center leading-8 mr-2">1</span>
            Copy your embed code
          </h2>
          <p className="text-gray-600 mb-4">
            Copy your code snippet from the dashboard by clicking the "Copy" button next to the slug on the desired bar. The code snippet will look something like this:
          </p>
          <div className="relative bg-gray-50 rounded-lg p-4 border border-gray-200">
            <button 
              onClick={() => handleCopy('<script src="https://yello.bar/embed/abc123.js" defer></script>')}
              className="absolute top-3 right-3 p-2 text-gray-500 hover:text-gray-700 transition-colors"
              title="Copy code"
            >
              {copied ? (
                <CheckIcon className="w-5 h-5 text-green-500" />
              ) : (
                <ClipboardDocumentIcon className="w-5 h-5" />
              )}
            </button>
            <pre className="text-sm text-gray-700 overflow-x-auto p-2">
              <code>{`<script src="https://yello.bar/embed/abc123.js" defer></script>`}</code>
            </pre>
          </div>
          
          {/* Screenshot */}
          <div className="mt-4">
            <img 
              src="/Group 13.png" 
              alt="Copy embed code from dashboard" 
              className="rounded-xl shadow-lg w-full max-w-2xl mx-auto"
            />
          </div>
        </div>

        {/* Step 2 */}
        <div className="mb-12">
          <h2 className="text-xl font-medium text-gray-900 mb-4">
            <span className="inline-block bg-[#FFFFC5] rounded-full w-8 h-8 text-center leading-8 mr-2">2</span>
            Paste it before &lt;/body&gt;
          </h2>
          <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
            <div className="relative">
              <pre className="text-sm text-gray-700 overflow-x-auto p-2">
                <code>{`<!DOCTYPE html>
<html>
  <head>
    ...
  </head>
  <body>
    ...
    <script src="https://app.yello.bar/embed/abc123.js" defer></script>
  </body>
</html>`}</code>
              </pre>
              <div className="absolute right-0 top-1/2 transform -translate-y-1/2 w-2 h-16 bg-[#FFFFC5] rounded-l-md" />
            </div>
          </div>
        </div>

        {/* Step 3 */}
        <div className="mb-12">
          <h2 className="text-xl font-medium text-gray-900 mb-4">
            <span className="inline-block bg-[#FFFFC5] rounded-full w-8 h-8 text-center leading-8 mr-2">3</span>
            Visit your website
          </h2>
          <p className="text-gray-600">
            Once the script is added, your banner will appear on your site automatically. No iframe or plugin needed.
          </p>
        </div>

        {/* Step 4 */}
        <div className="mb-12">
          <h2 className="text-xl font-medium text-gray-900 mb-4">
            <span className="inline-block bg-[#FFFFC5] rounded-full w-8 h-8 text-center leading-8 mr-2">4</span>
            Set your bar to active
          </h2>
          <p className="text-gray-600 mb-4">
            Make sure the status of your bar is set to active in the dashboard. You can toggle bars on/off or make changes anytime — and they'll appear on your site within ~30 seconds.
          </p>
          
          {/* Screenshot */}
          <div className="mt-4">
            <img 
              src="/Group 14.png" 
              alt="Setting bar status to active" 
              className="rounded-xl shadow-lg w-full max-w-2xl mx-auto"
            />
          </div>
        </div>
      </div>
    </div>
  )
} 