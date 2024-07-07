'use client'

import { useState, useEffect } from "react";
import axios from "axios";
import GanttChart from "../GanttChart";
import { formatDate } from '@/lib/utils';
import moment from "moment";
import Image from 'next/image';
import Loader from '../Loader';
import { RequestTimeline } from "@/assets";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import Spinner from "../Spinner";
import HeaderContent from "../HeaderContent";

const RequestViewContainer = () => {
  const [sectionData, setSectionData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const [isOptimizing, setIsOptimizing] = useState(false);

  useEffect(() => {
    async function fetchData() {
      setIsLoading(true)
      try {
        const res = await axios.post("http://localhost:4000/getRequests",{
          startDate: moment().subtract(10, "years"),
          endDate:new Date('2025-07-07').toISOString(),
        });
          setSectionData(res.data.map(block=>{
            console.log(block);
                  return {
                id:block.Station.Station,
                team:formatDate(block.startTime),
                name:block.Req_ID,
                machine: block.Machine.Machine_ID,
                start:moment(block.startTime).format("HH:mm"),
                end:moment(block.endTime).format("HH:mm")
              }
            }));
        console.log(res.data)
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false)
      }
    }
    fetchData();
  }, []);

  const optimizeTimelineHandler = () => {
    setIsOptimizing(true);
    setTimeout(() => {
      router.push('/optimize-timeline')
      setIsOptimizing(false);
    }, 4000)
  }

  return (
    <div className="w-4/5 min-h-screen flex flex-col space-y-8 p-24 items-center mx-auto">
      <HeaderContent title='Request Timeline' description='The request block timeline consists of all the requests raised by the all the users and visualise them into a timeline chart and if the request timings overlap on one another, it has a red overlay on top of the request blocks.' img={RequestTimeline} />
      {isLoading ? (
        <div className='w-full flex-1 h-full flex items-center justify-center text-xl font-semibold text-slate-800'>
        <Loader />
        </div>
      ) : (
        <GanttChart tasks={sectionData}/>
      )}
      {!isLoading && <Button className="w-56" onClick={optimizeTimelineHandler}>{isOptimizing ? <Spinner /> : <span>Optimize Timeline</span> } </Button>}
    </div>
  )
}

export default RequestViewContainer;
