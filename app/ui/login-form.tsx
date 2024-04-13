'use client';

import { useState } from 'react'; // Import useState hook
import { lusitana } from '@/app/ui/fonts';
import {
  AtSymbolIcon,
  KeyIcon,
  ExclamationCircleIcon,
} from '@heroicons/react/24/outline';
import { ArrowRightIcon } from '@heroicons/react/20/solid';
import { Button } from '@/app/ui/button';
import { useFormState, useFormStatus } from 'react-dom';
import { authenticate } from '@/app/lib/actions';
import Link from 'next/link';

export default function LoginForm() {
  const [errorMessage, setErrorMessage] = useState(null); // State for error message

  const handleSubmit = async (event) => {
    event.preventDefault(); // Prevent default form submission behavior

    // Get form data
    const username = event.target.email.value; // Assuming the input field is for the username
    const password = event.target.password.value;

    try {
      // Call the API to authenticate the user
      const response = await fetch(
        'https://api-finserve-dev.finserve.africa/user-manager/api/v1/authenticate-client-user',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json', // Set content type to JSON
            use: 'client', // Assuming 'use' is a custom header required by your API
          },
          body: JSON.stringify({ username, password }), // Convert data to JSON
        },
      );

      if (response.ok) {
        // Authentication successful, extract the token from response data
        const responseData = await response.json();
        const token = responseData.data.token;

        // Store the token in local storage
        localStorage.setItem('token', token);

        // Log the token to console
        console.log('Token:', token);
        window.location.href = '/OTP';
      } else {
        // Authentication failed, handle the error
        const errorData = await response.json();
        setErrorMessage(errorData.message); // Set error message state
      }
    } catch (error) {
      // Handle network errors or other exceptions
      console.error('Error:', error);
      setErrorMessage('An unexpected error occurred. Please try again later.');
    }
  };

  return (
    <div className="mx-auto max-w-lg rounded-lg border border-gray-300 p-3">
      <h2 className="bg-white-500 mb-4 flex justify-center rounded-lg p-2 text-xl font-semibold text-white">
        <img
          src="https://www.finserve.africa/images/finserve-big-logo.svg"
          alt="Finserve Logo"
          className="h-15 w-15 mr-2"
        />
        Sign up Form
      </h2>
      <form onSubmit={handleSubmit} className="space-y-3">
        <div className="flex-1 rounded-lg bg-gray-50 px-6 pb-4 pt-8">
          <h1 className={`${lusitana.className} mb-3 text-2xl`}>
            Please log in to continue.
          </h1>
          <div className="w-full">
            <div>
              <label
                className="mb-3 mt-5 block text-xs font-medium text-gray-900"
                htmlFor="email"
              >
                Email
              </label>
              <div className="relative">
                <input
                  className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-10 text-sm outline-2 placeholder:text-gray-500"
                  id="email"
                  type="email"
                  name="email"
                  placeholder="Enter your email address"
                  required
                />
                <AtSymbolIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
              </div>
            </div>
            <div className="mt-4">
              <label
                className="mb-3 mt-5 block text-xs font-medium text-gray-900"
                htmlFor="password"
              >
                Password
              </label>
              <div className="relative">
                <input
                  className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-10 text-sm outline-2 placeholder:text-gray-500"
                  id="password"
                  type="password"
                  name="password"
                  placeholder="Enter password"
                  required
                  minLength={6}
                />
                <KeyIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
              </div>
            </div>
          </div>
          <LoginButton />
          <div
            className="flex h-8 items-end space-x-1"
            aria-live="polite"
            aria-atomic="true"
          >
            {errorMessage && (
              <>
                <ExclamationCircleIcon className="h-5 w-5 text-red-500" />
                <p className="text-sm text-red-500">{errorMessage}</p>
              </>
            )}
          </div>
          <div className="mb-1 text-center text-blue-500 hover:underline">
            <Link href="/signup">Dont have account? Sign-up</Link>
          </div>
        </div>
      </form>
    </div>
  );
}

function LoginButton() {
  const { pending } = useFormStatus();

  return (
    <Button className="mt-4 w-full" aria-disabled={pending}>
      Log in <ArrowRightIcon className="ml-auto h-5 w-5 text-gray-50" />
    </Button>
  );
}
