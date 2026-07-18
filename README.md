# Strategic Product Placement & Business Intelligence Suite
**SmartBridge Retail Merchandising & Diagnostics Internship Project**

An end-to-end business intelligence and full-stack web integration solution engineered to optimize physical supermarket shelf configurations, pricing strategies, and aisle layout conversions.

---

## 📂 Submission Directory & Repository Layout

This repository is strictly organized to match the SmartBridge Evaluation Rubric and folder structure requirements.

### 1. `Data Collection & Extraction of Data/`
*   `dataset.csv`: The official source Kaggle retail dataset detailing product pricing, positions, traffic levels, demographics, and sales volumes.
*   `Strategic_Product_Placement.twb`: The core Tableau Desktop Workbook XML mapping columns, schemas, and custom calculated fields.
*   `Strategic_Product_Placement.twbx`: The compiled, self-contained **Tableau Packaged Workbook** containing the workbook structure zipped alongside the raw data source.

### 2. `Data Preparation/`
*   `prepare_data.py`: A Python pipeline automating whitespace stripping, median price imputation for missing entries, outlier validation, and pre-compiling Gross Revenue and Net Profit Margin indicators.
*   `dataset_cleansed.csv`: The output dataset of the cleaning pipeline, acting as the single source of truth for the Tableau visualization sheets.

### 3. `Data Visualization/`
*   Replicates 4 unique Tableau analytical worksheets analyzing product shelf elasticities:
    *   *Shelving Height Performance*: Grouped revenue double-bars (Top, Eye, Touch, Bottom shelfs).
    *   *Price Elasticity Bubble Matrix*: Multidimensional scatter bubble plot mapping price vs sales velocity.
    *   *Stacked Demographic Preference*: Demographics mapping (Families, Seniors, Youth) against product positions.
    *   *Traffic Conversion Correlation*: Combo line-bar comparing raw aisle footsteps with units sold.
*   `retail_dashboard_preview.png`: High-fidelity visualization exported from the workbook sheets.

### 4. `Dashboard/`
*   `Dashboard.png`: An exported, high-fidelity responsive layout preview of the main Tableau executive dashboard.
*   `dashboard_design.md`: Structural layout guidelines, responsive grid boundaries, and custom hex color configurations.

### 5. `Story/`
*   `Story.png`: An exported visual preview of the Tableau storyboard scene navigation panel.
*   `storyboards_overview.md`: Narrative diagnostics details for our **5 sequential story scenes** outlining merchandising conclusions.

### 6. `Performance Testing/`
*   `performance_benchmark.md`: Detailed performance metrics verifying sub-1.8ms rendering speeds during multi-category filtering and calculation executions.

### 7. `Web integration/`
*   `app.py`: High-performance Flask server routing the corporate portal and exposing RESTful JSON endpoints (`/api/v1/placements`).
*   `templates/index.html`: Fully styled HTML5/CSS portal utilizing Tailwind CSS, embedding the active Tableau Public Web JavaScript API widgets.
*   `flask_integration.md`: Technical documentation outlining Flask routes, API designs, and WebComponent embedding setups.

### 8. `Project Demonstration & Documentation/`
*   `project_documentation.md`: The mandatory step-by-step project development procedure, from ingestion to Flask hosting.
*   `video_explanation_script.md`: The professional transcript script guiding the recording of the final project solution video.

---

## 📊 Tableau Calculated Field Index

The workbook incorporates 5 dynamic calculations defined inside the `.twb` metadata:
1.  **Profit Margin %**: `([Gross Revenue] - ([Sales Volume] * [Unit Cost])) / [Gross Revenue]`
2.  **Sales per Facing**: `[Sales Volume] / [Facing Count]`
3.  **Revenue Density ($/f)**: `[Gross Revenue] / [Facing Count]`
4.  **Traffic Conversion Rate %**: `([Sales Volume] / [Weekly Foot Traffic]) * 100`
5.  **Competitor Price Variance**: `(([Competitor Price] - [Price]) / [Competitor Price]) * 100`

---

## 🚀 Running the Web Integration Layer (Flask)

To run the embedded web interface locally:
1.  Navigate to the integration directory:
    ```bash
    cd "Web integration"
    ```
2.  Install required backend dependencies:
    ```bash
    pip install flask
    ```
3.  Boot the application server:
    ```bash
    python3 app.py
    ```
4.  Open your browser and navigate to `http://localhost:5000` to view the live dashboard embed.

---
