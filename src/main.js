import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { OceanScene } from './scene/OceanScene.js';
import { ParticleSystem } from './scene/ParticleSystem.js';
import { VectorField } from './scene/VectorField.js';
import { BuoyDataLoader } from './data/BuoyDataLoader.js';
import { FieldInterpolator } from './data/FieldInterpolator.js';
import { ControlPanel } from './controls/ControlPanel.js';
import { TimelineControl } from './controls/TimelineControl.js';
import { DataPanel } from './utils/DataPanel.js';
import { HelpPanel } from './utils/HelpPanel.js';

class OceanCurrentSimulator {
    constructor() {
        console.log('Initializing Ocean Current Simulator...');
        this.init();
        this.loadData();
    }

    async loadData() {
        console.log('Loading buoy data...');
        this.buoyDataLoader = new BuoyDataLoader();
        this.fieldInterpolator = new FieldInterpolator();

        try {
            // Use relative path that works with Vite's base configuration
            await this.buoyDataLoader.loadCSV(`${import.meta.env.BASE_URL}processed_buoy_data_clustered_k3.csv`);
            console.log('Buoy data loaded successfully!');
            console.log('Total records:', this.buoyDataLoader.getTotalRecords());

            // Initialize to first record
            this.currentRecordIndex = 0;
            this.currentRecord = this.buoyDataLoader.getRecordByIndex(0);

            console.log('Controls setup...');
            this.setupControls();
            console.log('Scene setup...');
            this.setupScene();
            console.log('Starting animation...');
            this.animate();
            console.log('Hiding loading screen...');
            this.hideLoading();
            console.log('Simulator ready!');
        } catch (error) {
            console.error('Failed to load buoy data:', error);
            alert('Failed to load ocean current data. Please check console for details.');
        }
    }

    init() {
        // Scene setup
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(0x0a0e27);
        this.scene.fog = new THREE.Fog(0x0a0e27, 50, 200);

        // Camera setup
        this.camera = new THREE.PerspectiveCamera(
            60,
            window.innerWidth / window.innerHeight,
            0.1,
            1000
        );
        this.camera.position.set(0, 50, 80);
        this.camera.lookAt(0, 0, 0);

        // Renderer setup
        this.renderer = new THREE.WebGLRenderer({ antialias: true });
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        document.getElementById('canvas-container').appendChild(this.renderer.domElement);

        // Controls
        this.controls = new OrbitControls(this.camera, this.renderer.domElement);
        this.controls.enableDamping = true;
        this.controls.dampingFactor = 0.05;
        this.controls.maxPolarAngle = Math.PI / 2.2;
        this.controls.minDistance = 30;
        this.controls.maxDistance = 150;

        // Simulation parameters
        this.params = {
            showVectors: true,
            showParticles: true,
            particleCount: 5000,
            playbackSpeed: 1.0,
            isPlaying: false,
            currentIndex: 0
        };

        this.time = 0;
        this.clock = new THREE.Clock();
        this.accumulatedTime = 0; // For playback timing

        // Resize handler
        window.addEventListener('resize', () => this.onWindowResize());
    }

    setupScene() {
        // Lighting
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
        this.scene.add(ambientLight);

        const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
        directionalLight.position.set(50, 100, 50);
        directionalLight.castShadow = true;
        this.scene.add(directionalLight);

        // Create ocean scene
        this.oceanScene = new OceanScene();
        this.scene.add(this.oceanScene.group);

        // Create particle system
        this.particleSystem = new ParticleSystem(this.params.particleCount);
        this.scene.add(this.particleSystem.points);

        // Create vector field
        this.vectorField = new VectorField();
        this.scene.add(this.vectorField.group);

        // Initial update with real data
        this.updateCurrents();
    }

    setupControls() {
        this.controlPanel = new ControlPanel(this.params, () => this.updateCurrents());
        this.timelineControl = new TimelineControl(
            this.buoyDataLoader,
            (index) => this.setRecordByIndex(index)
        );
        this.dataPanel = new DataPanel();
        this.helpPanel = new HelpPanel();

        // Make simulator accessible globally for timeline control
        window.simulator = this;
    }

    updateCurrents() {
        if (!this.currentRecord) return;

        // Generate velocity field from real buoy data
        const velocityField = this.fieldInterpolator.interpolateToField(
            this.currentRecord.spatialGrid,
            this.currentRecord.buoys
        );

        // Store current velocity field
        this.currentVelocityField = velocityField;

        // Update particle system
        this.particleSystem.setVelocityField(velocityField);

        // Update vector field
        if (this.params.showVectors) {
            this.vectorField.update(velocityField);
            this.vectorField.group.visible = true;
        } else {
            this.vectorField.group.visible = false;
        }

        // Update particle visibility
        this.particleSystem.points.visible = this.params.showParticles;

        // Update data panel with real measurements
        const maxVelocity = this.fieldInterpolator.getMaxVelocity(velocityField);
        const clusterName = this.buoyDataLoader.getClusterName(this.currentRecord.cluster);

        this.dataPanel.updateRealData(
            this.currentRecord,
            maxVelocity,
            clusterName
        );
    }

    setRecordByIndex(index) {
        const record = this.buoyDataLoader.getRecordByIndex(index);
        if (record) {
            this.currentRecordIndex = index;
            this.currentRecord = record;
            this.params.currentIndex = index;
            this.updateCurrents();
        }
    }

    animate() {
        requestAnimationFrame(() => this.animate());

        const delta = this.clock.getDelta();

        // Update playback if playing
        if (this.params.isPlaying && this.buoyDataLoader) {
            this.accumulatedTime += delta * this.params.playbackSpeed;

            // Advance to next record every second (simulating hourly data)
            if (this.accumulatedTime >= 1.0) {
                this.accumulatedTime = 0;
                const nextIndex = (this.currentRecordIndex + 1) % this.buoyDataLoader.getTotalRecords();
                this.setRecordByIndex(nextIndex);
            }
        }

        this.time += delta;

        // Update controls
        this.controls.update();

        // Update particle positions
        if (this.currentVelocityField) {
            this.particleSystem.update(delta);
        }

        // Update ocean animation
        this.oceanScene.update(this.time);

        // Render
        this.renderer.render(this.scene, this.camera);
    }

    onWindowResize() {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
    }

    hideLoading() {
        const loading = document.getElementById('loading');
        if (loading) {
            loading.classList.add('hidden');
        }
    }
}

// Start the simulator
new OceanCurrentSimulator();
