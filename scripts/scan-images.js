/**
 * Scan images in assets/img and generate the images list
 * Run: node scripts/scan-images.js
 */

const fs = require('fs');
const path = require('path');

const IMG_DIR = path.join(__dirname, '..', 'assets', 'img');
const OUTPUT_FILE = path.join(__dirname, '..', 'js', 'images.js');

// Supported image extensions
const IMAGE_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg'];

function scanImages() {
    console.log('🔍 Scanning images in:', IMG_DIR);

    if (!fs.existsSync(IMG_DIR)) {
        console.log('📁 Creating assets/img directory...');
        fs.mkdirSync(IMG_DIR, { recursive: true });
        return [];
    }

    const files = fs.readdirSync(IMG_DIR);
    const images = [];

    files.forEach(file => {
        const ext = path.extname(file).toLowerCase();
        if (IMAGE_EXTENSIONS.includes(ext)) {
            const stats = fs.statSync(path.join(IMG_DIR, file));
            images.push({
                name: file,
                path: `assets/img/${file}`,
                size: stats.size,
                modified: stats.mtime
            });
        }
    });

    return images;
}

function generateJS(images) {
    const jsContent = `/**
 * Auto-generated image list
 * Generated: ${new Date().toISOString()}
 * Run 'node scripts/scan-images.js' to regenerate
 */

const IMAGES = ${JSON.stringify(images, null, 4)};

// Export for use
if (typeof module !== 'undefined') {
    module.exports = IMAGES;
}
`;

    fs.writeFileSync(OUTPUT_FILE, jsContent);
    console.log(`✅ Generated ${OUTPUT_FILE}`);
}

// Main
const images = scanImages();
console.log(`📸 Found ${images.length} images:`);
images.forEach(img => console.log(`   - ${img.name}`));

generateJS(images);
console.log('\n🎉 Done! Include js/images.js in your HTML.');
