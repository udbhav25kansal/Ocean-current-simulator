import { GUI } from 'lil-gui';

export class ControlPanel {
    constructor(params, updateCallback) {
        this.params = params;
        this.updateCallback = updateCallback;
        this.gui = new GUI({ title: 'Simulation Controls' });

        this.setupControls();
        this.setupPresets();
    }

    setupControls() {
        // River Discharge folder
        const riverFolder = this.gui.addFolder('River Discharge');
        riverFolder.add(this.params, 'riverDischarge', 0, 10000, 100)
            .name('Flow Rate (m³/s)')
            .onChange(() => this.updateCallback());
        riverFolder.open();

        // Wind folder
        const windFolder = this.gui.addFolder('Wind');
        windFolder.add(this.params, 'windSpeed', 0, 30, 1)
            .name('Speed (m/s)')
            .onChange(() => this.updateCallback());
        windFolder.add(this.params, 'windDirection', 0, 360, 5)
            .name('Direction (°)')
            .onChange(() => this.updateCallback());
        windFolder.open();

        // Tides folder
        const tideFolder = this.gui.addFolder('Tides');
        tideFolder.add(this.params, 'tidePhase', 0, 12.4, 0.1)
            .name('Phase (hours)')
            .onChange(() => this.updateCallback());

        const tideStates = {
            'Flood': 3.1,
            'High Slack': 6.2,
            'Ebb': 9.3,
            'Low Slack': 0.0
        };

        tideFolder.add({ state: 'Flood' }, 'state', Object.keys(tideStates))
            .name('Quick Set')
            .onChange((value) => {
                this.params.tidePhase = tideStates[value];
                this.updateCallback();
                this.gui.updateDisplay();
            });
        tideFolder.open();

        // Time Animation folder
        const timeFolder = this.gui.addFolder('Time Control');
        timeFolder.add(this.params, 'isPlaying')
            .name('Play/Pause')
            .onChange(() => {
                // Animation handled in main.js
            });
        timeFolder.add(this.params, 'timeSpeed', 0.1, 10, 0.1)
            .name('Speed Multiplier');
        timeFolder.open();

        // Visualization folder
        const vizFolder = this.gui.addFolder('Visualization');
        vizFolder.add(this.params, 'showParticles')
            .name('Show Particles')
            .onChange(() => this.updateCallback());
        vizFolder.add(this.params, 'showVectors')
            .name('Show Vectors')
            .onChange(() => this.updateCallback());
        vizFolder.add(this.params, 'particleCount', 1000, 20000, 1000)
            .name('Particle Count')
            .onChange(() => {
                // This would require recreating particle system
                console.log('Particle count changed - restart required');
            });
        vizFolder.open();

        // Reset button
        this.gui.add({ reset: () => this.resetToDefaults() }, 'reset')
            .name('Reset to Defaults');
    }

    setupPresets() {
        const presets = {
            'Winter Storm': () => {
                this.params.riverDischarge = 1000;
                this.params.windSpeed = 25;
                this.params.windDirection = 180;
                this.params.tidePhase = 3.1;
                this.updateCallback();
                this.gui.updateDisplay();
            },
            'Spring Freshet': () => {
                this.params.riverDischarge = 8000;
                this.params.windSpeed = 8;
                this.params.windDirection = 270;
                this.params.tidePhase = 6.2;
                this.updateCallback();
                this.gui.updateDisplay();
            },
            'Summer Calm': () => {
                this.params.riverDischarge = 2500;
                this.params.windSpeed = 5;
                this.params.windDirection = 315;
                this.params.tidePhase = 0;
                this.updateCallback();
                this.gui.updateDisplay();
            },
            'Tidal Dominance': () => {
                this.params.riverDischarge = 500;
                this.params.windSpeed = 3;
                this.params.windDirection = 0;
                this.params.tidePhase = 3.1;
                this.updateCallback();
                this.gui.updateDisplay();
            }
        };

        const presetFolder = this.gui.addFolder('Scenario Presets');

        Object.keys(presets).forEach(presetName => {
            presetFolder.add({ load: presets[presetName] }, 'load')
                .name(presetName);
        });

        presetFolder.open();
    }

    resetToDefaults() {
        this.params.riverDischarge = 3000;
        this.params.windSpeed = 10;
        this.params.windDirection = 180;
        this.params.tidePhase = 0;
        this.params.showVectors = true;
        this.params.showParticles = true;
        this.params.timeSpeed = 1.0;
        this.params.isPlaying = false;

        this.updateCallback();
        this.gui.updateDisplay();
    }

    destroy() {
        this.gui.destroy();
    }
}
