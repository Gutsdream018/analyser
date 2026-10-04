/**
 * Format numbers into Indian currency style (₹ with lakhs & crores)
 */
export function formatRupees(amount: number, showDecimals: boolean = true): string {
  if (amount === undefined || amount === null || isNaN(amount)) return '₹0.00';
  
  const isNegative = amount < 0;
  const absVal = Math.abs(amount);

  const formatted = absVal.toLocaleString('en-IN', {
    maximumFractionDigits: showDecimals ? 2 : 0,
    minimumFractionDigits: showDecimals ? 2 : 0,
  });

  return `${isNegative ? '-' : ''}₹${formatted}`;
}

export function formatMarketCapCr(marketCapInCrores: number): string {
  if (!marketCapInCrores && marketCapInCrores !== 0) return '₹0 Cr';
  
  if (marketCapInCrores >= 100000) {
    return `₹${(marketCapInCrores / 100000).toFixed(2)} L Cr`;
  }
  return `₹${marketCapInCrores.toLocaleString('en-IN', { maximumFractionDigits: 1 })} Cr`;
}

export function formatVolume(volume: number): string {
  if (!volume && volume !== 0) return '0';
  if (volume >= 10000000) {
    return `${(volume / 10000000).toFixed(2)} Cr`;
  }
  if (volume >= 100000) {
    return `${(volume / 100000).toFixed(2)} L`;
  }
  if (volume >= 1000) {
    return `${(volume / 1000).toFixed(1)} K`;
  }
  return volume.toLocaleString('en-IN');
}
