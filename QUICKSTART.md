# Quick Start Guide

Get your Ocean Current Simulator running in 3 minutes!

## Step 1: Install Dependencies

```bash
npm install
```

This installs:
- Three.js (3D graphics)
- Vite (development server)
- lil-gui (control panel)

## Step 2: Start Development Server

```bash
npm run dev
```

This will:
- Start a local server at `http://localhost:3000`
- Automatically open your browser
- Enable hot reload (changes update instantly)

## Step 3: Explore the Simulator

### Basic Controls

- **Rotate**: Click and drag with mouse
- **Zoom**: Scroll mouse wheel
- **Pan**: Right-click and drag

### Try These First

1. **Open the control panel** (right side of screen)
2. **Load a preset scenario**: Click "Scenario Presets" → "Winter Storm"
3. **Watch it update**: The particles and vectors change immediately
4. **Play with parameters**:
   - Increase river discharge → See northward plume strengthen
   - Increase wind speed → See surface drift intensify
   - Toggle Play/Pause → Watch tides oscillate over time

### Understanding the Visualization

**Particles (flowing dots)**:
- Blue = slow current
- Cyan = moderate speed
- Yellow = fast
- Red = very fast

**Arrows**:
- Direction = current direction
- Length = current speed
- Color = same as particles

**Bottom-left panel**:
- Shows current parameters
- Max velocity in the domain
- Which force is dominant (River/Wind/Tides)
- Bar chart of relative influence

## Common Scenarios to Try

### 1. Winter Storm Conditions
```
River: 1000 m³/s (low)
Wind: 25 m/s from South (high)
Result: Wind dominates, strong northward drift
```

### 2. Spring Freshet (High River Flow)
```
River: 8000 m³/s (high)
Wind: 8 m/s (moderate)
Result: River plume dominates, clear outflow pattern
```

### 3. Tidal Dominance
```
River: 500 m³/s (very low)
Wind: 3 m/s (light)
Tide: Set to Flood (3.1 hours)
Result: Tidal currents control the flow
```

### 4. Mixed Forcing
```
River: 4000 m³/s (moderate)
Wind: 15 m/s (moderate)
Tide: Mid-phase
Result: Complex interaction of all three forces
```

## Keyboard Tips

While there are no keyboard shortcuts built in yet, you can:
- Use the GUI controls for precise adjustments
- Click preset buttons for instant scenarios
- Adjust time speed to see tidal cycles faster

## Troubleshooting

### Blank screen
- Check browser console (F12) for errors
- Make sure you ran `npm install` first
- Try refreshing the page

### Slow performance
- Reduce particle count in controls
- Close other browser tabs
- Try a different browser (Chrome/Edge recommended)

### Controls not responding
- Check if the welcome panel is blocking (click "Start Exploring")
- Make sure you clicked inside the canvas area

## Next Steps

Once comfortable with the basics:

1. **Compare scenarios**: Set up a condition, note the max velocity, change one parameter, see the difference
2. **Time animation**: Use Play/Pause to watch 12.4-hour tidal cycle
3. **Identify patterns**: Notice how river plume radiates from southeast (Fraser River)
4. **Read the research**: Check README.md to understand the science behind it

## Building for Production

When ready to share:

```bash
npm run build
```

This creates an optimized version in the `dist/` folder that you can deploy to any web server.

---

**Enjoy exploring ocean currents! 🌊**
