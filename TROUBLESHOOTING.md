# Troubleshooting Guide

Common issues and their solutions for the Ocean Current Simulator.

---

## Installation Issues

### Problem: `npm install` fails

**Error**: "Cannot find module" or dependency errors

**Solutions**:
1. Check Node.js version:
   ```bash
   node --version  # Should be v16 or higher
   ```
2. Clear npm cache:
   ```bash
   npm cache clean --force
   npm install
   ```
3. Delete and reinstall:
   ```bash
   rm -rf node_modules package-lock.json
   npm install
   ```

---

### Problem: "Port 3000 already in use"

**Solutions**:
1. Use a different port:
   ```bash
   npm run dev -- --port 3001
   ```
2. Kill the process using port 3000:
   - **Windows**: `netstat -ano | findstr :3000` then `taskkill /PID [PID] /F`
   - **Mac/Linux**: `lsof -ti:3000 | xargs kill`

---

## Runtime Issues

### Problem: Blank/black screen

**Symptoms**: Page loads but shows only black screen

**Debugging steps**:
1. Open browser console (F12)
2. Look for JavaScript errors
3. Check Network tab for failed requests

**Common causes**:
- **Missing imports**: Check all import paths are correct
- **Three.js not loaded**: Verify `npm install` completed
- **WebGL disabled**: Enable hardware acceleration in browser

**Solutions**:
```bash
# Rebuild from scratch
rm -rf node_modules dist
npm install
npm run dev
```

---

### Problem: Particles not moving

**Symptoms**: Particles visible but stationary

**Cause**: Velocity field not connected to particle system

**Solution**: Verify in `src/main.js`:
```javascript
this.particleSystem.setDataGenerator(this.dataGenerator);
this.particleSystem.setVelocityField(velocityField);
```

**Quick fix**: Refresh the page after changing a parameter

---

### Problem: Controls not responding

**Symptoms**: Sliders move but visualization doesn't update

**Debugging**:
1. Check console for errors
2. Verify callback is called:
   ```javascript
   // Add to ControlPanel.js
   console.log('Parameter changed, updating...');
   ```

**Solution**: Ensure `updateCallback` is properly passed to `ControlPanel`:
```javascript
this.controlPanel = new ControlPanel(this.params, () => this.updateCurrents());
```

---

### Problem: Vectors (arrows) not showing

**Symptoms**: Particles visible but no arrows

**Causes**:
1. Vectors toggled off
2. Currents too weak (threshold not met)
3. Vector field not initialized

**Solutions**:
1. Check "Show Vectors" is enabled in controls
2. Increase wind/river/tide to create stronger currents
3. Check console for errors in `VectorField.js`

---

## Performance Issues

### Problem: Low FPS / Laggy animation

**Symptoms**: Choppy movement, FPS below 30

**Solutions by severity**:

**Quick fixes**:
1. Reduce particle count:
   - Controls → Visualization → Particle Count → 2000
2. Hide vectors:
   - Controls → Visualization → Show Vectors → Off
3. Close other browser tabs
4. Use Chrome or Edge (best WebGL performance)

**Advanced optimizations**:
1. Reduce grid resolution in `CurrentDataGenerator.js`:
   ```javascript
   this.gridWidth = 30;  // was 40
   this.gridHeight = 36; // was 48
   ```
2. Lower renderer pixel ratio in `main.js`:
   ```javascript
   this.renderer.setPixelRatio(1); // was Math.min(devicePixelRatio, 2)
   ```

**Hardware issues**:
- Update graphics drivers
- Enable hardware acceleration:
  - Chrome: `chrome://settings` → Advanced → System
  - Firefox: `about:preferences` → Performance

---

### Problem: High memory usage

**Symptoms**: Browser using >2GB RAM

**Causes**:
- Particle system leaking memory
- Old velocity fields not garbage collected

**Solutions**:
1. Refresh page periodically
2. Reduce particle count
3. Check for memory leaks in DevTools:
   - F12 → Memory → Take Heap Snapshot

**Prevention**: Ensure proper cleanup in component destructors

---

## Visual Issues

### Problem: Weird colors or artifacts

**Symptoms**: Flickering, wrong colors, visual glitches

**Solutions**:
1. Update graphics drivers
2. Disable browser extensions (especially ad blockers)
3. Clear browser cache:
   - Chrome: Ctrl+Shift+Delete
4. Try a different browser

---

### Problem: Labels/text not visible

**Symptoms**: Geographic labels missing

**Cause**: Canvas texture not rendering

**Solution**: Verify in `OceanScene.js`:
```javascript
const texture = new THREE.CanvasTexture(canvas);
texture.needsUpdate = true; // Add this
```

---

### Problem: Ocean looks flat (no waves)

**Symptoms**: Ocean surface doesn't animate

**Cause**: Update loop not running

