export interface AiDailyBrief {
  title: string;
  timestamp: string;
  confidenceScore: number;
  executiveSummary: string;
  signal: {
    title: string;
    headline: string;
    keyPoints: string[];
  };
  context: {
    macroSummary: string;
    fiiDiiFlowText: string;
    crudeAndCurrencyText: string;
  };
  marketBreadthSynthesis: string;
  sectorLeadership: {
    leading: string[];
    lagging: string[];
    commentary: string;
  };
  derivativesView: {
    pcrAnalysis: string;
    maxPainLevel: number;
    oiClusterText: string;
  };
  whatToWatch: string[];
}

export interface AttributionContributor {
  symbol: string;
  name: string;
  priceChangePercent: number;
  pointsContributed: number;
  direction: 'positive' | 'negative';
  observedData: string;
  aiExplanation: string;
}

export interface AttributionReport {
  indexSymbol: string;
  indexChangePoints: number;
  indexChangePercent: number;
  timestamp: string;
  topPositiveContributors: AttributionContributor[];
  topNegativeContributors: AttributionContributor[];
  netSectorImpact: { sector: string; points: number }[];
  synthesis: string;
}
