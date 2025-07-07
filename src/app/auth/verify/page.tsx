import Link from 'next/link'
import { EnvelopeIcon } from '@heroicons/react/24/outline'

export default function VerifyPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-indigo-100">
            <EnvelopeIcon className="h-8 w-8 text-indigo-600" />
          </div>
          
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Check your email
          </h2>
          
          <div className="mt-4 space-y-4">
            <p className="text-sm text-gray-600">
              We&apos;ve sent a verification email to your inbox. Please click the verification link in the email to activate your account.
            </p>
            
            <div className="rounded-md bg-blue-50 p-4">
              <div className="text-sm text-blue-800">
                <strong>Didn&apos;t receive the email?</strong>
                <br />
                Check your spam folder or wait a few minutes for the email to arrive.
              </div>
            </div>
            
            <div className="rounded-md bg-yellow-50 p-4">
              <div className="text-sm text-yellow-800">
                <strong>Already have an account?</strong>
                <br />
                If you already registered with this email, you&apos;ll receive a sign-up confirmation email. Simply ignore it and{' '}
                <Link 
                  href="/auth/login" 
                  className="font-medium text-yellow-900 underline hover:text-yellow-700"
                >
                  log in here
                </Link> instead.
              </div>
            </div>
            
            <div className="pt-4">
              <p className="text-sm text-gray-600">
                Already verified?{' '}
                <Link 
                  href="/auth/login" 
                  className="font-medium text-indigo-600 hover:text-indigo-500"
                >
                  Log in
                </Link>
              </p>
            </div>
            
            <div className="pt-2">
              <p className="text-sm text-gray-600">
                Need to use a different email?{' '}
                <Link 
                  href="/auth/signup" 
                  className="font-medium text-indigo-600 hover:text-indigo-500"
                >
                  Sign up again
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 