'use client'

import { useEffect, useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import EventContent from "@/components/calendar/eventContent";
import { Shift, User, Event } from "@/lib/types";
import Popup from "@/components/calendar/popup/popup";
import PocketBase, { RecordModel } from 'pocketbase';
import { getNameFromId } from "@/lib/scheduling";
import svLocale from '@fullcalendar/core/locales/sv';

type Props = {
  loadedShifts: Shift[];
  user: User;
  isNolleP: boolean;
}

//#region Event functions
const getShiftByIdFromCollection = (id: string, shiftCollection: Shift[] = []) => {
  const shift = shiftCollection.find(shift => shift.id === id);
  if (!shift)
    return null;
  return shift;
}

const mapShiftsToEvents = (shifts: Shift[]): Event[] => {
  // Map the shifts to events, combining the organisation and workers information into the title
  return shifts.map(shift => {
    const title = `${shift.organisation}/&${shift.workers[0] ? shift.workers[0] : ""}/&${shift.workers[1] ? shift.workers[1] : ""}`;
    return {
      id: shift.id,
      title: title,
      start: shift.start,
      end: shift.end
    } as Event;
  })
}

const updateShiftCollection = (loadedShifts: Shift[], updatedShift: Shift) => {
  // Delete the old shift
  loadedShifts = loadedShifts.filter(shift => shift.id !== updatedShift.id);

  // Add the updated shift
  loadedShifts.push(updatedShift);
  return loadedShifts;
}

// Map the records from the database to the Shift type
export const mapRecordToShift = async (record: RecordModel): Promise<Shift> => {
  return {
    id: record.id,
    organisation: await getNameFromId(record.organisation, "organisations") || "",
    workers: await Promise.all(record.workers.map(async (workerId: string) => await getNameFromId(workerId, "users"))),
    start: record.startTime,
    end: record.endTime
  };
}

//#endregion


function CalendarView(props: Readonly<Props>) {
  const closePopup = () => {
    setSelectedShift(null);
  }

  const [selectedShift, setSelectedShift] = useState<Shift | null>(null);
  const [loadedShifts, setLoadedShifts] = useState(props.loadedShifts); // Store the shifts in local state
  const [events, setEvents] = useState(mapShiftsToEvents(props.loadedShifts)); // Store the events in local state

  useEffect(() => {
    const pb = new PocketBase(process.env.NEXT_PUBLIC_POCKETBASE_URL);
    pb.autoCancellation(false);

    const updateShift2 = async (e: { action: string; record: { id: string } }) => {
      console.log("Event", e);
      if (e.action === 'update') {

        const updatedShift = await mapRecordToShift(e.record as RecordModel);
        console.log("Shift mapped", updatedShift);

        // Check if the shift data has actually changed before updating state
        setLoadedShifts((prevShifts) => handleShiftUpdate(prevShifts, updatedShift));
      }
    };

    const handleShiftUpdate = (prevShifts: Shift[], updatedShift: Shift) => {
      const updatedShifts = updateShiftCollection(prevShifts, updatedShift);

      // Compare updatedShifts with prevShifts to avoid unnecessary re-renders
      const hasChanges = prevShifts.some((shift) => {
        const updated = updatedShifts.find((s) => s.id === shift.id);
        return (
          updated &&
          (shift.organisation !== updated.organisation ||
            shift.start !== updated.start ||
            shift.end !== updated.end ||
            shift.workers.length !== updated.workers.length ||
            shift.workers.some((worker, index) => worker !== updated.workers[index]))
        );
      });

      if (hasChanges) {
        if (selectedShift?.id === updatedShift.id)
          setSelectedShift(updatedShift);

        setEvents(mapShiftsToEvents(updatedShifts));
        return updatedShifts;
      }

      return prevShifts; // Don't update state if no actual changes
    };

    pb.collection('shifts').subscribe('*', updateShift2);

    return () => {
      pb.collection('shifts').unsubscribe();
    };
  }, [props.loadedShifts, selectedShift]);


  return (
    <div className="w-full h-[92vh]">
      <Popup onCancel={closePopup} shift={selectedShift} user={props.user} isNolleP={props.isNolleP} />
      <FullCalendar
        locale={svLocale}
        timeZone="UTC"
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
        initialView="timeGridWeek"
        eventTimeFormat={{ hour: "2-digit", minute: "2-digit", meridiem: false, hour12: false }}
        slotLabelFormat={{ hour: "2-digit", minute: "2-digit", meridiem: false, hour12: false }}
        headerToolbar={{
          left: "timeGridWeek,timeGridDay",
          right: "today prev,next"
        }}
        weekends={false}
        displayEventEnd={false}
        events={events}
        height="90vh"
        slotDuration={"01:00:00"}
        expandRows={true}
        validRange={
          props.user?.isAdmin ? {} :
            {
              start: new Date().toISOString().split('T')[0]
            }
        }
        slotMinTime="08:00:00"
        slotMaxTime="18:00:00"
        allDaySlot={false}
        navLinkDayClick={(e) => console.log(e)}
        eventClick={(e) => setSelectedShift(getShiftByIdFromCollection(e.event.id, loadedShifts))}
        eventContent={(arg) => (
          <EventContent event={arg.event} eventTime={arg.timeText} isNolleP={props.isNolleP} />
        )}
      />
    </div>
  );
}

export default CalendarView;
