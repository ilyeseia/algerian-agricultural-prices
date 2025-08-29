export interface SearchFilters {
  search: string;
  wilayaId: string;
  category: string;
  marketType: string;
}

export interface ChartDataPoint {
  label: string;
  value: number;
  date: string;
}

export interface PriceHistoryData {
  productId: string;
  data: ChartDataPoint[];
}
