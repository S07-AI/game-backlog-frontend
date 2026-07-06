// Hand-drawn line icon set — replaces emoji icons throughout the app.
// All icons: 24x24 viewBox, stroke = currentColor, so they inherit text color/state.

const base = {
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.75,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
}

export function IconDashboard(props) {
  return (
    <svg {...base} {...props}>
      <rect x="3.5" y="3.5" width="7.5" height="7.5" rx="1.5" />
      <rect x="13" y="3.5" width="7.5" height="4.5" rx="1.5" />
      <rect x="13" y="10.5" width="7.5" height="10" rx="1.5" />
      <rect x="3.5" y="13.5" width="7.5" height="7" rx="1.5" />
    </svg>
  )
}

export function IconLibrary(props) {
  return (
    <svg {...base} {...props}>
      <path d="M7 8h10a4 4 0 014 4.2c0 2-1.2 3.3-2.6 3.3-1 0-1.6-.5-2.4-1.5-.8-1-1.4-1.4-2-1.4s-1.2.4-2 1.4c-.8 1-1.4 1.5-2.4 1.5C4.2 15.5 3 14.2 3 12.2A4 4 0 017 8z" />
      <path d="M8.2 10.6v2.4M7 11.8h2.4" />
      <circle cx="16" cy="10.6" r="0.6" fill="currentColor" stroke="none" />
      <circle cx="17.6" cy="12.4" r="0.6" fill="currentColor" stroke="none" />
    </svg>
  )
}

export function IconPlatforms(props) {
  return (
    <svg {...base} {...props}>
      <rect x="2.75" y="4" width="18.5" height="12" rx="2" />
      <path d="M8.5 20.5h7M12 16v4.5" />
    </svg>
  )
}

export function IconAdd(props) {
  return (
    <svg {...base} {...props}>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 8v8M8 12h8" />
    </svg>
  )
}

export function IconLogout(props) {
  return (
    <svg {...base} {...props}>
      <path d="M15 4.5h2.5A2.5 2.5 0 0120 7v10a2.5 2.5 0 01-2.5 2.5H15" />
      <path d="M10 16l4.5-4-4.5-4" />
      <path d="M14.4 12H4" />
    </svg>
  )
}

export function IconMenu(props) {
  return (
    <svg {...base} {...props}>
      <path d="M4 6h16M4 12h16M4 18h16" />
    </svg>
  )
}

export function IconClose(props) {
  return (
    <svg {...base} {...props}>
      <path d="M6 6l12 12M18 6L6 18" />
    </svg>
  )
}

export function IconMark(props) {
  // Small logomark used next to the wordmark — stacked diagonal bars.
  return (
    <svg viewBox="0 0 24 24" fill="none" {...props}>
      <rect x="3" y="13" width="5" height="8" rx="1.2" fill="currentColor" opacity="0.55" />
      <rect x="9.5" y="8" width="5" height="13" rx="1.2" fill="currentColor" opacity="0.8" />
      <rect x="16" y="3" width="5" height="18" rx="1.2" fill="currentColor" />
    </svg>
  )
}
