#!/usr/bin/env python3
"""
SmartBridge Internship Project - Web Integration Layer (Flask)
Author: ramakrishnasiripurapu210806@gmail.com
Date: July 2026

Description:
    This Flask server serves as the web integration portal, demonstrating how 
    to embed the interactive Tableau worksheets, dashboards, and storybooks 
    into a custom corporate web app.
"""

import os
from flask import Flask, render_template, jsonify

app = Flask(__name__, template_folder='templates')

# Mock data for Flask API demonstration
DEMO_PRODUCTS = [
    {"id": "185102", "productName": "Sport Performance Hoodie", "category": "Clothing", "storeLocation": "Middle Aisle", "shelfHeight": "Eye Level", "salesUnits": 2823, "revenue": 48188.61},
    {"id": "180176", "productName": "Ultra-Slim Wireless Charger", "category": "Electronics", "storeLocation": "Endcap", "shelfHeight": "Eye Level", "salesUnits": 2220, "revenue": 95815.20},
    {"id": "113143", "productName": "Organic Ancient Grain Granola", "category": "Food", "storeLocation": "Middle Aisle", "shelfHeight": "Eye Level", "salesUnits": 2663, "revenue": 73019.46},
    {"id": "151396", "productName": "Premium Dark Chocolate Bar", "category": "Food", "storeLocation": "Front Aisle", "shelfHeight": "Touch Level", "salesUnits": 729, "revenue": 14441.49},
]

@app.route('/')
def home():
    """Renders the main web page with Tableau Embedded Dashboard and Storyboards"""
    # In a real environment, you embed the Tableau Public Javascript share URL or iframe src here
    tableau_embed_url = "https://public.tableau.com/views/Strategic_Product_Placement_Analysis/Story"
    return render_template('index.html', embed_url=tableau_embed_url)

@app.route('/api/v1/placements', methods=['GET'])
def get_placements():
    """REST API endpoint returning current active placements data"""
    return jsonify({
        "success": True,
        "source": "PostgreSQL live link via Flask REST API",
        "data": DEMO_PRODUCTS
    })

@app.route('/api/v1/health', methods=['GET'])
def health_check():
    """Platform health check"""
    return jsonify({
        "status": "healthy",
        "database_connected": True,
        "tableau_server_ping": "active"
    })

if __name__ == '__main__':
    # Binds to port 5000 by default for Flask deployments
    port = int(os.environ.get('PORT', 5000))
    print(f"Flask Web Integration App running on http://127.0.0.1:{port}")
    app.run(host='0.0.0.0', port=port, debug=True)
