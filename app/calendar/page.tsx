import { Suspense } from 'react';
import CalendarLoading from './calendarLoading';
import CalendarContainer from './calendarContainer';

// Next.js will invalidate the cache when a
// request comes in, at most once every second.
export const revalidate = 1

// We'll prerender only the params from `generateStaticParams` at build time.
// If a request comes in for a path that hasn't been generated,
// Next.js will server-render the page on-demand.
export const dynamicParams = true // or false, to 404 on unknown paths

export default async function Home() {
  return (
    <div className='flex flex-col'>
      <Suspense fallback={<CalendarLoading />}>
        <CalendarContainer />
      </Suspense>
    </div>
  );
}
