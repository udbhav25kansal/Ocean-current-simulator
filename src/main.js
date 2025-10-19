import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { OceanScene } from './scene/OceanScene.js';
import { ParticleSystem } from './scene/ParticleSystem.js';
import { VectorField } from './scene/VectorField.js';
import { CurrentDataGenerator } from './data/CurrentDataGenerator.js';
import { ControlPanel } from './controls/ControlPanel.js';
import { DataPanel } from './utils/DataPanel.js';
import { HelpPanel } from './utils/HelpPanel.js';

class OceanCurrentSimulator {
    constructor() {
        console.log('Initializing Ocean Current Simulator...');
        this.init();
        console.log('Controls setup...');
        this.setupControls();
        console.log('Scene setup...');
        this.setupScene();
        console.log('Starting animation...');
        this.animate();
        console.log('Hiding loading screen...');
        this.hideLoading();
        console.log('Simulator ready!');
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
            riverDischarge: 3000,
            windSpeed: 10,
            windDirection: 180,
            tidePhase: 0,
            showVectors: true,
            showParticles: true,
            particleCount: 5000,
            timeSpeed: 1.0,
            isPlaying: false
        };

        this.time = 0;
        this.clock = new THREE.Clock();

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

        // Create data generator
        this.dataGenerator = new CurrentDataGenerator();

        // Create particle system
        this.particleSystem = new ParticleSystem(this.params.particleCount);
        this.particleSystem.setDataGenerator(this.dataGenerator);
        this.scene.add(this.particleSystem.points);

        // Create vector field
        this.vectorField = new VectorField();
        this.scene.add(this.vectorField.group);

        // Initial update
        this.updateCurrents();
    }

    setupControls() {
        this.controlPanel = new ControlPanel(this.params, () => this.updateCurrents());
        this.dataPanel = new DataPanel();
        this.helpPanel = new HelpPanel();
    }

    updateCurrents() {
        // Generate velocity field based on current parameters
        const velocityField = this.dataGenerator.generateField(
            this.params.riverDischarge,
            this.params.windSpeed,
            this.params.windDirection,
            this.params.tidePhase
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

        // Update data panel
        const maxVelocity = this.dataGenerator.getMaxVelocity(velocityField);
        const dominantForcing = this.dataGenerator.getDominantForcing(
            this.params.riverDischarge,
            this.params.windSpeed,
            this.params.tidePhase
        );
        this.dataPanel.update(this.params, maxVelocity, dominantForcing);
    }

    animate() {
        requestAnimationFrame(() => this.animate());

        const delta = this.clock.getDelta();

        // Update time if playing
        if (this.params.isPlaying) {
            this.time += delta * this.params.timeSpeed;
            this.params.tidePhase = (this.time / 3600) % 12.4; // Convert to hours
            this.updateCurrents();
        }

        // Update controls
        this.controls.update();

        // Update particle positions
        this.particleSystem.update(delta);

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
