import { css } from 'styled-system/css';
import { getTheme, setTheme } from '~/lib/theme';

const styles = css({
  border: 0,
  background: 'none',
  cursor: 'pointer',

  '& .sun': {
    fill: 'black',
    stroke: 'black',
  },

  '& .moon': {
    fill: 'transparent',
    stroke: 'transparent',
  },

  _dark: {
    '& .sun': {
      fill: 'transparent',
      stroke: 'transparent',
    },

    '& .moon': {
      fill: 'white',
      stroke: 'black',
    },
  },
});

export function ThemeIcon() {
  if (getTheme() === 'light') {
    document.documentElement.classList.remove('dark');
  } else {
    document.documentElement.classList.add('dark');
  }

  const handleToggleClick = () => {
    const element = document.documentElement;
    element.classList.toggle('dark');

    const isDark = element.classList.contains('dark');
    setTheme(isDark ? 'dark' : 'light');
  };

  return (
    <button onClick={handleToggleClick} className={styles}>
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
      >
        <circle className="sun" cx="12" cy="12" r="4"></circle>
        <path className="sun" d="M12 2v2"></path>
        <path className="sun" d="M12 20v2"></path>
        <path className="sun" d="m4.93 4.93 1.41 1.41"></path>
        <path className="sun" d="m17.66 17.66 1.41 1.41"></path>
        <path className="sun" d="M2 12h2"></path>
        <path className="sun" d="M20 12h2"></path>
        <path className="sun" d="m6.34 17.66-1.41 1.41"></path>
        <path className="sun" d="m19.07 4.93-1.41 1.41"></path>
        <path className="moon" d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"></path>
      </svg>
    </button>
  );
}
