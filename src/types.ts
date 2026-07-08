export interface ProductPlacement {
  id: string;
  productName: string;
  category: string;
  shelfHeight: 'Top Shelf' | 'Eye Level' | 'Touch Level' | 'Bottom Shelf';
  facingCount: number;
  salesUnits: number;
  revenue: number;
  unitCost: number;
  unitPrice: number;
  storeLocation: 'Front Aisle' | 'Middle Aisle' | 'Back Wall' | 'Endcap' | 'Checkout Queue';
  demographicTarget: 'Families' | 'Seniors' | 'Young adults' | 'College students' | 'General';
  weeklyFootTraffic: number;
  competitorPrice?: number; // Added to map Competitor_Price from the Kaggle dataset
  // Prepared/Calculated properties
  isDirty?: boolean;
}

export interface CalculatedField {
  id: string;
  name: string;
  formula: string; // e.g. "Profit Margin"
  expression: string; // e.g. "([Revenue] - ([Sales Units] * [Unit Cost])) / [Revenue]"
  description: string;
}

export interface StoryScene {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  visualType: 'shelf-height' | 'demographic-impulse' | 'facings-roi' | 'traffic-correlation' | 'ai-planogram';
  narrativePoints: string[];
}

export interface DatabaseConnection {
  id: string;
  name: string;
  type: 'PostgreSQL' | 'MySQL' | 'BigQuery' | 'Excel/CSV';
  status: 'connected' | 'disconnected';
  host?: string;
  database?: string;
  lastSync?: string;
}
