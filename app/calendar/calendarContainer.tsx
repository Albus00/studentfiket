import { getShifts } from '@/lib/scheduling';
import { redirect } from "next/navigation";
import CalendarView from './calendarView';
import { getFlag } from '../actions/meta/getFlag';
import { getUser } from '../actions/users/getUser';
import { getUserOrganisations } from '../actions/organisation/getUserOrganisations';

// Calendar dependencies will not work with SSR
// https://stackoverflow.com/questions/72140065/warning-prop-id-did-not-match-server-fc-dom-171-client-fc-dom-2-when-u
// const CalendarView = dynamic(() => import('@/app/calendar/calendarView'), {
//   ssr: false
// });

export const dynamic = 'force-dynamic'

export default async function CalendarContainer() {
  // Get the shifts
  const loadedShifts = await getShifts();

  // Get the user
  const user = await getUser();
  if (!user) {
    // Redirect to login if no user
    redirect("/login");
  }
  user.organisations = await getUserOrganisations();

  // Check if it it Nolle-P
  const isNolleP = await getFlag("NOLLE_P");

  if (!loadedShifts) {
    return <div>Loading...</div>;
  }

  return (
    <CalendarView loadedShifts={loadedShifts} user={user} isNolleP={isNolleP} />
  );
}