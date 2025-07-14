# 🎮 Battle64 Design System - Usage Guide

## 🚀 Quick Start

### 1. Include the CSS
```html
<link rel="stylesheet" href="design-system/css/battle64.css">
```

### 2. Add Fonts (Optional - already included via Google Fonts)
The design system automatically loads the required fonts:
- **Press Start 2P** (Pixel font for headings and retro elements)
- **Inter** (Modern font for body text)

### 3. Start Building
Use the provided CSS classes and components to build your Battle64 application.

## 🎨 Color Usage

### Primary Colors
```css
/* Use semantic color variables */
background-color: var(--color-primary);      /* Retro Violet */
background-color: var(--color-secondary);    /* Pixel Orange */
background-color: var(--color-accent);       /* Module Blue */
```

### Utility Classes
```html
<div class="bg-primary">Primary Background</div>
<div class="bg-secondary">Secondary Background</div>
<div class="bg-accent">Accent Background</div>
<div class="bg-success">Success Background</div>
<div class="bg-warning">Warning Background</div>
<div class="bg-error">Error Background</div>
```

### Text Colors
```html
<p class="text-primary">Primary Text</p>
<p class="text-secondary">Secondary Text</p>
<p class="text-success">Success Text</p>
<p class="text-warning">Warning Text</p>
<p class="text-error">Error Text</p>
<p class="text-muted">Muted Text</p>
```

## 📝 Typography

### Headings
```html
<h1 class="text-game-title">Game Title</h1>
<h2 class="h2">Heading 2</h2>
<h3 class="h3">Heading 3</h3>
<h4 class="h4">Heading 4</h4>
```

### Text Styles
```html
<p class="text-body">Regular body text</p>
<p class="text-body-small">Smaller body text</p>
<p class="text-caption">Caption text</p>
<p class="text-score">Score: 1,234,567</p>
<p class="text-timer">00:12:34</p>
```

### Special Effects
```html
<p class="text-glow-primary">Glowing Primary Text</p>
<p class="text-glow-orange">Glowing Orange Text</p>
<p class="text-glow-green">Glowing Green Text</p>
<p class="text-retro">Retro Style Text</p>
<p class="text-pixel">Pixel Font Text</p>
```

## 🎯 Buttons

### Button Variants
```html
<button class="btn btn-primary retro-click">Primary Button</button>
<button class="btn btn-secondary retro-click">Secondary Button</button>
<button class="btn btn-outline retro-click">Outline Button</button>
<button class="btn btn-ghost retro-click">Ghost Button</button>
```

### Button Sizes
```html
<button class="btn btn-primary btn-sm retro-click">Small</button>
<button class="btn btn-primary retro-click">Default</button>
<button class="btn btn-primary btn-lg retro-click">Large</button>
```

### Special Buttons
```html
<button class="btn btn-retro retro-click">Retro Button</button>
<button class="btn btn-primary btn-pulse retro-click">Pulsing Button</button>
<button class="btn btn-primary sparkle retro-click">Sparkle Button</button>
```

## 🧱 Cards

### Profile Card
```html
<div class="profile-card">
    <img src="avatar.jpg" alt="Avatar" class="profile-avatar">
    <h3 class="h3">Player Name</h3>
    <p class="text-body-small">Speedrunner & Collector</p>
    <div class="profile-stats">
        <div class="stat-item">
            <span class="stat-value">156</span>
            <span class="stat-label">Games</span>
        </div>
        <div class="stat-item">
            <span class="stat-value">23</span>
            <span class="stat-label">Records</span>
        </div>
        <div class="stat-item">
            <span class="stat-value">89</span>
            <span class="stat-label">Hours</span>
        </div>
    </div>
</div>
```

### Event Card
```html
<div class="event-card">
    <div class="event-header">
        <div class="event-icon">🏆</div>
        <h4 class="event-title">Speedrun Tournament</h4>
    </div>
    <p class="text-body-small">Join the ultimate N64 speedrunning challenge!</p>
    <div class="event-meta">
        <div class="event-meta-item">
            <span>📅</span>
            <span>Dec 15, 2024</span>
        </div>
        <div class="event-meta-item">
            <span>⏰</span>
            <span>2:00 PM</span>
        </div>
    </div>
</div>
```

### Gallery Tile
```html
<div class="gallery-tile">
    <img src="game-screenshot.jpg" alt="Game Screenshot" class="gallery-image">
    <div class="gallery-content">
        <h5 class="gallery-title">Super Mario 64</h5>
        <p class="gallery-description">Classic 3D platformer that defined a generation</p>
    </div>
</div>
```

## 📝 Form Elements

### Input Fields
```html
<input type="text" class="input" placeholder="Regular input">
<input type="text" class="input input-retro" placeholder="Retro input">
<input type="text" class="input error" placeholder="Error input">
```

### Badges
```html
<span class="badge badge-primary">Primary</span>
<span class="badge badge-secondary">Secondary</span>
<span class="badge badge-success">Success</span>
<span class="badge badge-warning">Warning</span>
<span class="badge badge-error">Error</span>
<span class="badge badge-retro">Retro</span>
```

## 🚨 Alerts
```html
<div class="alert alert-success">
    <strong>Success!</strong> Your record has been saved.
</div>
<div class="alert alert-warning">
    <strong>Warning!</strong> Your session will expire soon.
</div>
<div class="alert alert-error">
    <strong>Error!</strong> Failed to load game data.
</div>
<div class="alert alert-info">
    <strong>Info!</strong> New tournament starting soon.
</div>
```

