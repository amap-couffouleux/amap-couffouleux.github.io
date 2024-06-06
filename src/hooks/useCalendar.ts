import {
  addMonths,
  eachDayOfInterval,
  eachMonthOfInterval,
  eachWeekOfInterval,
  endOfMonth,
  endOfWeek,
  startOfMonth,
  startOfWeek,
  subMonths,
} from 'date-fns';

import { useReducer } from 'react';

const reducer = (state: Date, action: 'NEXT' | 'PREVIOUS' | 'CURRENT') => {
  switch (action) {
    case 'PREVIOUS':
      return subMonths(state, 1);
    case 'NEXT':
      return addMonths(state, 1);
    case 'CURRENT':
      return new Date();
    default:
      throw new Error('Unexpected action');
  }
};

export function useCalendar(currentDefault = new Date(), nbMonthToDisplay = 1) {
  const weekStartsOn = 1;

  const [current, actions] = useReducer(reducer, currentDefault);

  const calendar = eachMonthOfInterval({
    start: startOfMonth(current),
    end: endOfMonth(addMonths(current, nbMonthToDisplay - 1)),
  }).map((month) =>
    eachWeekOfInterval(
      {
        start: startOfMonth(month),
        end: endOfMonth(month),
      },
      { weekStartsOn }
    ).map((week) =>
      eachDayOfInterval({
        start: startOfWeek(week, { weekStartsOn }),
        end: endOfWeek(week, { weekStartsOn }),
      })
    )
  );

  return {
    calendar,
    current,
    goPrevious: () => actions('PREVIOUS'),
    goToday: () => actions('CURRENT'),
    goNext: () => actions('NEXT'),
  };
}
