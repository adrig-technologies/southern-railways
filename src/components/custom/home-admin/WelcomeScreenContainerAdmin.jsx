"use client";

import React, { useState } from "react";
import Link from "next/link";
import Lottie from "lottie-react";
import { NoActivity } from "@/assets";
import {
  Mic,
  MoveRight,
  Upload,
  CalendarClock,
  ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/utils";
import useRequestCheck from "@/lib/hooks/useRequestCheck";
import useIsAdmin from "@/lib/hooks/useIsAdmin";

const getFormattedDate = () => {
  const date = new Date();
  const days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  const dayOfWeek = days[date.getDay()];
  const month = months[date.getMonth()];
  const day = date.getDate();

  // Function to get the ordinal suffix
  const getOrdinalSuffix = (day) => {
    if (day > 3 && day < 21) return "th";
    switch (day % 10) {
      case 1:
        return "st";
      case 2:
        return "nd";
      case 3:
        return "rd";
      default:
        return "th";
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
const QuickLinksCard = ({ title, description }) => (
  <div className="p-6 bg-white rounded-xl ">
    <h3 className="text-lg font-bold text-textcolor mb-2">{title}</h3>
    <p className="text-gray-600">{description}</p>
  </div>
);

const QuickLinks = ({ links }) => {
  return (
    <div className="w-full mx-auto p-6 bg-[#f7c4d4] rounded-xl col-span-2">
      <div className="mb-6">
        <h2 className="text-xl font-bold text-textcolor">Quick links</h2>
        <p className="text-gray-600">There are requests to be optimised.</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {links.map((link, index) => (
          <QuickLinksCard
            key={index}
            title={link.title}
            description={link.description}
          />
        ))}
      </div>
    </div>
  );
};
const ScheduleCard = ({ schedules }) => {
  return (
    <div className="w-full mx-auto p-6 bg-[#f7c4d4] rounded-xl col-span-2">
      <div className="flex justify-between items-center mb-4">
        <span className="text-xl font-bold text-textcolor">
          Station Schedules
        </span>
        <a href="#" className="text-purple-700">
          View all
        </a>
      </div>
      <p className="text-gray-600 mb-6">There are requests to be optimised.</p>
      <div className="space-y-1">
        {schedules.map((schedule, index) => (
          <div
            key={index}
            className="flex items-center justify-between py-1 px-3 bg-white rounded-md"
          >
            <div className="flex items-center">
              <CalendarClock className="mr-3" />
              <div>
                <p className="font-medium text-black">{schedule.station}</p>
                <p className="text-gray-600">{schedule.details}</p>
              </div>
            </div>
            <ChevronRight />
          </div>
        ))}
      </div>
    </div>
  );
};

const generateDummyData = () => {
  const data = [
    [
      "Month",
      "Requests Made",
      "Requests Accepted",
      "Requests Rejected",
      "Requests Pending",
    ],
    ["Jan", 30, 20, 5, 5],
    ["Feb", 42, 25, 10, 7],
    ["Mar", 50, 30, 15, 5],
    ["Apr", 65, 40, 20, 5],
    ["May", 80, 50, 25, 5],
    ["Jun", 55, 35, 15, 5],
    ["Jul", 72, 45, 20, 7],
    ["Aug", 90, 55, 30, 5],
    ["Sep", 85, 50, 25, 10],
    ["Oct", 60, 40, 15, 5],
    ["Nov", 45, 30, 10, 5],
    ["Dec", 35, 25, 5, 5],
  ];
  return data;
};

const WelcomeScreenContainerUser = () => {

  const { requestCheck, isFetching, error } = useRequestCheck();

  const data = generateDummyData();
  const handleFileChange = async (event) => {
    const selectedFile = event.target.files[0];

    if (!selectedFile) {
      alert('Please select a file to upload');
      return;
    }

    const formData = new FormData();
    formData.append('file', selectedFile);

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/upload`, {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();

      if (response.ok) {
        alert(result.message);
      } else {
        alert(result.error);
      }
    } catch (error) {
      console.error('Error uploading file:', error);
      alert('Error uploading file');
    }
  };

  const { isAdmin, isLoading } = useIsAdmin();

  const options = {
    title: "Requests Over Time",
    hAxis: { title: "Requests" },
    vAxis: { title: "Month" },
    legend: "bottom",
    colors: ["#1e3a8a", "#22c55e", "#ef233c", "#f97316"], // Use appropriate colors
  };
  return (
    <div className="flex min-h-screen flex-col items-center w-full space-y-6">
      <section className="bg-secondary w-full rounded-xl flex flex-col items-start space-y-4 p-6">
        <div className="w-full flex items-start justify-between">
          <div className="text-center flex flex-col items-start">
            <span className="text-md mb-4 text-slate-500 font-sans font-medium">
              {getFormattedDate()}
            </span>
            <h1 className="text-3xl font-bold mb-4 text-slate-950">
              Welcome, Admin 🎉
            </h1>
            <p className="text-md text-textcolor mb-4">
              Manage your block requests efficiently and effectively.
            </p>
          </div>
          {/* <Button className="bg-secondary-foreground text-textcolor flex items-center space-x-4 p-4 font-semibold rounded-full">
        <CircleUserRound />
        <span>Admin</span>
        </Button> */}
        </div>
        <div className="flex gap-x-4">
          <div className="w-64 p-4 bg-primary rounded-xl text-textcolor shadow-md col-span-1 flex flex-col items-center justify-between space-y-2">
            <h2 className="text-xl font-bold  w-full text-start">
              Upload Bulk Request
            </h2>
            <p className="text-xs text-left w-full">
              There are request to be optimised 
            </p>
            <div className="w-full flex justify-between pt-2">
      <input
        type="file"
        accept=".csv"
        onChange={handleFileChange}
        className="hidden"
        id="fileUpload"
      />
      <label
        htmlFor="fileUpload"
        className="bg-white text-sm text-center font-semibold px-6 py-2 flex items-center rounded-full mr-2 cursor-pointer"
      >
        <Upload />
        <span className="ml-2 text-nowrap text-center">Upload</span>
      </label>
    </div>
    </div>

          <div className={cn("w-64 p-4  rounded-xl text-textcolor shadow-md col-span-1 flex flex-col items-center justify-between space-y-2 bg-primary", !requestCheck && "bg-gray-300" )}>
            <h2 className="text-xl font-bold  w-full text-start">Requests</h2>
            <p className="text-xs text-left w-full">
              There are request to be optimised
            </p>
            <div className="w-full flex justify-between pt-2">
              <Link
                href="/schedule-manager"
                passHref
                className={cn("bg-white  text-sm text-center font-semibold px-6 py-2 flex items-center rounded-full  mr-2",
                  !requestCheck && "pointer-events-none  opacity-50"
                )}
                
              >
                <MoveRight />{" "}
                <span className=" ml-2 text-nowrap text-center ">Open</span>
              </Link>
            </div>
          </div>

          <div className="w-64 p-4 bg-primary rounded-xl text-textcolor shadow-md col-span-1 flex flex-col items-center justify-between space-y-2">
            <h2 className="text-xl font-bold  w-full text-start">Corridors</h2>
            <p className="text-xs text-left w-full">Manage your corridors</p>
            <div className="w-full flex justify-between pt-2">
              <Link
                href="/block-request"
                className="bg-white  text-sm text-center font-semibold px-6 py-2 flex items-center rounded-full  mr-2"
              >
                <MoveRight />{" "}
                <span className=" ml-2 text-nowrap text-center ">Open</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* <div className="bg-secondary"> */}

      {/* <h2 className="text-xl text-textcolor ">Total Request Made</h2> */}

      <div className="bg-secondary p-6 w-full">
        <h2 className="text-xl text-textcolor mb-4 w-full">
          How this week looks
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 w-full rounded-xl">
          <ScheduleCard
            schedules={[
              { station: "AAK - FSS", details: "4 Schedules and 2 Conflicts" },
              { station: "JIY - FSS", details: "7 Schedules and 2 Conflicts" },
              { station: "AHM - FSS", details: "8 Schedules and 1 Conflict" },
              { station: "RTT - FSS", details: "4 Schedules and no Conflicts" },
              { station: "RTT - FSS", details: "1 Schedule and no Conflicts" },
            ]}
          />
          <QuickLinks
            links={[
              {
                title: "This Week",
                description: "There are requests to be optimised.",
              },
              { title: "Users", description: "Manage your users" },
              {
                title: "Timeslots",
                description: "Edit and manage your timeslots",
              },
              { title: "Optimize", description: "Optimise Requests" },
            ]}
          />

          <div className="flex flex-col h-full col-span-2 justify-start space-y-8">
            <div className="p-4 bg-primary rounded-xl shadow-md">
              <h2 className="text-xl font-semibold mb-4 font-sans text-textcolor">
                Recent Activities
              </h2>
              <div className="w-full flex flex-col items-center">
                <Lottie
                  animationData={NoActivity}
                  loop={true}
                  className="w-36 h-36"
                />
                <p className="text-sm font-medium text-textcolor">
                  No recent activities to display.
                </p>
              </div>
            </div>

            <div className="p-4 bg-white rounded-xl shadow-md border-t">
              <h2 className="text-xl font-semibold mb-4 font-sans text-textcolor">
                Announcements
              </h2>
              <div className="w-full flex flex-col items-center space-y-4 text-textcolor">
                <Mic className="w-10 h-10" />
                <p className="text-sm font-medium">
                  No announcements at this time.
                </p>
              </div>
            </div>
          </div>
          {/* <div className="p-4 bg-white rounded-xl border-t shadow-md col-span-2">
            <h2 className="text-xl font-bold mb-4">Statistics</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-blue-400 hover:bg-blue-500 ease-in-out duration-300 py-6 text-center rounded-3xl text-slate-50 flex flex-col items-center space-y-2">
                <div className="w-10 h-10 bg-white rounded-full shadow-md animate-pulse shadow-slate-900 text-blue-400 flex items-center justify-center">
                  <Send />
                </div>
                <h3 className="text-2xl font-bold">10</h3>
                <p className="text-sm">Block Requests Submitted</p>
              </div>
              <div className="bg-green-400 hover:bg-green-500 ease-in-out duration-300 py-6 text-center rounded-3xl text-slate-50 flex flex-col items-center space-y-2">
                <div className="w-10 h-10 bg-white rounded-full shadow-md animate-bounce shadow-slate-900 text-green-400 flex items-center justify-center">
                  <CircleCheck />
                </div>
                <h3 className="text-2xl font-bold">5</h3>
                <p className="text-sm">Approved Requests</p>
              </div>
              <div className="bg-orange-400 hover:bg-orange-500 ease-in-out duration-300 py-6 text-center rounded-3xl text-slate-50 flex flex-col items-center space-y-2">
                <div className="w-10 h-10 bg-white rounded-full text-orange-400 animate-spin flex items-center justify-center">
                  <CircleDashed />
                </div>
                <h3 className="text-2xl font-bold">2</h3>
                <p className="text-sm">Pending Requests</p>
              </div>
            </div>
          </div> */}
        </div>
      </div>
    </div>
  );
};

export default WelcomeScreenContainerUser;
