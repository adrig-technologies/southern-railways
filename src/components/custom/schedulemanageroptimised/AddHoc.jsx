import React, { useState } from 'react';
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

const AddHoc = () => {
  const [isAdHocEnabled, setIsAdHocEnabled] = useState(false);

  const handleSwitchChange = async (newState) => {
    console.log(newState); // Directly logs the new state
    setIsAdHocEnabled(newState);

    try {
      const response = await fetch('/api/adhoc', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ enabled: newState }),
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }

      // Handle response data if needed
      const result = await response.json();
      console.log('Ad-Hoc status updated:', result);

    } catch (error) {
      console.error('Error updating Ad-Hoc status:', error);
    }
  };

  return (
    <section className="flex items-center space-x-2">
      <Switch 
        id="enable-adhoc" 
        checked={isAdHocEnabled} 
        onCheckedChange={(newState) => handleSwitchChange(newState)} 
      />
      <Label htmlFor="enable-adhoc">Ad-Hoc</Label>
    </section>
  );
}

export default AddHoc;
