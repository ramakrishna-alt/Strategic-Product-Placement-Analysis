import { ProductPlacement, CalculatedField, DatabaseConnection, StoryScene } from './types';

function getProductName(id: string, category: string): string {
  const clothingNames = [
    'Sport Performance Hoodie', 'Classic Chino Pants', 'Relaxed Fit Jeans', 'Sleek Activewear Joggers',
    'Premium Cotton Tee', 'Casual Denim Jacket', 'Comfort Knit Sweater', 'Thermal Fleece Pullover',
    'All-Weather Trench Coat', 'Merino Wool Socks', 'Breather Running Shorts', 'Graphic Print T-Shirt'
  ];
  const electronicsNames = [
    'Smart Noise-Canceling Headphones', 'Ultra-Slim Wireless Charger', 'Portable Bluetooth Speaker', '4K HD Action Camera',
    'Ergonomic Wireless Mouse', 'Multi-Device Keyboard', 'Compact Smart Projector', 'Dual-USB Power Bank',
    'Smart Fitness Watch', 'High-Speed HDMI Cable', 'LED Backlit Gaming Keyboard', 'Studio Condenser Microphone'
  ];
  const foodNames = [
    'Organic Ancient Grain Granola', 'Gourmet Truffle Potato Chips', 'Premium Dark Chocolate Bar', 'Artisanal Cold Brew Tea',
    'Raw Unfiltered Clover Honey', 'Gluten-Free Almond Crackers', 'Roasted Sea Salt Cashews', 'Organic Maple Waffles',
    'Whole Wheat Avocado Slices', 'Cold-Pressed Green Juice', 'Aged Cheddar Cheese Snacks', 'Dried Tart Cherries'
  ];

  const seed = parseInt(id) || 0;
  if (category === 'Clothing') {
    return clothingNames[seed % clothingNames.length];
  } else if (category === 'Electronics') {
    return electronicsNames[seed % electronicsNames.length];
  } else {
    return foodNames[seed % foodNames.length];
  }
}

