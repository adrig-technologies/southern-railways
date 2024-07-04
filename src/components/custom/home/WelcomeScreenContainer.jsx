'use client'

import React from 'react'
import Link from 'next/link'
import Lottie from 'lottie-react';
import { NoActivity } from '@/assets';
import { Chart } from 'react-google-charts';
import { Mic, CircleCheck, CircleDashed, Send, Activity  } from 'lucide-react';

const getFormattedDate = () => {
  const date = new Date();
  const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  const dayOfWeek = days[date.getDay()];
  const month = months[date.getMonth()];
  const day = date.getDate();

  // Function to get the ordinal suffix
  const getOrdinalSuffix = (day) => {
    if (day > 3 && day < 21) return 'th';
    switch (day % 10) {
      case 1: return 'st';
      case 2: return 'nd';
      case 3: return 'rd';
      default: return 'th';
    }
  };

  const ordinalSuffix = getOrdinalSuffix(day);
  return (
    <>
      {dayOfWeek}, {month} {day}
      <sup>{ordinalSuffix}</sup>
    </>
  );
};

const generateDummyData = () => {
  const data = [
    ['Month', 'Requests Made', 'Requests Accepted', 'Requests Rejected', 'Requests Pending'],
    ['Jan', 30, 20, 5, 5],
    ['Feb', 42, 25, 10, 7],
    ['Mar', 50, 30, 15, 5],
    ['Apr', 65, 40, 20, 5],
    ['May', 80, 50, 25, 5],
    ['Jun', 55, 35, 15, 5],
    ['Jul', 72, 45, 20, 7],
    ['Aug', 90, 55, 30, 5],
    ['Sep', 85, 50, 25, 10],
    ['Oct', 60, 40, 15, 5],
    ['Nov', 45, 30, 10, 5],
    ['Dec', 35, 25, 5, 5],
  ];
  return data;
};


const WelcomeScreenContainer = () => {
  const data = generateDummyData();
  console.log(data)

  const options = {
    title: 'Requests Over Time',
    hAxis: { title: 'Requests' },
    vAxis: { title: 'Month' },
    legend: 'bottom',
  };
  return (
        <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="text-center flex flex-col">
      <span className="text-md mb-4 text-slate-500 font-sans font-medium">{getFormattedDate()}</span>
        <h1 className="text-3xl font-bold mb-4 text-slate-950">Welcome, Dinesh Kumar 🎉</h1>
        <p className="text-md text-slate-800 mb-4">Manage your block requests efficiently and effectively.</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-8 w-full">
        <div className="p-6 bg-white border-t rounded-lg shadow-md col-span-2">
          <h2 className="text-xl text-slate-400 mb-4">Total Request Made</h2>
          <span className='text-5xl font-bold'>4,650</span>
          <div className="py-6">
          <Chart
      chartType="ScatterChart"
      width="100%"
      height="360px"
      data={data}
      options={options}
    />
        </div>
        </div>

<div className='flex flex-col h-full col-span-1 justify-start space-y-8'>
<div className="p-4 bg-slate-50 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4 font-sans text-slate-800">Recent Activities</h2>
          <div className='w-full flex flex-col items-center'>
          <Lottie animationData={NoActivity} loop={true} className='w-36 h-36' />
          <p className="text-sm font-medium text-slate-400">No recent activities to display.</p>
          </div>
        </div>
        
        <div className="p-4 bg-white rounded-lg shadow-md border-t">
          <h2 className="text-xl font-semibold mb-4 font-sans text-slate-800">Announcements</h2>
          <div className='w-full flex flex-col items-center space-y-4 text-slate-400'>
          <Mic className='w-10 h-10' />
          <p className="text-sm font-medium">No announcements at this time.</p>
          </div>
        </div>
</div>
        <div className="p-4 bg-slate-800 rounded-xl shadow-md col-span-1 flex flex-col items-center justify-between">
          <h2 className="text-xl text-slate-50 font-bold mb-4 w-full text-start">Quick Actions</h2>
          <Activity className='w-10 h-10 text-slate-400 animate-pulse' />
          <div className='w-full flex justify-between'>
          <Link href='/block-request'
            className="bg-blue-500 text-sm text-center hover:bg-blue-600 w-full text-white font-semibold px-4 py-2 rounded-md mr-2"
          >
            Create Block Request
          </Link>
          <Link href='/view-requests'
            className="bg-red-500 text-sm text-center hover:bg-red-600 w-full text-white font-semibold px-4 py-2 rounded-md"
          >
            View Requests
          </Link>
          </div>
        </div>
        <div className="p-4 bg-white rounded-lg border-t shadow-md col-span-2">
          <h2 className="text-xl font-bold mb-4">Statistics</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-blue-400 hover:bg-blue-500 ease-in-out duration-300 py-6 text-center rounded-3xl text-slate-50 flex flex-col items-center space-y-2">
              <div className='w-10 h-10 bg-white rounded-full shadow-md animate-pulse shadow-slate-900 text-blue-400 flex items-center justify-center'>
              <Send />
              </div>
              <h3 className="text-2xl font-bold">10</h3>
              <p className="text-sm">Block Requests Submitted</p>
            </div>
            <div className="bg-green-400 hover:bg-green-500 ease-in-out duration-300 py-6 text-center rounded-3xl text-slate-50 flex flex-col items-center space-y-2">
            <div className='w-10 h-10 bg-white rounded-full shadow-md animate-bounce shadow-slate-900 text-green-400 flex items-center justify-center'>
            <CircleCheck />
              </div>
              <h3 className="text-2xl font-bold">5</h3>
              <p className="text-sm">Approved Requests</p>
            </div>
            <div className="bg-orange-400 hover:bg-orange-500 ease-in-out duration-300 py-6 text-center rounded-3xl text-slate-50 flex flex-col items-center space-y-2">
            <div className='w-10 h-10 bg-white rounded-full text-orange-400 animate-spin flex items-center justify-center'>
            <CircleDashed />
              </div>
              <h3 className="text-2xl font-bold">2</h3>
              <p className="text-sm">Pending Requests</p>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}

export default WelcomeScreenContainer