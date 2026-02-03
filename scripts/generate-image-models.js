/**
 * Generate GLB models from images
 * Creates a flat plane with the image as texture for AR viewing
 * Run: node scripts/generate-image-models.js
 */

const fs = require('fs');
const path = require('path');

const IMG_DIR = path.join(__dirname, '..', 'assets', 'img');
const MODELS_DIR = path.join(__dirname, '..', 'assets', 'models');
const JS_OUTPUT = path.join(__dirname, '..', 'js', 'images.js');

// Ensure models directory exists
if (!fs.existsSync(MODELS_DIR)) {
    fs.mkdirSync(MODELS_DIR, { recursive: true });
}

// Supported image extensions
const IMAGE_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.gif', '.webp'];

/**
 * Create a simple GLB file with a plane and embedded image texture
 */
function createImagePlaneGLB(imagePath, outputPath) {
    const imageBuffer = fs.readFileSync(imagePath);
    const ext = path.extname(imagePath).toLowerCase();

    // Determine MIME type
    const mimeTypes = {
        '.jpg': 'image/jpeg',
        '.jpeg': 'image/jpeg',
        '.png': 'image/png',
        '.gif': 'image/gif',
        '.webp': 'image/webp'
    };
    const mimeType = mimeTypes[ext] || 'image/png';

    // Get image dimensions (approximate - assume square for now)
    // For a real implementation, you'd parse the image header
    const aspectRatio = 1.0; // Default to square, could be enhanced
    const width = 1.0;
    const height = width / aspectRatio;

    // Create plane geometry (2 triangles forming a quad)
    const halfW = width / 2;
    const halfH = height / 2;

    // Vertices: 4 corners of the plane
    const positions = new Float32Array([
        -halfW, -halfH, 0,  // bottom-left
        halfW, -halfH, 0,  // bottom-right
        halfW, halfH, 0,  // top-right
        -halfW, halfH, 0   // top-left
    ]);

    // Normals (all pointing towards viewer)
    const normals = new Float32Array([
        0, 0, 1,
        0, 0, 1,
        0, 0, 1,
        0, 0, 1
    ]);

    // Texture coordinates
    const texcoords = new Float32Array([
        0, 1,  // bottom-left (flip Y for correct orientation)
        1, 1,  // bottom-right
        1, 0,  // top-right
        0, 0   // top-left
    ]);

    // Indices (two triangles)
    const indices = new Uint16Array([0, 1, 2, 0, 2, 3]);

    // Build the binary buffer
    const posBuffer = Buffer.from(positions.buffer);
    const normBuffer = Buffer.from(normals.buffer);
    const texBuffer = Buffer.from(texcoords.buffer);
    const idxBuffer = Buffer.from(indices.buffer);

    // Calculate offsets
    const posOffset = 0;
    const normOffset = posBuffer.length;
    const texOffset = normOffset + normBuffer.length;
    const idxOffset = texOffset + texBuffer.length;
    const imageOffset = idxOffset + idxBuffer.length;

    // Combine all binary data
    const binData = Buffer.concat([posBuffer, normBuffer, texBuffer, idxBuffer, imageBuffer]);

    // Create glTF JSON
    const gltf = {
        asset: { version: "2.0", generator: "AR Image Viewer" },
        scene: 0,
        scenes: [{ nodes: [0] }],
        nodes: [{ mesh: 0, name: "ImagePlane" }],
        meshes: [{
            name: "Plane",
            primitives: [{
                attributes: {
                    POSITION: 0,
                    NORMAL: 1,
                    TEXCOORD_0: 2
                },
                indices: 3,
                material: 0
            }]
        }],
        accessors: [
            { bufferView: 0, byteOffset: 0, componentType: 5126, count: 4, type: "VEC3", min: [-halfW, -halfH, 0], max: [halfW, halfH, 0] },
            { bufferView: 1, byteOffset: 0, componentType: 5126, count: 4, type: "VEC3" },
            { bufferView: 2, byteOffset: 0, componentType: 5126, count: 4, type: "VEC2" },
            { bufferView: 3, byteOffset: 0, componentType: 5123, count: 6, type: "SCALAR" }
        ],
        bufferViews: [
            { buffer: 0, byteOffset: posOffset, byteLength: posBuffer.length, target: 34962 },
            { buffer: 0, byteOffset: normOffset, byteLength: normBuffer.length, target: 34962 },
            { buffer: 0, byteOffset: texOffset, byteLength: texBuffer.length, target: 34962 },
            { buffer: 0, byteOffset: idxOffset, byteLength: idxBuffer.length, target: 34963 },
            { buffer: 0, byteOffset: imageOffset, byteLength: imageBuffer.length }
        ],
        buffers: [{ byteLength: binData.length }],
        materials: [{
            name: "ImageMaterial",
            pbrMetallicRoughness: {
                baseColorTexture: { index: 0 },
                metallicFactor: 0,
                roughnessFactor: 1
            },
            doubleSided: true
        }],
        textures: [{ source: 0, sampler: 0 }],
        images: [{ bufferView: 4, mimeType: mimeType }],
        samplers: [{ magFilter: 9729, minFilter: 9987, wrapS: 33071, wrapT: 33071 }]
    };

    // Convert to JSON string
    const gltfJson = JSON.stringify(gltf);
    const gltfBuffer = Buffer.from(gltfJson);

    // Pad JSON to 4-byte alignment
    const jsonPadding = (4 - (gltfBuffer.length % 4)) % 4;
    const paddedJson = Buffer.concat([gltfBuffer, Buffer.alloc(jsonPadding, 0x20)]);

    // Pad binary to 4-byte alignment
    const binPadding = (4 - (binData.length % 4)) % 4;
    const paddedBin = Buffer.concat([binData, Buffer.alloc(binPadding, 0x00)]);

    // GLB header
    const GLB_MAGIC = 0x46546C67; // "glTF"
    const GLB_VERSION = 2;
    const headerSize = 12;
    const jsonChunkHeader = 8;
    const binChunkHeader = 8;
    const totalSize = headerSize + jsonChunkHeader + paddedJson.length + binChunkHeader + paddedBin.length;

    const glbBuffer = Buffer.alloc(totalSize);
    let offset = 0;

    // Write header
    glbBuffer.writeUInt32LE(GLB_MAGIC, offset); offset += 4;
    glbBuffer.writeUInt32LE(GLB_VERSION, offset); offset += 4;
    glbBuffer.writeUInt32LE(totalSize, offset); offset += 4;

    // Write JSON chunk
    glbBuffer.writeUInt32LE(paddedJson.length, offset); offset += 4;
    glbBuffer.writeUInt32LE(0x4E4F534A, offset); offset += 4; // "JSON"
    paddedJson.copy(glbBuffer, offset); offset += paddedJson.length;

    // Write BIN chunk
    glbBuffer.writeUInt32LE(paddedBin.length, offset); offset += 4;
    glbBuffer.writeUInt32LE(0x004E4942, offset); offset += 4; // "BIN\0"
    paddedBin.copy(glbBuffer, offset);

    // Write to file
    fs.writeFileSync(outputPath, glbBuffer);
    return true;
}

