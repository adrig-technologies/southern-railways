"use client";

import Link from "next/link";
import React, { useState } from "react";
import { House, CalendarCog, CirclePlus, LogOut, Settings, TrainTrack, CalendarCheck } from "lucide-react";
import { usePathname } from "next/navigation";
import useOptimizedCheck from "../../lib/hooks/useOptimizedCheck";
import useIsAdmin from "../../lib/hooks/useIsAdmin";
import { OrganizationProfile, SignOutButton, UserProfile } from "@clerk/nextjs";

const SidebarMenu = () => {

  const { optimizedCheck, isFetching, error }= useOptimizedCheck();

  const [blockDetailsOpen, setBlockDetailsOpen] = useState(false);
  const [blocksSummaryOpen, setBlocksSummaryOpen] = useState(false);
  const pathname = usePathname();
  const { isAdmin, isLoading } = useIsAdmin();

  const handleBlockDetailsClick = () => {
    setBlockDetailsOpen(!blockDetailsOpen);
  };

  const handleBlocksSummaryClick = () => {
    setBlocksSummaryOpen(!blocksSummaryOpen);
  };

  return (
    <div className="font-sans flex flex-col space-y-4 p-4 h-full bg-secondary text-textcolor rounded-xl col-span-2">
      <span className="px-5 font-medium">Maintenance Management</span>
      <div className="flex-1 flex flex-col space-y-4 px-4">
        {/* <p className="text-lg font-bold px-4">Chennai Division</p>
            <div className="px-4 mb-4">
              <p className="text-xs text-textcolor">
                Welcome, <br />
                <strong className="text-slate-200 ml-2 text-lg">
                  Dinesh Kumar
                </strong>
              </p>
            </div> */}
        <nav className="space-y-1 text-sm border-b-2 border-secondary-foreground">
          <Link
            href="/admin-home"
            className={`flex items-center hover:bg-secondary-foreground rounded-full p-4 font-semibold ease-in-out duration-300 w-full 
              ${pathname === "/admin-home" && "bg-primary" }
              ${!isAdmin && "hidden" }
              
              `}
          >
            <House className="w-4 h-4 mr-2" />
            <span>Home</span>
          </Link>

          <Link
            href="/"
            className={`flex items-center hover:bg-secondary-foreground rounded-full p-4 font-semibold ease-in-out duration-300 w-full 
              ${pathname === "/admin-home" && "bg-primary" }
              ${isAdmin && "hidden" }
              
              `}
          >
            <House className="w-4 h-4 mr-2" />
            <span>Home</span>
          </Link>

          <Link
            href="/block-request"
            className={`flex items-center hover:bg-secondary-foreground rounded-full p-4 font-semibold ease-in-out duration-300 w-full
              ${isAdmin && "hidden" }
              ${pathname === "/block-request" && "bg-primary" }

            `}
          >
            <CirclePlus className="w-4 h-4 mr-2" />
            <span>Create Block Request</span>
          </Link> 


          <Link
            href="/schedule-manager"
            className={`flex items-center hover:bg-secondary-foreground rounded-full p-4 font-semibold ease-in-out duration-300 w-full ${
              pathname === "/schedule-manager" && "bg-primary" 
            }`}
          >
            <CalendarCog className="w-4 h-4 mr-2" />
            <span>Request Table</span>
          </Link>
          <Link
            href="/corridor-table"
            className={`flex items-center hover:bg-secondary-foreground rounded-full p-4 font-semibold ease-in-out duration-300 w-full 
              ${pathname === "/corridor-table" && "bg-primary" }
              ${!isAdmin && "hidden" }
              
              `}
          >
            <TrainTrack className="w-4 h-4 mr-2" />
            <span>Corridor</span>
          </Link>
          <Link
            href="/optimised-table"
            className={`flex items-center hover:bg-secondary-foreground rounded-full p-4 font-semibold ease-in-out duration-300 w-full 
              ${ pathname === "/optimised-table" && "bg-primary" }
              ${ !optimizedCheck && "hidden" }
              
              `}
          >
            <CalendarCheck className="w-4 h-4 mr-2" />
            <span>Optimised Table</span>
          </Link>
          
        
          {/* <Link
            href="/schedule-manager"
            className="flex items-center hover:bg-secondary-foreground hover:rounded-full p-4 font-semibold ease-in-out duration-300 w-full"
          >
            <CalendarCog className="w-4 h-4 mr-2" />
            <span>Schedule Manager</span>
          </Link>
          */}
          {/* 
            <Link href="/requests" className="flex items-center px-4 py-2 hover:bg-slate-300 hover:text-slate-950 font-medium ease-in-out duration-300 w-full">
            <Pencil className="w-4 h-4 mr-2" />
              <span>Requests</span>
            </Link>
            <Link href="/suggested" className="flex items-center px-4 py-2 hover:bg-slate-300 hover:text-slate-950 font-medium ease-in-out duration-300 w-full">
            <CircleUser className="w-4 h-4 mr-2"/>
              <span>Suggested Block Requests (user)</span>
            </Link>
            <Link href="/suggest" className="flex items-center px-4 py-2 hover:bg-slate-300 hover:text-slate-950 font-medium ease-in-out duration-300 w-full">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 mr-2" viewBox="0 0 36 36"><path fill="currentColor" d="M14.68 14.81a6.76 6.76 0 1 1 6.76-6.75a6.77 6.77 0 0 1-6.76 6.75m0-11.51a4.76 4.76 0 1 0 4.76 4.76a4.76 4.76 0 0 0-4.76-4.76" class="clr-i-outline clr-i-outline-path-1"/><path fill="currentColor" d="M16.42 31.68A2.14 2.14 0 0 1 15.8 30H4v-5.78a14.81 14.81 0 0 1 11.09-4.68h.72a2.2 2.2 0 0 1 .62-1.85l.12-.11c-.47 0-1-.06-1.46-.06A16.47 16.47 0 0 0 2.2 23.26a1 1 0 0 0-.2.6V30a2 2 0 0 0 2 2h12.7Z" class="clr-i-outline clr-i-outline-path-2"/><path fill="currentColor" d="M26.87 16.29a.37.37 0 0 1 .15 0a.42.42 0 0 0-.15 0" class="clr-i-outline clr-i-outline-path-3"/><path fill="currentColor" d="m33.68 23.32l-2-.61a7.21 7.21 0 0 0-.58-1.41l1-1.86A.38.38 0 0 0 32 19l-1.45-1.45a.36.36 0 0 0-.44-.07l-1.84 1a7.15 7.15 0 0 0-1.43-.61l-.61-2a.36.36 0 0 0-.36-.24h-2.05a.36.36 0 0 0-.35.26l-.61 2a7 7 0 0 0-1.44.6l-1.82-1a.35.35 0 0 0-.43.07L17.69 19a.38.38 0 0 0-.06.44l1 1.82a6.77 6.77 0 0 0-.63 1.43l-2 .6a.36.36 0 0 0-.26.35v2.05A.35.35 0 0 0 16 26l2 .61a7 7 0 0 0 .6 1.41l-1 1.91a.36.36 0 0 0 .06.43l1.45 1.45a.38.38 0 0 0 .44.07l1.87-1a7.09 7.09 0 0 0 1.4.57l.6 2a.38.38 0 0 0 .35.26h2.05a.37.37 0 0 0 .35-.26l.61-2.05a6.92 6.92 0 0 0 1.38-.57l1.89 1a.36.36 0 0 0 .43-.07L32 30.4a.35.35 0 0 0 0-.4l-1-1.88a7 7 0 0 0 .58-1.39l2-.61a.36.36 0 0 0 .26-.35v-2.1a.36.36 0 0 0-.16-.35M24.85 28a3.34 3.34 0 1 1 3.33-3.33A3.34 3.34 0 0 1 24.85 28" class="clr-i-outline clr-i-outline-path-4"/><path fill="none" d="M0 0h36v36H0z"/></svg>
              <span>Suggest Line Block (admin)</span>
            </Link>
            <Link href="/view-requests" className="flex items-center px-4 py-2 hover:bg-slate-300 hover:text-slate-950 font-medium ease-in-out duration-300 w-full">
              <Eye className="w-4 h-4 mr-2" />
              <span>View Block Requests</span>
            </Link>
            <Link href="/corridor" className="flex items-center px-4 py-2 hover:bg-slate-300 hover:text-slate-950 font-medium ease-in-out duration-300 w-full">
            <CalendarClock className="w-4 h-4 mr-2" />
              <span>Corridor Table</span>
            </Link>
            <Link href="/request-view" className="flex items-center px-4 py-2 hover:bg-slate-300 hover:text-slate-950 font-medium ease-in-out duration-300 w-full">
            <CalendarCog  className="w-4 h-4 mr-2"/>
              <span>Request Table</span>
            </Link>
            <Link href="/optimize-timeline" className="flex items-center px-4 py-2 hover:bg-slate-300 hover:text-slate-950 font-medium ease-in-out duration-300 w-full">
            <CalendarCheck2 className="w-4 h-4 mr-2"/>
              <span>Optimized Table</span>
            </Link> */}
        </nav>
      </div>
      <div className="px-2 w-[90%] mx-auto py-4 border-t-2 border-secondary-foreground flex flex-col items-start space-y-2">
        <span className="px-2 font-medium">System</span>
        <Link href="/user-profile">
        <div className="flex items-center hover:bg-secondary-foreground hover:rounded-full px-4 py-2 font-semibold ease-in-out duration-300 w-full">
          <Settings className="w-4 h-4 mr-2" />
          <span>Setting</span>
        </div>
        </Link>
        <SignOutButton >
        <div className="flex cursor-pointer items-center hover:bg-secondary-foreground hover:rounded-full px-4 py-2 font-semibold ease-in-out duration-300 w-full">
          <LogOut className="w-4 h-4 mr-2" />
          <span>Sign Out</span>
        </div>
        </SignOutButton>
      </div>
    </div>
  );
};

export default SidebarMenu;