const CSV_DATA = `Product ID,Product Position,Price,Competitor's Price,Promotion,Foot Traffic,Consumer Demographics,Product Category,Seasonal,Sales Volume
185102,Aisle,17.07,16.16,No,Medium,Families,Clothing,No,2823
188771,Aisle,17.41,13.13,No,Low,Seniors,Clothing,No,654
180176,End-cap,43.16,38.37,Yes,Medium,Young adults,Electronics,Yes,2220
112917,Aisle,42.26,38.98,Yes,Low,Families,Clothing,Yes,1568
192936,End-cap,47.94,45.59,No,Medium,College students,Clothing,Yes,2942
117590,End-cap,34.5,34.34,No,Medium,Seniors,Clothing,No,2968
189118,Front of Store,41.11,40.15,Yes,High,College students,Clothing,Yes,952
182157,Aisle,15.75,12.3,No,Low,College students,Clothing,No,2421
141861,Aisle,30.07,26.75,Yes,High,Families,Electronics,Yes,1916
137121,Aisle,38,33.38,No,High,Families,Electronics,Yes,656
113143,Aisle,27.42,22.82,Yes,High,College students,Food,Yes,2663
140028,Aisle,12.15,9.39,Yes,High,College students,Food,Yes,1260
134693,Aisle,31.45,28.93,Yes,Low,College students,Food,No,2124
151396,Front of Store,19.81,17.04,Yes,Medium,Families,Food,Yes,729
132889,Aisle,15.74,12.8,Yes,Low,Families,Food,Yes,2265
152174,End-cap,13.16,12.94,No,Medium,Young adults,Clothing,No,2226
129906,Aisle,14.58,14.49,No,Medium,Young adults,Food,No,2089
195879,Front of Store,21.03,18.54,Yes,Medium,Young adults,Food,Yes,2339
155050,Aisle,19.92,14.93,No,High,College students,Clothing,Yes,2321
194410,End-cap,36.2,32.49,No,Low,Young adults,Electronics,No,669
141904,End-cap,27.36,23.03,Yes,Medium,College students,Food,Yes,1712
124981,Front of Store,42.74,40.29,No,Low,Families,Clothing,Yes,1832
161909,Aisle,22.16,20.85,Yes,Medium,Young adults,Electronics,No,1290
129152,End-cap,48.51,47.56,No,Low,Seniors,Electronics,No,2356
183243,Front of Store,39.32,37.12,Yes,Low,Families,Food,No,1524
198248,Front of Store,27.81,23.4,Yes,High,Seniors,Clothing,No,1644
191230,End-cap,49.95,45.65,No,High,Young adults,Clothing,No,966
187234,Front of Store,39.27,35.55,Yes,Low,College students,Clothing,Yes,2575
148888,Front of Store,16.92,14.44,No,Low,Families,Clothing,No,2774
110805,Front of Store,35.91,34.74,Yes,Medium,Young adults,Food,No,2477
179801,Front of Store,46.81,43.04,No,Low,College students,Electronics,Yes,2608
134927,Aisle,6.1,5.37,Yes,High,Families,Electronics,Yes,2252
123150,End-cap,37.03,34.9,Yes,Medium,Seniors,Electronics,No,2074
159145,End-cap,19.01,18.27,Yes,High,Seniors,Electronics,No,2579
172364,Aisle,12.3,10.3,Yes,High,College students,Clothing,No,2931
178281,End-cap,11.64,7.89,No,Low,College students,Electronics,Yes,1145
194339,End-cap,18.2,16.18,No,Low,Seniors,Clothing,No,1792
174412,Aisle,23.93,19.71,No,Low,Young adults,Electronics,Yes,1796
114877,Aisle,21.76,21.09,No,Medium,College students,Clothing,No,1860
140727,End-cap,15.89,12.07,Yes,High,Families,Clothing,Yes,1002
133109,Front of Store,36.13,31.33,No,High,Families,Clothing,Yes,2063
127296,Aisle,34.02,32.31,No,Low,Families,Food,No,1165
133757,Aisle,7.38,3.97,Yes,High,Families,Electronics,No,2071
111760,End-cap,19.3,17.41,No,Low,College students,Clothing,No,1474
198375,End-cap,7.1,6.84,No,Low,Seniors,Clothing,No,2202
168837,Aisle,43.43,38.54,No,Low,Families,Electronics,No,665
138505,Front of Store,46.72,42.48,No,Low,Seniors,Food,No,2478
116228,End-cap,36.32,32.95,Yes,Medium,Families,Clothing,No,647
167592,Front of Store,17.76,16.84,Yes,Medium,Seniors,Food,No,707
133100,End-cap,47.78,43.18,Yes,Medium,Families,Clothing,No,2729
119955,Front of Store,34.12,32.94,No,High,Young adults,Electronics,No,1590
189349,End-cap,45.91,42.91,Yes,Medium,Seniors,Electronics,No,1245
127478,Front of Store,29.3,26.06,No,Low,Young adults,Clothing,Yes,2498
180661,Front of Store,39.96,36.05,No,High,Young adults,Food,Yes,1041
186681,End-cap,39.46,35.1,No,Low,Young adults,Food,Yes,1717
133183,Front of Store,45.07,44.26,Yes,Low,Families,Electronics,Yes,2859
173508,Aisle,13.67,13.18,Yes,High,Families,Food,No,1658
187930,End-cap,19.95,19.19,No,Medium,College students,Electronics,Yes,706
124088,End-cap,48.71,46.44,Yes,High,Young adults,Electronics,Yes,2065
190238,Front of Store,34.67,32.6,No,High,Seniors,Clothing,Yes,1917
151925,End-cap,47.63,42.99,Yes,Medium,Seniors,Food,Yes,2179
163234,Front of Store,12.03,7.97,No,Medium,Young adults,Clothing,No,1633
135610,Aisle,36.04,35.59,Yes,High,College students,Electronics,Yes,1513
117065,Aisle,47.39,47.31,Yes,High,Seniors,Electronics,Yes,758
149315,End-cap,24.71,24.08,Yes,Low,Families,Electronics,No,718
149510,Aisle,36.18,34.02,No,High,Young adults,Clothing,Yes,1412
137990,Aisle,12.01,10.23,No,High,Seniors,Clothing,No,2929
154016,End-cap,46.04,42.05,Yes,High,Seniors,Food,Yes,2366
117751,Aisle,10,5.63,No,Medium,Seniors,Electronics,No,2749
182362,Front of Store,14.1,13.51,No,Low,Families,Electronics,No,2019
117725,Aisle,40.15,35.86,No,Low,Seniors,Food,Yes,1506
145289,End-cap,30.65,30.08,No,High,Families,Clothing,No,1012
173576,End-cap,46.74,46.32,Yes,Medium,College students,Electronics,No,1838
175059,Aisle,19.16,18.62,Yes,High,Seniors,Food,No,2170
199368,Front of Store,31.93,27.22,No,Low,Families,Clothing,Yes,1061
162883,Front of Store,18.3,14.19,Yes,Low,Seniors,Food,No,786
135490,Front of Store,18.72,17.29,No,Medium,Families,Clothing,No,1094
125408,End-cap,21.79,18.92,Yes,High,College students,Clothing,Yes,2220
134763,Front of Store,18.75,17.42,No,Low,College students,Clothing,Yes,2048
143231,Aisle,44.2,42.72,No,Low,Families,Food,No,2578
125409,End-cap,42.55,40.35,Yes,High,College students,Clothing,No,2040
183074,Aisle,34.15,30.46,No,Low,College students,Clothing,No,2791
147947,Aisle,19.24,15.64,Yes,High,Young adults,Clothing,Yes,1249
174171,Front of Store,8.01,5.34,Yes,Medium,Seniors,Food,Yes,2273
183064,Front of Store,19.25,17.13,Yes,Low,Young adults,Electronics,No,1773
177131,Aisle,47.16,43.78,Yes,High,Families,Food,Yes,1733
128179,End-cap,38.75,35.22,Yes,High,Seniors,Electronics,No,2060
152723,Aisle,44.16,42.34,No,High,Seniors,Food,Yes,2849
123824,Aisle,32.35,28.97,Yes,Low,Families,Electronics,No,2277
166345,Aisle,40.77,39.73,No,Low,Seniors,Electronics,Yes,1135
199279,Aisle,18.36,15.23,No,Low,Seniors,Electronics,No,1770
167981,End-cap,37.4,37.29,No,High,College students,Clothing,No,730
146839,Aisle,10.04,7.54,No,Medium,College students,Food,No,1525
187180,Front of Store,47.5,46.74,No,High,Families,Electronics,Yes,647
167640,End-cap,46.56,43.71,Yes,High,Families,Electronics,Yes,1017
165158,Front of Store,40.44,37.89,No,Low,College students,Food,No,1622
111521,Front of Store,31.98,27.82,Yes,High,Seniors,Food,Yes,2553
120228,End-cap,15.92,13.41,No,High,Seniors,Food,No,2347
133078,Aisle,48.34,45.21,No,Low,Families,Clothing,Yes,2535
137598,Aisle,38.21,37.69,No,Medium,Families,Electronics,Yes,2839
138779,Front of Store,44.97,42.24,Yes,Low,Families,Clothing,Yes,2801
198329,Front of Store,19.55,15.77,Yes,Low,Young adults,Electronics,Yes,628
110295,End-cap,13.1,8.47,Yes,Low,Young adults,Electronics,No,1448
196427,Aisle,36.73,31.98,Yes,Low,Families,Electronics,No,1401
110075,Front of Store,42.96,41.45,Yes,Medium,College students,Electronics,Yes,2185
132322,Front of Store,37.74,34.99,Yes,Low,Families,Clothing,No,2135
199631,Front of Store,14.8,14.51,Yes,Medium,Families,Electronics,No,1269
182306,Front of Store,5.93,5.84,No,Medium,Seniors,Food,No,2805
194915,Aisle,23.91,21.1,Yes,Low,Seniors,Food,No,1796
131298,End-cap,41.46,37.69,Yes,Medium,College students,Electronics,No,2133
168571,Aisle,10.78,6.39,No,High,Seniors,Electronics,No,1778
154224,End-cap,22.69,21.79,Yes,Medium,Families,Food,No,2474
171061,Aisle,23.25,22.71,No,Low,College students,Electronics,Yes,2032
119049,Aisle,16.24,11.33,No,Low,Seniors,Clothing,Yes,1659
158781,End-cap,19.91,16.77,Yes,Medium,Young adults,Clothing,Yes,2443
151438,Aisle,5.41,2.73,No,Medium,Seniors,Food,Yes,1137
152871,End-cap,13.39,12.76,No,High,Families,Clothing,Yes,1847
`;

