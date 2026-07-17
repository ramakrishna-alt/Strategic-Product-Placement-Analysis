import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI, Type } from '@google/genai';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Standard mock arrays loaded from data module in TypeScript or duplicated here for isolation
import { INITIAL_PRODUCTS, INITIAL_DATABASE_CONNECTIONS, INITIAL_CALCULATED_FIELDS } from './src/data';
import { ProductPlacement, DatabaseConnection, CalculatedField } from './src/types';

// In-Memory Database Store for real-time interactivity
let productsStore: ProductPlacement[] = JSON.parse(JSON.stringify(INITIAL_PRODUCTS));
let connectionsStore: DatabaseConnection[] = JSON.parse(JSON.stringify(INITIAL_DATABASE_CONNECTIONS));
let calculatedFieldsStore: CalculatedField[] = JSON.parse(JSON.stringify(INITIAL_CALCULATED_FIELDS));

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Body parsing middleware
  app.use(express.json());

  // Safe Gemini Client Lazy Initialization
  let aiClient: GoogleGenAI | null = null;
  function getGeminiClient(): GoogleGenAI {
    if (!aiClient) {
      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) {
        throw new Error('GEMINI_API_KEY environment variable is missing.');
      }
      aiClient = new GoogleGenAI({
        apiKey: apiKey,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build',
          }
        }
      });
    }
    return aiClient;
  }

  // --- API Endpoints ---

  // Get all products
  app.get('/api/products', (req, res) => {
    res.json(productsStore);
  });

  // Create or Update a product (Simulates Data Collection / Manual placement adjustment)
  app.post('/api/products', (req, res) => {
    const product: ProductPlacement = req.body;
    if (!product.id) {
      product.id = `prod-${Date.now()}`;
      productsStore.push(product);
    } else {
      const idx = productsStore.findIndex(p => p.id === product.id);
      if (idx !== -1) {
        productsStore[idx] = { ...productsStore[idx], ...product };
      } else {
        productsStore.push(product);
      }
    }
    res.json({ success: true, product });
  });

  // Delete a product placement
  app.delete('/api/products/:id', (req, res) => {
    const { id } = req.params;
    productsStore = productsStore.filter(p => p.id !== id);
    res.json({ success: true });
  });

  // Reset product store to defaults
  app.post('/api/products/reset', (req, res) => {
    productsStore = JSON.parse(JSON.stringify(INITIAL_PRODUCTS));
    res.json({ success: true, products: productsStore });
  });

  // Bulk import products from external sources (e.g., Google Drive)
  app.post('/api/products/import', (req, res) => {
    const { products, mode } = req.body;
    if (!Array.isArray(products)) {
      return res.status(400).json({ error: 'Products must be an array' });
    }
    if (mode === 'replace') {
      productsStore = products;
    } else {
      // Append mode: avoid identical IDs by generating distinct ones if exists
      for (const prod of products) {
        const exists = productsStore.some(p => p.id === prod.id);
        if (exists) {
          prod.id = `${prod.id}-dup-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
        }
        productsStore.push(prod);
      }
    }
    res.json({ success: true, products: productsStore });
  });

  // Simulates Data Preparation: clean titles, fill in null fields, ensure numbers are absolute, flag duplicates
  app.post('/api/products/prepare', (req, res) => {
    productsStore = productsStore.map(p => {
      // 1. Data Cleaning: Strip accidental whitespaces from text fields
      const cleanedName = p.productName.trim().replace(/\s+/g, ' ');
      // 2. Outlier Management: Ensure positive numbers
      const cleanedUnits = Math.max(0, Math.round(p.salesUnits));
      const cleanedCost = Math.max(0, Number(p.unitCost));
      const cleanedPrice = Math.max(0, Number(p.unitPrice));
      const cleanedCompPrice = Math.max(0, Number(p.competitorPrice !== undefined ? p.competitorPrice : cleanedPrice));
      const cleanedRevenue = Number((cleanedUnits * cleanedPrice).toFixed(2));

      return {
        ...p,
        productName: cleanedName,
        salesUnits: cleanedUnits,
        unitCost: cleanedCost,
        unitPrice: cleanedPrice,
        competitorPrice: cleanedCompPrice,
        revenue: cleanedRevenue,
        isDirty: false
      };
    });
    res.json({ success: true, products: productsStore });
  });

  // Get active database connections
  app.get('/api/connections', (req, res) => {
    res.json(connectionsStore);
  });

  // Sync / Connect new Database Connection
  app.post('/api/connections', (req, res) => {
    const conn: DatabaseConnection = req.body;
    if (!conn.id) {
      conn.id = `conn-${Date.now()}`;
      connectionsStore.push(conn);
    } else {
      const idx = connectionsStore.findIndex(c => c.id === conn.id);
      if (idx !== -1) {
        connectionsStore[idx] = conn;
      } else {
        connectionsStore.push(conn);
      }
    }
    res.json({ success: true, connections: connectionsStore });
  });

  // Simulate SQL Sync extraction (Seeds DB or extracts fresh entries)
  app.post('/api/connections/sync/:id', (req, res) => {
    const { id } = req.params;
    const conn = connectionsStore.find(c => c.id === id);
    if (!conn) {
       return res.status(404).json({ error: 'Connection not found' });
    }

    conn.status = 'connected';
    conn.lastSync = 'Just now';

    // Extract some new simulated records if it was disconnected
    if (productsStore.length < 15) {
      productsStore = JSON.parse(JSON.stringify(INITIAL_PRODUCTS));
    }

    res.json({ success: true, connection: conn, products: productsStore });
  });

  // Get Calculated Fields list
  app.get('/api/calculated-fields', (req, res) => {
    res.json(calculatedFieldsStore);
  });

  // Create a custom Calculated Field (Tableau performance metric)
  app.post('/api/calculated-fields', (req, res) => {
    const field: CalculatedField = req.body;
    if (!field.id) {
      field.id = `calc-${Date.now()}`;
    }
    const idx = calculatedFieldsStore.findIndex(f => f.id === field.id);
    if (idx !== -1) {
      calculatedFieldsStore[idx] = field;
    } else {
      calculatedFieldsStore.push(field);
    }
    res.json({ success: true, calculatedFields: calculatedFieldsStore });
  });

  // Delete calculated field
  app.delete('/api/calculated-fields/:id', (req, res) => {
    const { id } = req.params;
    calculatedFieldsStore = calculatedFieldsStore.filter(f => f.id !== id);
    res.json({ success: true, calculatedFields: calculatedFieldsStore });
  });

  // Strategic AI Shelf review & placement recommendations
  app.post('/api/gemini/analyze', async (req, res) => {
    const { query, products } = req.body;
    
    try {
      // Setup payload safely
      const itemsInfo = products.map((p: ProductPlacement) => 
        `- ${p.productName} (${p.category}): placed at "${p.shelfHeight}" height in "${p.storeLocation}" aisle. Sales: ${p.salesUnits} units, Revenue: $${p.revenue}, Facing count: ${p.facingCount}. Margin: ${(((p.revenue - (p.salesUnits * p.unitCost)) / p.revenue) * 100).toFixed(1)}%. Demographic: ${p.demographicTarget}.`
      ).join('\n');

      const systemPrompt = `You are an elite retail merchandiser, space planner, and Tableau business intelligence analyst.
You help supermarket store managers and retail planners optimize their shelf planograms, product facings, and category layouts to maximize sales and net profits.

Review the following active product placement configuration:
${itemsInfo}

The user's query: "${query || 'Provide a strategic planogram review and placement optimization report.'}"

Provide a highly professional, scannable, and concrete optimization report including:
1. **Vertical Shelf Performance Audit**: Analyze if current items are at the optimal height (e.g. Eye-Level for high margin, Touch-Level for kid items, bottom shelf for low-margin staples).
2. **Facings & Share of Shelf Analysis**: Suggest where to increase or decrease facings to optimize profit density.
3. **Store Physical Bottlenecks**: Evaluate if store location (Endcap, checkout, middle aisle) aligns with traffic.
4. **Calculated ROI Actionable Recommendations**: 3 distinct, high-impact changes to make right now with estimated profit increases.

Format your response in beautiful markdown with rich retail tables, bullet points, and high-visibility recommendations. Do not mention secret API keys or code structure. Keep the advice actionable.`;

      // Check if API key is present
      if (!process.env.GEMINI_API_KEY) {
         // Graceful mock mode if no API key is set, to guarantee that the app doesn't crash
         return res.json({
           analysis: `### ⚠️ No API Key Detected (Running in Simulator Mode)

Here is a simulated Retail Merchandising Audit based on your products:

1. **Shelf Height Performance Audit**:
   - **Super Sugar Loops Cereal** is optimally placed at **Touch Level** (Kids-level) attracting impulse purchases from families, yielding outstanding conversion (450 units sold).
   - **Premium Hypoallergenic Formula** ($34.99) at **Eye Level** is a strong profit anchor. However, it can be cross-merchandised near Baby Wipes to boost average cart value.
   - **Gourmet Truffle Chips** on the **Endcap** are capturing massive traffic (7,500), but could use an extra facing to prevent late-day stockouts.

2. **Facings Optimization Suggestions**:
   - Reduce **Value Gallon Whole Milk** from 5 to 4 facings. Staple goods have low elasticity; the extra facing doesn't yield proportional sales.
   - Reallocate that shelf share to **Premium Greek Yogurt Pack** to capture high-margin health-conscious consumers.

3. **Actionable Recommendations**:
   - **Cross-merchandising**: Place Organic Apple Puree Pouches ($1.49) next to the premium formula to trigger baby snack add-ons.
   - **Eye-Level adjustments**: Shifting Ancient Grain Granola to Eye-Level and placing Crunchy Honey Oats at Top Shelf could improve gross cereal category profit margin by 4.2% due to higher basket premiumization.`
         });
      }

      const ai = getGeminiClient();
      const response = await ai.models.generateContent({
        model: 'gemini-3.5-flash',
        contents: systemPrompt,
      });

      res.json({ analysis: response.text });
    } catch (error: any) {
      console.error('Gemini call failed:', error);
      res.status(500).json({ error: error?.message || 'Failed to generate recommendations from Gemini' });
    }
  });

  // --- Serve Frontend ---
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on port ${PORT}`);
  });
}

startServer();
