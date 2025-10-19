import * as THREE from 'three';

export class VectorField {
    constructor() {
        this.group = new THREE.Group();
        this.arrows = [];
        this.samplePoints = this.createSampleGrid();
    }

    createSampleGrid() {
        // Create a grid of sample points (fewer than full field for visibility)
        const points = [];
        const spacing = 10; // Sample every 10 units

        for (let z = -50; z <= 50; z += spacing) {
            for (let x = -40; x <= 40; x += spacing) {
                points.push({ x, z });
            }
        }

        return points;
    }

    update(velocityField) {
        // Clear existing arrows
        this.group.clear();
        this.arrows = [];

        // Find max velocity for scaling
        let maxMagnitude = 0;
        for (let i = 0; i < velocityField.length; i++) {
            for (let j = 0; j < velocityField[i].length; j++) {
                if (velocityField[i][j].magnitude > maxMagnitude) {
                    maxMagnitude = velocityField[i][j].magnitude;
                }
            }
        }

        // Create arrows at sample points
        this.samplePoints.forEach(point => {
            const velocity = this.interpolateVelocity(point.x, point.z, velocityField);

            if (velocity.magnitude > 0.01) {
                const arrow = this.createArrow(
                    point.x,
                    point.z,
                    velocity.u,
                    velocity.v,
                    velocity.magnitude,
                    maxMagnitude
                );
                this.group.add(arrow);
                this.arrows.push(arrow);
            }
        });
    }

    interpolateVelocity(x, z, field) {
        // Simple nearest-neighbor lookup
        // (Could be improved with bilinear interpolation)

        let minDist = Infinity;
        let closestVelocity = { u: 0, v: 0, magnitude: 0 };

        for (let i = 0; i < field.length; i++) {
            for (let j = 0; j < field[i].length; j++) {
                const dx = field[i][j].x - x;
                const dz = field[i][j].z - z;
                const dist = Math.sqrt(dx * dx + dz * dz);

                if (dist < minDist) {
                    minDist = dist;
                    closestVelocity = field[i][j];
                }
            }
        }

        return closestVelocity;
    }

    createArrow(x, z, u, v, magnitude, maxMagnitude) {
        const group = new THREE.Group();

        // Arrow direction
        const direction = new THREE.Vector3(u, 0, v).normalize();

        // Arrow length based on magnitude
        const length = (magnitude / (maxMagnitude + 0.01)) * 8;

        // Color based on magnitude
        const normalizedMag = magnitude / (maxMagnitude + 0.01);
        const color = this.getColorFromSpeed(normalizedMag);

        // Arrow shaft (cylinder)
        const shaftGeometry = new THREE.CylinderGeometry(0.1, 0.1, length * 0.7, 8);
        const shaftMaterial = new THREE.MeshBasicMaterial({ color: color });
        const shaft = new THREE.Mesh(shaftGeometry, shaftMaterial);

        // Arrow head (cone)
        const headGeometry = new THREE.ConeGeometry(0.3, length * 0.3, 8);
        const headMaterial = new THREE.MeshBasicMaterial({ color: color });
        const head = new THREE.Mesh(headGeometry, headMaterial);

        // Position shaft
        shaft.position.y = length * 0.35;

        // Position head
        head.position.y = length * 0.7 + length * 0.15;

        group.add(shaft);
        group.add(head);

        // Orient arrow in direction of flow
        const angle = Math.atan2(u, v);
        group.rotation.y = -angle;
        group.rotation.x = Math.PI / 2;

        // Position arrow
        group.position.set(x, 1, z);

        return group;
    }

    getColorFromSpeed(normalizedSpeed) {
        // Blue (slow) -> Cyan -> Yellow -> Red (fast)
        const color = new THREE.Color();

        if (normalizedSpeed < 0.33) {
            const t = normalizedSpeed / 0.33;
            color.setRGB(0.2 + t * 0.3, 0.5 + t * 0.5, 1.0);
        } else if (normalizedSpeed < 0.66) {
            const t = (normalizedSpeed - 0.33) / 0.33;
            color.setRGB(0.5 + t * 0.5, 1.0, 1.0 - t);
        } else {
            const t = (normalizedSpeed - 0.66) / 0.34;
            color.setRGB(1.0, 1.0 - t, 0.0);
        }

        return color;
    }

    setVisible(visible) {
        this.group.visible = visible;
    }
}
