import { css } from '../../styled-system/css';
import { HStack } from 'styled-system/jsx';
import {
  format,
  formatISO9075,
  isSameDay,
  isBefore,
  startOfToday,
  isSameMonth,
  startOfMonth,
  eachDayOfInterval,
  endOfMonth,
  getDay,
} from 'date-fns';
import { fr } from 'date-fns/locale';
import type { CollectionEntry } from 'astro:content';
import { ContractBadge } from './ContractBadge';
import { useMemo } from 'react';
import { Button } from './ui/Button';
import { useCalendar } from '~/hooks/useCalendar';

const agendaContainerCss = css({
  display: 'flex',
  flexDirection: 'column',
  gap: 4,
});

const dateGroupCss = css({
  borderColor: 'border.default',
  border: '1px solid',
  borderRadius: 'md',
  overflow: 'hidden',
});

const dateHeaderCss = css({
  display: 'flex',
  alignItems: 'center',
  gap: 4,
  paddingBlock: 3,
  paddingInline: 3,
  fontSize: 'sm',
  fontWeight: 'medium',
  borderBottom: '1px solid',
  borderColor: 'border.default',

  '&[data-is-past="false"]': {
    bg: 'bg.subtle',
  },

  '&[data-is-past="true"]': {
    bg: 'bg.disabled',
    color: 'fg.subtle',
  },
});

const dataHeaderTitleCss = css({
  fontWeight: 'semibold',
  fontSize: 'md',
});

const distributionListCss = css({
  display: 'flex',
  flexDirection: 'column',
  gap: 2,
  padding: 3,
});

const distributionItemCss = css({
  display: 'flex',
  alignItems: 'center',
  gap: 2,
});

const todayIndicatorCss = css({
  display: 'flex',
  alignItems: 'center',
  gap: 2,
  color: 'blue.9',
  fontWeight: 'medium',
  fontSize: 'sm',

  '&::before': {
    content: '""',
    width: '8px',
    height: '8px',
    borderRadius: '50%',
    bg: 'blue.9',
    flexShrink: 0,
  },

  '&::after': {
    content: '""',
    flex: 1,
    height: '2px',
    bg: 'blue.9',
  },
});

const emptyDistributionCss = css({
  padding: 3,
  color: 'fg.muted',
});

type Event = {
  date: Date;
  contracts: Array<CollectionEntry<'contracts'>>;
};

const currentMonthFormat = new Intl.DateTimeFormat('fr-FR', { month: 'long', year: 'numeric' }).format;

type AgendaProps = {
  contracts: Array<CollectionEntry<'contracts'>>;
  className?: string;
};

export function Agenda({ contracts, className }: AgendaProps) {
  const distributions = useMemo(() => {
    const eventsMap = new Map<string, Array<CollectionEntry<'contracts'>>>();

    for (const contract of contracts) {
      for (const date of contract.data.dates) {
        const dateKey = formatISO9075(date, { representation: 'date' });

        if (!eventsMap.has(dateKey)) {
          eventsMap.set(dateKey, []);
        }

        eventsMap.get(dateKey)!.push(contract);
      }
    }

    return Array.from(eventsMap.entries())
      .map(([dateStr, contracts]) => ({
        date: new Date(dateStr),
        contracts,
      }))
      .toSorted((a, b) => a.date.getTime() - b.date.getTime());
  }, [contracts]);

  const today = startOfToday();

  const firstUpcomingEvent = useMemo(() => {
    return distributions.find((event) => !isBefore(event.date, today) || isSameDay(event.date, today));
  }, [distributions, today]);

  const initialMonth = firstUpcomingEvent ? firstUpcomingEvent.date : today;
  const { current, goNext, goPrevious } = useCalendar(initialMonth);

  const agendaItems: Event[] = useMemo(() => {
    // Filter events for the current month
    const monthEvents = distributions.filter((event) => isSameMonth(event.date, current));

    // Find all Tuesdays in the month
    const tuesdays = eachDayOfInterval({
      start: startOfMonth(current),
      end: endOfMonth(current),
    }).filter((day) => getDay(day) === 2); // 2 = Tuesday

    const emptyTuesdays: Event[] = tuesdays
      .filter((tuesday) => {
        // Keep only Tuesdays that don't have an event
        return !monthEvents.some((event) => isSameDay(event.date, tuesday));
      })
      .map((tuesday) => ({
        date: tuesday,
        contracts: [],
      }));

    // Combine events and empty Tuesdays
    return [...monthEvents, ...emptyTuesdays].toSorted((a, b) => a.date.getTime() - b.date.getTime());
  }, [distributions, current]);

  const canGoPrevious = isBefore(startOfMonth(initialMonth), startOfMonth(current));

  return (
    <div className={className}>
      <HStack className={css({ gap: 4, mb: 4, justifyContent: 'flex-end', alignItems: 'center' })}>
        {canGoPrevious && (
          <Button onClick={goPrevious} size="xs" variant="outline" disabled={!canGoPrevious}>
            {'<'}
          </Button>
        )}
        <span className={css({ fontWeight: 'medium' })}>{currentMonthFormat(current)}</span>
        <Button onClick={goNext} size="xs" variant="outline">
          {'>'}
        </Button>
      </HStack>

      <div className={agendaContainerCss}>
        {agendaItems.length === 0 ? (
          <div className={css({ textAlign: 'center', color: 'fg.muted', py: 8 })}>Aucune distribution prévue</div>
        ) : (
          <>
            {agendaItems.map((item) => {
              const isPast = isBefore(item.date, today) && !isSameDay(item.date, today);
              const isTodayDate = isSameDay(item.date, today);
              const dateKey = formatISO9075(item.date, { representation: 'date' });

              if (item.contracts.length <= 0) {
                return (
                  <div key={`empty-${dateKey}`} className={dateGroupCss}>
                    <div className={dateHeaderCss} data-is-today={isTodayDate} data-is-past={isPast}>
                      <div className={dataHeaderTitleCss} data-is-today={isTodayDate}>
                        {format(item.date, 'EEEE d MMMM yyyy', { locale: fr })}
                      </div>
                      {isTodayDate && <div className={css({ fontSize: 'xs', color: 'blue.9' })}>Aujourd'hui</div>}
                    </div>
                    <div className={emptyDistributionCss}>😢 Aucune distribution ce jour</div>
                  </div>
                );
              }

              const isFirstUpcoming = firstUpcomingEvent && item.date.getTime() === firstUpcomingEvent.date.getTime();
              const showTodayIndicator = !isTodayDate && isFirstUpcoming;

              return (
                <>
                  {showTodayIndicator && (
                    <div key="today-indicator" className={todayIndicatorCss}>
                      <span>Aujourd'hui - {format(today, 'd MMMM yyyy', { locale: fr })}</span>
                    </div>
                  )}
                  <div key={dateKey} className={dateGroupCss}>
                    <div className={dateHeaderCss} data-is-today={isTodayDate} data-is-past={isPast}>
                      <div className={dataHeaderTitleCss} data-is-today={isTodayDate}>
                        {format(item.date, 'EEEE d MMMM yyyy', { locale: fr })}
                      </div>
                      {isTodayDate && <div className={css({ fontSize: 'xs', color: 'blue.9' })}>Aujourd'hui</div>}
                    </div>
                    <div className={distributionListCss}>
                      {item.contracts.map((contract, contractIndex) => (
                        <div key={contractIndex} className={distributionItemCss}>
                          <ContractBadge contract={contract} />
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              );
            })}
          </>
        )}
      </div>
    </div>
  );
}
