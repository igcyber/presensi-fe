# Panduan Development - Portal Admin

Panduan lengkap untuk development team dalam mengembangkan Portal Admin Kabupaten Kutai Kartanegara.

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm atau yarn
- Git

### Setup Project
```bash
# Clone repository
git clone <repository-url>
cd admin-portal

# Install dependencies
npm install

# Start development server
npm run dev
```

## 📁 Struktur Project

```
admin-portal/
├── src/
│   ├── assets/                 # Asset statis
│   │   ├── images/            # Gambar utama
│   │   ├── icon/              # Icon menu
│   │   ├── uploads/           # File upload
│   │   └── mini-img/          # Gambar mini
│   ├── composables/           # Logic yang dapat digunakan kembali
│   │   ├── usePortal.ts       # Portal logic
│   │   └── useFormatters.ts   # Formatting utilities
│   ├── lib/                   # Library dan utilities
│   │   ├── api/              # API configuration
│   │   ├── config/           # Configuration files
│   │   └── utils/            # Utility functions
│   ├── pages/                # Halaman aplikasi
│   │   ├── portal/           # Portal page
│   │   └── dashboard/        # Dashboard page
│   ├── router/               # Vue Router
│   ├── stores/               # State management
│   └── __tests__/            # Test files
├── public/                   # Public assets
├── dist/                     # Build output
└── docs/                     # Documentation
```

## 🛠️ Development Workflow

### 1. Feature Development
```bash
# Create feature branch
git checkout -b feature/nama-feature

# Make changes
# ...

# Run tests
npm run test:unit

# Build for testing
npm run build

# Commit changes
git add .
git commit -m "feat: add new feature"

# Push to remote
git push origin feature/nama-feature
```

### 2. Code Quality
```bash
# Lint code
npm run lint

# Fix linting issues
npm run lint:fix

# Type check
npm run type-check
```

### 3. Testing
```bash
# Run unit tests
npm run test:unit

# Run tests in watch mode
npm run test:unit -- --watch

# Run tests with coverage
npm run test:unit -- --coverage
```

## 🎯 Architecture Patterns

### 1. Composable Pattern
Gunakan composables untuk logic yang dapat digunakan kembali:

```typescript
// src/composables/usePortal.ts
export function usePortal() {
  const state = ref()
  const computed = computed(() => {})
  const methods = () => {}
  
  return {
    state,
    computed,
    methods
  }
}
```

### 2. Configuration Pattern
Pisahkan konfigurasi ke file terpisah:

```typescript
// src/lib/config/portal.ts
export const PORTAL_CONFIG = {
  name: 'Portal Name',
  settings: {}
}
```

### 3. Type Safety
Selalu gunakan TypeScript interfaces:

```typescript
interface MenuItem {
  id: number
  judul: string
  link: string
  icon: string
}
```

## 📝 Coding Standards

### 1. Naming Conventions
- **Files**: kebab-case (`use-portal.ts`)
- **Components**: PascalCase (`IndexPage.vue`)
- **Variables**: camelCase (`menuItems`)
- **Constants**: UPPER_SNAKE_CASE (`PORTAL_CONFIG`)
- **Interfaces**: PascalCase (`MenuItem`)

### 2. File Organization
```
component/
├── ComponentName.vue
├── ComponentName.spec.ts
└── ComponentName.types.ts
```

### 3. Import Order
```typescript
// 1. Vue imports
import { ref, computed } from 'vue'

// 2. Third-party libraries
import { useRouter } from 'vue-router'

// 3. Internal modules
import { usePortal } from '@/composables/usePortal'

// 4. Types
import type { MenuItem } from '@/types'
```

### 4. Component Structure
```vue
<template>
  <!-- Template content -->
</template>

<script setup lang="ts">
// Script content
</script>

<style scoped>
/* Styles */
</style>
```

## 🔧 Configuration

### Environment Variables
Buat file `.env` berdasarkan `.env.example`:

```env
VITE_APP_TITLE=Portal Admin
VITE_API_BASE_URL=http://localhost:8000/api
VITE_DEBUG_MODE=true
```

### Vite Configuration
File `vite.config.ts` sudah dikonfigurasi untuk:
- Vue 3 support
- TypeScript support
- Path aliases
- Asset handling

### TypeScript Configuration
File `tsconfig.json` sudah dikonfigurasi untuk:
- Strict mode
- Path mapping
- Modern JavaScript features

## 🧪 Testing Strategy

### 1. Unit Tests
- Test composables
- Test utility functions
- Test configuration

### 2. Component Tests
- Test component rendering
- Test user interactions
- Test props and events

### 3. Integration Tests
- Test API integration
- Test routing
- Test state management

### Test Examples
```typescript
import { describe, it, expect } from 'vitest'
import { usePortal } from '@/composables/usePortal'

describe('usePortal', () => {
  it('should return portal composable', () => {
    const portal = usePortal()
    expect(portal.menus).toBeDefined()
  })
})
```

## 🚀 Deployment

### 1. Build Production
```bash
npm run build
```

### 2. Preview Build
```bash
npm run preview
```

### 3. Deploy
Upload folder `dist/` ke web server.

## 📊 Performance Optimization

### 1. Code Splitting
- Gunakan dynamic imports
- Lazy load components
- Split vendor bundles

### 2. Asset Optimization
- Compress images
- Use WebP format
- Optimize video files

### 3. Caching
- Implement service workers
- Use browser caching
- Optimize bundle size

## 🔍 Debugging

### 1. Development Tools
- Vue DevTools
- Browser DevTools
- TypeScript error checking

### 2. Logging
```typescript
// Development logging
if (import.meta.env.DEV) {
  console.log('Debug info:', data)
}
```

### 3. Error Handling
```typescript
try {
  // Risky operation
} catch (error) {
  console.error('Error:', error)
  // Handle error gracefully
}
```

## 📚 Resources

### Documentation
- [Vue 3 Documentation](https://vuejs.org/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Vite Documentation](https://vitejs.dev/)

### Tools
- [Vue DevTools](https://devtools.vuejs.org/)
- [Vitest](https://vitest.dev/)
- [ESLint](https://eslint.org/)

## 🤝 Team Collaboration

### 1. Code Review
- Review semua pull requests
- Check code quality
- Verify tests pass

### 2. Documentation
- Update README.md
- Document new features
- Maintain API documentation

### 3. Communication
- Use clear commit messages
- Document breaking changes
- Share knowledge with team

## 📞 Support

Untuk pertanyaan atau dukungan:
- Check documentation
- Search existing issues
- Create new issue dengan detail lengkap
- Hubungi tim Diskominfo Kukar 