import { GUI } from 'lil-gui';

export class ControlPanel {
    constructor(params, updateCallback) {
        this.params = params;
        this.updateCallback = updateCallback;
        this.gui = new GUI({ title: 'Visualization Controls' });

        this.setupControls();
    }

    setupControls() {
        // Visualization folder
        const vizFolder = this.gui.addFolder('Display Options');
        vizFolder.add(this.params, 'showParticles')
            .name('Show Particles')
            .onChange(() => this.updateCallback());
        vizFolder.add(this.params, 'showVectors')
            .name('Show Vectors')
            .onChange(() => this.updateCallback());
        vizFolder.add(this.params, 'particleCount', 1000, 20000, 1000)
            .name('Particle Count')
            .onChange(() => {
                console.log('Particle count change requires restart');
            });
        vizFolder.open();

        // Info section
        const infoFolder = this.gui.addFolder('About');
        infoFolder.add({ info: 'Real buoy data from 2023-2024' }, 'info')
            .name('Data Source')
            .disable();
        infoFolder.add({ records: '17,494 hourly records' }, 'records')
            .name('Dataset')
            .disable();
        infoFolder.open();
    }

    destroy() {
        this.gui.destroy();
    }
}
