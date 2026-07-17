# Web Integration: Flask Server & Embedding Guide

This document outlines the web integration layer, detailing how to run the **Flask python server** and embed the interactive Tableau workbook sheets into custom corporate portals.

---

## 1. Flask Server Structure
The Flask server scripts are stored in the `/Web integration` directory:

- `/Web integration/app.py`: The entry point python script setting up HTTP endpoints and REST APIs.
- `/Web integration/templates/index.html`: The HTML client styled with Tailwind CSS, integrating Tableau dashboards and story point panels.

---

## 2. Setting Up and Running the Flask Portal

To run the Flask application on your local workstation, ensure you have python3 and Flask installed, then follow these instructions:

### Step A: Install Dependencies
Open a command terminal and execute:
```bash
pip install Flask
```

### Step B: Run the Server
Launch the Flask script:
```bash
python3 "Web integration/app.py"
```

### Step C: View in Browser
Open your browser and navigate to:
```
http://127.0.0.1:5000/
```
The server will boot up instantly and serve the responsive BI dashboard embed portal.

---

## 3. Integrating Live Tableau WebComponents
The HTML template utilizes high-performance iframe containers ready for your specific **Tableau Public** or **Tableau Server** URL parameters. 

To link your live published Tableau sheet:
1. Open your workbook on **Tableau Public**.
2. Click **Share** in the bottom-right menu and copy the **Embed Code** or **Link**.
3. Replace the `tableau_embed_url` parameter inside `/Web integration/app.py` with your custom link.
4. The web portal will dynamically load and serve your active, interactive Tableau charts in real-time!
