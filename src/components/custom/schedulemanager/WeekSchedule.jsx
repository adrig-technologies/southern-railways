'use client'

import React from "react";
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/components/ui/carousel";

const WeekSchedule = () => {
  const [api, setApi] = React.useState(null);
  const [current, setCurrent] = React.useState(1);
  const [count, setCount] = React.useState(1);

  React.useEffect(() => {
    if (!api) {
      return;
    }

    setCount(api.scrollSnapList().length);

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
      <section className="w-full">
        <Carousel
          opts={{
            align: "start",
          }}
          className="w-full"
          setApi={setApi}
        >
          <CarouselContent className="mx-[1.24rem]">
            {Array.from({ length: 7 }).map((_, index) => (
              <CarouselItem
                key={index}
                className={`h-[5.6rem] md:basis-1/2 lg:basis-1/4 bg-cardbg mx-[0.96rem] text-textcolor bg-white font-semibold rounded-lg ${
                  current === index + 1 ? 'bg-primary font-black' : 'hover:bg-primary-foreground ease-in-out duration-200'
                }`}
                onClick={() => handleItemClick(index)}
              >
                <div className="p-1">
                  <span>{index + 1}</span>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
      </section>
    </div>
  );
};

export default WeekSchedule;
