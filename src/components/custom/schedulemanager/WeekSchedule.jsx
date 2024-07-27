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
import { Button } from "@/components/ui/button";

const WeekSchedule = ({ isStationFetching, scheduleDataByStation }) => {
  const [api, setApi] = useState(null);
  const [current, setCurrent] = useState(1);
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {}, [isStationFetching]);

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

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      alert("Please select a file to upload.");
      return;
    }

    const formData = new FormData();
    formData.append("csrFile", selectedFile);

    try {
      setUploading(true);
      const response = await fetch('/api/upload', { // Adjust the URL to your API endpoint
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }

      // Handle response data if needed
      const result = await response.json();
      console.log('File uploaded successfully:', result);
      alert("File uploaded successfully!");
      setSelectedFile(null); // Clear the file input after upload
    } catch (error) {
      console.error('Error uploading file:', error);
      alert("Error uploading file.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="w-full px-24 flex flex-1 h-full rounded-xl flex-col items-center space-y-10 pt-10 bg-secondary">
      {isStationFetching ? (
        <div className="w-full h-full flex items-center justify-center">
          <Loader />
        </div>
      ) : (
        scheduleDataByStation && scheduleDataByStation.week.length > 0 ? (
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
        ) : (
          <div className="w-full h-full flex items-center justify-center flex-col space-y-4">
            <input
              type="file"
              accept=".csr" // Adjust based on your file type
              onChange={handleFileChange}
              className="mb-4 w-1/2"
            />
            <Button 
              className="text-textcolor" 
              onClick={handleUpload} 
              disabled={uploading}
            >
              {uploading ? 'Uploading...' : 'Upload CSR'}
            </Button>
          </div>
        )
      )}
    </div>
  );
};

export default WeekSchedule;
