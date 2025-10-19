# Ocean Current Simulator - Implementation Guide
## Strait of Georgia Interactive Visualization

---

## Project Overview
Create an interactive 3D web-based simulator that visualizes ocean currents in the Strait of Georgia based on three input parameters:
- **River Discharge** (Fraser River outflow)
- **Wind** (speed and direction)
- **Tides** (tidal elevation/phase)

The simulator will use mock data based on your ML model's learned patterns to demonstrate how different forcing mechanisms affect surface currents.

---

## Technology Stack
- **Frontend Framework**: Three.js for 3D visualization
- **UI Controls**: dat.GUI or lil-gui for parameter controls
- **Particle System**: For animated current visualization
- **Backend (Optional)**: Simple Express.js server for mock data generation
- **Styling**: Basic CSS for clean interface

---

## Step-by-Step Implementation

---

### **STEP 1: Project Setup and Basic Structure**

**Goal**: Set up the project directory and install necessary dependencies

**Tasks**:
1. Initialize a new Node.js project
2. Install required packages:
   - three.js (3D rendering)
   - vite (development server and bundler)
   - lil-gui (UI controls)
3. Create basic project structure:
   ```
   ocean-current-simulator/
   ├── index.html
   ├── src/
   │   ├── main.js
   │   ├── scene/
   │   ├── data/
   │   ├── controls/
   │   └── utils/
   ├── public/
   │   └── assets/
   └── package.json
   ```

**Deliverable**: A working development environment with hot reload

---

### **STEP 2: Create the 3D Ocean Environment**

**Goal**: Build the base 3D scene representing the Strait of Georgia

**Tasks**:
1. Create Three.js scene with camera and renderer
2. Add a flat plane representing the ocean surface
3. Apply a water-like material (blue with slight transparency)
4. Add simple lighting (ambient + directional)
5. Implement basic camera controls (OrbitControls)
6. Define the geographic boundaries of Strait of Georgia as a simplified polygon/shape

**Visual Target**: A rotating 3D blue surface that represents the ocean

**Deliverable**: A rotatable 3D ocean surface view

---

### **STEP 3: Add Geographic Context**

**Goal**: Make it recognizable as the Strait of Georgia

**Tasks**:
1. Create simplified landmass shapes for:
   - Vancouver Island (west side)
   - Mainland BC (east side)
   - Fraser River mouth location
2. Use Three.js shapes or imported GeoJSON simplified polygons
3. Color land areas green/brown to contrast with water
4. Add optional labels for key locations (Vancouver, Fraser River, etc.)

**Visual Target**: Recognizable strait shape with surrounding land

**Deliverable**: Geographic context that looks like the Strait of Georgia

---

### **STEP 4: Create Mock Data Generator**

**Goal**: Generate realistic current patterns based on input parameters

**Tasks**:
1. Create a grid system representing HF radar measurement points
2. Implement a function that generates U and V velocity components based on:
   - **River discharge mode**: Flow radiating outward from Fraser River mouth
   - **Wind mode**: Flow aligned with wind direction (with Ekman deflection)
   - **Tide mode**: Oscillating flow patterns (flood/ebb)
3. Combine multiple forcing mechanisms with weighted influence
4. Add realistic noise and turbulence to the patterns

**Key Physics to Mock**:
- River: Outward plume from river mouth, decreasing with distance
- Wind: Surface drift in wind direction + 15-20° deflection (Ekman)
- Tides: Alternating north-south flow patterns with ~12.4h period

**Deliverable**: A function that returns velocity field based on inputs

---

### **STEP 5: Implement Particle System for Current Visualization**

**Goal**: Show flowing currents using animated particles

**Tasks**:
1. Create a particle system (thousands of small points)
2. Initialize particles randomly across the ocean surface
3. Update particle positions each frame based on velocity field:
   - Read U and V components at particle location
   - Move particle accordingly
   - Fade out old particles and spawn new ones
4. Color particles based on velocity magnitude (slow=blue, fast=red)
5. Add trails/streaks for better flow visualization

**Visual Target**: Flowing particle streams like wind maps or ocean current visualizations (similar to earth.nullschool.net)

**Deliverable**: Animated particles showing current flow patterns

---

### **STEP 6: Build User Control Panel**

**Goal**: Allow users to adjust forcing parameters in real-time

**Tasks**:
1. Implement lil-gui control panel with:
   - **River Discharge**: Slider (0-10,000 m³/s)
   - **Wind Speed**: Slider (0-30 m/s)
   - **Wind Direction**: Slider (0-360°) or compass widget
   - **Tide Phase**: Slider (0-12.4 hours) or dropdown (Flood/Slack/Ebb)
2. Connect controls to data generator
3. Update visualization in real-time when parameters change
4. Add preset scenarios:
   - "Winter Storm" (high wind, low river)
   - "Spring Freshet" (high river, moderate wind)
   - "Summer Calm" (low wind, moderate river)

