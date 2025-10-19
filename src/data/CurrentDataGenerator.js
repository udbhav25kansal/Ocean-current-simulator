export class CurrentDataGenerator {
    constructor() {
        // Grid configuration for velocity field
        this.gridWidth = 40;
        this.gridHeight = 48;
        this.gridSpacing = 2.5;

        // Fraser River location (southeast)
        this.riverX = 35;
        this.riverZ = -45;

        // Constants for realistic ocean physics
        this.WIND_FACTOR = 0.03; // ~3% of wind speed transfers to surface current
        this.EKMAN_ANGLE = 15 * (Math.PI / 180); // 15 degree deflection
        this.RIVER_DECAY = 15; // Decay length in km
        this.TIDAL_AMPLITUDE = 0.8; // m/s maximum tidal current
    }

    generateField(riverDischarge, windSpeed, windDirection, tidePhase) {
        const field = [];

        // Convert wind direction to radians (meteorological convention: direction FROM)
        const windDirRad = (windDirection + 180) * (Math.PI / 180);

        // Convert tide phase to radians
        const tidePhaseRad = (tidePhase / 12.4) * 2 * Math.PI;

        for (let i = 0; i < this.gridHeight; i++) {
            field[i] = [];
            for (let j = 0; j < this.gridWidth; j++) {
                // Grid position in world coordinates
                const x = (j - this.gridWidth / 2) * this.gridSpacing;
                const z = (i - this.gridHeight / 2) * this.gridSpacing;

                // Initialize velocity components
                let u = 0; // East-West
                let v = 0; // North-South

                // 1. RIVER DISCHARGE EFFECT
                const riverContribution = this.calculateRiverEffect(
                    x, z, riverDischarge
                );
                u += riverContribution.u;
                v += riverContribution.v;

                // 2. WIND EFFECT
                const windContribution = this.calculateWindEffect(
                    windSpeed, windDirRad, x, z
                );
                u += windContribution.u;
                v += windContribution.v;

                // 3. TIDAL EFFECT
                const tidalContribution = this.calculateTidalEffect(
                    x, z, tidePhaseRad
                );
                u += tidalContribution.u;
                v += tidalContribution.v;

                // 4. Add turbulence/noise
                const noise = this.addNoise(x, z);
                u += noise.u;
                v += noise.v;

                // Calculate magnitude
                const magnitude = Math.sqrt(u * u + v * v);

                field[i][j] = {
                    x: x,
                    z: z,
                    u: u,
                    v: v,
                    magnitude: magnitude
                };
            }
        }

        return field;
    }

    calculateRiverEffect(x, z, riverDischarge) {
        // Distance from river mouth
        const dx = x - this.riverX;
        const dz = z - this.riverZ;
        const distance = Math.sqrt(dx * dx + dz * dz);

        // River discharge in m³/s, normalize to typical range (0-10000)
        const normalizedDischarge = riverDischarge / 10000;

        // Exponential decay from river mouth
        const influence = normalizedDischarge * Math.exp(-distance / this.RIVER_DECAY);

        // Direction: radiating outward from river mouth
        const angle = Math.atan2(dz, dx);

        // River plume creates outward flow, with northward bias
        const u = influence * Math.cos(angle) * 0.8;
        const v = influence * Math.sin(angle) * 1.2 + influence * 0.3; // Northward tendency

        return { u, v };
    }

    calculateWindEffect(windSpeed, windDirRad, x, z) {
        // Wind-driven surface current (Ekman transport)
        // Current flows at angle to wind (Ekman deflection)

        // Basic wind-driven component
        const baseU = windSpeed * Math.cos(windDirRad) * this.WIND_FACTOR;
        const baseV = windSpeed * Math.sin(windDirRad) * this.WIND_FACTOR;

        // Apply Ekman deflection (rotate current direction)
        const u = baseU * Math.cos(this.EKMAN_ANGLE) - baseV * Math.sin(this.EKMAN_ANGLE);
        const v = baseU * Math.sin(this.EKMAN_ANGLE) + baseV * Math.cos(this.EKMAN_ANGLE);

        // Add spatial variation (wind stress varies across strait)
        const widthFactor = 1 - Math.abs(x / 50) * 0.3; // Reduced near shores

        return { u: u * widthFactor, v: v * widthFactor };
    }

    calculateTidalEffect(x, z, tidePhaseRad) {
        // Tidal currents in Strait of Georgia are predominantly north-south
        // with maximum velocities in the center of the strait

        const tidalStrength = Math.sin(tidePhaseRad) * this.TIDAL_AMPLITUDE;

        // Tidal currents strongest in center, weaker near shores
        const distanceFromCenter = Math.abs(x) / 50;
        const channelFactor = Math.exp(-distanceFromCenter * distanceFromCenter * 2);

        // North-south oscillation with some east-west component
        const u = tidalStrength * 0.15 * channelFactor; // Weak cross-strait
        const v = tidalStrength * channelFactor; // Strong along-strait

        // Add phase variation along the length of the strait
        const phaseShift = z / 60; // Phase propagates northward
        const u_adjusted = u * Math.cos(phaseShift);
        const v_adjusted = v * Math.cos(phaseShift);

        return { u: u_adjusted, v: v_adjusted };
    }

    addNoise(x, z) {
        // Add small-scale turbulence using pseudo-random noise
        const noiseScale = 0.05;
        const u = (Math.sin(x * 0.5) * Math.cos(z * 0.3) - 0.5) * noiseScale;
        const v = (Math.cos(x * 0.3) * Math.sin(z * 0.5) - 0.5) * noiseScale;

        return { u, v };
    }

    getVelocityAt(x, z, field) {
        // Bilinear interpolation to get velocity at arbitrary point
        const gridX = (x / this.gridSpacing) + (this.gridWidth / 2);
        const gridZ = (z / this.gridSpacing) + (this.gridHeight / 2);

        // Clamp to grid boundaries
        if (gridX < 0 || gridX >= this.gridWidth - 1 ||
            gridZ < 0 || gridZ >= this.gridHeight - 1) {
            return { u: 0, v: 0, magnitude: 0 };
        }

        const i = Math.floor(gridZ);
        const j = Math.floor(gridX);
        const fx = gridX - j;
        const fz = gridZ - i;

        // Get four surrounding grid points
        const p00 = field[i][j];
        const p10 = field[i][j + 1];
        const p01 = field[i + 1][j];
        const p11 = field[i + 1][j + 1];

        // Bilinear interpolation
        const u = (1 - fx) * (1 - fz) * p00.u +
                  fx * (1 - fz) * p10.u +
                  (1 - fx) * fz * p01.u +
                  fx * fz * p11.u;

        const v = (1 - fx) * (1 - fz) * p00.v +
                  fx * (1 - fz) * p10.v +
                  (1 - fx) * fz * p01.v +
                  fx * fz * p11.v;

        const magnitude = Math.sqrt(u * u + v * v);

        return { u, v, magnitude };
    }

    getMaxVelocity(field) {
        let maxMag = 0;
        for (let i = 0; i < field.length; i++) {
            for (let j = 0; j < field[i].length; j++) {
                if (field[i][j].magnitude > maxMag) {
                    maxMag = field[i][j].magnitude;
                }
            }
        }
        return maxMag;
    }

    getDominantForcing(riverDischarge, windSpeed, tidePhase) {
        // Simple heuristic to determine dominant forcing mechanism
        const riverStrength = riverDischarge / 10000;
        const windStrength = windSpeed / 30;
        const tidalStrength = Math.abs(Math.sin((tidePhase / 12.4) * 2 * Math.PI));

        if (riverStrength > windStrength && riverStrength > tidalStrength) {
            return 'River Discharge';
        } else if (windStrength > tidalStrength) {
            return 'Wind';
        } else {
            return 'Tides';
        }
    }
}
