export class FieldInterpolator {
    constructor(targetWidth = 40, targetHeight = 48) {
        // Target visualization grid dimensions
        this.targetWidth = targetWidth;
        this.targetHeight = targetHeight;
        this.gridSpacing = 2.5;

        // Source data is 256 points, likely 16x16 grid
        this.sourceWidth = 16;
        this.sourceHeight = 16;
    }

    /**
     * Convert 256-point spatial grid to velocity field for visualization
     * The z0-z255 values appear to be derived field quantities
     * We'll interpret them as velocity magnitudes and create u,v components
     */
    interpolateToField(spatialGrid, buoyData) {
        const field = [];

        // First, reshape 1D array (256 values) into 2D grid (16x16)
        const sourceGrid = this.reshapeToGrid(spatialGrid);

        for (let i = 0; i < this.targetHeight; i++) {
            field[i] = [];
            for (let j = 0; j < this.targetWidth; j++) {
                // World coordinates
                const x = (j - this.targetWidth / 2) * this.gridSpacing;
                const z = (i - this.targetHeight / 2) * this.gridSpacing;

                // Get interpolated value from source grid
                const gridValue = this.bilinearInterpolate(
                    sourceGrid,
                    j / (this.targetWidth / this.sourceWidth),
                    i / (this.targetHeight / this.sourceHeight)
                );

                // Convert grid value to velocity components using buoy data as reference
                const velocity = this.gridValueToVelocity(gridValue, x, z, buoyData);

                field[i][j] = {
                    x: x,
                    z: z,
                    u: velocity.u,
                    v: velocity.v,
                    magnitude: velocity.magnitude,
                    gridValue: gridValue
                };
            }
        }

        return field;
    }

    reshapeToGrid(spatialArray) {
        // Convert 256-element array to 16x16 grid
        const grid = [];
        for (let i = 0; i < this.sourceHeight; i++) {
            grid[i] = [];
            for (let j = 0; j < this.sourceWidth; j++) {
                const index = i * this.sourceWidth + j;
                grid[i][j] = spatialArray[index] || 0;
            }
        }
        return grid;
    }

    bilinearInterpolate(grid, x, y) {
        // Clamp to grid boundaries
        const x0 = Math.max(0, Math.min(this.sourceWidth - 2, Math.floor(x)));
        const y0 = Math.max(0, Math.min(this.sourceHeight - 2, Math.floor(y)));
        const x1 = x0 + 1;
        const y1 = y0 + 1;

        // Fractional parts
        const fx = x - x0;
        const fy = y - y0;

        // Get four corner values
        const q00 = grid[y0][x0];
        const q10 = grid[y0][x1];
        const q01 = grid[y1][x0];
        const q11 = grid[y1][x1];

        // Bilinear interpolation
        const value = (1 - fx) * (1 - fy) * q00 +
                      fx * (1 - fy) * q10 +
                      (1 - fx) * fy * q01 +
                      fx * fy * q11;

        return value;
    }

    gridValueToVelocity(gridValue, x, z, buoyData) {
        // Strategy: Use buoy measurements to establish velocity direction/scale
        // and use gridValue as a spatial modifier

        // Average the buoy velocities to get regional flow pattern
        let avgU = 0;
        let avgV = 0;
        let count = 0;

        Object.values(buoyData).forEach(buoy => {
            if (buoy.u !== null && buoy.u !== undefined &&
                buoy.v !== null && buoy.v !== undefined) {
                avgU += buoy.u;
                avgV += buoy.v;
                count++;
            }
        });

        if (count > 0) {
            avgU /= count;
            avgV /= count;
        }

        // Use gridValue to modulate the velocity
        // GridValue appears to be a normalized quantity (typically -0.1 to 0.1 based on data)
        // Scale it to affect the velocity magnitude
        const scaleFactor = 1.0 + (gridValue * 5.0); // Allow ±50% variation from average

        const u = avgU * scaleFactor;
        const v = avgV * scaleFactor;
        const magnitude = Math.sqrt(u * u + v * v);

        return { u, v, magnitude };
    }

    /**
     * Alternative: Use buoy positions to create spatial interpolation
     * This gives more physically accurate representation
     */
    interpolateFromBuoys(buoyData, buoyPositions) {
        const field = [];

        for (let i = 0; i < this.targetHeight; i++) {
            field[i] = [];
            for (let j = 0; j < this.targetWidth; j++) {
                const x = (j - this.targetWidth / 2) * this.gridSpacing;
                const z = (i - this.targetHeight / 2) * this.gridSpacing;

                // Inverse distance weighting from buoy stations
                const velocity = this.inverseDistanceWeighting(
                    x, z, buoyData, buoyPositions
                );

                field[i][j] = {
                    x: x,
                    z: z,
                    u: velocity.u,
                    v: velocity.v,
                    magnitude: velocity.magnitude
                };
            }
        }

        return field;
    }

    inverseDistanceWeighting(x, z, buoyData, buoyPositions) {
        let totalWeight = 0;
        let weightedU = 0;
        let weightedV = 0;

        Object.entries(buoyData).forEach(([buoyId, data]) => {
            if (!buoyPositions[buoyId]) return;
            if (data.u === null || data.v === null) return;

            const buoyPos = buoyPositions[buoyId];
            const dx = x - buoyPos.x;
            const dz = z - buoyPos.z;
            const distance = Math.sqrt(dx * dx + dz * dz) + 0.1; // Avoid division by zero

            // Inverse distance weight (p=2 is common)
            const weight = 1.0 / (distance * distance);

            weightedU += data.u * weight;
            weightedV += data.v * weight;
            totalWeight += weight;
        });

        if (totalWeight > 0) {
            weightedU /= totalWeight;
            weightedV /= totalWeight;
        }

        const magnitude = Math.sqrt(weightedU * weightedU + weightedV * weightedV);
        return { u: weightedU, v: weightedV, magnitude };
    }

    /**
     * Get velocity at arbitrary point using bilinear interpolation
     */
    getVelocityAt(x, z, field) {
        const gridX = (x / this.gridSpacing) + (this.targetWidth / 2);
        const gridZ = (z / this.gridSpacing) + (this.targetHeight / 2);

        // Clamp to grid boundaries
        if (gridX < 0 || gridX >= this.targetWidth - 1 ||
            gridZ < 0 || gridZ >= this.targetHeight - 1) {
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
}
