# Data Preparation & Hygiene Guide

This document outlines the systematic, step-by-step procedures used to prepare the raw **Strategic Product Placement** dataset for visualization in Tableau. Data quality is the foundation of high-performance retail analytics.

## Step 1: Automated Data Preparation Pipeline
The python script `prepare_data.py` (located in this directory) acts as our centralized ETL pipeline. The execution of this script performs critical clean-ups:

- **String Stripping**: Automatically removes any leading, trailing, or double-spacing characters from core categorization fields like `Product Category` and `Product Position`. This prevents Tableau from treating `"Aisle"` and `"Aisle "` as separate legend elements.
- **Null & Missing Value Handling**:
  - Unspecified prices are imputed using the column **median price**.
  - Missing competitor pricing is defaulted to the active product's price to maintain margin metrics.
  - Missing promotions are flagged conservatively as `"No"`.
  - Empty sales volume numbers are initialized to `0` instead of breaking aggregation counters.
- **Logical Enforcements (Outlier Suppression)**:
  - Numerical inputs are cast as absolute values (`.abs()`) to prevent negative prices, negative volumes, or negative costs from skewing aggregate sums.
  - Product prices that evaluate exactly to `0` are re-anchored to a conservative `$1.00` baseline.

## Step 2: High-Performance Feature Engineering
To reduce calculation overhead inside the Tableau rendering engine, three critical fields are pre-compiled and appended directly into our cleansed dataset file `dataset_cleansed.csv`:

1. **Gross Revenue**: Calculated as:
   $$\text{Gross Revenue} = \text{Sales Volume} \times \text{Price}$$
2. **Estimated Wholesale Unit Cost**: Modeled after historical retail margins to support margin audits:
   $$\text{Unit Cost} = \text{Price} \times 0.55$$
3. **Estimated Gross Profit**: Calculated as:
   $$\text{Est Profit} = \text{Gross Revenue} - (\text{Sales Volume} \times \text{Unit Cost})$$

## Step 3: Duplicate Transaction Audits
Duplicate Transaction Audits search for rows that share identical `Product ID` entries. Duplicate indicators are flagged using a boolean state column (`is_duplicate`) so that analysts can isolate or filter out redundant warehouse listings easily in Tableau worksheets using a simple context filter.

---

### How to Run the Pipeline
Ensure Python is installed on your local system, then navigate to your repository root and execute:

```bash
python3 "Data Preparation/prepare_data.py"
```

This will read raw records from `Data Collection & Extraction of Data/dataset.csv` and output a clean, visualization-ready version to `Data Preparation/dataset_cleansed.csv`.
