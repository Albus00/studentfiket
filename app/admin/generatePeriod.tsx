'use client'

import React from 'react';
import { useState } from 'react';
import { DateRange } from 'react-day-picker';
import { addDays } from 'date-fns';
import { Button } from '@/components/ui/button';

import { DatePickerWithRange } from '@/components/datePickerWithRange';
import { generateNewPeriod } from '@/lib/scheduling';


export default function GeneratePeriod() {
  const handleSubmit = () => {
    if (!date?.from || !date?.to) {
      console.error("No date selected");
      return;
    }

    setIsLoading(true); // Start loading
    generateNewPeriod(date?.from, date?.to).then(() => {
      setIsLoading(false); // Start loading
    });
  };

  // TODO: Implement loading progress or whatever
  const [isLoading, setIsLoading] = useState(false);
  const [date, setDate] = React.useState<DateRange | undefined>(() => {
    const now = new Date();
    const startOfNextWeek = new Date(now.setDate(now.getDate() + (7 - now.getDay())));
    startOfNextWeek.setHours(0, 0, 0, 0);
    return {
      from: startOfNextWeek,
      to: addDays(startOfNextWeek, 6)
    };
  });

  return (
    <div className='relative'>
      <div>
        <h4 className='text-lg font-semibold'>Generera skift för period</h4>
      </div>
      <div className='flex flex-row'>
        <div className='flex flex-col sm:flex-row'>
          <DatePickerWithRange date={date} setDate={setDate} />
          <Button
            className='mt-4 sm:mt-0 sm:ml-4 py-4 flex justify-center'
            onClick={handleSubmit}
            disabled={isLoading}
          >
            {
              isLoading ? <div className="generating"><p className='text-transparent'>Generera skift</p></div> : <p>Generera skift</p>
            }
          </Button>
        </div>
      </div>
    </div>
  );
}