'use client';
import { useState, ChangeEvent, FormEvent } from 'react';

interface ResetPasswordProps {
  devUrl: string;
}

const ResetPassword: React.FC<ResetPasswordProps> = ({ devUrl }) => {
  const [password, setPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [message, setMessage] = useState<string>('');

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setMessage("Passwords don't match");
      return;
    }

    try {
      const response = await fetch(
        `${devUrl}/api/v1/client-user/password/reset`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ password }),
        },
      );

      if (response.ok) {
        setMessage('Password reset successfully.');
      } else {
        const data = await response.json();
        setMessage(data.message || 'Failed to reset password.');
      }
    } catch (error) {
      console.error('Error resetting password:', error);
      setMessage('An error occurred. Please try again later.');
    }
  };

  const handlePasswordChange = (e: ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  };

  const handleConfirmPasswordChange = (e: ChangeEvent<HTMLInputElement>) => {
    setConfirmPassword(e.target.value);
  };

  return (
    <div className="mx-auto max-w-lg rounded-lg border border-gray-300 p-3">
      <h2 className="bg-white-500 mb-4  rounded-lg p-2 text-xl font-semibold text-white">
        <img
          src="https://www.finserve.africa/images/finserve-big-logo.svg"
          alt="Finserve Logo"
          className="h-15 w-15 mr-2"
        />
      </h2>
      <h1 className="mx-auto mb-4 text-center font-bold">Bulk-sms</h1>
      <div className="w-full max-w-md">
        <h2 className="mb-4 text-center">Reset Password</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label>New Password:</label>
            <input
              type="password"
              value={password}
              onChange={handlePasswordChange}
              required
              className="block w-full rounded-md border-gray-300 p-2"
            />
          </div>
          <div className="mb-4">
            <label>Confirm Password:</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={handleConfirmPasswordChange}
              required
              className="block w-full rounded-md border-gray-300 p-2"
            />
          </div>
          <div className="flex justify-center">
            <button
              type="submit"
              className="rounded-full bg-red-500 px-4 py-2 font-bold text-white hover:bg-red-700"
            >
              Reset Password
            </button>
          </div>
        </form>
        {message && <p className="mt-4">{message}</p>}
      </div>
    </div>
  );
};

export default ResetPassword;
