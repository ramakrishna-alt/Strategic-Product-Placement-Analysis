# Step-by-Step Project Development Procedure

This step-by-step documentation outlines the comprehensive project development lifecycle of our **Strategic Product Placement & Business Intelligence Suite**.

---

## Phase 1: Data Collection & Extraction
1. **Source Dataset Collection**: We gathered raw retail transactional placement listings containing product price benchmarks, foot traffic categorizations, facing counts, and seasonal markers.
2. **Schema Definition**: Designed a standard layout modeling product listings.
3. **Database Configuration**: Bootstrapped PostgreSQL relational database connections alongside BigQuery warehouses to store customer segments and coordinate live extracts.

---

## Phase 2: Data Preparation
1. **Cleaning Rules Implementation**: Formulated standard sanitization routines in `prepare_data.py` utilizing python.
2. **Whitespace and Format Stripping**: Cleaned categorical fields to ensure text formatting matches.
3. **Null/Missing Cell Imputations**: Configured median price lookups and default booleans to prevent blank values.
4. **Calculated Feature Pre-compilation**: Engineered metrics like **Gross Revenue**, **Estimated Unit Cost**, and **Net Profit Margin** directly into the data rows to reduce analytical calculation overhead.

---

## Phase 3: Unique Visualizations (Worksheets)
Developed 4 unique worksheets replicating advanced Tableau interactive charts:
1. **Shelving Height Comparison**: Double bar charts analyzing revenue yields and net profit margins across Top, Eye, Touch, and Bottom shelfs.
2. **Price Elasticity Bubbles Matrix**: X-Y scatter bubble plot mapping price vs unit velocity, colored by category and sized by placement revenue.
3. **Demographic Impulses Stack**: Stacked column charts revealing which age/demographic groups purchase most frequently from specific shelf heights.
4. **Foot Traffic Conversions**: Grouped combo chart comparing raw aisle footsteps with resulting unit conversions across key store locations.

---

## Phase 4: Dashboard & Storybook Design
1. **Responsive Bento Grid Layout**: Built an asymmetrical flexbox and responsive grid system that automatically scales and stacks from mobile viewports to ultra-wide desktop monitors.
2. **KPI Header Matrix**: Placed aggregate panels tracking real-time Revenue, Margins, Units, and traffic conversions.
3. **5-Scene Narrative Storybook**: Built a sequential Tableau Storybook detailing:
   - *Scene 1*: Eye-Level dominance insights.
   - *Scene 2*: Youth-targeted "Touch Level" impulse buying metrics.
   - *Scene 3*: Shelf Share facings ROI thresholds.
   - *Scene 4*: Store location bottleneck conversion rates.
   - *Scene 5*: AI-Optimized shelf planogram recomendations.

---

## Phase 5: Web & Flask Integration
1. **Embedded Web App Development**: Built a solid python Flask application supporting HTML/CSS views.
2. **Tableau Component Embedded Rendering**: Crafted Tailwind CSS templates containing high-fidelity, responsive iframe share tags pointing to the published Tableau workbooks.
3. **RESTful APIs**: Configured Flask route endpoints (`/api/v1/placements`) serving real-time JSON payloads fetched directly from the database connection layers.
