// Copied to Layout.astro
export function getTheme() {
  if (typeof localStorage !== 'undefined') {
    const theme = localStorage.getItem('theme');
    if (theme === 'light' || theme === 'dark') {
      return theme;
    }
  }

  if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
    return 'dark';
  }

  return 'light';
}

export function setTheme(theme: 'light' | 'dark') {
  window.localStorage.setItem('theme', theme);
}
