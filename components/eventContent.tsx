import { Shift } from "@/lib/types";
import { EventApi } from "@fullcalendar/core";

type Props = {
  event: EventApi;
  eventTime: string;
  isNolleP: boolean;
}

const EventContent = (props: Props) => {
  const interactiveClass = "shadow-lg";
  const bookedClass = "bg-shift-booked shadow-inner"

  // Generate the title of the shift (Organisation name, Private or Book)
  const getTitle = (shift: Shift) => {
    if (shift.organisation !== "") {
      // If the shift is booked by an organisation, return the organisation name
      return shift.organisation;
    }
    if (shiftHasPassed && shift.workers[0] === "" && shift.workers[1] === "") {
      // If the shift has passed and was free, return "Obokat"
      return "Obokat";
    }
    if (shift.workers[0] !== "" || shift.workers[1] !== "") {
      // If the shift i booked by a person but no organisation, return "Privat"
      return "Privat";
    }
    // If the shift is free, return "BOKA"
    return "BOKA";
  }

  // Check if the shift is booked, reserved or free. Used to determine the styling of the shift
  const checkAvailability = (shift: Shift) => {
    const shiftTitle = getTitle(shift);
    switch (shiftTitle) {
      case "Privat":
        return (shift.workers[0] !== "" && shift.workers[1] !== "") ? bookedClass : "bg-shift-reserved " + interactiveClass;
      case "BOKA":
        return "bg-shift-free " + interactiveClass;
      default:
        return (shift.workers[0] !== "" && shift.workers[1] !== "") ? bookedClass : "bg-shift-reserved " + interactiveClass;
    }
  }

  // Split the information from the event title into separate fields
  const shiftInfo = props.event.title.split("/&");
  const shift: Shift = {
    id: props.event.id,
    organisation: shiftInfo[0],
    workers: [shiftInfo[1], shiftInfo[2]],
    start: props.event.startStr,
    end: props.event.endStr
  }

  const shortName1 = shift.workers[0] !== "" ? shift.workers[0].split(" ")[0] : "";
  const shortName2 = shift.workers[1] !== "" ? shift.workers[1].split(" ")[0] : "";


  const startHour = new Date(props.event.startStr).getUTCHours();
  const shiftHasPassed = new Date(props.event.startStr) < new Date();

  return (
    <div className={'event-container w-auto box-content h-full py-1 overflow-hidden rounded-lg cursor-pointer z-50 ' +
      'sm:ml-1 sm:mr-2 hover:scale-105 transition-transform ease-in-out hover:shadow-xl ' + checkAvailability(shift) + (shiftHasPassed && ' grayscale')}>
      <div className="h-full flex flex-col">
        {startHour === 12 ?
          <div className="flex flex-col h-full items-center justify-center">
            <p className="hidden sm:block">{props.eventTime}</p>
            <h3 className="block sm:hidden">{getTitle(shift).length > 6 ? `${getTitle(shift).slice(0, 5)}..` : getTitle(shift)}</h3>
            <h3 className="hidden sm:block">{getTitle(shift)}</h3>
          </div>
          :
          <div className="flex flex-col justify-start items-center">
            <p>{props.eventTime}</p>
            <h3 className="block sm:hidden">{getTitle(shift).length > 6 ? `${getTitle(shift).slice(0, 5)}..` : getTitle(shift)}</h3>
            <h3 className="hidden sm:block">{getTitle(shift)}</h3>
          </div>
        }
        {startHour !== 12 && !props.isNolleP && (
          <div>
            <p className="hidden sm:block">{shift.workers[0]}</p>
            <p className="block sm:hidden">{shortName1}</p>
            <p className="hidden sm:block">{shift.workers[1]}</p>
            <p className="block sm:hidden">{shortName2}</p>
          </div>
        )}
      </div>
    </div >
  );
};

export default EventContent;