# Dashboard Responsive & Design Specification

This document details the architectural grid, visual design rules, and mobile-friendly responsive properties of our **Strategic Product Placement BI Dashboard**.

## 1. Grid & Layout Architecture (Bento Style)
To maximize visual scanning and maintain professional data density, the main dashboard screen utilizes a custom, modern flexbox and grid structure:

- **Desktop Layout (Large Screens `xl:`)**: Operates on an asymmetrical **1:3 grid layout**:
  - **Left Rail (Col Span 1)**: Interactive control panel containing categories, store locations, and height filters.
  - **Right Stage (Col Span 3)**: Main dashboard canvas housing KPI summary cards (top row) and a 4-pane visualization matrix (2x2 grid).
- **Mobile Layout (Small Screens `<md`)**: Responsive layout shifts to a single linear-column flow. Filters sit compactly at the top, followed by sequential, swipe-friendly cards.

## 2. Dynamic KPI Indicator Panels (Metrics Header)
The dashboard features five high-visibility aggregate cards designed for instant retail diagnostic checks:

1. **Total Sales Revenue**: Displays sum of transactions ($) with progress indication.
2. **Category Net Profit**: Displays net margins ($) with bold styling.
3. **Total Units Distributed**: Raw unit output count.
4. **Average Profit Margin**: Dynamic, weighted ratio percentage indicator.
5. **Traffic Conversion Efficiency**: Percentage of shoppers converting to real purchases.

---

## 3. UI/UX Design System Token Reference

| Aspect | Custom Token / CSS Utility | Description |
| :--- | :--- | :--- |
| **Theme Base** | `bg-slate-50/50` / `bg-white` | Pristine high-contrast light theme with rich charcoal accents |
| **Primary Typography** | `Inter`, `ui-sans-serif` | Clean, modern sans-serif optimized for numbers and legibility |
| **Mono Accents** | `JetBrains Mono` | Applied to IDs, calculation fields, and technical KPI values |
| **Color Codes** | `text-slate-800` / `text-emerald-600` | Deep slate for hierarchy, vibrant emerald green for successful gains |
| **Grid Padding** | `p-6` (Desktop) / `p-4` (Mobile) | Generous white-space breathing rooms, preventing visual noise |
| **Visual Boundaries** | `border-slate-100` / `shadow-xs` | Ultra-fine subtle panel divisions, maintaining absolute neatness |

---

## 4. Mobile Responsiveness Tests
- **Touch Targets**: Buttons, filter chips, and interactive charts feature safe touch targets exceeding **44px** to ensure seamless operation on tablets and mobile phones.
- **Chart Resizing**: All Recharts component wrappers utilize `ResponsiveContainer` wrapping with real-time `ResizeObserver` tracking. This guarantees charts dynamically stretch or scale on viewports from 375px wide (mobile) up to 2560px wide (ultra-wide monitors) without clipping text.