function parseCSV(): ProductPlacement[] {
  const lines = CSV_DATA.trim().split('\n');
  const result: ProductPlacement[] = [];

  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;
    const parts = line.split(',');
    if (parts.length < 10) continue;

    const id = parts[0];
    const position = parts[1];
    const price = parseFloat(parts[2]);
    const compPrice = parseFloat(parts[3]);
    const traffic = parts[5];
    const demo = parts[6] as any;
    const category = parts[7];
    const volume = parseInt(parts[9]);

    let storeLocation: 'Front Aisle' | 'Middle Aisle' | 'Back Wall' | 'Endcap' | 'Checkout Queue' = 'Middle Aisle';
    if (position === 'End-cap') {
      storeLocation = 'Endcap';
    } else if (position === 'Front of Store') {
      storeLocation = 'Front Aisle';
    }

    let shelfHeight: 'Top Shelf' | 'Eye Level' | 'Touch Level' | 'Bottom Shelf' = 'Eye Level';
    if (traffic === 'Low') {
      shelfHeight = parseInt(id) % 2 === 0 ? 'Bottom Shelf' : 'Top Shelf';
    } else if (traffic === 'Medium') {
      shelfHeight = 'Touch Level';
    }

    let weeklyFootTraffic = 4500;
    if (traffic === 'High') {
      weeklyFootTraffic = 8500;
    } else if (traffic === 'Low') {
      weeklyFootTraffic = 1800;
    }

    const productName = getProductName(id, category);

    let facingCount = 3;
    if (position === 'End-cap') {
      facingCount = 2;
    } else if (position === 'Front of Store') {
      facingCount = 4;
    }

    let costFactor = 0.5;
    if (category === 'Clothing') costFactor = 0.4;
    else if (category === 'Electronics') costFactor = 0.7;
    const unitCost = parseFloat((price * costFactor).toFixed(2));

    const revenue = parseFloat((volume * price).toFixed(2));

    result.push({
      id,
      productName,
      category,
      shelfHeight,
      facingCount,
      salesUnits: volume,
      revenue,
      unitCost,
      unitPrice: price,
      competitorPrice: compPrice,
      storeLocation,
      demographicTarget: demo,
      weeklyFootTraffic
    });
  }

  return result;
}