function main() {
    console.log('🖼️  Generating AR models from images...\n');

    if (!fs.existsSync(IMG_DIR)) {
        console.log('📁 Creating assets/img directory...');
        fs.mkdirSync(IMG_DIR, { recursive: true });
        console.log('   Add images to assets/img/ and run this script again.');
        return;
    }

    const files = fs.readdirSync(IMG_DIR);
    const images = [];

    files.forEach(file => {
        const ext = path.extname(file).toLowerCase();
        if (IMAGE_EXTENSIONS.includes(ext)) {
            const imagePath = path.join(IMG_DIR, file);
            const modelName = path.basename(file, ext) + '.glb';
            const modelPath = path.join(MODELS_DIR, modelName);

            console.log(`📸 Processing: ${file}`);

            try {
                createImagePlaneGLB(imagePath, modelPath);
                console.log(`   ✅ Created: ${modelName}`);

                images.push({
                    name: file,
                    path: `assets/img/${file}`,
                    model: `assets/models/${modelName}`
                });
            } catch (err) {
                console.log(`   ❌ Error: ${err.message}`);
            }
        }
    });

    // Generate JS file
    const jsContent = `/**
 * Auto-generated image list with AR models
 * Generated: ${new Date().toISOString()}
 * Run 'npm run scan' to regenerate
 */

const IMAGES = ${JSON.stringify(images, null, 4)};

// Export for use
if (typeof module !== 'undefined') {
    module.exports = IMAGES;
}
`;

    fs.writeFileSync(JS_OUTPUT, jsContent);

    console.log(`\n✅ Generated ${images.length} AR models`);
    console.log(`📄 Updated: js/images.js`);
    console.log('\n🎉 Done! Deploy to test AR on your phone.');
}

main();
