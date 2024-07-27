"use client";

import React, { useState, useEffect } from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import Loader from "../Loader";
import moment from "moment";

const WeekSchedule = ({ isStationFetching, scheduleDataByStation }) => {
  const [api, setApi] = useState(null);
  const [current, setCurrent] = useState(1);

  useEffect(() => {
    if (!api) {
      return;
    }

    // Clean up event listener on component unmount
    return () => {
      api.off("select");
    };
  }, [api]);

  const handleItemClick = (index) => {
    setCurrent(index + 1);
  };

  return (
    <div className="w-full px-24 flex flex-1 h-full rounded-xl flex-col items-center space-y-10 pt-10 bg-secondary">
      {isStationFetching ? (
        <div className="w-full h-full flex items-center justify-center">
          <Loader />
        </div>
      ) : (
        scheduleDataByStation && (
          <section className="w-full">
            <Carousel
              opts={{
                align: "start",
              }}
              className="w-full"
              setApi={setApi}
            >
              <CarouselContent className="mx-[1.24rem]">
                {scheduleDataByStation.week.map((day, index) => (
                  <CarouselItem
                    key={index}
                    className={`h-[10%] md:basis-1/2 lg:basis-1/4 bg-cardbg mx-[0.96rem] text-textcolor bg-white font-semibold rounded-lg ${
                      current === index + 1
                        ? "bg-primary font-black"
                        : "hover:bg-primary-foreground ease-in-out duration-200"
                    }`}
                    onClick={() => handleItemClick(index)}
                  >
                    <div className="py-2 flex flex-col items-start space-y-2">
                      <span>{moment(day.date).format("DD/MM/YYYY")}</span>
                      <div className="flex flex-col items-start space-y-2">
                        <div className="flex items-center space-x-2">
                          <div className="w-4 aspect-square rounded-full bg-orange-400 animate-pulse"></div>
                          <span className="text-sm font-semibold">
                            <strong>{day.conflictCount}</strong> no. of conflicts
                          </span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <div className="w-4 aspect-square rounded-full bg-blue-400 animate-pulse"></div>
                          <span className="text-sm font-semibold">
                            <strong>{day.availableSlot}</strong> no. of slots available
                          </span>
                        </div>
                      </div>
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious />
              <CarouselNext />
            </Carousel>
          </section>
        )
      )}
    </div>
  );
};

export default WeekSchedule;