## 📑 Tabs

### Regular Tabs
```html
<div class="tab-container">
    <ul class="tab-list">
        <li class="tab-item">
            <button class="tab-button active">Games</button>
        </li>
        <li class="tab-item">
            <button class="tab-button">Records</button>
        </li>
        <li class="tab-item">
            <button class="tab-button">Profile</button>
        </li>
    </ul>
    <div class="tab-content">
        <p class="text-body">Tab content goes here...</p>
    </div>
</div>
```

### Retro Tabs
```html
<div class="tab-container tab-retro">
    <ul class="tab-list">
        <li class="tab-item">
            <button class="tab-button active">Games</button>
        </li>
        <li class="tab-item">
            <button class="tab-button">Records</button>
        </li>
        <li class="tab-item">
            <button class="tab-button">Profile</button>
        </li>
    </ul>
    <div class="tab-content">
        <p class="text-body">Retro tab content...</p>
    </div>
</div>
```

## 🎭 Animations

### Animation Classes
```html
<div class="fade-in">Fade In Animation</div>
<div class="slide-in-up">Slide In Up Animation</div>
<div class="scale-in">Scale In Animation</div>
<div class="rotate-in">Rotate In Animation</div>
```

### Hover Effects
```html
<button class="btn btn-primary hover-shimmer">Hover Shimmer</button>
<button class="btn btn-secondary hover-shake">Hover Shake</button>
```

### Special Effects
```html
<div class="star-rain">
    <p>Star Rain Effect</p>
</div>
<p class="glitch" data-text="GLITCH TEXT">GLITCH TEXT</p>
<div class="loading-cartridge"></div>
```

## 📐 Layout Utilities

### Flexbox
```html
<div class="flex items-center justify-between">
    <span>Left Content</span>
    <span>Right Content</span>
</div>
```

### Grid
```html
<div class="grid grid-cols-1 md-grid-cols-2 lg-grid-cols-3 gap-4">
    <div>Grid Item 1</div>
    <div>Grid Item 2</div>
    <div>Grid Item 3</div>
</div>
```

### Spacing
```html
<div class="p-4">Padding 4</div>
<div class="m-3">Margin 3</div>
<div class="px-2 py-3">Horizontal padding 2, vertical padding 3</div>
```

## 📱 Responsive Design

### Breakpoints
- **sm**: 640px and up
- **md**: 768px and up
- **lg**: 1024px and up
- **xl**: 1280px and up

### Responsive Classes
```html
<div class="grid grid-cols-1 md-grid-cols-2 lg-grid-cols-3">
    <!-- Responsive grid -->
</div>
<div class="hidden md-block">
    <!-- Hidden on mobile, visible on medium screens and up -->
</div>
```

## 🎮 Game-Specific Features

### Loading States
```html
<div class="loading-cartridge"></div>
<div class="loading" style="position: relative; width: 100px; height: 100px;"></div>
```

### Success Animations
```html
<div class="success-bounce">Success Animation</div>
```

### Error Effects
```html
<div class="error-flash">Error Flash Effect</div>
```

## 🎨 Customization

### CSS Variables
You can customize the design system by overriding CSS variables:

```css
:root {
    --color-primary: #your-custom-color;
    --spacing-lg: 2rem;
    --radius-lg: 16px;
}
```

### Component Customization
```css
/* Custom button style */
.btn-custom {
    background: linear-gradient(45deg, var(--color-primary), var(--color-accent));
    border: 2px solid var(--color-secondary);
    box-shadow: var(--shadow-glow);
}
```

## 🎯 Best Practices

### 1. Mobile First
Always design for mobile first, then enhance for larger screens.

### 2. Accessibility
- Use semantic HTML elements
- Provide proper contrast ratios
- Include alt text for images
- Use the `sr-only` class for screen reader content

### 3. Performance
- Use the `pixel-perfect` class for pixel art images
- Minimize animation usage on mobile devices
- Use `prefers-reduced-motion` media query for accessibility

### 4. Consistency
- Stick to the defined color palette
- Use consistent spacing with the spacing system
- Follow the typography hierarchy

### 5. Retro Aesthetic
- Use pixel fonts sparingly for maximum impact
- Apply retro effects consistently
- Maintain the nostalgic N64 feel

## 🔧 JavaScript Integration

### Tab Functionality
```javascript
document.querySelectorAll('.tab-button').forEach(button => {
    button.addEventListener('click', () => {
        const tabContainer = button.closest('.tab-container');
        tabContainer.querySelectorAll('.tab-button').forEach(btn => {
            btn.classList.remove('active');
        });
        button.classList.add('active');
    });
});
```

### Animation Triggers
```javascript
// Add animation class
element.classList.add('fade-in');

// Remove animation class after completion
setTimeout(() => {
    element.classList.remove('fade-in');
}, 500);
```

### Loading States
```javascript
// Show loading state
button.classList.add('loading');

// Hide loading state
button.classList.remove('loading');
```

## 📚 Examples

See the `examples/components.html` file for a complete showcase of all components and their usage.

## 🎮 Next Steps

1. **Explore the Components**: Check out the component showcase
2. **Customize Colors**: Adjust the color palette to match your brand
3. **Add Custom Components**: Extend the system with your own components
4. **Test Responsiveness**: Ensure your implementation works on all devices
5. **Optimize Performance**: Monitor and optimize for the best user experience

---

**🎮 Happy coding with Battle64 Design System!**