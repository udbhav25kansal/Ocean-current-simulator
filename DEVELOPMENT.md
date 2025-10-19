# Development Notes

This document explains the technical implementation details for developers who want to modify or extend the Ocean Current Simulator.

## Architecture Overview

The simulator follows a modular architecture with clear separation of concerns:

```
User Input → Control Panel → Data Generator → Visualization Components → Renderer
                                    ↓
                            Current Velocity Field
                                    ↓
                    ┌───────────────┴───────────────┐
                    ↓                               ↓
            Particle System                  Vector Field
```

## Core Components

### 1. Main Application (`src/main.js`)

**OceanCurrentSimulator Class**: Central orchestrator

- Manages Three.js scene, camera, renderer
- Coordinates all components
- Handles animation loop
- Updates all systems each frame

**Key Methods**:
- `init()`: Setup Three.js environment
- `setupScene()`: Create ocean, particles, vectors
- `updateCurrents()`: Regenerate velocity field when parameters change
- `animate()`: Main render loop (60 FPS target)

### 2. Ocean Scene (`src/scene/OceanScene.js`)

**Purpose**: Render the geographic environment

**Components**:
- Ocean plane with animated waves
- Vancouver Island landmass (west)
- BC Mainland (east)
- Fraser River mouth indicator
- Text labels

**Wave Animation**:
```javascript
waveHeight = sin(x * 0.1 + time * 0.5) * cos(y * 0.1 + time * 0.3) * 0.3
```

**Optimization Notes**:
- Waves computed on CPU (could be moved to vertex shader for better performance)
- Labels use canvas-based sprites (lightweight)

### 3. Data Generator (`src/data/CurrentDataGenerator.js`)

**Purpose**: Generate realistic velocity fields from forcing parameters

**Grid Specification**:
- 40 × 48 points
- 2.5 km spacing
- Total domain: ~100 km × 120 km

**Physics Models**:

#### River Discharge
```javascript
influence = (Q / 10000) * exp(-r / L_decay)
direction = atan2(Δz, Δx) from river mouth
u_river = influence * cos(θ)
v_river = influence * sin(θ) + northward_bias
```

Where:
- Q = discharge in m³/s
- r = distance from river mouth
- L_decay = 15 km (tunable parameter)

#### Wind-Driven Current
```javascript
u_wind = V_wind * cos(θ_wind) * 0.03
v_wind = V_wind * sin(θ_wind) * 0.03

// Apply Ekman rotation (15°)
u_ekman = u_wind * cos(α) - v_wind * sin(α)
v_ekman = u_wind * sin(α) + v_wind * cos(α)
```

Where:
- V_wind = wind speed (m/s)
- θ_wind = wind direction (radians)
- α = Ekman angle = 15° = 0.262 radians
- 0.03 = wind transfer coefficient (~3%)

#### Tidal Current
```javascript
tidal_strength = A_max * sin(2π * t / T)
spatial_factor = exp(-2 * (x / W)²)

u_tidal = tidal_strength * 0.15 * spatial_factor
v_tidal = tidal_strength * spatial_factor * cos(z / 60)
```

Where:
- A_max = 0.8 m/s (maximum tidal current)
- T = 12.4 hours (semi-diurnal period)
- W = 50 km (strait width)
- Phase propagates northward (z-dependence)

#### Velocity Interpolation
Uses **bilinear interpolation** for smooth particle motion:

```javascript
p00 ---- p10
 |        |
 |   (x,z)|
 |        |
p01 ---- p11

u(x,z) = (1-fx)(1-fz)·u00 + fx(1-fz)·u10 + (1-fx)fz·u01 + fx·fz·u11
```

### 4. Particle System (`src/scene/ParticleSystem.js`)

**Purpose**: Visualize flow with animated particles

**Parameters**:
- Default count: 5000 particles
- Lifetime: ~5 seconds (fade in/out)
- Speed multiplier: 5× for visibility

**Color Mapping**:
```javascript
speed_norm = velocity / max_velocity

if (speed_norm < 0.33):      Blue to Cyan
elif (speed_norm < 0.66):    Cyan to Yellow
else:                        Yellow to Red
```

**Update Logic** (each frame):
1. Get velocity at particle position
2. Move particle: `pos += velocity × dt × speed_multiplier`
3. Update lifetime and fade
4. Respawn if outside bounds or lifetime expired

**Optimization**:
- Uses BufferGeometry (GPU-friendly)
- Additive blending (glow effect)
- No depth write (performance)

### 5. Vector Field (`src/scene/VectorField.js`)

**Purpose**: Display discrete velocity measurements as arrows

**Sampling**:
- Grid spacing: 10 units
- ~100-150 arrows total
- Only show if magnitude > 0.01 m/s

**Arrow Construction**:
- Shaft: Cylinder (70% of length)
- Head: Cone (30% of length)
- Length scales with velocity magnitude
- Color matches particle scheme

**Performance Note**:
- Arrows regenerated when field updates (not every frame)
- Uses simple geometry (low polygon count)

### 6. Control Panel (`src/controls/ControlPanel.js`)

