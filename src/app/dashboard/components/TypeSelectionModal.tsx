'use client'

import { Fragment } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import { useRouter } from 'next/navigation'
import { XMarkIcon } from '@heroicons/react/24/outline'

interface TypeSelectionModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function TypeSelectionModal({ isOpen, onClose }: TypeSelectionModalProps) {
  const router = useRouter()

  const types = [
    {
      id: 'single',
      title: 'Single',
      description: 'Display one fixed message',
      disabled: false,
      route: '/dashboard/create/single'
    },
    {
      id: 'carousel',
      title: 'Carousel',
      description: 'Rotate between multiple slides',
      disabled: false,
      route: '/dashboard/create/carousel'
    },
    {
      id: 'marquee',
      title: 'Marquee',
      description: 'Scrolling ticker message',
      disabled: true,
      route: null
    }
  ]

  const handleTypeSelect = (type: typeof types[0]) => {
    if (type.disabled) return
    if (type.route) {
      router.push(type.route)
    }
    onClose()
  }

  return (
    <Transition.Root show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
        </Transition.Child>

        <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
          <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6">
                <div className="absolute right-0 top-0 pr-4 pt-4">
                  <button
                    type="button"
                    className="rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2"
                    onClick={onClose}
                  >
                    <span className="sr-only">Close</span>
                    <XMarkIcon className="h-6 w-6" />
                  </button>
                </div>
                <div>
                  <div className="text-center">
                    <Dialog.Title as="h3" className="text-2xl font-semibold leading-6 text-gray-900 mb-8">
                      Choose Your Bar Type
                    </Dialog.Title>
                  </div>
                  <div className="mt-4 grid gap-4">
                    {types.map((type) => (
                      <button
                        key={type.id}
                        onClick={() => handleTypeSelect(type)}
                        className={`relative flex flex-col items-start p-6 rounded-xl border-2 text-left transition-all ${
                          type.disabled
                            ? 'border-gray-200 bg-gray-50 cursor-not-allowed'
                            : 'border-gray-200 hover:border-brand-500 hover:shadow-md'
                        }`}
                        disabled={type.disabled}
                      >
                        <h4 className="text-lg font-semibold text-gray-900 mb-2">
                          {type.title}
                          {type.disabled && (
                            <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-600">
                              Coming Soon
                            </span>
                          )}
                        </h4>
                        <p className="text-gray-600">{type.description}</p>
                      </button>
                    ))}
                  </div>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  )
} 