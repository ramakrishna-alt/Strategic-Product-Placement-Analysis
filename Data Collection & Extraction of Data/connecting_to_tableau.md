# Connecting the Dataset with Tableau

This guide details the procedure for connecting the **Strategic Product Placement Dataset** to **Tableau Desktop/Server/Public** for real-time and static business intelligence operations.

## Connection Protocol 1: Direct CSV File Integration
Use this method for offline local BI workbook development using the provided Kaggle CSV format.

1. **Launch Tableau**: Open **Tableau Desktop** or **Tableau Public** on your local machine.
2. **Select Data Source**: In the left-hand menu under **Connect / To a File**, select **Text File**.
3. **Locate Dataset**: Choose the file `dataset.csv` located in the `Data Collection & Extraction of Data/` directory.
4. **Inspect Metadata**: In the **Data Source Workspace**, confirm that Tableau has auto-detected the columns:
   - `Product ID` (Numeric/String)
   - `Product Position` (Categorical String)
   - `Price` (Decimal Numeric)
   - `Competitor's Price` (Decimal Numeric)
   - `Promotion` (Boolean/String)
   - `Foot Traffic` (Ordinal Categorical)
   - `Consumer Demographics` (Categorical String)
   - `Product Category` (Categorical String)
   - `Seasonal` (Boolean/String)
   - `Sales Volume` (Discrete Integer)

---

## Connection Protocol 2: Relational PostgreSQL Server Connection
For enterprise scenarios where product transactions are streamed or stored in a relational cloud database.

1. **Locate Server Connect Panel**: Under **Connect / To a Server**, click **More...** and select **PostgreSQL**.
2. **Server Credentials Entry**:
   - **Server / Host**: `postgres-retail.gcp.internal`
   - **Port**: `5432`
   - **Database**: `production_sales_v2`
   - **Authentication**: `Username and Password`
   - **Username**: `smartbridge_analyst`
   - **Password**: `sb_retail_secure_pass_2026`
3. **Establish Joins & Relationships**:
   - Drag the `sales_transactions` and `product_dimensions` tables onto the upper Canvas workspace.
   - Configure a native **Inner Join** or **Logical Relationship** mapping the primary and foreign key dimensions:
     ```sql
     [sales_transactions].[product_id] = [product_dimensions].[id]
     ```
4. **Data Extract vs. Live**: 
   - Choose **Extract** mode for optimal performance, faster rendering speed, and custom offline workbook distribution.
   - Click **Go to Worksheet** (Sheet 1) to begin building calculated fields and visualizations.
