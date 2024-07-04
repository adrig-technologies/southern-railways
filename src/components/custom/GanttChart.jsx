import React, { useState, useEffect, useMemo } from "react";
import axios from "axios";

import '@/app/GanttChart.css';

const GanttChart = ({ tasks }) => {
  const [timeSlots, setTimeSlots] = useState([]);
  const [conflictingTasks, setConflictingTasks] = useState([]);
  const [groupedTasks, setGroupedTasks] = useState({});
  const [conflicts, setConflicts] = useState([]);
  const [showToolTip, setShowToolTip] = useState(null);
  const [tooltipPosition, setTooltipPosition] = useState([0, 0]);
  
  useEffect(() => {
    generateTimeSlots();
    findConflicts();
    groupTasksByTeam();
  }, [tasks]);

  const generateTimeSlots = () => {
    const slots = [];
    for (let i = 0; i < 24; i++) {
      slots.push(`${i.toString().padStart(2, '0')}:00`);
    }
    setTimeSlots(slots);
  };

  const findConflicts = () => {
    const conflictingTaskIds = [];
    const conflictAreas = [];

    const timeToMinutes = (time) => {
      const [hours, minutes] = time.split(':').map(Number);
      return hours * 60 + minutes;
    };

    const minutesToTime = (minutes) => {
      const hours = Math.floor(minutes / 60);
      const mins = minutes % 60;
      return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`;
    };

    for (let i = 0; i < tasks.length; i++) {
      for (let j = i + 1; j < tasks.length; j++) {
        if (tasks[i].team === tasks[j].team) {
          const startA = timeToMinutes(tasks[i].start);
          const endA = timeToMinutes(tasks[i].end);
          const startB = timeToMinutes(tasks[j].start);
          const endB = timeToMinutes(tasks[j].end);

          if ((startA <= startB && startB < endA) || (startB <= startA && startA < endB)) {
            conflictingTaskIds.push(tasks[i].id, tasks[j].id);
            conflictAreas.push({
              team: tasks[i].team,
              start: minutesToTime(Math.max(startA, startB)),
              end: minutesToTime(Math.min(endA, endB))
            });
          }
        }
      }
    }
    setConflictingTasks([...new Set(conflictingTaskIds)]);
    setConflicts(conflictAreas);
  };

  

  const groupTasksByTeam = () => {
    const grouped = tasks.reduce((acc, task) => {
      if (!acc[task.team]) {
        acc[task.team] = [];
      }
      acc[task.team].push(task);
      return acc;
    }, {});
    setGroupedTasks(grouped);
  };

  const calculatePosition = (time) => {
    const [hours, minutes] = time.split(':').map(Number);
    return (hours + minutes / 60) * (100 / 24);
  };

  const calculateWidth = (start, end) => {
    const startPosition = calculatePosition(start);
    const endPosition = calculatePosition(end);
    return endPosition - startPosition;
  };

  const getTeamColor = (teamId) => {
    const colors = ['#4CAF50', '#2196F3', '#FFC107', '#9C27B0', '#FF5722'];
    return colors[teamId % colors.length];
  };

  // console.log(groupedTasks[1][0].teamTasks)

  return (
    <div className="gantt-chart">
      <div className="tasks-container">
      <div className="time-slots">
          {timeSlots.map((slot, index) => (
            <div key={index} className="time-slot">
              {slot}
            </div>
          ))}
        </div>
        {Object.entries(groupedTasks).map(([teamId, teamTasks]) => (
          <div key={teamId} className="team-group">
            <div className="team-label" style={{ backgroundColor: getTeamColor(teamId) }}>
              {teamId}
            </div>
            <div className="team-timeline">
              {teamTasks.map((task) => (
                <div key={task.id} className="task-row">
                  <div className="h-10 text-sm text-slate-400 px-10">{task.id}</div>
                  <div className="task-timeline">
                    <div
                      className={`task ${conflictingTasks.includes(task.id) ? 'conflict' : ''}`}
                     
                      onMouseEnter={(event) => {
                        setTooltipPosition(()=>[event.clientX, event.clientY]);
                        setShowToolTip(task.id)
                      }}
                      onMouseLeave={() => setShowToolTip(null)}

                      style={{
                        left: `${calculatePosition(task.start)}%`,
                        width: `${calculateWidth(task.start, task.end)}%`,
                        backgroundColor: getTeamColor(teamId),
                        animationDelay: `${Math.random() * 0.25}s`,
                      }}
                    >
                    <span className="icon">{conflictingTasks.includes(task.id) ? '!' : '✔'}</span>
                      <span className="text">{task.name}{/*`${task.start} - ${task.end}`*/}</span>
                    </div>
                    {conflicts
                      .filter(conflict => conflict.team === parseInt(teamId))
                      .map((conflict, index) => (
                        <div
                          key={index}
                          className="conflict-area"
                          style={{
                            left: `${calculatePosition(conflict.start)}%`,
                            width: `${calculateWidth(conflict.start, conflict.end)}%`,
                          }}
                        ></div>
                      ))}
                      <div className="task-tooltip" style={showToolTip===task.id ? {visibility:"initial",opacity:1, left: `${calculatePosition(task.start)}%`,
                        }:{}}>
                        <strong>{task.name}</strong><br />
                        {task.machine && `Machine: ${task.machine}`}<br/>
                        Team: {task.team}<br />
                        Start: {task.start}<br />
                        End: {task.end}
                      </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default GanttChart
