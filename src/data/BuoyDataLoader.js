import Papa from 'papaparse';

export class BuoyDataLoader {
    constructor() {
        this.data = [];
        this.dataByTimestamp = new Map();
        this.isLoaded = false;
        this.stats = {
            timeRange: { start: null, end: null },
            riverDischarge: { min: Infinity, max: -Infinity },
            velocity: { min: Infinity, max: -Infinity },
            seaLevel: { min: Infinity, max: -Infinity },
            temperature: { min: Infinity, max: -Infinity }
        };
    }

    async loadCSV(filePath) {
        console.log('Loading buoy data from:', filePath);

        return new Promise((resolve, reject) => {
            Papa.parse(filePath, {
                download: true,
                header: true,
                dynamicTyping: true,
                skipEmptyLines: true,
                complete: (results) => {
                    console.log('CSV parsed successfully. Rows:', results.data.length);
                    this.processData(results.data);
                    this.isLoaded = true;
                    resolve(this.data);
                },
                error: (error) => {
                    console.error('Error parsing CSV:', error);
                    reject(error);
                }
            });
        });
    }

    processData(rawData) {
        console.log('Processing buoy data...');

        rawData.forEach((row, index) => {
            // Skip invalid rows
            if (!row.time || row.time === '') return;

            // Extract the 256 spatial grid values (z0 to z255)
            const spatialGrid = [];
            for (let i = 0; i < 256; i++) {
                const key = `z${i}`;
                spatialGrid.push(row[key] !== null && row[key] !== undefined ? row[key] : 0);
            }

            // Create data record
            const record = {
                timestamp: new Date(row.time),
                time: row.time,

                // Environmental measurements
                airTemp: row.avg_air_temp_pst10mts_46131,
                seaLevel: row['Sand Heads_SLEV'],
                riverDischarge: row.Q_cms,

                // Buoy velocity measurements (4 stations)
                buoys: {
                    46131: { u: row.u_46131, v: row.v_46131 },
                    46146: { u: row.u_46146, v: row.v_46146 },
                    46303: { u: row.u_46303, v: row.v_46303 },
                    46304: { u: row.u_46304, v: row.v_46304 }
                },

                // Spatial grid data (256 points)
                spatialGrid: spatialGrid,

                // Temporal features
                month: row.month,
                hour: row.hour,
                dayOfYear: row.day_of_year,
                dayOfWeek: row.day_of_week,

                // Cluster assignment
                cluster: row.cluster,

                // Index for easy navigation
                index: index
            };

            this.data.push(record);
            this.dataByTimestamp.set(row.time, record);

            // Update statistics
            this.updateStats(record);
        });

        console.log('Processed records:', this.data.length);
        console.log('Statistics:', this.stats);
    }

    updateStats(record) {
        // Time range
        if (!this.stats.timeRange.start || record.timestamp < this.stats.timeRange.start) {
            this.stats.timeRange.start = record.timestamp;
        }
        if (!this.stats.timeRange.end || record.timestamp > this.stats.timeRange.end) {
            this.stats.timeRange.end = record.timestamp;
        }

        // River discharge
        if (record.riverDischarge !== null && record.riverDischarge !== undefined) {
            this.stats.riverDischarge.min = Math.min(this.stats.riverDischarge.min, record.riverDischarge);
            this.stats.riverDischarge.max = Math.max(this.stats.riverDischarge.max, record.riverDischarge);
        }

        // Sea level
        if (record.seaLevel !== null && record.seaLevel !== undefined) {
            this.stats.seaLevel.min = Math.min(this.stats.seaLevel.min, record.seaLevel);
            this.stats.seaLevel.max = Math.max(this.stats.seaLevel.max, record.seaLevel);
        }

        // Temperature
        if (record.airTemp !== null && record.airTemp !== undefined) {
            this.stats.temperature.min = Math.min(this.stats.temperature.min, record.airTemp);
            this.stats.temperature.max = Math.max(this.stats.temperature.max, record.airTemp);
        }

        // Velocity (from all buoys)
        Object.values(record.buoys).forEach(buoy => {
            if (buoy.u !== null && buoy.u !== undefined && buoy.v !== null && buoy.v !== undefined) {
                const mag = Math.sqrt(buoy.u * buoy.u + buoy.v * buoy.v);
                this.stats.velocity.min = Math.min(this.stats.velocity.min, mag);
                this.stats.velocity.max = Math.max(this.stats.velocity.max, mag);
            }
        });
    }

    getRecordByIndex(index) {
        if (index < 0 || index >= this.data.length) return null;
        return this.data[index];
    }

    getRecordByTimestamp(timestamp) {
        return this.dataByTimestamp.get(timestamp);
    }

    getRecordByDate(date) {
        // Find closest record to given date
        if (this.data.length === 0) return null;

        const targetTime = date.getTime();
        let closestRecord = this.data[0];
        let closestDiff = Math.abs(closestRecord.timestamp.getTime() - targetTime);

        for (const record of this.data) {
            const diff = Math.abs(record.timestamp.getTime() - targetTime);
            if (diff < closestDiff) {
                closestDiff = diff;
                closestRecord = record;
            }
        }

        return closestRecord;
    }

    getClusterName(clusterId) {
        // Map cluster IDs to ocean regimes based on k-means clustering analysis
        const clusterNames = {
            0: 'Tide + River Dominated',
            1: 'Wind/Storm-Dominated',
            2: 'River Discharge Dominated'
        };
        return clusterNames[clusterId] || 'Unknown';
    }

    getStats() {
        return this.stats;
    }

    getTotalRecords() {
        return this.data.length;
    }

    getTimeRange() {
        return this.stats.timeRange;
    }
}
