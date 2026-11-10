export const fmtDate = (locale: string, iso: string) =>
  new Intl.DateTimeFormat(locale, { month: 'long', day: 'numeric', year: 'numeric', timeZone: 'UTC' }).format(new Date(iso + 'T12:00:00Z'));
