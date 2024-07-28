"use client";

import React, { useState, useEffect } from "react";
import { Check } from "lucide-react";
import { GanttChartModern } from "../GanttChartModern";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import moment from "moment"
const data={
  "endDate": "08/11/2023",
  "startDate": "08/07/2023",
  "week": [
      {
          "date": "8/7/2023",
          "stations": [
              {
                  "requests": [
                      {
                          "clashed": false,
                          "endHour": "15:30",
                          "startHour": "00:30"
                      }
                  ],
                  "stationName": "AJJ-AJJN"
              },
              {
                  "requests": [
                      {
                          "clashed": false,
                          "endHour": "14:00",
                          "startHour": "00:30"
                      },
                      {
                          "clashed": false,
                          "endHour": "15:00",
                          "startHour": "14:00"
                      }
                  ],
                  "stationName": "VKZ-NG"
              },
              {
                  "requests": [
                      {
                          "clashed": false,
                          "endHour": "15:30",
                          "startHour": "14:00"
                      },
                      {
                          "clashed": false,
                          "endHour": "14:00",
                          "startHour": "00:30"
                      }
                  ],
                  "stationName": "EKM-VGA"
              },
              {
                  "requests": [
                      {
                          "clashed": false,
                          "endHour": "15:30",
                          "startHour": "14:30"
                      }
                  ],
                  "stationName": "TDK-PUDI"
              },
              {
                  "requests": [
                      {
                          "clashed": false,
                          "endHour": "15:00",
                          "startHour": "13:30"
                      }
                  ],
                  "stationName": "AJJN-TRT"
              },
              {
                  "requests": [
                      {
                          "clashed": false,
                          "endHour": "14:30",
                          "startHour": "13:30"
                      }
                  ],
                  "stationName": "TRT-POI"
              },
              {
                  "requests": [
                      {
                          "clashed": false,
                          "endHour": "14:00",
                          "startHour": "00:00"
                      },
                      {
                          "clashed": false,
                          "endHour": "03:00",
                          "startHour": "14:00"
                      }
                  ],
                  "stationName": "PUT-TDK"
              },
              {
                  "requests": [
                      {
                          "clashed": false,
                          "endHour": "15:30",
                          "startHour": "14:30"
                      }
                  ],
                  "stationName": "PUDI-RU"
              }
          ]
      },
      {
          "date": "8/8/2023",
          "stations": [
              {
                  "requests": [
                      {
                          "clashed": false,
                          "endHour": "03:30",
                          "startHour": "14:30"
                      },
                      {
                          "clashed": true,
                          "endHour": "15:30",
                          "startHour": "14:00"
                      },
                      {
                          "clashed": true,
                          "endHour": "15:30",
                          "startHour": "14:00"
                      },
                      {
                          "clashed": false,
                          "endHour": "13:00",
                          "startHour": "00:00"
                      }
                  ],
                  "stationName": "VGA-PUT"
              },
              {
                  "requests": [
                      {
                          "clashed": false,
                          "endHour": "03:30",
                          "startHour": "14:00"
                      }
                  ],
                  "stationName": "VKZ-NG"
              },
              {
                  "requests": [
                      {
                          "clashed": false,
                          "endHour": "13:30",
                          "startHour": "00:30"
                      },
                      {
                          "clashed": false,
                          "endHour": "14:30",
                          "startHour": "13:00"
                      }
                  ],
                  "stationName": "TDK-PUDI"
              },
              {
                  "requests": [
                      {
                          "clashed": false,
                          "endHour": "13:00",
                          "startHour": "00:00"
                      }
                  ],
                  "stationName": "POI-VKZ"
              },
              {
                  "requests": [
                      {
                          "clashed": false,
                          "endHour": "14:30",
                          "startHour": "00:00"
                      }
                  ],
                  "stationName": "AJJN-TRT"
              },
              {
                  "requests": [
                      {
                          "clashed": false,
                          "endHour": "14:30",
                          "startHour": "00:30"
                      }
                  ],
                  "stationName": "EKM-VGA"
              },
              {
                  "requests": [
                      {
                          "clashed": false,
                          "endHour": "15:30",
                          "startHour": "14:00"
                      }
                  ],
                  "stationName": "TRT-POI"
              },
              {
                  "requests": [
                      {
                          "clashed": false,
                          "endHour": "14:30",
                          "startHour": "13:30"
                      }
                  ],
                  "stationName": "PUDI-RU"
              }
          ]
      },
      {
          "date": "8/9/2023",
          "stations": [
              {
                  "requests": [
                      {
                          "clashed": false,
                          "endHour": "15:00",
                          "startHour": "13:30"
                      },
                      {
                          "clashed": false,
                          "endHour": "13:30",
                          "startHour": "00:30"
                      }
                  ],
                  "stationName": "PUDI-RU"
              },
              {
                  "requests": [
                      {
                          "clashed": false,
                          "endHour": "14:00",
                          "startHour": "00:30"
                      }
                  ],
                  "stationName": "AJJ-AJJN"
              },
              {
                  "requests": [
                      {
                          "clashed": false,
                          "endHour": "13:00",
                          "startHour": "00:00"
                      },
                      {
                          "clashed": false,
                          "endHour": "13:00",
                          "startHour": "00:00"
                      }
                  ],
                  "stationName": "POI-VKZ"
              },
              {
                  "requests": [
                      {
                          "clashed": false,
                          "endHour": "14:00",
                          "startHour": "00:30"
                      }
                  ],
                  "stationName": "VKZ-NG"
              },
              {
                  "requests": [
                      {
                          "clashed": false,
                          "endHour": "14:30",
                          "startHour": "13:30"
                      },
                      {
                          "clashed": false,
                          "endHour": "13:30",
                          "startHour": "00:30"
                      }
                  ],
                  "stationName": "EKM-VGA"
              },
              {
                  "requests": [
                      {
                          "clashed": true,
                          "endHour": "14:30",
                          "startHour": "13:00"
                      },
                      {
                          "clashed": true,
                          "endHour": "15:00",
                          "startHour": "13:30"
                      }
                  ],
                  "stationName": "PUT-TDK"
              },
              {
                  "requests": [
                      {
                          "clashed": false,
                          "endHour": "13:00",
                          "startHour": "00:00"
                      },
                      {
                          "clashed": false,
                          "endHour": "13:00",
                          "startHour": "00:00"
                      }
                  ],
                  "stationName": "AJJN-TRT"
              },
              {
                  "requests": [
                      {
                          "clashed": false,
                          "endHour": "14:00",
                          "startHour": "13:00"
                      }
                  ],
                  "stationName": "NG-EKM"
              },
              {
                  "requests": [
                      {
                          "clashed": false,
                          "endHour": "14:00",
                          "startHour": "13:30"
                      }
                  ],
                  "stationName": "TDK-PUDI"
              },
              {
                  "requests": [
                      {
                          "clashed": false,
                          "endHour": "14:30",
                          "startHour": "13:30"
                      }
                  ],
                  "stationName": "VGA-PUT"
              }
          ]
      },
      {
          "date": "8/10/2023",
          "stations": [
              {
                  "requests": [
                      {
                          "clashed": false,
                          "endHour": "13:00",
                          "startHour": "00:00"
                      },
                      {
                          "clashed": false,
                          "endHour": "14:30",
                          "startHour": "13:00"
                      }
                  ],
                  "stationName": "AJJN-TRT"
              },
              {
                  "requests": [
                      {
                          "clashed": false,
                          "endHour": "13:00",
                          "startHour": "00:00"
                      },
                      {
                          "clashed": false,
                          "endHour": "13:30",
                          "startHour": "00:30"
                      }
                  ],
                  "stationName": "NG-EKM"
              },
              {
                  "requests": [
                      {
                          "clashed": false,
                          "endHour": "13:00",
                          "startHour": "00:00"
                      },
                      {
                          "clashed": false,
                          "endHour": "13:30",
                          "startHour": "00:00"
                      },
                      {
                          "clashed": false,
                          "endHour": "14:30",
                          "startHour": "13:30"
                      }
                  ],
                  "stationName": "TRT-POI"
              },
              {
                  "requests": [
                      {
                          "clashed": false,
                          "endHour": "13:00",
                          "startHour": "00:00"
                      }
                  ],
                  "stationName": "PUT-TDK"
              },
              {
                  "requests": [
                      {
                          "clashed": false,
                          "endHour": "13:30",
                          "startHour": "00:00"
                      }
                  ],
                  "stationName": "AJJ-AJJN"
              },
              {
                  "requests": [
                      {
                          "clashed": false,
                          "endHour": "14:00",
                          "startHour": "00:30"
                      },
                      {
                          "clashed": false,
                          "endHour": "15:00",
                          "startHour": "14:00"
                      }
                  ],
                  "stationName": "VKZ-NG"
              },
              {
                  "requests": [
                      {
                          "clashed": false,
                          "endHour": "13:30",
                          "startHour": "00:30"
                      }
                  ],
                  "stationName": "VGA-PUT"
              },
              {
                  "requests": [
                      {
                          "clashed": false,
                          "endHour": "13:30",
                          "startHour": "00:30"
                      }
                  ],
                  "stationName": "PUDI-RU"
              },
              {
                  "requests": [
                      {
                          "clashed": false,
                          "endHour": "14:00",
                          "startHour": "13:00"
                      }
                  ],
                  "stationName": "POI-VKZ"
              },
              {
                  "requests": [
                      {
                          "clashed": false,
                          "endHour": "13:30",
                          "startHour": "00:30"
                      },
                      {
                          "clashed": false,
                          "endHour": "15:30",
                          "startHour": "14:30"
                      }
                  ],
                  "stationName": "TDK-PUDI"
              },
              {
                  "requests": [
                      {
                          "clashed": false,
                          "endHour": "14:30",
                          "startHour": "14:00"
                      }
                  ],
                  "stationName": "EKM-VGA"
              }
          ]
      },
      {
          "date": "8/11/2023",
          "stations": [
              {
                  "requests": [
                      {
                          "clashed": false,
                          "endHour": "14:30",
                          "startHour": "13:30"
                      }
                  ],
                  "stationName": "EKM-VGA"
              },
              {
                  "requests": [
                      {
                          "clashed": false,
                          "endHour": "14:30",
                          "startHour": "13:30"
                      }
                  ],
                  "stationName": "VGA-PUT"
              },
              {
                  "requests": [
                      {
                          "clashed": false,
                          "endHour": "14:00",
                          "startHour": "00:30"
                      },
                      {
                          "clashed": false,
                          "endHour": "14:30",
                          "startHour": "13:30"
                      }
                  ],
                  "stationName": "PUDI-RU"
              },
              {
                  "requests": [
                      {
                          "clashed": false,
                          "endHour": "14:30",
                          "startHour": "13:30"
                      }
                  ],
                  "stationName": "POI-VKZ"
              }
          ]
      }
  ]
}

