"use client";

import React from "react";
import Link from "next/link";
import Lottie from "lottie-react";
import { NoActivity } from "@/assets";
import { Chart } from "react-google-charts";
import {
  Mic,
  CircleCheck,
  CircleDashed,
  Send,
  Activity,
  CircleUserRound,
  MoveRight,
  Upload,
  Calendar,
  ArrowBigRight,
  AlignRightIcon,
  Play,
  ChevronRightIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";

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
  const data = generateDummyData();

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
              <Link
                href="/block-request"
                className="bg-white  text-sm text-center font-semibold px-6 py-2 flex items-center rounded-full  mr-2"
              >
                <Upload />{" "}
                <span className=" ml-2 text-nowrap text-center ">Open</span>
              </Link>
            </div>
          </div>

          <div className="w-64 p-4 bg-primary rounded-xl text-textcolor shadow-md col-span-1 flex flex-col items-center justify-between space-y-2">
            <h2 className="text-xl font-bold  w-full text-start">Requests</h2>
            <p className="text-xs text-left w-full">
              There are request to be optimised
            </p>
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
          <div className="p-6 bg-primary border-t rounded-xl shadow-md col-span-2">
            <h2 className="text-xl text-textcolor ">Station Schedules</h2>
            <span className="text-xs font-bold">
              There are request to be optimised
            </span>
            <div className="py-6">
              <div className="bg-white flex text-xs mb-1">
                <Calendar className="my-auto mr-2" />
                <div>
                  <p>AAK-FFS</p>
                  <p>4 Schedules and 2 Conflicts</p>
                </div>
                <ChevronRightIcon className="my-auto ml-auto mr-2" />
              </div>
              <div className="bg-white flex text-xs mb-1">
                <Calendar className="my-auto mr-2" />
                <div>
                  <p>AAK-FFS</p>
                  <p>4 Schedules and 2 Conflicts</p>
                </div>
                <ChevronRightIcon className="my-auto ml-auto mr-2" />
              </div>
              <div className="bg-white flex text-xs mb-1">
                <Calendar className="my-auto mr-2" />
                <div>
                  <p>AAK-FFS</p>
                  <p>4 Schedules and 2 Conflicts</p>
                </div>
                <ChevronRightIcon className="my-auto ml-auto mr-2" />
              </div>
              <div className="bg-white flex text-xs mb-1">
                <Calendar className="my-auto mr-2" />
                <div>
                  <p>AAK-FFS</p>
                  <p>4 Schedules and 2 Conflicts</p>
                </div>
                <ChevronRightIcon className="my-auto ml-auto mr-2" />
              </div>
              <div className="bg-white flex text-xs mb-1">
                <Calendar className="my-auto mr-2" />
                <div>
                  <p>AAK-FFS</p>
                  <p>4 Schedules and 2 Conflicts</p>
                </div>
                <ChevronRightIcon className="my-auto ml-auto mr-2" />
              </div>
              <div className="bg-white flex text-xs mb-1">
                <Calendar className="my-auto mr-2" />
                <div>
                  <p>AAK-FFS</p>
                  <p>4 Schedules and 2 Conflicts</p>
                </div>
                <ChevronRightIcon className="my-auto ml-auto mr-2" />
              </div>
              <div className="bg-white flex text-xs mb-1">
                <Calendar className="my-auto mr-2" />
                <div>
                  <p>AAK-FFS</p>
                  <p>4 Schedules and 2 Conflicts</p>
                </div>
                <ChevronRightIcon className="my-auto ml-auto mr-2" />
              </div>
            </div>
          </div>

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
          <div className="p-4 bg-white rounded-xl border-t shadow-md col-span-2">
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
          </div>
        </div>
      </div>
    </div>
  );
};

export default WelcomeScreenContainerUser;
