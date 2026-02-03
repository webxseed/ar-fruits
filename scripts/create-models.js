/**
 * Simple GLB Fruit Model Generator
 * Creates basic colored sphere/shape GLB models for each fruit
 * 
 * This uses a minimal GLB binary format with embedded geometry
 * Requires: npm install gltf-pipeline
 * 
 * Usage: node create-models.js
 */

const fs = require('fs');
const path = require('path');

// Fruit definitions with colors
const fruits = [
    { name: 'apple', color: [0.8, 0.1, 0.1] },      // Red
    { name: 'banana', color: [1.0, 0.9, 0.2] },     // Yellow
    { name: 'orange', color: [1.0, 0.5, 0.0] },     // Orange
    { name: 'strawberry', color: [0.9, 0.2, 0.3] }, // Pink-red
    { name: 'pineapple', color: [0.9, 0.7, 0.1] },  // Golden
    { name: 'watermelon', color: [0.2, 0.7, 0.3] }, // Green
    { name: 'grapes', color: [0.5, 0.2, 0.6] },     // Purple
    { name: 'pear', color: [0.7, 0.8, 0.2] },       // Green-yellow
    { name: 'kiwi', color: [0.4, 0.3, 0.2] },       // Brown
    { name: 'mango', color: [1.0, 0.6, 0.1] }       // Orange-yellow
];

