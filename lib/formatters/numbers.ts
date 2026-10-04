export function formatPercent(value: number, includeSign: boolean = true): string {
  if (value === undefined || value === null || isNaN(value)) return '0.00%';
  const prefix = includeSign && value > 0 ? '+' : '';
  return `${prefix}${value.toFixed(2)}%`;
}

export function formatIndexPoints(points: number, includeSign: boolean = true): string {
  if (points === undefined || points === null || isNaN(points)) return '0.00';
  const prefix = includeSign && points > 0 ? '+' : '';
  return `${prefix}${points.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

export function formatRatio(value: number, decimals: number = 2): string {
  if (value === undefined || value === null || isNaN(value)) return '0.00';
  return value.toFixed(decimals);
}
