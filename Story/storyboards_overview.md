# Tableau Storyboard Structure

This document details the narrative architecture, sequence of scenes, and analytical goals of the interactive **Tableau Storybook** implemented in our suite.

---

## Story Overview
Our Tableau Storybook is structured as a five-scene narrative flow, taking a retail category analyst from high-level vertical shelf positioning rules down to interactive AI-optimized space layout design:

```
[Scene 1] Vertical Shelf Heights -> [Scene 2] Demographics Mapping -> [Scene 3] Share of Shelf Facings -> [Scene 4] Aisle Foot Traffic -> [Scene 5] AI-Optimized Planogram
```

---

## Scene-by-Scene Description

### Scene 1: The Golden Zone: Eye-Level Dominance
- **Subtitle**: Analyzing how vertical shelf positioning dictates retail sales performance.
- **Narrative Points**:
  1. Eye-Level products generate the highest absolute revenue, commanding premium unit pricing.
  2. Bottom Shelf placement is reserved for bulk or generic items; while volume remains stable, the revenue density is 40% lower on average.
  3. Specialty or niche items on the Top Shelf capture high margin percentage ratios but struggle with sales frequency.

### Scene 2: Touch Level Strategy: Capturing Younger Demographics
- **Subtitle**: Matching product demographics to vertical height.
- **Narrative Points**:
  1. Products targeting families with kids (like Sugar Loops) outperform by 150% in sales units when placed on the "Touch Level" (approx. 2 to 3 feet high) versus the top or bottom shelves.
  2. Young Professionals and Health-conscious segments convert highly at Eye-Level or Top Shelf positions, reflecting deliberate, health-oriented buying patterns.

### Scene 3: Facings ROI: Share of Shelf vs. Efficiency
- **Subtitle**: Finding the sweet spot between shelf footprint and sales volume.
- **Narrative Points**:
  1. We observe diminishing returns: expanding a product from 2 to 4 facings often increases sales by only 15-20%, reducing the Sales per Facing efficiency.
  2. High-velocity basic items require high facing counts (5+) to prevent stockouts but have lower revenue density.
  3. Impulse electronics achieve maximum Revenue Density with just a single facing.

### Scene 4: Aisle Traffic & Footwear Conversion Correlation
- **Subtitle**: How store physical bottlenecks affect aisle conversions.
- **Narrative Points**:
  1. Checkout Queues register the highest absolute traffic, driving incredible impulse conversions on small items like chewing gum.
  2. Endcap displays generate up to 3x the traffic of normal middle aisles. Placing Gourmet Potato Chips here spikes weekly revenue significantly.

### Scene 5: AI-Generated Shelf Optimization (Planogram)
- **Subtitle**: Gemini recommendations for maximizing revenue on a standard 4-tier retail shelf.
- **Narrative Points**:
  1. Recommend moving High-Margin Baby Formula strictly to Eye-Level and bundling with wipes on the Bottom Shelf.
  2. Recommend keeping Kids Sweets at Touch-Level to trigger impulse grabs.
  3. Propose shifting Gourmet Organic Ancient Grain Granola to Eye Level and reducing Pretzels facings to optimize profit margin density.