export const INITIAL_PRODUCTS: ProductPlacement[] = parseCSV();

export const INITIAL_DATABASE_CONNECTIONS: DatabaseConnection[] = [
  {
    id: 'conn-1',
    name: 'Main Retail PostgreSQL DB',
    type: 'PostgreSQL',
    status: 'connected',
    host: 'postgres-retail.gcp.internal',
    database: 'production_sales_v2',
    lastSync: '10 minutes ago'
  },
  {
    id: 'conn-2',
    name: 'Consumer Demographics BigQuery Warehouse',
    type: 'BigQuery',
    status: 'connected',
    host: 'bigquery.google.com/p/retail-bi-dw',
    database: 'analytics_customer_segments',
    lastSync: '1 hour ago'
  },
  {
    id: 'conn-3',
    name: 'Kaggle Product Positioning CSV File',
    type: 'Excel/CSV',
    status: 'connected',
    host: 'kaggle.com/datasets/amitvkulkarni/impact-of-product-positioning-on-sales',
    database: 'impact-of-product-positioning-on-sales.csv',
    lastSync: 'Just now'
  }
];

export const INITIAL_CALCULATED_FIELDS: CalculatedField[] = [
  {
    id: 'calc-1',
    name: 'Profit Margin',
    formula: 'Profit Margin',
    expression: '([Revenue] - ([Sales Units] * [Unit Cost])) / [Revenue]',
    description: 'Percentage of revenue kept as profit'
  },
  {
    id: 'calc-2',
    name: 'Sales per Facing',
    formula: 'Sales per Facing',
    expression: '[Sales Units] / [Facing Count]',
    description: 'Average number of unit sales generated per shelf facing'
  },
  {
    id: 'calc-3',
    name: 'Revenue Density',
    formula: 'Revenue Density',
    expression: '[Revenue] / [Facing Count]',
    description: 'Weekly dollar sales generated per shelf facing footprint'
  },
  {
    id: 'calc-4',
    name: 'Foot Traffic Conversion',
    formula: 'Conversion Rate',
    expression: '([Sales Units] / [Weekly Foot Traffic]) * 100',
    description: 'Percentage of aisle traffic that buys the product'
  },
  {
    id: 'calc-5',
    name: 'Competitor Price Difference',
    formula: 'Price Diff',
    expression: '(([Competitor Price] - [Unit Price]) / [Competitor Price]) * 100',
    description: 'Percentage pricing discount or premium compared to competitor shelf pricing'
  }
];

