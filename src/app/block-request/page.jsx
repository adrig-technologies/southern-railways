import { BlockRequestContainer } from '@/components/custom/blockrequest'
import axios from 'axios';
import React from 'react'

const Page = async () => { 
    let machinesData = []
    let sectionData = []
    let stationsData = []
    let slotData = []
    let loading = true;
    let error = null;
  
      try {
        const res = await axios.get('http://localhost:4000/createBlockRequest');
        machinesData = (res.data.data.machines);
        sectionData = (res.data.data.stations);
        stationsData = (res.data.data.sections);
       slotData = (res.data.data.slot);
      } catch (error) {

      }
  
  return (
    <BlockRequestContainer 
      machinesData={machinesData}
      sectionData={sectionData}
      stationsData={stationsData}
      slotData={slotData}
    />
  )
}

export default Page