**Debugging**:
```javascript
// Add to animate() in main.js
console.log('Frame:', this.time);
```

**Solution**: Check that `oceanScene.update(time)` is called every frame

---

## Browser-Specific Issues

### Chrome/Edge

**Issue**: Warning about WebGL context lost
**Solution**: Reduce particle count or restart browser

### Firefox

**Issue**: Slower performance than Chrome
**Solution**:
- Enable `webgl.force-enabled` in `about:config`
- Reduce pixel ratio

### Safari

**Issue**: Particles appear dimmer
**Solution**: This is expected due to Safari's WebGL implementation

---

## Build/Production Issues

### Problem: `npm run build` fails

**Error**: "Cannot find module" during build

**Solutions**:
1. Check all imports use correct file extensions (`.js`)
2. Verify no missing files:
   ```bash
   find src -name "*.js"
   ```
3. Clean and rebuild:
   ```bash
   rm -rf dist
   npm run build
   ```

---

### Problem: Built app doesn't work (blank screen)

**Symptoms**: Dev works, production doesn't

**Causes**:
- Absolute paths instead of relative
- Missing assets
- CORS issues

**Solutions**:
1. Test production build locally:
   ```bash
   npm run preview
   ```
2. Check browser console for 404 errors
3. Verify `vite.config.js` has correct `base` path

---

## Data/Physics Issues

### Problem: Currents look unrealistic

**Symptoms**: Particles move strangely or don't match expectations

**Debugging**:
1. Check parameter values in data panel
2. Test with preset scenarios first
3. Verify physics in `CurrentDataGenerator.js`

**Common mistakes**:
- Wind direction reversed (check meteorological convention)
- Tide phase incorrect
- River position wrong

**Validation**:
```javascript
// Add to updateCurrents() in main.js
console.log('Max velocity:', this.dataGenerator.getMaxVelocity(velocityField));
console.log('Dominant:', dominantForcing);
```

---

### Problem: No flow near river mouth

**Symptoms**: Expected river plume not visible

**Cause**: River discharge too low or decay length too small

**Solution**: Increase values in `CurrentDataGenerator.js`:
```javascript
this.RIVER_DECAY = 20; // was 15 (km)
```

Or increase river discharge in controls to >5000 m³/s

---

## UI/Control Issues

### Problem: GUI panel overlaps other elements

**Solution**: Adjust z-index in `ControlPanel.js` or CSS

---

### Problem: Help screen won't close

**Symptom**: Clicking "Start Exploring" does nothing

**Debugging**:
```javascript
// Check in browser console
document.getElementById('start-btn')
```

**Solution**: Verify event listener attached in `HelpPanel.js`

---

### Problem: Data panel shows NaN or undefined

**Cause**: Calculation error in `DataPanel.js`

**Solution**: Add null checks:
```javascript
const maxVelocity = this.dataGenerator.getMaxVelocity(velocityField) || 0;
```

---

## Still Having Issues?

### Diagnostic Checklist

Run through this list:
- [ ] Node.js v16+ installed
- [ ] Dependencies installed (`npm install`)
- [ ] No console errors (F12)
- [ ] WebGL enabled (visit `https://get.webgl.org/`)
- [ ] Hardware acceleration enabled
- [ ] Using modern browser (Chrome, Firefox, Safari, Edge)
- [ ] All source files present (check `src/` directory)
- [ ] Vite dev server running (`npm run dev`)

### Get More Help

1. **Check console**: F12 → Console tab
2. **Check network**: F12 → Network tab
3. **Check performance**: F12 → Performance tab
4. **Browser compatibility**: Test in different browser
5. **File an issue**: Include:
   - Browser and version
   - Operating system
   - Console error messages
   - Steps to reproduce

### Reset to Fresh State

Nuclear option (deletes everything):
```bash
# Back up any custom changes first!
rm -rf node_modules dist package-lock.json
npm install
npm run dev
```

---

## Known Limitations

These are **not bugs**, but expected behavior:

1. **Particles may cluster**: This is realistic (currents create convergence zones)
2. **Arrows update slower than particles**: Arrows regenerate on parameter changes only
3. **Time animation resets on manual tide change**: Expected behavior
4. **Slight FPS drop during zoom**: GPU recalculates frustum culling
5. **Safari slightly dimmer colors**: WebGL implementation difference

---

## Tips for Best Experience

✅ **Do**:
- Use latest Chrome or Edge
- Start with preset scenarios
- Adjust one parameter at a time
- Monitor FPS in stats panel (if added)
- Keep browser tab active (background tabs throttle)

❌ **Don't**:
- Set all parameters to maximum simultaneously
- Use IE11 (not supported)
- Expect real-time tidal cycles (use time animation)
- Compare exact numbers to Pawlowicz (2018) - this is mock data

---

**If all else fails**: Delete everything and follow QUICKSTART.md from scratch! 🔄
