# 🎮 Battle64 - Premium Retro Gaming Platform

A cutting-edge retro gaming platform with advanced animations and 90s nostalgia, built with Next.js, Framer Motion, and modern web technologies.

## ✨ Features

### 🎯 Animation System
- **Start Animation**: N64 cartridge drop with CRT scanlines
- **Navigation**: Smooth slide transitions with retro effects
- **Interactive Elements**: Joypad-style buttons with bounce effects
- **Level Up**: Explosive celebration animations
- **Upload Progress**: Rotating cartridge loader
- **Live Events**: Scrolling ticker with Mario Party style
- **Fanart Gallery**: Parallax backgrounds with floating stars

### 🎨 Visual Effects
- CRT scanlines and flicker effects
- Pixel-perfect borders and retro fonts
- Glowing text effects with custom shadows
- Parallax star backgrounds
- Explosion animations with particle effects
- Joypad button styling with 3D effects

### ♿ Accessibility
- Respects `prefers-reduced-motion` user preference
- All animations can be disabled in settings
- High contrast color scheme
- Keyboard navigation support

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd battle64
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Run the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🛠️ Tech Stack

- **Framework**: Next.js 14 with App Router
- **Animations**: Framer Motion
- **Styling**: Tailwind CSS with custom animations
- **Icons**: React Icons (FontAwesome, Game Icons)
- **TypeScript**: Full type safety
- **Fonts**: Press Start 2P, VT323 (Google Fonts)

## 🎮 Animation Components

### Start Animation
```tsx
// Cartridge drop with flash effect
<motion.div
  initial={{ y: '-100vh', rotate: 0, opacity: 0 }}
  animate={{ y: 0, rotate: 360, opacity: 1 }}
  transition={{ duration: 2, ease: 'easeInOut' }}
>
  <GiCartridge className="text-8xl text-n64-purple" />
</motion.div>
```

### Level Up Animation
```tsx
<LevelUpAnimation 
  isVisible={showLevelUp}
  level={level}
  onComplete={() => setShowLevelUp(false)}
/>
```

### Retro Button
```tsx
<RetroButton 
  variant="primary"
  size="lg"
  onClick={handleClick}
  icon={<FaGamepad />}
>
  Start Game
</RetroButton>
```

## 🎨 Custom CSS Classes

### Animation Classes
- `.crt-scanlines` - CRT scanline overlay
- `.crt-flicker` - Subtle screen flicker
- `.retro-glow` - Glowing text effect
- `.joypad-button` - 3D button styling
- `.pixel-star` - Star-shaped clip-path
- `.level-up-explosion` - Explosion gradient
- `.ticker-tape` - Scrolling highlight effect
- `.parallax-bg` - Animated star background

### Color Classes
- `.text-n64-purple` - N64 purple (#5D3FD3)
- `.text-n64-blue` - N64 blue (#4A90E2)
- `.text-n64-green` - N64 green (#7ED321)
- `.text-n64-red` - N64 red (#D0021B)
- `.text-n64-yellow` - N64 yellow (#F5A623)
- `.text-crt-green` - CRT green (#00FF41)

## 🔧 Configuration

### Animation Settings
The app includes a comprehensive animation system that respects user preferences:

```tsx
const { settings, updateSettings, shouldAnimate } = useAnimation()

// Check if animations should run
if (shouldAnimate) {
  // Run animations
}
```

### Tailwind Configuration
Custom animations and colors are defined in `tailwind.config.js`:

```js
animation: {
  'crt-scan': 'scan 0.1s linear infinite',
  'pixel-bounce': 'pixelBounce 0.6s ease-out',
  'cartridge-drop': 'cartridgeDrop 2s ease-in-out',
  // ... more animations
}
```

## 📱 Responsive Design

The app is fully responsive with:
- Mobile-first design approach
- Touch-friendly button sizes
- Optimized animations for different screen sizes
- Adaptive layout for tablets and desktops

## 🎯 Performance

- Lazy loading of animation components
- Optimized bundle size with tree shaking
- Efficient re-renders with React.memo
- CSS animations for better performance
- Reduced motion support for accessibility

## 🔮 Future Enhancements

- [ ] Sound effects integration
- [ ] More particle effects
- [ ] Advanced Lottie animations
- [ ] Multiplayer animations
- [ ] Achievement system animations
- [ ] Custom animation presets

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Nintendo 64 for the retro gaming inspiration
- Framer Motion team for the amazing animation library
- React Icons for the comprehensive icon set
- Tailwind CSS for the utility-first styling approach

---

**Battle64** - Where retro meets modern, and every interaction feels magical! 🎮✨