**Library**: lil-gui

**Folders**:
1. River Discharge
2. Wind (speed + direction)
3. Tides (phase + quick presets)
4. Time Control (play/pause + speed)
5. Visualization (toggles)
6. Scenario Presets

**Callback Pattern**:
```javascript
parameter.onChange(() => updateCallback())
```

All changes trigger `updateCurrents()` in main app.

### 7. Data Panel (`src/utils/DataPanel.js`)

**Purpose**: Display quantitative metrics

**Information Shown**:
- Current parameter values
- Maximum velocity in domain
- Dominant forcing mechanism
- Relative influence (bar chart)

**Influence Calculation**:
```javascript
river_influence = min(Q / 10000, 1)
wind_influence = min(V_wind / 30, 1)
tidal_influence = |sin(2π * t / T)|

percentage = (influence / total_influence) × 100%
```

**Update Frequency**: Every time parameters change

## Performance Considerations

### Current Performance
- **Target**: 60 FPS
- **Typical**: 50-60 FPS on modern hardware
- **Bottleneck**: Particle position updates (CPU-bound)

### Optimization Strategies

#### Already Implemented
- BufferGeometry instead of regular Geometry
- Particle system uses Float32Arrays
- Additive blending without depth write
- Frustum culling enabled
- Pixel ratio capped at 2

#### Future Optimizations
1. **GPU Compute** (WebGL2):
   - Move particle updates to shader
   - Store velocities in texture
   - Use transform feedback

2. **Level of Detail**:
   - Reduce particle count when zoomed out
   - Simplify arrows at distance

3. **Web Workers**:
   - Generate velocity field in worker thread
   - Offload interpolation calculations

4. **Instancing**:
   - Use InstancedMesh for arrows
   - Batch draw calls

## Code Style Guide

### Naming Conventions
- Classes: PascalCase (`OceanScene`)
- Methods: camelCase (`updateCurrents`)
- Constants: UPPER_SNAKE_CASE (`WIND_FACTOR`)
- Private properties: prefix with `_` (not enforced)

### File Organization
```
Component files should export a single class
Utility files can export multiple functions
Keep files under 300 lines when possible
```

### Comments
```javascript
// High-level explanation of what this section does
const result = complexCalculation();

// Inline comments for non-obvious calculations
const ekman = wind * Math.cos(angle); // Ekman deflection
```

## Testing Checklist

When making changes, verify:

- [ ] Particles render and move smoothly
- [ ] Vector arrows update when parameters change
- [ ] No console errors
- [ ] 60 FPS maintained (check DevTools)
- [ ] Controls respond immediately
- [ ] Presets load correct values
- [ ] Time animation works (Play/Pause)
- [ ] Zoom and rotation smooth
- [ ] Data panel shows correct values
- [ ] Works in Chrome, Firefox, Safari

## Browser Compatibility

**Tested**:
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

**Requirements**:
- WebGL 1.0 (not WebGL2)
- ES6+ JavaScript support
- No IE11 support (uses ES modules)

## Build Configuration

### Vite Settings (`vite.config.js`)
```javascript
{
  server: { port: 3000 },
  build: {
    sourcemap: true,        // Enable debugging
    rollupOptions: {
      manualChunks: {
        'three': ['three']  // Separate Three.js bundle
      }
    }
  }
}
```

### Bundle Size
- Three.js: ~600 KB
- Application code: ~50 KB
- Total (gzipped): ~200 KB

## Extending the Simulator

### Adding a New Forcing Mechanism

1. **Update Data Generator**:
```javascript
calculateNewForcing(params) {
  // Your physics implementation
  return { u, v };
}
```

2. **Add to `generateField()`**:
```javascript
const newContribution = this.calculateNewForcing(params);
u += newContribution.u;
v += newContribution.v;
```

3. **Update Control Panel**:
```javascript
const newFolder = this.gui.addFolder('New Forcing');
newFolder.add(this.params, 'newParam', min, max)
  .onChange(() => this.updateCallback());
```

### Adding Real Data

Replace mock data generator with API call:

```javascript
async fetchRealData(params) {
  const response = await fetch('/api/currents', {
    method: 'POST',
    body: JSON.stringify(params)
  });
  return await response.json();
}
```

### Exporting Data

Add export functionality:

```javascript
exportVelocityField() {
  const csv = this.currentVelocityField
    .flat()
    .map(p => `${p.x},${p.z},${p.u},${p.v}`)
    .join('\n');

  const blob = new Blob([csv], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'currents.csv';
  a.click();
}
```

## Common Issues and Solutions

### Issue: Particles not moving
**Solution**: Check that `setDataGenerator()` was called on particle system

### Issue: Arrows pointing wrong direction
**Solution**: Verify coordinate system (Three.js uses right-handed, Z-up for plane rotation)

### Issue: Performance degradation
**Solution**: Reduce particle count, disable vector field, or check for memory leaks

### Issue: Controls not updating
**Solution**: Ensure `updateCallback` is properly passed to ControlPanel

---

**Happy coding! 🚀**
