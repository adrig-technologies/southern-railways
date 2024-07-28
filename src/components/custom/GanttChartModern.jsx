import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Tooltip, TooltipProvider, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip';


const GanttChartBar = ({ startHour, endHour, color, tooltip, clashed }) => {
  const calculatePosition = (time) => {
    const [hours, minutes] = time.split(':').map(Number);
    const totalMinutes = hours * 60 + minutes;
    return (totalMinutes / (24 * 60)) * 100;
  };

  const left = calculatePosition(startHour);
  const right = calculatePosition(endHour);
  const width = right - left;

  const barColor = clashed ? 'bg-red-500' : color || 'bg-blue-500';

  return (
    <div 
      className={`absolute h-full ${barColor} rounded-lg`} 
      style={{ left: `${left}%`, width: `${width}%` }}
    >
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger>
            <div className="absolute inset-0 cursor-help" />
          </TooltipTrigger>
          <TooltipContent>
            <p>{`${tooltip} (${startHour} - ${endHour})`}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
};

const GanttChartGrid = () => (
  <>
    {[...Array(25)].map((_, i) => (
      <div
        key={i}
        className="absolute inset-y-0 w-px bg-muted-foreground/20"
        style={{ left: `${(i / 24) * 100}%` }}
      />
    ))}
  </>
);

const TimeLabels = () => (
  <div className="flex justify-between text-xs text-muted-foreground mt-1">
    {[...Array(25)].map((_, i) => (
      <span key={i}>{`${String(i).padStart(2, '0')}:00`}</span>
    ))}
  </div>
);
const groupStations = (stations) => {
  const grouped = {};
  stations.forEach(station => {
    if (!grouped[station.stationName]) {
      grouped[station.stationName] = {
        stationName: station.stationName,
        requests: []
      };
    }
    grouped[station.stationName].requests.push(...station.requests);
  });
  return Object.values(grouped);
};

const StationGantt = ({ station }) => {
  const nonClashingRequests = station.requests.filter(r => !r.clashed);
  const clashingRequests = station.requests.filter(r => r.clashed);

  return (
    <div className="space-y-2">
      <h3 className="text-sm font-semibold mb-1">{station.stationName}</h3>
      <div className="relative h-8 bg-gray-200 rounded-lg">
        {nonClashingRequests.map((request, index) => (
          <GanttChartBar
            key={index}
            startHour={request.startHour}
            endHour={request.endHour}
            clashed={false}
            tooltip={`${station.stationName} - Non-clashing Request ${index + 1}`}
          />
        ))}
        <GanttChartGrid />
      </div>
      {clashingRequests.map((request, index) => (
        <div key={index} className="relative h-8 bg-gray-200 rounded-lg">
          <GanttChartBar
            startHour={request.startHour}
            endHour={request.endHour}
            clashed={true}
            tooltip={`${station.stationName} - Clashing Request ${index + 1}`}
          />
          <GanttChartGrid />
        </div>
      ))}
      
      <TimeLabels />
    </div>
  );
};

export const GanttChartModern = ({ data }) => {
  const groupedStations = groupStations(data.stations);

  return (
    <Card className="rounded-lg">
      <CardHeader>
        <CardTitle>Station Schedules</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {groupedStations.map((station, index) => (
            <StationGantt key={index} station={station} />
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
// const groupStations = (stations) => {
//   const grouped = {};
//   stations.forEach(station => {
//     const [start, end] = station.stationName.split('-');
//     const key = `${start}-${end}`;
//     if (!grouped[key]) {
//       grouped[key] = [];
//     }
//     grouped[key].push(station);
//   });
//   return grouped;
// };

// const StationGantt = ({ station }) => {
//   const nonClashingRequests = station.requests.filter(r => !r.clashed);
//   const clashingRequests = station.requests.filter(r => r.clashed);

//   return (
//     <div className="space-y-2">
//       {/* <h3 className="text-sm font-semibold mb-1">{station.stationName}</h3> */}
//       <div className="relative h-8 bg-gray-200 rounded-lg">
//         {nonClashingRequests.map((request, index) => (
//           <GanttChartBar
//             key={index}
//             startHour={request.startHour}
//             endHour={request.endHour}
//             clashed={false}
//             tooltip={`${station.stationName} - Non-clashing Request ${index + 1}`}
//           />
//         ))}
//         <GanttChartGrid />
//       </div>
//       {clashingRequests.map((request, index) => (
//         <div key={index} className="relative h-8 bg-gray-200 rounded-lg">
//           <GanttChartBar
//             startHour={request.startHour}
//             endHour={request.endHour}
//             clashed={true}
//             tooltip={`${station.stationName} - Clashing Request ${index + 1}`}
//           />
//           <GanttChartGrid />
//         </div>
//       ))}
//     </div>
//   );
// };

// export const GanttChartModern = ({ data }) => {
//   const groupedStations = groupStations(data.stations);

//   return (
//     <Card className="rounded-lg">
//       <CardHeader>
//         <CardTitle>Station Schedules</CardTitle>
//       </CardHeader>
//       <CardContent>
//         <div className="space-y-6">
//           {Object.entries(groupedStations).map(([groupName, stations], groupIndex) => (
//             <>
//             <div key={groupIndex} className="space-y-4">
//               <h2 className="text-lg font-bold">{groupName}</h2>
//               {stations.map((station, stationIndex) => (
//                 <StationGantt key={stationIndex} station={station} />
//               ))}
//             <TimeLabels />
//             </div>
//             </>
//           ))}
//         </div>
//       </CardContent>
//     </Card>
//   );
// };