export function formatIstTime(date: Date = new Date()): string {
  return date.toLocaleTimeString('en-IN', {
    timeZone: 'Asia/Kolkata',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  }) + ' IST';
}

export function formatIstDate(date: Date = new Date()): string {
  return date.toLocaleDateString('en-IN', {
    timeZone: 'Asia/Kolkata',
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}

export function isMarketOpen(): boolean {
  const now = new Date();
  const utcHours = now.getUTCHours();
  const utcMinutes = now.getUTCMinutes();
  const istMinutes = utcHours * 60 + utcMinutes + 330; // UTC + 5:30
  const normalizedIst = (istMinutes % 1440);
  
  const day = (now.getUTCDay() + (istMinutes >= 1440 ? 1 : 0)) % 7;
  // Sunday = 0, Saturday = 6
  if (day === 0 || day === 6) return false;

  const marketOpenMinutes = 9 * 60 + 15; // 09:15
  const marketCloseMinutes = 15 * 60 + 30; // 15:30

  return normalizedIst >= marketOpenMinutes && normalizedIst <= marketCloseMinutes;
}
