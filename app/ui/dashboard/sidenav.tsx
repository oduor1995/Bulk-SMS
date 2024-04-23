'use client';
import Link from 'next/link';
import NavLinks from '@/app/ui/dashboard/nav-links';
import AcmeLogo from '@/app/ui/acme-logo';
import { PowerIcon } from '@heroicons/react/24/outline';

export default function SideNav() {
  const handleLogout = async (event: any) => {
    event.preventDefault();

    try {
      const username = 'otienocollinsoduor@gmail.com';

      const response = await fetch(
        'https://api-finserve-dev.finserve.africa/user-manager/api/v1/user/logout',
        {
          method: 'POST',
          // credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ username }),
        },
      );

      if (!response.ok) {
        throw new Error('Logout failed');
      }

      window.location.href = '/login';
    } catch (error) {
      console.error('Logout failed:', error);
      // Handle error, show error message, etc.
    }
  };
  return (
    <div className="flex h-full flex-col px-3 py-4 md:px-2">
      <h2 className=" bg-white-500 mx-auto mb-4 flex justify-center rounded-lg p-2 text-xl font-semibold text-white">
        <img
          src="https://www.finserve.africa/images/finserve-big-logo.svg"
          alt="Finserve Logo"
          className="h-15 w-15 "
        />
      </h2>
      {/* <Link
        className="mb-2 flex h-20 items-end justify-start rounded-md bg-red-600 p-4 md:h-40"
        href="/dashboard"
      >
        <div className="w-32 text-white md:w-40">
          <AcmeLogo />
        </div>
      </Link> */}
      <div className="flex grow flex-row justify-between space-x-2 md:flex-col md:space-x-0 md:space-y-2">
        <NavLinks />
        <div className="hidden h-auto w-full grow rounded-md bg-gray-50 md:block"></div>
        <form onSubmit={handleLogout}>
          {' '}
          {/* Use onSubmit event */}
          <button
            type="submit" // Explicitly set button type to submit
            className="flex h-[48px] w-full grow items-center justify-center gap-2 rounded-md bg-gray-50 p-3 text-sm font-medium hover:bg-sky-100 hover:text-blue-600 md:flex-none md:justify-start md:p-2 md:px-3"
            aria-label="Sign Out"
          >
            <PowerIcon className="w-6" />
            <div className="hidden md:block">Sign Out</div>
          </button>
        </form>
      </div>
    </div>
  );
}
