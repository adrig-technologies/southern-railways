import React from 'react'
import ToolBar from '@/components/custom/schedulemanager/TollBar'
import WeekSchedule from './WeekSchedule'

const ScheduleManager = () => {
  return (
    <div className='w-full h-[95vh] flex flex-col items-center space-y-6'>
      <ToolBar />
      <WeekSchedule />
    </div>
  )
}

export default ScheduleManager