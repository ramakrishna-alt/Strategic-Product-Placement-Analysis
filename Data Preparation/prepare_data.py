#!/usr/bin/env python3
"""
SmartBridge Internship Project - Data Preparation Pipeline
Author: ramakrishnasiripurapu210806@gmail.com
Date: July 2026

Description:
    This script automates the cleansing and preparation of raw retail product 
    placement data. It performs trailing/leading whitespace removal, handles 
    missing or null fields, guarantees absolute values for pricing/costs, flags 
    potential transaction duplicates, and outputs a highly optimized file 
    ready for seamless ingestion into Tableau.
"""

import os
import sys

def run_data_preparation(input_path, output_path):
    print("=== Launching Data Preparation & Hygiene Pipeline ===")
    
    if not os.path.exists(input_path):
        print(f"Error: Raw dataset not found at {input_path}")
        sys.exit(1)
        
    try:
        import pandas as pd
    except ImportError:
        print("Pandas library is not installed. Performing fall-back text processing...")
        # Simple fallback text sanitization if pandas is not in the environment
        sanitize_raw_text(input_path, output_path)
        return

    # 1. Read Raw CSV
    print(f"Reading raw transactions from: {input_path}")
    df = pd.read_csv(input_path)
    initial_rows = len(df)
    print(f"Loaded {initial_rows} records.")

    # 2. String Cleaning (Whitespace and Cases)
    print("Cleaning string columns (removing leading/trailing spaces)...")
    for col in df.select_dtypes(include=['object']).columns:
        df[col] = df[col].astype(str).str.strip()

    # 3. Missing Value Imputation
    print("Filling missing and null cells with conservative fallbacks...")
    df['Price'] = df['Price'].fillna(df['Price'].median())
    df["Competitor's Price"] = df["Competitor's Price"].fillna(df['Price'])
    df['Promotion'] = df['Promotion'].fillna('No')
    df['Foot Traffic'] = df['Foot Traffic'].fillna('Medium')
    df['Consumer Demographics'] = df['Consumer Demographics'].fillna('General')
    df['Sales Volume'] = df['Sales Volume'].fillna(0).astype(int)

    # 4. Outlier & Error Correction (Enforcing absolute values & logical thresholds)
    print("Enforcing numeric integrity (converting negative values to absolute values)...")
    df['Price'] = df['Price'].abs()
    df["Competitor's Price"] = df["Competitor's Price"].abs()
    df['Sales Volume'] = df['Sales Volume'].abs()

    # Ensure competitor price makes sense (not extreme outlier)
    # If price is 0, make it a baseline of $1.0
    df.loc[df['Price'] == 0, 'Price'] = 1.0
    df.loc[df["Competitor's Price"] == 0, "Competitor's Price"] = df['Price']

    # 5. Feature Engineering: Adding helper columns for Tableau optimizations
    print("Creating engineered calculated features for high-performance visualization...")
    df['Gross Revenue'] = (df['Sales Volume'] * df['Price']).round(2)
    # Estimated wholesale cost factor
    df['Unit Cost'] = (df['Price'] * 0.55).round(2)
    df['Est Profit'] = (df['Gross Revenue'] - (df['Sales Volume'] * df['Unit Cost'])).round(2)

    # 6. Duplicates Management
    duplicates_count = df.duplicated(subset=['Product ID']).sum()
    print(f"Identified {duplicates_count} records with duplicate Product IDs.")
    # For a high fidelity report we preserve them but index/tag them clearly
    df['is_duplicate'] = df.duplicated(subset=['Product ID'], keep=False)

    # 7. Export Sanitized Workbook Output
    print(f"Saving cleansed dataset to: {output_path}")
    df.to_csv(output_path, index=False)
    
    print("=== Data Preparation Pipeline Successfully Completed! ===")
    print(f"Processed Rows: {len(df)} | Output Size: {os.path.getsize(output_path)} bytes\n")

def sanitize_raw_text(input_path, output_path):
    """Fallback text processor when pandas library is missing"""
    with open(input_path, 'r') as infile, open(output_path, 'w') as outfile:
        headers = infile.readline().strip()
        # Add engineered column headers
        outfile.write(headers + ",Gross Revenue,Unit Cost,Est Profit,is_duplicate\n")
        
        for line in infile:
            parts = [p.strip() for p in line.strip().split(',')]
            if len(parts) < 10:
                continue
            
            pid, pos, price_str, comp_price_str, promo, traffic, demo, cat, seasonal, vol_str = parts[:10]
            
            # Numeric conversion and sanitization
            price = abs(float(price_str)) if price_str else 4.99
            comp_price = abs(float(comp_price_str)) if comp_price_str else price
            vol = abs(int(vol_str)) if vol_str else 0
            
            rev = round(price * vol, 2)
            cost = round(price * 0.55, 2)
            profit = round(rev - (vol * cost), 2)
            
            cleansed_line = f"{pid},{pos},{price},{comp_price},{promo},{traffic},{demo},{cat},{seasonal},{vol},{rev},{cost},{profit},False\n"
            outfile.write(cleansed_line)
    print("Text-based sanitization fallback completed successfully.")

if __name__ == "__main__":
    # Standard paths relative to root directory
    raw_path = "Data Collection & Extraction of Data/dataset.csv"
    clean_path = "Data Preparation/dataset_cleansed.csv"
    
    # Ensure folder structure exists
    os.makedirs(os.path.dirname(clean_path), exist_ok=True)
    
    run_data_preparation(raw_path, clean_path)
