/**
 * QR Code Generator Script
 * Run with Node.js to generate a QR code for the AR experience
 * 
 * Usage: node generate-qr.js [URL]
 * 
 * Prerequisites:
 * npm install qrcode
 */

const QRCode = require('qrcode');
const fs = require('fs');
const path = require('path');

// Default URL - update this with your deployed URL
const DEFAULT_URL = 'https://your-username.github.io/ar-fruits/';

// Get URL from command line or use default
const targetUrl = process.argv[2] || DEFAULT_URL;

// Output paths
const outputDir = path.join(__dirname, '..', 'assets');
const outputPath = path.join(outputDir, 'qr-code.png');

// QR Code options
const options = {
    type: 'png',
    width: 512,
    margin: 2,
    color: {
        dark: '#1a1a2e',  // Dark purple (matches theme)
        light: '#ffffff'  // White background
    },
    errorCorrectionLevel: 'H'  // High error correction for better scanning
};

// Ensure output directory exists
if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
}

// Generate QR Code
console.log('🔲 Generating QR Code...');
console.log(`📍 Target URL: ${targetUrl}`);

QRCode.toFile(outputPath, targetUrl, options)
    .then(() => {
        console.log(`✅ QR Code saved to: ${outputPath}`);
        console.log('\n📱 Scan this QR code with your phone to open the AR experience!');
    })
    .catch(err => {
        console.error('❌ Error generating QR code:', err);
    });

// Also generate a data URL for inline use
QRCode.toDataURL(targetUrl, options)
    .then(dataUrl => {
        // Save the data URL to a text file for easy copy-paste
        const dataUrlPath = path.join(outputDir, 'qr-code-dataurl.txt');
        fs.writeFileSync(dataUrlPath, dataUrl);
        console.log(`📄 Data URL saved to: ${dataUrlPath}`);
    })
    .catch(err => {
        console.error('❌ Error generating data URL:', err);
    });