export const STORY_SCENES: StoryScene[] = [
  {
    id: 'scene-1',
    title: 'The Golden Zone: Eye-Level Dominance',
    subtitle: 'Analyzing how vertical shelf positioning dictates retail sales performance',
    description: 'Retail stores traditionally place higher-margin, premium items in the "Eye Level" area (approx. 4.5 to 5.5 feet high) where customers look first.',
    visualType: 'shelf-height',
    narrativePoints: [
      'Eye-Level products generate the highest absolute revenue, commanding premium unit prices ($3.99 - $34.99).',
      'Bottom Shelf placement is reserved for bulk or generic items. While volume is high, the revenue density is 40% lower on average.',
      'Specialty or niche items on the Top Shelf capture high margins but struggle with sales frequency.'
    ]
  },
  {
    id: 'scene-2',
    title: 'Touch Level Strategy: Capturing Younger Demographics',
    subtitle: 'Matching product demographics to vertical height',
    description: 'Consumer segments have different height profiles. Most notably, kids stand lower than adults, making the "Touch Level" shelf a primary impulse trigger for sweet cereals and colorful snacks.',
    visualType: 'demographic-impulse',
    narrativePoints: [
      'Products targeting "Families with Kids" (like Sugar Loops and Cheese Puffs) outperform by 150% in sales units when placed on the "Touch Level" (approx. 2 to 3 feet high) versus the top or bottom shelves.',
      'Young Professionals and Health-conscious segments convert highly at Eye-Level or Top Shelf positions, reflecting deliberate, health-oriented buying patterns.',
      'Placing kid-friendly chocolate milks on the bottom shelf or eye level results in a noticeable drop in conversion rate.'
    ]
  },
  {
    id: 'scene-3',
    title: 'Facings ROI: Share of Shelf vs. Efficiency',
    subtitle: 'Finding the sweet spot between shelf footprint and sales volume',
    description: 'Every product facing on a shelf represents valuable real estate. Is a product with 5 facings twice as effective as one with 2?',
    visualType: 'facings-roi',
    narrativePoints: [
      'We observe diminishing returns: expanding a product from 2 to 4 facings often increases sales by only 15-20%, reducing the Sales per Facing metric.',
      'High-velocity basic items (like Gallon Milk) require high facing counts (5+) to prevent stockouts, but have lower Revenue Density.',
      'Impulse electronics (like Power Banks) achieve maximum Revenue Density ($1,699/facing) with just a single facing!'
    ]
  },
  {
    id: 'scene-4',
    title: 'Aisle Traffic & Footwear Conversion Correlation',
    subtitle: 'How store physical bottlenecks affect aisle conversions',
    description: 'High foot-traffic areas like Endcaps and Checkout Queues offer massive exposure. Let’s map how Traffic translates into real purchase conversions across physical store zones.',
    visualType: 'traffic-correlation',
    narrativePoints: [
      'Checkout Queues register the highest absolute traffic (9,800+ weekly), driving incredible impulse conversions on small items like chewing gum (620 units sold).',
      'Endcap displays generate up to 3x the traffic of normal middle aisles. Placing Gourmet Potato Chips here spikes weekly revenue to $1,696.',
      'Back wall areas (dairy fridge) serve as destination anchors—traffic is steady (6,200), driving high conversion for staple goods regardless of layout.'
    ]
  },
  {
    id: 'scene-5',
    title: 'AI-Generated Shelf Optimization (Planogram)',
    subtitle: 'Gemini recommendations for maximizing revenue on a standard 4-tier retail shelf',
    description: 'Using real-time consumer demographics and margin structures, Gemini has drafted an optimized Planogram. See the proposed shelf arrangement designed to maximize cross-selling and revenue growth.',
    visualType: 'ai-planogram',
    narrativePoints: [
      'Recommend moving High-Margin Baby Formula strictly to Eye-Level and bundle with wipes on the Bottom Shelf.',
      'Recommend keeping Kids Sweets at Touch-Level to trigger impulse grabs.',
      'Propose shifting Gourmet Organic Ancient Grain Granola to Eye Level and reducing Pretzels facings to optimize profit margin density.'
    ]
  }
];