**Deliverable**: Interactive controls that change the current patterns

---

### **STEP 7: Add Velocity Vector Field Overlay**

**Goal**: Show discrete velocity measurements at specific points (like buoy data)

**Tasks**:
1. Select key grid points (e.g., 20-50 locations)
2. Draw arrows at each point showing:
   - Direction of current
   - Magnitude (arrow length and thickness)
3. Update arrows dynamically when parameters change
4. Add option to toggle arrow visibility on/off

**Visual Target**: Arrows overlaid on the particle flow, similar to weather maps

**Deliverable**: Toggleable vector field display

---

### **STEP 8: Implement Time Animation**

**Goal**: Show how currents evolve over time (especially for tides)

**Tasks**:
1. Add a "Play/Pause" button for time animation
2. Implement a time slider showing hours (0-24)
3. Make tidal currents oscillate automatically when playing
4. Optional: Add day/night visual effects (lighting changes)
5. Show current timestamp on screen

**Deliverable**: Animated time progression showing tidal cycles

---

### **STEP 9: Add Data Visualization Panel**

**Goal**: Show quantitative information alongside the visual

**Tasks**:
1. Create an info panel showing:
   - Current parameter values
   - Maximum velocity in the domain
   - Dominant forcing mechanism (River/Wind/Tide)
   - Current time (if animation running)
2. Add a simple bar chart or pie chart showing relative influence of each forcing
3. Position panel in corner of screen

**Deliverable**: Information display showing what's driving the currents

---

### **STEP 10: Polish and Optimization**

**Goal**: Make it production-ready and performant

**Tasks**:
1. Optimize particle count for smooth 60 FPS
2. Add loading screen/progress indicator
3. Implement responsive design (works on different screen sizes)
4. Add instructions/help tooltip for first-time users
5. Fine-tune colors, lighting, and visual aesthetics
6. Add "Reset" button to return to default state
7. Test on different browsers and devices

**Deliverable**: Polished, smooth, professional-looking simulator

---

### **STEP 11 (Optional): Advanced Features**

**Goal**: Add research-relevant features

**Tasks**:
1. **Compare Mode**: Show side-by-side before/after scenarios
2. **Export Data**: Download current velocity field as CSV
3. **Upload Custom Scenarios**: Let users upload their own forcing parameters
4. **3D Depth Layers**: Show how currents vary with depth (not just surface)
5. **Seasonal Presets**: Winter, Spring, Summer, Fall typical conditions
6. **Validation View**: Show your actual HF radar data vs. model predictions

---

## Mock Data Strategy

Since you don't want to run the actual ML model in the browser, create simplified physics-based mock functions:

### River Discharge Effect
```
For each grid point (x, y):
  distance_from_river = sqrt((x - river_x)^2 + (y - river_y)^2)
  river_influence = river_discharge * exp(-distance_from_river / decay_length)
  U += river_influence * cos(angle_from_river)
  V += river_influence * sin(angle_from_river)
```

### Wind Effect
```
For each grid point:
  U += wind_speed * cos(wind_direction) * 0.03  // 3% of wind speed (typical)
  V += wind_speed * sin(wind_direction) * 0.03
  // Add Ekman deflection (rotate 15-20 degrees)
```

### Tidal Effect
```
For each grid point:
  tidal_phase_radians = (tide_hour / 12.4) * 2 * PI
  tidal_amplitude = max_tidal_current * sin(tidal_phase_radians)
  // Tides flow north-south predominantly in Strait of Georgia
  V += tidal_amplitude
```

---

## Design Inspiration

Look at these for visual reference:
- **earth.nullschool.net**: Excellent particle-based wind/ocean visualization
- **Windy.com**: Clean UI for weather visualization
- **MarineTraffic.com**: Ocean-specific mapping
- Your own model outputs and Pawlowicz (2018) validation figures

---

## Success Criteria

✅ Users can adjust river, wind, and tide parameters
✅ Currents respond realistically to changes
✅ Visualization is smooth and visually appealing
✅ Geography is recognizable as Strait of Georgia
✅ Can demonstrate seasonal patterns (winter wind vs. summer river dominance)
✅ Runs smoothly in web browser without installation

---

## Estimated Timeline

- **Step 1-2**: 2-3 hours
- **Step 3-4**: 3-4 hours
- **Step 5-6**: 4-5 hours
- **Step 7-8**: 2-3 hours
- **Step 9-10**: 2-3 hours

**Total**: ~15-20 hours for full implementation

---

## Next Steps

Start with **STEP 1** and work sequentially. Each step builds on the previous one. Test thoroughly at each stage before moving forward.

Good luck with your Ocean Current Simulator! 🌊
