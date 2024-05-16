'use client';
import { environment } from '@/environment/environment';
import { useState } from 'react';

export default function OTPForm() {
  const [otp, setOTP] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    // Validate OTP (You can add your validation logic here)
    if (!/^\d{6}$/.test(otp)) {
      setErrorMessage('Please enter a valid 6-digit OTP.');
      return;
    }
    const dev_url = environment.dev_url;
    const local_user = environment.local_user;

    try {
      // Retrieve token from local storage
      const token = localStorage.getItem('token');

      // Check if token is available
      if (!token) {
        setErrorMessage('Token is not available. Please log in again.');
        return;
      }

      // Log headers before making the API call
      console.log('Headers:', {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      });

      // Send OTP and token to API for verification
      const response = await fetch(
        `${local_user}/api/v1/client-user/verifyOTP`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Token: `${token}`, // Include token in request headers
          },
          body: JSON.stringify({ verificationCode: otp }), // Include only OTP in request body
        },
      );

      // Check if the request was successful
      if (response.ok) {
        const responseData = await response.json();

        // Extract access token and refresh token
        const { accessToken, refreshToken } = responseData;

        // Store tokens in localStorage
        localStorage.setItem('accessToken', accessToken);
        localStorage.setItem('refreshToken', refreshToken);

        // Redirect the user to the dashboard
        window.location.href = '/dashboard';
      } else {
        // Handle error response
        const errorData = await response.json();
        setErrorMessage(errorData.message || 'Failed to verify OTP');
      }
    } catch (error) {
      console.error('Error:', error);
      setErrorMessage('An unexpected error occurred. Please try again later.');
    }
  };
  function regenerateOTP() {}

  return (
    <div className="mx-auto mt-8 max-w-[400px] rounded-md bg-white p-6 shadow-md">
      <h2 className="mb-4 text-xl font-semibold">Enter OTP</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={otp}
          onChange={(e) => setOTP(e.target.value)}
          placeholder="Enter OTP"
          className="mb-4 block w-full rounded-md border-gray-300 px-4 py-2 focus:outline-none focus:ring focus:ring-blue-400"
          required
        />
        <div className="">
          <button
            type="submit"
            className="rounded-md bg-red-500 px-4 py-2 font-semibold text-white hover:bg-red-700 focus:outline-none focus:ring focus:ring-blue-400"
          >
            Submit OTP
          </button>
        </div>

        {errorMessage && <p className="mt-2 text-red-500">{errorMessage}</p>}
      </form>
    </div>
  );
}
