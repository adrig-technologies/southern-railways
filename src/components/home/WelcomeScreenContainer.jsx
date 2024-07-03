import React from 'react'
import Link from 'next/link'

const WelcomeScreenContainer = () => {
  return (
        <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-4">Welcome, Dinesh Kumar</h1>
        <p className="text-lg mb-4">Manage your block requests efficiently and effectively.</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8 w-full">
        <div className="p-4 bg-white rounded-lg shadow-md">
          <h2 className="text-xl font-bold mb-4">Quick Actions</h2>
          <Link href='/lineblocks'
            className="bg-blue-500 text-white px-4 py-2 rounded-md mr-2"
          >
            Create Block Request
          </Link>
          <Link href='/view-requests'
            className="bg-red-500 text-white px-4 py-2 rounded-md"
          >
            View Requests
          </Link>
        </div>

        <div className="p-4 bg-white rounded-lg shadow-md">
          <h2 className="text-xl font-bold mb-4">Recent Activities</h2>
          <p className="text-sm">No recent activities to display.</p>
        </div>
        
        <div className="p-4 bg-white rounded-lg shadow-md col-span-2">
          <h2 className="text-xl font-bold mb-4">Statistics</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-gray-100 p-4 text-center">
              <h3 className="text-2xl font-bold">10</h3>
              <p className="text-sm">Block Requests Submitted</p>
            </div>
            <div className="bg-gray-100 p-4 text-center">
              <h3 className="text-2xl font-bold">5</h3>
              <p className="text-sm">Approved Requests</p>
            </div>
            <div className="bg-gray-100 p-4 text-center">
              <h3 className="text-2xl font-bold">2</h3>
              <p className="text-sm">Pending Requests</p>
            </div>
          </div>
        </div>

        <div className="p-4 bg-white rounded-lg shadow-md">
          <h2 className="text-xl font-bold mb-4">Announcements</h2>
          <p className="text-sm">No announcements at this time.</p>
        </div>
      </div>
    </main>
  )
}

export default WelcomeScreenContainer