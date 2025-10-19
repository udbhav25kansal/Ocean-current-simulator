import * as THREE from 'three';

export class ParticleSystem {
    constructor(particleCount = 5000) {
        this.particleCount = particleCount;
        this.velocityField = null;
        this.dataGenerator = null; // Will be set externally

        this.createParticles();
    }

    createParticles() {
        // Particle geometry
        const positions = new Float32Array(this.particleCount * 3);
        const colors = new Float32Array(this.particleCount * 3);
        const sizes = new Float32Array(this.particleCount);
        const lifetimes = new Float32Array(this.particleCount);

        // Initialize particles
        for (let i = 0; i < this.particleCount; i++) {
            const i3 = i * 3;

            // Random position within strait bounds
            positions[i3] = (Math.random() - 0.5) * 90; // x
            positions[i3 + 1] = Math.random() * 0.5 + 0.5; // y (just above water)
            positions[i3 + 2] = (Math.random() - 0.5) * 110; // z

            // Initial color (will be updated based on velocity)
            colors[i3] = 0.3;
            colors[i3 + 1] = 0.7;
            colors[i3 + 2] = 1.0;

            // Random size
            sizes[i] = Math.random() * 0.5 + 0.3;

            // Random lifetime (0-1)
            lifetimes[i] = Math.random();
        }

        const geometry = new THREE.BufferGeometry();
        geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
        geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));

        // Store lifetimes as custom attribute
        this.lifetimes = lifetimes;

        // Particle material
        const material = new THREE.PointsMaterial({
            size: 0.8,
            vertexColors: true,
            transparent: true,
            opacity: 0.7,
            blending: THREE.AdditiveBlending,
            depthWrite: false,
            sizeAttenuation: true
        });

        this.points = new THREE.Points(geometry, material);
        this.geometry = geometry;
    }

    setVelocityField(field) {
        this.velocityField = field;
    }

    setDataGenerator(generator) {
        this.dataGenerator = generator;
    }

    update(delta) {
        if (!this.velocityField || !this.dataGenerator) return;

        const positions = this.geometry.attributes.position.array;
        const colors = this.geometry.attributes.color.array;

        // Maximum velocity for color mapping
        const maxVel = this.dataGenerator.getMaxVelocity(this.velocityField);

        for (let i = 0; i < this.particleCount; i++) {
            const i3 = i * 3;

            const x = positions[i3];
            const y = positions[i3 + 1];
            const z = positions[i3 + 2];

            // Get velocity at particle position
            const velocity = this.dataGenerator.getVelocityAt(x, z, this.velocityField);

            // Update position based on velocity
            const speed = 5.0; // Speed multiplier for visualization
            positions[i3] += velocity.u * delta * speed;
            positions[i3 + 2] += velocity.v * delta * speed;

            // Update lifetime
            this.lifetimes[i] += delta * 0.2;

            // Fade out old particles
            if (this.lifetimes[i] > 1.0) {
                // Respawn particle at random location
                positions[i3] = (Math.random() - 0.5) * 90;
                positions[i3 + 1] = Math.random() * 0.5 + 0.5;
                positions[i3 + 2] = (Math.random() - 0.5) * 110;
                this.lifetimes[i] = 0;
            }

            // Boundary check - respawn if out of bounds
            if (Math.abs(positions[i3]) > 50 || Math.abs(positions[i3 + 2]) > 60) {
                positions[i3] = (Math.random() - 0.5) * 90;
                positions[i3 + 2] = (Math.random() - 0.5) * 110;
                this.lifetimes[i] = 0;
            }

            // Update color based on velocity magnitude
            const normalizedSpeed = Math.min(velocity.magnitude / (maxVel + 0.01), 1.0);

            // Color gradient: blue (slow) -> cyan -> yellow -> red (fast)
            if (normalizedSpeed < 0.33) {
                // Blue to cyan
                const t = normalizedSpeed / 0.33;
                colors[i3] = 0.2 + t * 0.3; // R
                colors[i3 + 1] = 0.5 + t * 0.5; // G
                colors[i3 + 2] = 1.0; // B
            } else if (normalizedSpeed < 0.66) {
                // Cyan to yellow
                const t = (normalizedSpeed - 0.33) / 0.33;
                colors[i3] = 0.5 + t * 0.5; // R
                colors[i3 + 1] = 1.0; // G
                colors[i3 + 2] = 1.0 - t * 1.0; // B
            } else {
                // Yellow to red
                const t = (normalizedSpeed - 0.66) / 0.34;
                colors[i3] = 1.0; // R
                colors[i3 + 1] = 1.0 - t * 1.0; // G
                colors[i3 + 2] = 0.0; // B
            }

            // Apply lifetime fade
            const alpha = Math.sin(this.lifetimes[i] * Math.PI);
            colors[i3] *= alpha;
            colors[i3 + 1] *= alpha;
            colors[i3 + 2] *= alpha;
        }

        this.geometry.attributes.position.needsUpdate = true;
        this.geometry.attributes.color.needsUpdate = true;
    }

    setParticleCount(count) {
        this.particleCount = count;
        this.points.geometry.dispose();
        this.createParticles();
    }
}
