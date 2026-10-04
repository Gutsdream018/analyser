export interface OptionStrike {
  strikePrice: number;
  callOi: number;
  callOiChange: number;
  callVolume: number;
  callIv: number;
  callLtp: number;
  callChange: number;
  isAtm: boolean;
  putLtp: number;
  putChange: number;
  putIv: number;
  putVolume: number;
  putOiChange: number;
  putOi: number;
}

export interface OptionChain {
  underlyingSymbol: string;
  underlyingPrice: number;
  futurePrice: number;
  basis: number;
  expiryDate: string;
  availableExpiries: string[];
  strikes: OptionStrike[];
  pcr: number;
  maxPain: number;
  totalCallOi: number;
  totalPutOi: number;
  highestCallOiStrike: number;
  highestPutOiStrike: number;
}

export interface FnoSnapshot {
  niftySpot: number;
  niftyFuture: number;
  niftyBasis: number;
  niftyPcr: number;
  niftyMaxPain: number;
  bankNiftySpot: number;
  bankNiftyFuture: number;
  bankNiftyBasis: number;
  bankNiftyPcr: number;
  bankNiftyMaxPain: number;
  indiaVix: number;
  indiaVixChange: number;
}

export interface FnoBuildUp {
  symbol: string;
  type: 'Long Build-up' | 'Short Build-up' | 'Short Covering' | 'Long Unwinding';
  priceChange: number;
  oiChange: number;
  volume: number;
}
