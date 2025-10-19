import * as THREE from 'three';

export class OceanScene {
    constructor() {
        this.group = new THREE.Group();
        this.createOcean();
        this.createLandmasses();
    }

    createOcean() {
        // Create ocean plane - Strait of Georgia dimensions
        // Approximately 50km x 100km simplified
        const oceanGeometry = new THREE.PlaneGeometry(100, 120, 100, 120);

        // Ocean material with water-like appearance
        const oceanMaterial = new THREE.MeshStandardMaterial({
            color: 0x1a5f7a,
            transparent: true,
            opacity: 0.9,
            metalness: 0.1,
            roughness: 0.6,
            side: THREE.DoubleSide
        });

        this.ocean = new THREE.Mesh(oceanGeometry, oceanMaterial);
        this.ocean.rotation.x = -Math.PI / 2;
        this.ocean.receiveShadow = true;

        // Add subtle waves to the ocean
        this.oceanGeometry = oceanGeometry;
        this.waveTime = 0;

        this.group.add(this.ocean);

        // Add ocean grid for reference
        const gridHelper = new THREE.GridHelper(120, 40, 0x2a6f8a, 0x1a4f6a);
        gridHelper.position.y = 0.1;
        this.group.add(gridHelper);
    }

    createLandmasses() {
        const landMaterial = new THREE.MeshStandardMaterial({
            color: 0x2d5016,
            roughness: 0.9,
            metalness: 0.1
        });

        // Vancouver Island (west side) - simplified shape
        const islandShape = new THREE.Shape();
        islandShape.moveTo(-60, -50);
        islandShape.lineTo(-60, 50);
        islandShape.lineTo(-50, 55);
        islandShape.lineTo(-48, 50);
        islandShape.lineTo(-48, -50);
        islandShape.lineTo(-52, -55);
        islandShape.closePath();

        const islandGeometry = new THREE.ExtrudeGeometry(islandShape, {
            depth: 2,
            bevelEnabled: false
        });
        const island = new THREE.Mesh(islandGeometry, landMaterial);
        island.rotation.x = -Math.PI / 2;
        island.position.y = 1;
        this.group.add(island);

        // Mainland BC (east side) - simplified shape
        const mainlandShape = new THREE.Shape();
        mainlandShape.moveTo(48, -60);
        mainlandShape.lineTo(48, 30);
        mainlandShape.lineTo(45, 40);
        mainlandShape.lineTo(40, 50);
        mainlandShape.lineTo(35, 55);
        mainlandShape.lineTo(35, 60);
        mainlandShape.lineTo(60, 60);
        mainlandShape.lineTo(60, -60);
        mainlandShape.closePath();

        const mainlandGeometry = new THREE.ExtrudeGeometry(mainlandShape, {
            depth: 2,
            bevelEnabled: false
        });
        const mainland = new THREE.Mesh(mainlandGeometry, landMaterial);
        mainland.rotation.x = -Math.PI / 2;
        mainland.position.y = 1;
        this.group.add(mainland);

        // Fraser River mouth indicator (south end)
        const riverMouthGeometry = new THREE.CylinderGeometry(1.5, 1.5, 0.5, 16);
        const riverMouthMaterial = new THREE.MeshStandardMaterial({
            color: 0x4fc3f7,
            emissive: 0x2196f3,
            emissiveIntensity: 0.3
        });
        this.riverMouth = new THREE.Mesh(riverMouthGeometry, riverMouthMaterial);
        this.riverMouth.position.set(35, 0.5, -45); // Southeast position
        this.group.add(this.riverMouth);

        // Add labels using sprites
        this.addLabel('Vancouver Island', -50, 2, 0);
        this.addLabel('Mainland BC', 50, 2, 0);
        this.addLabel('Fraser River', 35, 2, -48);
    }

    addLabel(text, x, y, z) {
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        canvas.width = 512;
        canvas.height = 128;

        context.fillStyle = 'rgba(0, 0, 0, 0.6)';
        context.fillRect(0, 0, canvas.width, canvas.height);

        context.font = 'Bold 48px Arial';
        context.fillStyle = '#ffffff';
        context.textAlign = 'center';
        context.textBaseline = 'middle';
        context.fillText(text, canvas.width / 2, canvas.height / 2);

        const texture = new THREE.CanvasTexture(canvas);
        const spriteMaterial = new THREE.SpriteMaterial({ map: texture });
        const sprite = new THREE.Sprite(spriteMaterial);

        sprite.position.set(x, y, z);
        sprite.scale.set(15, 4, 1);

        this.group.add(sprite);
    }

    update(time) {
        // Animate ocean waves
        this.waveTime = time;
        const positions = this.oceanGeometry.attributes.position;

        for (let i = 0; i < positions.count; i++) {
            const x = positions.getX(i);
            const y = positions.getY(i);

            const waveHeight = Math.sin(x * 0.1 + time * 0.5) *
                             Math.cos(y * 0.1 + time * 0.3) * 0.3;

            positions.setZ(i, waveHeight);
        }

        positions.needsUpdate = true;
        this.oceanGeometry.computeVertexNormals();

        // Pulse the river mouth indicator
        const pulse = Math.sin(time * 2) * 0.2 + 1;
        this.riverMouth.scale.set(pulse, 1, pulse);
    }
}