const WeekSchedule = ({
  isStationFetching,
  setIsGanttView,
}) => {
  const [api, setApi] = useState(null);
  const [current, setCurrent] = useState(0);
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
    setCurrent(index+1);
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
      const response = await fetch("/api/upload", {
        // Adjust the URL to your API endpoint
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }

      // Handle response data if needed
      const result = await response.json();
      console.log("File uploaded successfully:", result);
      alert("File uploaded successfully!");
      setSelectedFile(null); // Clear the file input after upload
    } catch (error) {
      console.error("Error uploading file:", error);
      alert("Error uploading file.");
    } finally {
      setUploading(false);
    }
  };


  return (
    <div className="w-full max-w-6xl mx-auto py-8 px-6 bg-secondary rounded-xl">
      <div className="flex justify-between items-center mb-4 w-full">
        <h1 className="text-2xl font-semibold">Gantt View</h1>
        <div>
          <div className="flex rounded-full border border-gray-300 bg-[#f5effc] font-semibold">
            <button
              className="flex items-center px-4 py-2 rounded-l-full bg-[#e4d6f7] text-black"
              onClick={() => setIsGanttView(false)}
            >
              Compact View
            </button>
            <button className="flex items-center px-4 py-2 rounded-r-full text-black">
              <Check className="mr-2" />
              Gantt View
            </button>
          </div>
        </div>
      </div>
      <section className="w-full">
          <Carousel
            opts={{
              align: "start",
            }}
            className="w-full mb-5"
            setApi={setApi}
          >
            <CarouselContent className="ml-1">
              {data.week.map((day, index) => (
                <CarouselItem
                  key={index}
                  className={`h-24 bg-cardbg basis-1/4 ml-5 text-textcolor bg-white font-semibold rounded-lg ${
                    current === index + 1
                      ? "bg-primary font-black"
                      : "hover:bg-primary-foreground ease-in-out duration-200"
                  }`}
                  onClick={() => handleItemClick(index)}
                >
                  <div className="flex flex-col items-start p-4">
                    <span>{moment(day.date).format("DD/MM/YYYY")}</span>
                    <div className="flex flex-col items-start space-y-2">
                      <div className="flex items-center space-x-2">
                        <div className="w-4 aspect-square rounded-full bg-orange-400 animate-pulse"></div>
                        <span className="text-sm font-semibold">
                          <strong>{day.stations.reduce((acc,curr)=>{
                            return acc+curr.requests.filter(r=>r.clashed).length
                          },0)}</strong> no. of conflicts
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
      <GanttChartModern data={data.week[current]}/>
      {/* {isStationFetching ? (
        <div className="w-full h-full flex items-center justify-center">
          <Loader />
        </div>
      ) : scheduleDataByStation && scheduleDataByStation.week.length > 0 ? (
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
                          <strong>{day.availableSlot}</strong> no. of slots
                          available
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
            {uploading ? "Uploading..." : "Upload CSR"}
          </Button>
        </div>
      )} */}
    </div>
  );
};

export default WeekSchedule;