// Create a minimal valid GLB with a colored sphere
function createSphereGLB(color) {
    // Generate sphere vertices and indices
    const segments = 16;
    const rings = 12;
    const radius = 0.5;

    const positions = [];
    const normals = [];
    const indices = [];

    // Generate vertices
    for (let ring = 0; ring <= rings; ring++) {
        const theta = (ring / rings) * Math.PI;
        const sinTheta = Math.sin(theta);
        const cosTheta = Math.cos(theta);

        for (let seg = 0; seg <= segments; seg++) {
            const phi = (seg / segments) * 2 * Math.PI;
            const sinPhi = Math.sin(phi);
            const cosPhi = Math.cos(phi);

            const x = cosPhi * sinTheta;
            const y = cosTheta;
            const z = sinPhi * sinTheta;

            positions.push(x * radius, y * radius, z * radius);
            normals.push(x, y, z);
        }
    }

    // Generate indices
    for (let ring = 0; ring < rings; ring++) {
        for (let seg = 0; seg < segments; seg++) {
            const first = ring * (segments + 1) + seg;
            const second = first + segments + 1;

            indices.push(first, second, first + 1);
            indices.push(second, second + 1, first + 1);
        }
    }

    // Create binary buffers
    const positionBuffer = new Float32Array(positions);
    const normalBuffer = new Float32Array(normals);
    const indexBuffer = new Uint16Array(indices);

    // Calculate buffer sizes (aligned to 4 bytes)
    const positionByteLength = positionBuffer.byteLength;
    const normalByteLength = normalBuffer.byteLength;
    const indexByteLength = indexBuffer.byteLength;
    const padding = (4 - (indexByteLength % 4)) % 4;

    const totalBufferLength = positionByteLength + normalByteLength + indexByteLength + padding;

    // Create the binary buffer
    const binaryBuffer = new ArrayBuffer(totalBufferLength);
    const binaryView = new Uint8Array(binaryBuffer);
    const dataView = new DataView(binaryBuffer);

    let offset = 0;

    // Write index buffer first (needs to be at offset 0 for alignment)
    for (let i = 0; i < indexBuffer.length; i++) {
        dataView.setUint16(offset, indexBuffer[i], true);
        offset += 2;
    }
    offset += padding;

    const positionOffset = offset;
    for (let i = 0; i < positionBuffer.length; i++) {
        dataView.setFloat32(offset, positionBuffer[i], true);
        offset += 4;
    }

    const normalOffset = offset;
    for (let i = 0; i < normalBuffer.length; i++) {
        dataView.setFloat32(offset, normalBuffer[i], true);
        offset += 4;
    }

    // Create glTF JSON
    const gltf = {
        asset: { version: "2.0", generator: "AR Fruits Generator" },
        scene: 0,
        scenes: [{ nodes: [0] }],
        nodes: [{ mesh: 0, name: "Fruit" }],
        meshes: [{
            primitives: [{
                attributes: {
                    POSITION: 1,
                    NORMAL: 2
                },
                indices: 0,
                material: 0
            }]
        }],
        materials: [{
            pbrMetallicRoughness: {
                baseColorFactor: [...color, 1.0],
                metallicFactor: 0.0,
                roughnessFactor: 0.7
            },
            name: "FruitMaterial"
        }],
        accessors: [
            {
                bufferView: 0,
                componentType: 5123, // UNSIGNED_SHORT
                count: indices.length,
                type: "SCALAR"
            },
            {
                bufferView: 1,
                componentType: 5126, // FLOAT
                count: positions.length / 3,
                type: "VEC3",
                min: [-radius, -radius, -radius],
                max: [radius, radius, radius]
            },
            {
                bufferView: 2,
                componentType: 5126, // FLOAT
                count: normals.length / 3,
                type: "VEC3"
            }
        ],
        bufferViews: [
            {
                buffer: 0,
                byteOffset: 0,
                byteLength: indexByteLength,
                target: 34963 // ELEMENT_ARRAY_BUFFER
            },
            {
                buffer: 0,
                byteOffset: indexByteLength + padding,
                byteLength: positionByteLength,
                target: 34962 // ARRAY_BUFFER
            },
            {
                buffer: 0,
                byteOffset: indexByteLength + padding + positionByteLength,
                byteLength: normalByteLength,
                target: 34962 // ARRAY_BUFFER
            }
        ],
        buffers: [{
            byteLength: totalBufferLength
        }]
    };

    // Convert JSON to bytes
    let jsonString = JSON.stringify(gltf);
    // Pad JSON to 4-byte alignment
    while (jsonString.length % 4 !== 0) {
        jsonString += ' ';
    }
    const jsonBuffer = Buffer.from(jsonString, 'utf8');

    // Create GLB
    const glbLength = 12 + 8 + jsonBuffer.length + 8 + totalBufferLength;
    const glb = Buffer.alloc(glbLength);
    let glbOffset = 0;

    // GLB Header
    glb.writeUInt32LE(0x46546C67, glbOffset); // Magic: "glTF"
    glbOffset += 4;
    glb.writeUInt32LE(2, glbOffset); // Version
    glbOffset += 4;
    glb.writeUInt32LE(glbLength, glbOffset); // Length
    glbOffset += 4;

    // JSON Chunk
    glb.writeUInt32LE(jsonBuffer.length, glbOffset); // Chunk length
    glbOffset += 4;
    glb.writeUInt32LE(0x4E4F534A, glbOffset); // Chunk type: "JSON"
    glbOffset += 4;
    jsonBuffer.copy(glb, glbOffset);
    glbOffset += jsonBuffer.length;

    // Binary Chunk
    glb.writeUInt32LE(totalBufferLength, glbOffset); // Chunk length
    glbOffset += 4;
    glb.writeUInt32LE(0x004E4942, glbOffset); // Chunk type: "BIN"
    glbOffset += 4;
    Buffer.from(binaryBuffer).copy(glb, glbOffset);

    return glb;
}

// Main execution
const outputDir = path.join(__dirname, '..', 'assets', 'models');

// Ensure output directory exists
if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
}

console.log('🍎 Generating fruit models...\n');

fruits.forEach(fruit => {
    const glb = createSphereGLB(fruit.color);
    const outputPath = path.join(outputDir, `${fruit.name}.glb`);
    fs.writeFileSync(outputPath, glb);
    console.log(`✅ Created ${fruit.name}.glb (${(glb.length / 1024).toFixed(1)} KB)`);
});

console.log('\n🎉 All fruit models generated successfully!');
console.log(`📁 Output directory: ${outputDir}`);
