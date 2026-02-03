/**
 * Scan 3D models in assets/models and generate the models list
 * Run: node scripts/scan-images.js
 */

const fs = require('fs');
const path = require('path');

const MODELS_DIR = path.join(__dirname, '..', 'assets', 'models');
const OUTPUT_FILE = path.join(__dirname, '..', 'js', 'images.js');

// Supported model extensions
const MODEL_EXTENSIONS = ['.glb', '.gltf'];

/**
 * Convert filename to display name
 * e.g., "delicious_shawarma.glb" -> "Delicious Shawarma"
 */
function formatDisplayName(filename) {
    const nameWithoutExt = path.basename(filename, path.extname(filename));
    return nameWithoutExt
        .replace(/[-_]/g, ' ')
        .replace(/\b\w/g, char => char.toUpperCase());
}

/**
 * Generate a random vibrant color for the model card
 */
function generateColor() {
    const colors = [
        '#ff6b6b', '#ffd93d', '#ff9f43', '#ee5a5a', '#f8d56b',
        '#26de81', '#a55eea', '#c4e538', '#7bed9f', '#ffa502',
        '#45aaf2', '#fd79a8', '#6c5ce7', '#00cec9', '#e17055'
    ];
    return colors[Math.floor(Math.random() * colors.length)];
}

function scanModels() {
    console.log('🔍 Scanning models in:', MODELS_DIR);

    if (!fs.existsSync(MODELS_DIR)) {
        console.log('📁 Creating assets/models directory...');
        fs.mkdirSync(MODELS_DIR, { recursive: true });
        return [];
    }

    const files = fs.readdirSync(MODELS_DIR);
    const models = [];

    files.forEach(file => {
        const ext = path.extname(file).toLowerCase();
        if (MODEL_EXTENSIONS.includes(ext)) {
            const stats = fs.statSync(path.join(MODELS_DIR, file));
            const id = path.basename(file, ext).toLowerCase().replace(/[-\s]/g, '_');

            models.push({
                id: id,
                name: formatDisplayName(file),
                model: `assets/models/${file}`,
                color: generateColor(),
                size: stats.size,
                sizeFormatted: (stats.size / 1024).toFixed(1) + ' KB'
            });
        }
    });

    return models;
}

function generateJS(models) {
    // Create a cleaner output without size metadata
    const cleanModels = models.map(m => ({
        id: m.id,
        name: m.name,
        model: m.model,
        color: m.color
    }));

    const jsContent = `/**
 * Auto-generated models list
 * Generated: ${new Date().toISOString()}
 * Run 'npm run scan' to regenerate
 */

const IMAGES = ${JSON.stringify(cleanModels, null, 4)};

// Export for use
if (typeof module !== 'undefined') {
    module.exports = IMAGES;
}
`;

    fs.writeFileSync(OUTPUT_FILE, jsContent);
    console.log(`✅ Generated ${OUTPUT_FILE}`);
}

// Main
const models = scanModels();
console.log(`🎯 Found ${models.length} models:`);
models.forEach(m => console.log(`   - ${m.name} (${m.sizeFormatted})`));

generateJS(models);
console.log('\n🎉 Done! Include js/images.js in your HTML.');
