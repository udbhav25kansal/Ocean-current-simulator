# Ocean Current Simulator - Strait of Georgia

An interactive 3D web-based visualization demonstrating how different forcing mechanisms (river discharge, wind, and tides) affect surface currents in the Strait of Georgia, British Columbia.

## Overview

This simulator is a demonstration tool for oceanographic research, showcasing how AI/ML approaches can identify dominant forcing mechanisms in coastal ocean dynamics. The visualization uses physics-based mock data to illustrate patterns learned from HF radar observations, wind measurements, and river discharge data.

## Research Background

This project demonstrates a novel AI/ML clustering approach to understanding ocean currents:

- **Traditional Approach**: Solve complex differential equations for tides, wind stress, and buoyancy-driven flow
- **Our Approach**: Use machine learning to learn current patterns directly from observational data

The simulator shows how three main forces drive surface currents:

1. **River Discharge** (Fraser River): Creates a buoyant plume flowing northward through the strait
2. **Wind**: Transfers momentum to the surface with Ekman deflection (~15° to the right)
3. **Tides**: Semi-diurnal oscillations creating along-strait currents (~12.4 hour period)

### Key Findings

- **Winter**: Wind dominates surface flow (strong storms, low river discharge)
- **Spring/Summer**: River discharge becomes the main driver (freshet period)
- **Tidal Influence**: Always present but varies spatially (stronger in central channel)

This aligns with findings from Pawlowicz (2018) but achieved through data-driven learning rather than deterministic modeling.

## Features

- **3D Interactive Visualization**: Rotate, zoom, and explore the strait from any angle
- **Real-time Parameter Control**: Adjust river discharge, wind speed/direction, and tidal phase
- **Particle-based Flow Visualization**: Color-coded particles show speed and direction
- **Vector Field Overlay**: Arrows display discrete velocity measurements
- **Time Animation**: Watch how currents evolve over a tidal cycle
- **Data Dashboard**: See quantitative metrics and forcing influence breakdown
- **Preset Scenarios**: Jump to typical conditions (Winter Storm, Spring Freshet, etc.)

## Installation

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Setup

```bash
# Clone the repository
git clone <repository-url>
cd ocean-current-simulator

# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Usage

1. **Launch the simulator** - Open your browser to `http://localhost:3000`

2. **Explore the controls** (right panel):
   - Adjust **River Discharge** (0-10,000 m³/s)
   - Set **Wind Speed** (0-30 m/s) and **Direction** (0-360°)
   - Change **Tide Phase** (0-12.4 hours)

3. **Try preset scenarios**:
   - Winter Storm: High wind, low river
   - Spring Freshet: High river discharge, moderate wind
   - Summer Calm: Low wind, moderate river
   - Tidal Dominance: Minimal wind/river, strong tides

4. **Visualize the flow**:
   - Particles show current pathways (blue = slow, red = fast)
   - Arrows indicate direction and magnitude at grid points
   - Data panel shows dominant forcing mechanism

5. **Animate over time**: Toggle Play/Pause to watch tidal evolution

## Project Structure

```
ocean-current-simulator/
├── index.html              # Main HTML file
├── package.json           # Dependencies and scripts
├── vite.config.js        # Vite configuration
├── src/
│   ├── main.js           # Main application entry point
│   ├── scene/
│   │   ├── OceanScene.js       # 3D ocean and geography
│   │   ├── ParticleSystem.js   # Flow particle visualization
│   │   └── VectorField.js      # Arrow-based velocity field
│   ├── data/
│   │   └── CurrentDataGenerator.js  # Physics-based mock data
│   ├── controls/
│   │   └── ControlPanel.js     # User interface controls
│   └── utils/
│       ├── DataPanel.js        # Metrics display
│       └── HelpPanel.js        # Welcome/instructions
└── public/
    └── assets/           # Static assets (if any)
```

## Technology Stack

- **Three.js**: 3D rendering and scene management
- **Vite**: Fast development server and build tool
- **lil-gui**: Real-time parameter controls
- **Vanilla JavaScript**: No heavy frameworks, fast and lightweight

## Physics Implementation

### Mock Data Generation

The simulator uses simplified physics equations to generate realistic current patterns:

#### River Discharge Effect
```javascript
influence = (discharge / 10000) * exp(-distance / decayLength)
velocity = influence * direction_from_river_mouth
```

#### Wind Effect (Ekman Transport)
```javascript
surfaceCurrent = windSpeed * 0.03  // 3% rule
direction = windDirection + 15°     // Ekman deflection
```

#### Tidal Effect
```javascript
tidalCurrent = amplitude * sin(2π * phase / 12.4)
// Primarily north-south, strongest in center
```

### Grid Resolution
- 40 x 48 grid points
- 2.5 km spacing
- Covers ~100 km x 120 km domain

## Future Development

Potential enhancements:

- [ ] Upload real HF radar data for comparison
- [ ] 3D depth layers (subsurface currents)
- [ ] Export velocity field as CSV/GeoJSON
- [ ] Side-by-side scenario comparison
- [ ] Integrate actual ML model predictions
- [ ] Add seasonal temperature/salinity layers
- [ ] Mobile-responsive touch controls

## Research Context

This simulator demonstrates the frontend visualization component of a larger research project:

**Goal**: Determine what drives Strait of Georgia surface currents at any given time

**Approach**:
1. Collect HF radar (current), river discharge, and wind data
2. Train ML clustering model to learn patterns
3. Identify dominant forcing automatically
4. Validate against deterministic models (e.g., Pawlowicz 2018)

**Limitations**:
- HF radar data had gaps and low temporal resolution
- Couldn't run traditional tidal analysis (T_Tide) effectively
- ML approach bypasses need for solving full equations

**Result**: Data-driven alternative to classical ocean modeling that successfully identifies:
- When winds dominate (winter)
- When river discharge dominates (spring/summer)
- Tidal contributions throughout

## References

- Pawlowicz, R. (2018). Seasonal cycles, hypoxia, and renewal in a coastal fjord (Strait of Georgia, British Columbia)
- HF Radar data: Ocean Networks Canada
- River discharge: Environment and Climate Change Canada (ECCC)
- Wind data: Buoy stations (4 locations, 10-min resolution)

## License

MIT License - see LICENSE file for details

## Contributors

[Add your team members here]

## Acknowledgments

- Ocean Networks Canada for HF radar data
- Environment and Climate Change Canada for Fraser River discharge data
- Buoy network operators for wind measurements
- Pawlowicz (2018) for validation framework

---

**Built with ❤️ for ocean science and data visualization**
