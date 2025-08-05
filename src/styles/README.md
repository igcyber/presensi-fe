# Styling Architecture - Portal Admin

Dokumentasi untuk struktur styling yang terorganisir dan mengikuti best practices.

## 📁 Struktur File

```
src/styles/
├── variables.css          # CSS Variables global
├── base.css              # Base styles dan reset
├── components/
│   └── portal.css        # Component-specific styles
└── README.md             # Dokumentasi ini
```

## 🎨 CSS Variables

### Color Palette

```css
--color-primary: #00a85f; /* Hijau utama */
--color-primary-dark: #00884d; /* Hijau gelap */
--color-secondary: rgba(13, 52, 85, 0.8); /* Biru transparan */
--color-secondary-dark: #0d3455; /* Biru gelap */
--color-accent: #e8ce53; /* Kuning aksen */
--color-white: #ffffff; /* Putih */
--color-black: #000000; /* Hitam */
--color-gray-light: rgb(224, 224, 224); /* Abu-abu terang */
--color-gray: #89939e; /* Abu-abu */
```

### Typography

```css
--font-family-primary: "Roboto", sans-serif;
--font-size-xs: 13px;
--font-size-sm: 18px;
--font-size-base: 20px;
--font-size-lg: 30px;
--font-weight-normal: 400;
--font-weight-medium: 500;
--font-weight-bold: 700;
```

### Spacing

```css
--spacing-xs: 5px;
--spacing-sm: 10px;
--spacing-md: 20px;
--spacing-lg: 30px;
--spacing-xl: 40px;
--spacing-2xl: 50px;
--spacing-3xl: 60px;
```

### Layout

```css
--container-max-width: 1200px;
--header-height: 120px;
--footer-height: 70px;
--menu-item-width: 100px;
--menu-item-height: 90px;
--menu-icon-size: 40px;
```

## 🏗️ Architecture Principles

### 1. CSS Variables First

- Semua nilai menggunakan CSS variables
- Mudah untuk theming dan customization
- Konsistensi di seluruh aplikasi

### 2. Component-Based Styling

- Setiap komponen memiliki file CSS terpisah
- Naming convention yang konsisten
- Scoped styles untuk komponen spesifik

### 3. Responsive Design

- Mobile-first approach
- Breakpoints yang terstandarisasi
- Flexible layouts

### 4. Performance Optimization

- Minimal CSS dalam komponen
- Global styles untuk reusability
- Efficient selectors

## 📱 Responsive Breakpoints

```css
--breakpoint-mobile: 450px;
--breakpoint-tablet: 700px;
--breakpoint-desktop: 1000px;
```

### Usage

```css
@media only screen and (max-width: 1000px) {
  /* Tablet styles */
}

@media only screen and (max-width: 700px) {
  /* Mobile styles */
}

@media only screen and (max-width: 450px) {
  /* Small mobile styles */
}
```

## 🎯 Naming Convention

### BEM Methodology

```css
.portal-container {
} /* Block */
.portal-container__header {
} /* Element */
.portal-container--active {
} /* Modifier */
```

### Component Prefix

- `portal-` untuk komponen portal
- `btn-` untuk buttons
- `card-` untuk cards
- `modal-` untuk modals

## 🚀 Best Practices

### 1. CSS Variables

```css
/* ✅ Good */
.button {
  background-color: var(--color-primary);
  padding: var(--spacing-md);
  border-radius: var(--radius-sm);
}

/* ❌ Bad */
.button {
  background-color: #00a85f;
  padding: 20px;
  border-radius: 10px;
}
```

### 2. Responsive Design

```css
/* ✅ Good - Mobile First */
.portal-menu-item {
  width: 100%;
}

@media (min-width: 700px) {
  .portal-menu-item {
    width: var(--menu-item-width);
  }
}
```

### 3. Performance

```css
/* ✅ Good - Specific selectors */
.portal-menu-item:hover {
  transform: translateY(-2px);
}

/* ❌ Bad - Generic selectors */
*:hover {
  transform: translateY(-2px);
}
```

### 4. Maintainability

```css
/* ✅ Good - Organized structure */
.portal-container {
  /* Layout */
  position: absolute;
  display: flex;

  /* Sizing */
  width: 100%;
  height: 100%;

  /* Spacing */
  padding: var(--spacing-md);

  /* Colors */
  background-color: var(--bg-primary);

  /* Effects */
  box-shadow: var(--shadow-sm);
}
```

## 🎨 Theming Support

### Dark Theme

```css
[data-theme="dark"] {
  --color-primary: #00a85f;
  --bg-primary: rgba(0, 0, 0, 0.8);
}
```

### Light Theme

```css
[data-theme="light"] {
  --color-primary: #00a85f;
  --bg-primary: rgba(255, 255, 255, 0.9);
}
```

## 📝 Usage Examples

### Adding New Component

1. Buat file CSS di `src/styles/components/`
2. Import di `src/main.ts`
3. Gunakan CSS variables
4. Follow naming convention

```css
/* src/styles/components/new-component.css */
.new-component {
  background-color: var(--color-primary);
  padding: var(--spacing-md);
  border-radius: var(--radius-sm);
}

.new-component__title {
  font-size: var(--font-size-lg);
  color: var(--color-white);
}
```

### Modifying Existing Styles

1. Update CSS variables jika perlu
2. Gunakan existing classes
3. Extend dengan modifier classes

```css
.portal-button--large {
  padding: var(--spacing-lg);
  font-size: var(--font-size-base);
}
```

## 🔧 Tools & Utilities

### CSS Reset

- Normalize browser differences
- Consistent base styles
- Box-sizing: border-box

### Utility Classes

```css
.text-center {
  text-align: center;
}
.flex {
  display: flex;
}
.items-center {
  align-items: center;
}
.w-full {
  width: 100%;
}
```

### Animations

```css
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes slideUp {
  from {
    transform: translateY(100%);
  }
  to {
    transform: translateY(0);
  }
}
```

## 📊 Performance Tips

1. **Minimize CSS in Components**
   - Gunakan global styles untuk common patterns
   - Scoped styles hanya untuk component-specific

2. **Efficient Selectors**
   - Avoid deep nesting
   - Use specific class names
   - Minimize universal selectors

3. **CSS Variables**
   - Reduce repetition
   - Easy theming
   - Better maintainability

4. **Responsive Images**
   - Use appropriate sizes
   - Optimize for different screens
   - Consider lazy loading

## 🧪 Testing

### Visual Testing

- Test di berbagai browser
- Test responsive breakpoints
- Test accessibility

### CSS Validation

```bash
# Validate CSS
npm run lint:css

# Check for unused CSS
npm run analyze:css
```

## 📚 Resources

- [CSS Variables Guide](https://developer.mozilla.org/en-US/docs/Web/CSS/Using_CSS_custom_properties)
- [BEM Methodology](http://getbem.com/)
- [CSS Architecture](https://css-tricks.com/css-architecture/)
- [Responsive Design](https://web.dev/learn/design/responsive/)
