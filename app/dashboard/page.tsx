'use client';
import { lusitana } from '@/app/ui/fonts';
import React from 'react';
import { ActionAreaCard } from '@/app/ui/dashboard/card';
import { SimpleLineChart } from '@/app/ui/dashboard/charts';
import { UserProfile } from '@/app/ui/dashboard/userProfile';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';

export default async function Page() {
  return (
    <main>
      <h1 className={`${lusitana.className} mb-4 text-xl md:text-2xl`}>
        Dashboard
      </h1>
      <div className="fixed right-8 top-0">
        <AccountCircleIcon style={{ fontSize: 30, marginRight: 8 }} />
        <UserProfile />
      </div>
      <div>
        <div className="col-span-full mx-auto flex justify-between space-x-6">
          <div className="w-1/3">
            <ActionAreaCard
              image="https://cdn.mos.cms.futurecdn.net/6ZYk9A8EBh62fytQ64a5JW-1600-80.jpg.webp"
              title="Sms Sent"
              description="Stay connected and informed "
              bgColor="#d0d0d0"
              textColor="#333"
            />
          </div>
          <div className="w-1/3">
            <ActionAreaCard
              image="https://www.infotectraining.com/sites/default/files/field/image/infotec_75.png"
              title="Total Customers"
              description="Join our growing community of satisfied customers"
              bgColor="#d0d0d0"
              textColor="#444"
            />
          </div>
          <div className="w-1/3">
            <ActionAreaCard
              image="https://www.finserve.africa/images/equitel-logo.svg"
              title="Sms Campaign"
              description="Unlock greater engagement and reach with  SMS campaigns"
              bgColor="#d0d0d0"
              textColor="#555"
            />
          </div>
          {/* <DashboardCard /> */}
        </div>
      </div>
      <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-4 lg:grid-cols-8">
        <SimpleLineChart />
      </div>
    </main>
  );
}
