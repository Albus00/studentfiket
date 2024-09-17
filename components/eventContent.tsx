import { Shift } from "@/lib/types";
import { EventApi } from "@fullcalendar/react";
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

type Props = {
  event: EventApi
  eventTime: string;
}

const EventContent = (props: Props) => {
  const interactiveClass = "shadow-lg";
  const bookedClass = "bg-shift-booked opacity-30 shadow-inner"

  // Generate the title of the shift (Organisation name, Private or Book)
  const getTitle = (shift: Shift) => {
    if (shift.organisation !== "") {
      return shift.organisation;
    }
    else {
      if (shift.person1 !== "") {
        return "Privat";
      }
      return "BOKA";
    }
  }

  // Check if the shift is booked, reserved or free. Used to determine the styling of the shift
  const checkAvailability = (shift: Shift) => {
    const shiftTitle = getTitle(shift);
    switch (shiftTitle) {
      case "Privat":
        return (shift.person1 !== "" && shift.person2 !== "") ? bookedClass : "bg-shift-reserved " + interactiveClass;
      case "BOKA":
        return "bg-shift-free " + interactiveClass;
      default:
        return (shift.person1 !== "" && shift.person2 !== "") ? bookedClass : "bg-shift-reserved " + interactiveClass;
    }
  }

  // Split the information from the event title into separate fields
  const shiftInfo = props.event.title.split("/&");
  const shift: Shift = {
    id: props.event.id,
    organisation: shiftInfo[0],
    person1: shiftInfo[1],
    person2: shiftInfo[2],
    start: props.event.startStr,
    end: props.event.endStr
  }

  const startHour = new Date(props.event.startStr).getHours();

  return (
    <div className={'event-container w-auto ml-1 mr-2 box-content h-full py-1 overflow-hidden rounded-lg cursor-pointer hover:scale-105 transition-transform ease-in-out ' + checkAvailability(shift)}>
      <div className="h-full grid grid-rows-2">
        <div>
          <div>
            <p>{props.eventTime}</p>
            <h3>{getTitle(shift)}</h3>
          </div>
        </div>
        {startHour !== 12 && (
          <div>
            <p>{shift.person1}</p>
            <p>{shift.person2}</p>
          </div>
        )}
      </div>
    </div >
  );
};

export default EventContent;