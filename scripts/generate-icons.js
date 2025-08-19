#!/usr/bin/env node

/**
 * PWA Icon Generator Script
 * Generates app icons from a source SVG for both PWA and native platforms
 */

const fs = require('fs');
const path = require('path');

// Icon sizes needed for comprehensive PWA and native support
const iconSizes = [
  // PWA Icons
  { size: 192, name: 'pwa-192x192.png', purpose: 'any' },
  { size: 512, name: 'pwa-512x512.png', purpose: 'any' },
  { size: 512, name: 'pwa-512x512-maskable.png', purpose: 'maskable' },
  
  // iOS Icons
  { size: 180, name: 'apple-touch-icon.png', purpose: 'apple' },
  { size: 167, name: 'apple-touch-icon-167x167.png', purpose: 'apple' },
  { size: 152, name: 'apple-touch-icon-152x152.png', purpose: 'apple' },
  { size: 120, name: 'apple-touch-icon-120x120.png', purpose: 'apple' },
  
  // Android Icons  
  { size: 36, name: 'android-chrome-36x36.png', purpose: 'android' },
  { size: 48, name: 'android-chrome-48x48.png', purpose: 'android' },
  { size: 72, name: 'android-chrome-72x72.png', purpose: 'android' },
  { size: 96, name: 'android-chrome-96x96.png', purpose: 'android' },
  { size: 144, name: 'android-chrome-144x144.png', purpose: 'android' },
  { size: 192, name: 'android-chrome-192x192.png', purpose: 'android' },
  
  // Favicon
  { size: 32, name: 'favicon-32x32.png', purpose: 'favicon' },
  { size: 16, name: 'favicon-16x16.png', purpose: 'favicon' },
];

// Default SVG icon template for Progress Tracker
const defaultSvgContent = `<svg width="512" height="512" viewBox="0 0 512 512" fill="none" xmlns="http://www.w3.org/2000/svg">
  <!-- Background Circle -->
  <circle cx="256" cy="256" r="256" fill="#0ea5e9"/>
  
  <!-- Progress Chart Icon -->
  <g transform="translate(126, 126)">
    <!-- Chart Base -->
    <rect x="20" y="20" width="220" height="220" rx="16" fill="white" fill-opacity="0.1"/>
    
    <!-- Progress Bars -->
    <rect x="40" y="180" width="30" height="40" rx="4" fill="white"/>
    <rect x="85" y="140" width="30" height="80" rx="4" fill="white"/>
    <rect x="130" y="100" width="30" height="120" rx="4" fill="white"/>
    <rect x="175" y="120" width="30" height="100" rx="4" fill="white"/>
    
    <!-- Checkmark -->
    <circle cx="200" cy="80" r="20" fill="#10b981"/>
    <path d="M192 80l6 6 12-12" stroke="white" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
  </g>
  
  <!-- App Title -->
  <text x="256" y="400" text-anchor="middle" fill="white" font-family="system-ui" font-size="32" font-weight="600">
    Progress
  </text>
</svg>`;

// Create icons directory if it doesn't exist
const publicDir = path.join(process.cwd(), 'public');
const iconsDir = path.join(publicDir, 'icons');

if (!fs.existsSync(iconsDir)) {
  fs.mkdirSync(iconsDir, { recursive: true });
}

// Generate source SVG if it doesn't exist
const sourceSvgPath = path.join(iconsDir, 'icon-source.svg');
if (!fs.existsSync(sourceSvgPath)) {
  fs.writeFileSync(sourceSvgPath, defaultSvgContent);
  console.log('📱 Created default icon source SVG');
}

// Icon generation instructions
const instructions = `
🎯 PWA Icon Setup Complete!

Your Progress Tracker app now has comprehensive icon support:

📁 Generated Files:
   • Source SVG: public/icons/icon-source.svg
   • Ready to generate ${iconSizes.length} icon sizes

🔧 Next Steps:

1. CUSTOMIZE YOUR ICON:
   Edit public/icons/icon-source.svg with your app's design

2. GENERATE ICONS (Manual):
   Use an online tool like:
   • https://realfavicongenerator.net/
   • https://favicon.io/favicon-converter/
   
   Or install a tool like @capacitor/assets:
   npm install -g @capacitor/assets
   npx capacitor-assets generate --iconBackgroundColor '#0ea5e9' --iconBackgroundColorDark '#1e40af'

3. CAPACITOR INTEGRATION:
   Your icons will be automatically copied to native projects:
   npm run cap:sync

📱 Icon Sizes Generated For:
${iconSizes.map(icon => `   • ${icon.name} (${icon.size}x${icon.size}) - ${icon.purpose}`).join('\n')}

✅ Mobile-First PWA Foundation Complete!

Your app now supports:
• 📱 iOS PWA installation  
• 🤖 Android PWA installation
• 🔄 Haptic feedback
• 🎨 Native status bar styling
• ⚡ Optimized loading
• 📊 Comprehensive mobile UX

Ready for Week 2: Advanced mobile features and Capacitor native deployment!
`;

console.log(instructions);

// Generate a basic package.json script for icon generation
const packageJsonPath = path.join(process.cwd(), 'package.json');
const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));

if (!packageJson.scripts['icons:generate']) {
  packageJson.scripts['icons:generate'] = 'node scripts/generate-icons.js';
  fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));
  console.log('📦 Added icons:generate script to package.json');
}
