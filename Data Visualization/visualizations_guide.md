# Unique Data Visualizations

This guide documents the design, mapping metrics, and clinical retail insights for the **four unique visualizations** integrated into our interactive BI environment. These replicate advanced Tableau worksheets.

---

## Worksheet 1: Shelving Height Revenue & Profit Margin (Grouped Bar Chart)
This visualization aggregates sales performance by physical shelf placement height.

- **Primary Dimensions**: `Shelf Height` (Top Shelf, Eye Level, Touch Level, Bottom Shelf)
- **Primary Measures**: `Sum of Revenue ($)`, `Sum of Estimated Gross Profit ($)`
- **Aesthetic Pairings**: Grouped Columns with high-contrast color codes:
  - **Revenue**: Styled in Deep Emerald Green to signify gross cash generation.
  - **Profit**: Styled in Soft Teal to represent net category margins.
- **Analytical Intent**: Directly audits the **"Golden Zone" (Eye Level)** premium against the bottom shelf zone. This serves as the foundation for planogram optimization models.

---

## Worksheet 2: Price Elasticity & Sales Volume (Scatter Plot Worksheet)
A scatter correlation matrix analyzing the relationship between price points and unit velocity.

- **Primary Dimensions**: `Product Name` (Scatter Point Mark labels)
- **X-Axis Dimension**: `Unit Price ($)`
- **Y-Axis Dimension**: `Sales Volume (Units)`
- **Color Category Encoding**: `Product Category` (Food = Emerald, Electronics = Royal Blue, Clothing = Charcoal Grey)
- **Marker Size Encoding**: `Revenue ($)` (Bubble size increases dynamically based on the total financial value of the placement)
- **Analytical Intent**: Identifies pricing elasticity clusters and verifies if competitor pricing variations trigger volume drops.

---

## Worksheet 3: Stacked Demographic Placement (Stacked Bar Chart)
Visualizes demographic segment brand alignment with vertical shelf placement heights.

- **Primary Dimensions**: `Shelf Height` (Y-Axis Rows)
- **Stacked Segment Legend**: `Consumer Demographics` (Families, Seniors, Young Adults, College Students, General)
- **Primary Measures**: `Sales Volume (Units)` (X-Axis Bars)
- **Analytical Intent**: Discovers crucial impulse buying behaviors. For example, it highlights how kid-targeted sweet snacks at "Touch Level" outperform eye-level placement, proving height-demographic correlations.

---

## Worksheet 4: Location Traffic & Volume Correlation (Comparative Performance Chart)
Examines store location placement efficiency against real physical foot traffic footsteps.

- **Primary Dimensions**: `Store Location` (Front Aisle, Middle Aisle, Back Wall, Endcap, Checkout Queue)
- **Left Measure**: `Sales Units` (Bar length)
- **Right Measure**: `Weekly Foot Traffic` (Trend line overlay)
- **Analytical Intent**: Audits location conversion efficiency. Identifies if high-traffic positions (such as Checkout Queues) are being under-utilized with low-velocity products.
