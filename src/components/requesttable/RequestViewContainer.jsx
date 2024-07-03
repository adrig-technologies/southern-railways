'use client'

import { useState, useEffect, useMemo } from "react";
import { Chart } from "react-google-charts";
import axios from "axios";

const RequestViewContainer = () => {
  const [sectionData, setSectionData] = useState([]);
  const [startDateBound, setStartDateBound] = useState([]);
  const [endDateBound, setEndDateBound] = useState([]);

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await axios.get(process.env.NEXT_PUBLIC_API_URI + "/matrix");
        setSectionData(res.data.sections);
        setStartDateBound(res.data.startDate);
        setEndDateBound(res.data.endDate);
      } catch (error) {
        console.error(error);
      }
    }
    fetchData();
  }, []);

  const [selectedBlock, setSelectedBlock] = useState("AJJ-RU");
  const [startDate, setStartDate] = useState("2024-06-10");
  const [endDate, setEndDate] = useState("2024-06-11");

  const predefinedData = {
    "AJJ-RU": [
      { id: "task-1", start: new Date("2024-06-10T06:00:00"), end: new Date("2024-06-10T08:00:00"), name: "MLPM-AJJN" },
      { id: "task-1", start: new Date("2024-06-10T05:00:00"), end: new Date("2024-06-10T07:30:00"), name: "MLPM-AJJN" },
      { id: "task-1", start: new Date("2024-06-11T06:00:00"), end: new Date("2024-06-12T08:00:00"), name: "MLPM-AJJN" },
      { id: "task-2", start: new Date("2024-06-10T09:00:00"), end: new Date("2024-06-10T11:00:00"), name: "VKZ-NG" },
      { id: "task-3", start: new Date("2024-06-10T01:10:00"), end: new Date("2024-06-10T04:30:00"), name: "VKZ-NG" },
      { id: "task-3", start: new Date("2024-06-10T07:00:00"), end: new Date("2024-06-10T09:00:00"), name: "EKM-VGA" },
      { id: "task-4", start: new Date("2024-06-10T10:00:00"), end: new Date("2024-06-10T12:00:00"), name: "PUDI-RU" },
      { id: "task-2", start: new Date("2024-06-10T03:15:00"), end: new Date("2024-06-10T04:45:00"), name: "PUDI-RU" },
    ],
    "RU-AJJ": [
      { id: "task-5", start: new Date("2024-06-11T06:07:00"), end: new Date("2024-06-11T08:00:00"), name: "PUDI-RU" },
      { id: "task-6", start: new Date("2024-06-11T09:00:00"), end: new Date("2024-06-11T11:00:00"), name: "AJJN-TRT" },
      { id: "task-7", start: new Date("2024-06-11T07:00:00"), end: new Date("2024-06-11T09:00:00"), name: "EKM-VGA" },
      { id: "task-8", start: new Date("2024-06-11T10:00:00"), end: new Date("2024-06-11T12:00:00"), name: "TDK-PUDI" },
    ],
  };

  const filteredData = useMemo(() => {
    if (!selectedBlock || !startDate || !endDate) return [];

    const tasksByDay = {};
    const startDateObj = new Date(startDate);
    const endDateObj = new Date(endDate);

    // Iterate through each day between start and end date (inclusive)
    for (
      let currentDate = new Date(startDateObj);
      currentDate <= endDateObj;
      currentDate.setDate(currentDate.getDate() + 1)
    ) {
      const taskDate = currentDate.toDateString();
      tasksByDay[taskDate] = [];
    }

    predefinedData[selectedBlock].forEach((task) => {
      let taskStart = new Date(task.start);
      const taskEnd = new Date(task.end);

      while (taskStart < taskEnd) {
        const taskDate = taskStart.toDateString();
        if (tasksByDay[taskDate]) {
          const nextDay = new Date(taskStart);
          nextDay.setDate(taskStart.getDate() + 1);
          nextDay.setHours(0, 0, 0, 0);

          tasksByDay[taskDate].push({
            ...task,
            start: taskStart,
            end: taskEnd > nextDay ? nextDay : taskEnd,
          });

          taskStart = nextDay;
        } else {
          break;
        }
      }
    });

    return Object.entries(tasksByDay).map(([date, tasks]) => ({
      date,
      tasks,
    }));
  }, [predefinedData, selectedBlock, startDate, endDate]);

  const handleBlockChange = (e) => {
    setSelectedBlock(e.target.value);
  };

  const handleStartDateChange = (e) => {
    setStartDate(e.target.value);
  };

  const handleEndDateChange = (e) => {
    setEndDate(e.target.value);
  };

  const blockOptions = ["AJJ-RU", "RU-AJJ"];

  const formatTooltip = (task) => {
    const startTime = task.start.toLocaleTimeString("en-GB");
    const endTime = task.end.toLocaleTimeString("en-GB");
    const duration = ((task.end - task.start) / (1000 * 60 * 60)).toFixed(2);
    return `
      <div style="padding: 5px; background: white; border: 1px solid black;">
        <div><strong>${task.name}</strong></div>
        <div>Start: ${startTime}</div>
        <div>End: ${endTime}</div>
        <div>Duration: ${duration} hour(s)</div>
      </div>
    `;
  };

  const generateChartData = (tasks) => {
    const rows = [];
    const sections = {};

    tasks.forEach((task) => {
      if (!sections[task.name]) {
        sections[task.name] = [];
      }
      sections[task.name].push(task);
    });

    Object.entries(sections).forEach(([section, tasks]) => {
      tasks.forEach((task) => {
        rows.push([
          section,
          task.id,
          task.start,
          task.end,
          null,
          formatTooltip(task),
        ]);
      });
    });

    return [
      [
        { type: "string", id: "Section" },
        { type: "string", id: "Task ID" },
        { type: "date", id: "Start" },
        { type: "date", id: "End" },
        { type: "string", role: "style" },
        { type: "string", role: "tooltip", p: { html: true } },
      ],
      ...rows,
    ];
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Request Table</h1>
      <div className="flex mb-4">
        <select
          value={selectedBlock}
          onChange={handleBlockChange}
          className="p-2 border border-gray-300 rounded"
        >
          {blockOptions.map((block) => (
            <option key={block} value={block}>
              {block}
            </option>
          ))}
        </select>
        <input
          type="date"
          value={startDate}
          onChange={handleStartDateChange}
          className="p-2 ml-2 border border-gray-300 rounded"
        />
        <input
          type="date"
          value={endDate}
          onChange={handleEndDateChange}
          className="p-2 ml-2 border border-gray-300 rounded"
        />
      </div>
      {filteredData.map(({ date, tasks }) => (
        <div key={date} className="mb-8">
          <h2 className="text-xl font-bold mb-4">{date}</h2>
          <Chart
            chartType="Timeline"
            options={{
              timeline: { showRowLabels: true, showBarLabels: false, singleColor: "#8d8", },
              hAxis: {
                minValue: new Date(date),
                maxValue: new Date(new Date(date).setHours(23, 59, 59, 999)),
                slantedText: false,
                format: 'HH:mm',
                title: 'Time of Day',
                titleTextStyle: { italic: false },
              },
              tooltip: { isHtml: true },
            }}
            data={generateChartData(tasks)}
            width="100%"
            height="250px"
          />
        </div>
      ))}
    </div>
  );
};

export default RequestViewContainer;