// Simple interpreter to evaluate formula on a product record
export function evaluateCalculatedField(field: CalculatedField, prod: ProductPlacement): number {
  try {
    const revenue = prod.revenue;
    const salesUnits = prod.salesUnits;
    const unitCost = prod.unitCost;
    const facingCount = prod.facingCount || 1;
    const footTraffic = prod.weeklyFootTraffic || 1;
    const competitorPrice = prod.competitorPrice !== undefined ? prod.competitorPrice : prod.unitPrice;

    switch (field.id) {
      case 'calc-1': // Profit Margin
        return ((revenue - (salesUnits * unitCost)) / revenue) * 100;
      case 'calc-2': // Sales per Facing
        return salesUnits / facingCount;
      case 'calc-3': // Revenue Density
        return revenue / facingCount;
      case 'calc-4': // Foot Traffic Conversion
        return (salesUnits / footTraffic) * 100;
      case 'calc-5': // Price Competitiveness Difference
        return ((competitorPrice - prod.unitPrice) / competitorPrice) * 100;
      default:
        // Try to parse basic formulas of form "[FieldName] / [FieldName2]" or similar
        let expr = field.expression;
        expr = expr.replace(/\[Revenue\]/gi, revenue.toString());
        expr = expr.replace(/\[Sales Units\]/gi, salesUnits.toString());
        expr = expr.replace(/\[Unit Cost\]/gi, unitCost.toString());
        expr = expr.replace(/\[Facing Count\]/gi, facingCount.toString());
        expr = expr.replace(/\[Weekly Foot Traffic\]/gi, footTraffic.toString());
        expr = expr.replace(/\[Unit Price\]/gi, prod.unitPrice.toString());
        expr = expr.replace(/\[Competitor Price\]/gi, competitorPrice.toString());
        
        // Remove brackets
        expr = expr.replace(/\[|\]/g, '');
        // Safe evaluation
        const cleanExpr = expr.replace(/[^0-9\s+\-*/().]/g, '');
        const res = Function(`"use strict"; return (${cleanExpr})`)();
        return isNaN(res) || !isFinite(res) ? 0 : res;
    }
  } catch (err) {
    console.error('Error evaluating formula:', err);
    return 0;
  }
}
