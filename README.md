# 🍎 AR Fruits Experience

A WebAR experience that places random 3D fruit models in your real environment. Built with Google's Model Viewer for maximum compatibility across iOS and Android devices.

![AR Fruits Demo](assets/qr-code.png)

## Features

- **WebAR Support**: No app installation required - works directly in Safari (iOS) and Chrome (Android)
- **Random Fruit Selection**: Each session randomly selects one of 10 different fruits
- **AR Placement**: Tap to place the fruit on detected surfaces
- **Gesture Controls**: Pinch to scale, drag to rotate
- **Realistic Shadows**: Ground shadow for immersive AR feel
- **Fallback Mode**: 3D viewer with orbit controls for non-AR devices
- **Beautiful UI**: Modern dark theme with glassmorphism effects

## 📁 Project Structure

```
ar/
├── index.html              # Main AR experience page
├── css/
│   └── styles.css          # All styles
├── js/
│   ├── app.js              # Main application logic
│   ├── fruits.js           # Fruit data configuration
│   └── generate-qr.js      # QR code generator script
├── assets/
│   ├── models/             # 3D fruit models (.glb)
│   │   ├── apple.glb
│   │   ├── banana.glb
│   │   ├── orange.glb
│   │   ├── strawberry.glb
│   │   ├── pineapple.glb
│   │   ├── watermelon.glb
│   │   ├── grapes.glb
│   │   ├── pear.glb
│   │   ├── kiwi.glb
│   │   └── mango.glb
│   └── qr-code.png         # Scan Me QR code
└── README.md               # This file
```

## 🚀 Deployment

### Option 1: GitHub Pages (Free & Easy)

1. **Create a GitHub repository**:
   ```bash
   git init
   git add .
   git commit -m "Initial commit - AR Fruits Experience"
   git branch -M main
   git remote add origin https://github.com/YOUR-USERNAME/ar-fruits.git
   git push -u origin main
   ```

2. **Enable GitHub Pages**:
   - Go to your repo's Settings → Pages
   - Source: Deploy from branch
   - Branch: `main` / `root`
   - Click Save

3. **Your URL will be**: `https://YOUR-USERNAME.github.io/ar-fruits/`

### Option 2: Netlify (Drag & Drop)

1. Go to [netlify.com](https://netlify.com)
2. Sign up/Login
3. Drag the entire `ar/` folder onto the deploy area
4. Done! You'll get a URL like `https://random-name.netlify.app`

### Option 3: Vercel

1. Install Vercel CLI:
   ```bash
   npm install -g vercel
   ```

2. Deploy:
   ```bash
   cd ar
   vercel
   ```

3. Follow the prompts to get your deployment URL

## 📱 Generate QR Code

After deploying, generate a QR code pointing to your URL:

```bash
# Install dependencies
npm install qrcode

# Generate QR code (replace with your actual URL)
node js/generate-qr.js https://your-username.github.io/ar-fruits/
```

The QR code will be saved to `assets/qr-code.png`.

## 🍌 Adding 3D Fruit Models

### Option 1: Download Free Models

Get free fruit models from these sources:
- [Sketchfab](https://sketchfab.com/search?q=fruit&type=models&features=downloadable) (Filter: Free + Downloadable)
- [Poly Pizza](https://poly.pizza) (Search for fruits)
- [Google Poly Archive](https://github.com/nicfv/polygen) (Archived but still accessible)
- [TurboSquid Free Section](https://www.turbosquid.com/Search/3D-Models/free/fruit)

**Requirements for each model:**
- Format: `.glb` or `.gltf` (GLB preferred for single file)
- Size: Under 5MB for fast mobile loading
- Style: Low-poly or stylized works best

### Option 2: Create Your Own

Use Blender to create simple fruit models:

1. Open Blender
2. Create a sphere and shape it into a fruit
3. Add materials/colors
4. Export as `.glb` (File → Export → glTF 2.0, select GLB format)

### Replacing Placeholder Models

1. Download or create your .glb models
2. Name them: `apple.glb`, `banana.glb`, etc.
3. Place them in `assets/models/`
4. Refresh the page!

## ✅ Testing Checklist

### Android (Chrome)
- [ ] Open the URL in Chrome
- [ ] Page loads with random fruit
- [ ] "View in AR" button is visible
- [ ] Tapping AR button launches Scene Viewer
- [ ] Surface detection works (move phone around)
- [ ] Tap to place fruit on surface
- [ ] Pinch gesture scales the fruit
- [ ] Drag gesture rotates the fruit
- [ ] Shadow appears under fruit
- [ ] Exit AR returns to page

### iOS (Safari)
- [ ] Open the URL in Safari
- [ ] Page loads with random fruit
- [ ] "View in AR" button is visible
- [ ] Tapping AR button launches Quick Look
- [ ] AR mode activates with camera
- [ ] Tap to place fruit on surface
- [ ] Gesture controls work
- [ ] Shadow/grounding visible
- [ ] Exit AR returns to page

### Desktop (Any Browser)
- [ ] Page loads correctly
- [ ] 3D viewer with orbit controls works
- [ ] Fallback message appears (for non-AR)
- [ ] "Try Another Fruit" button works

## 🔧 Troubleshooting

### AR Button Doesn't Appear
- Ensure you're on HTTPS (required for AR)
- Check if your device supports AR:
  - iOS 12+ with ARKit (iPhone 6s+)
  - Android with ARCore support

### Models Don't Load
- Check browser console for errors
- Verify .glb files are valid (try opening in [gltf-viewer.donmccurdy.com](https://gltf-viewer.donmccurdy.com))
- Ensure file paths are correct

### AR Session Fails
- Grant camera permissions when prompted
- Ensure adequate lighting
- Point at a flat surface (floor, table)

## 🎨 Customization

### Change Fruits
Edit `js/fruits.js` to add, remove, or modify fruits:

```javascript
{
    id: 'cherry',
    name: 'Cherry',
    emoji: '🍒',
    description: 'Sweet little bundles of joy',
    model: 'assets/models/cherry.glb',
    color: '#ff0000'
}
```

### Change Theme
Edit CSS variables in `css/styles.css`:

```css
:root {
    --primary-gradient: linear-gradient(135deg, #your-color 0%, #your-other-color 100%);
    --bg-primary: #your-background;
    /* etc. */
}
```

## 📄 License

This project is MIT licensed. Free to use for personal and commercial projects.

## 🙏 Credits

- **Model Viewer**: [Google's Model Viewer](https://modelviewer.dev)
- **WebXR**: [WebXR Device API](https://www.w3.org/TR/webxr/)
- **Fonts**: [Inter by Rasmus Andersson](https://rsms.me/inter/)

---

Made with ❤️ for AR enthusiasts!
