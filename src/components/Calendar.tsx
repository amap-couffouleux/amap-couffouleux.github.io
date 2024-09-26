import { HStack } from 'styled-system/jsx';
import { css, cx } from '../../styled-system/css';

import { isToday, isSameMonth, formatISO9075 } from 'date-fns';
import { useCalendar } from '~/hooks/useCalendar';
import { Button } from './ui/Button';
import type { CollectionEntry } from 'astro:content';

import { ContractBadge } from './ContractBadge';

const days = ['Lun.', 'Mar.', 'Mer.', 'Jeu.', 'Ven.', 'Sam.', 'Dim.'];

const currentDateFormat = new Intl.DateTimeFormat('fr-FR', { month: 'long', year: 'numeric' }).format;
const firstDateFormat = new Intl.DateTimeFormat('fr-FR', { month: 'short', day: 'numeric' }).format;

const calendarCss = css({
  borderColor: 'border.default',
  borderTop: '1px solid',
  borderLeft: '1px solid',
});

const weekCss = css({
  display: 'grid',
  gridTemplateColumns: '1fr 3fr 1fr 1fr 1fr 1fr 1fr',
});

const cellCss = css({
  flex: 1,
  overflow: 'hidden',
  fontSize: 'md',
  minHeight: '100px',
  padding: '1',
  borderRight: '1px solid',
  borderBottom: '1px solid',
  borderColor: 'border.default',

  '&:nth-child(n+6)': {
    bg: 'bg.disabled',
  },

  '&[data-in-range="false"]': {
    color: 'fg.disabled',
  },

  '&[data-today="true"]': {
    boxShadow: 'inset 0 0 3px 0 {colors.accent.10}',
  },
});

type Data = {
  contracts: Array<CollectionEntry<'contracts'>>;
  events: Map<string, Array<string>>;
  className?: string;
};

type CellProps = {
  day: Date;
  current: Date;
} & Data;

function Cell({ day, current, events, contracts }: CellProps) {
  const date = day.getDate() === 1 ? firstDateFormat(day) : day.getDate();

  const event = events.get(formatISO9075(day, { representation: 'date' }));

  const distributions = event
    ?.map((slug) => {
      const contract = contracts.find((c) => c.slug === slug);

      if (!contract) {
        return null;
      }

      return {
        contract,
        slug,
        title: contract.data.title,
        icon: contract.data.icon,
      };
    })
    .filter((el) => el != null);

  return (
    <div
      className={cellCss}
      data-in-range={isSameMonth(day, current)}
      data-today={isToday(day)}
      data-mardi={day.getDay() === 2}
    >
      <div>{date}</div>

      {distributions?.map((distribution) => <ContractBadge contract={distribution.contract} />)}
    </div>
  );
}

export function Calendar({ contracts, events, className }: Data) {
  const { calendar, current, goNext, goPrevious } = useCalendar();

  return (
    <div className={className}>
      <HStack css={{ justifyContent: 'space-between' }}>
        {currentDateFormat(current)}
        <div className={css({ gap: 1, display: 'flex', mb: 1 })}>
          <Button onClick={goPrevious} size="xs">
            {'<'}
          </Button>
          <Button onClick={goNext} size="xs">
            {'>'}
          </Button>
        </div>
      </HStack>

      <div className={cx(weekCss, css({ fontSize: 'xs' }))}>
        {days.map((day, i) => (
          <span key={i} className={css({ p: '1', color: 'gray.11' })}>
            {day}
          </span>
        ))}
      </div>

      <div className={calendarCss}>
        {calendar[0].map((week, i) => (
          <div key={i} className={weekCss}>
            {week.map((day, j) => {
              return <Cell key={j} day={day} current={current} contracts={contracts} events={events} />;
            })}
          </div>
        ))}
      </div>
    </div>
  );
}
