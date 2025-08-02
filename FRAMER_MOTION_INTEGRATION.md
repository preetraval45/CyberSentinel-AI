# Framer Motion Integration

Complete animation system using Framer Motion for enhanced user experience across all pages.

## Installation

```bash
npm install framer-motion
```

## Animation Library (`/lib/animations.ts`)

### Page Transitions
```typescript
export const pageVariants: Variants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 }
}
```

### Movement Animations
- `slideUp`: Fade in from bottom
- `slideLeft`: Slide in from left
- `slideRight`: Slide in from right
- `scaleIn`: Scale and fade in

### Interaction Animations
- `cardHover`: Scale up and lift on hover
- `buttonHover`: Scale up on hover/tap
- `inputFocus`: Scale up on focus

### Loading Animations
- `loadingSpinner`: Continuous rotation
- `modalVariants`: Modal entrance/exit

## Components

### PageTransition (`/components/ui/PageTransition.tsx`)
Wraps pages with consistent enter/exit animations:
```tsx
<PageTransition>
  <YourPageContent />
</PageTransition>
```

### LoadingSpinner (`/components/ui/LoadingSpinner.tsx`)
Animated loading indicator with size variants:
```tsx
<LoadingSpinner size="sm" color="text-blue-500" />
```

## Page Implementations

### Login Page
- **Page Entry**: Slide up with stagger
- **Form Fields**: Sequential slide-in from left
- **3D Icon**: Hover scale and rotation
- **Button**: Loading spinner during submission
- **Error Messages**: Scale-in animation

### Register Page
- **Form Container**: Staggered children animation
- **Input Fields**: Focus scale animation
- **Security Shield**: Hover scale with rotation
- **Validation**: Animated error states

### Admin Dashboard
- **Header**: Slide down entrance
- **Cards**: Staggered grid animation
- **Hover Effects**: Card lift and scale
- **Role Badge**: Interactive hover scale

### Unauthorized Page
- **Error Icon**: Shake and pulse animation
- **Content**: Scale-in entrance
- **Buttons**: Hover and tap feedback

## Animation Patterns

### Staggered Animations
```tsx
<motion.div variants={staggerContainer}>
  {items.map((item, i) => (
    <motion.div key={i} variants={slideUp}>
      {item}
    </motion.div>
  ))}
</motion.div>
```

### Form Interactions
```tsx
<motion.input
  {...inputFocus}
  whileFocus={{ scale: 1.02 }}
  transition={{ type: 'spring', stiffness: 300 }}
/>
```

### Loading States
```tsx
{isLoading ? (
  <LoadingSpinner size="sm" color="text-white" />
) : (
  <Icon className="w-4 h-4" />
)}
```

### Hover Effects
```tsx
<motion.div
  {...cardHover}
  whileHover={{ scale: 1.02, y: -5 }}
  whileTap={{ scale: 0.98 }}
>
  Card Content
</motion.div>
```

## Performance Optimizations

### Spring Animations
```typescript
transition={{ type: 'spring', stiffness: 300 }}
```

### Reduced Motion Support
```typescript
transition={{ 
  duration: 0.3,
  ease: 'easeInOut'
}}
```

### GPU Acceleration
- Transform properties (scale, rotate, translate)
- Opacity changes
- Avoid layout-triggering properties

## Timing & Easing

### Standard Durations
- **Fast**: 0.2s (micro-interactions)
- **Medium**: 0.3-0.5s (page transitions)
- **Slow**: 0.6s+ (complex animations)

### Easing Functions
- `easeOut`: Natural deceleration
- `easeInOut`: Smooth start and end
- `spring`: Bouncy, organic feel

### Stagger Delays
- **Sequential**: 0.1s between items
- **Grid**: 0.05s for dense layouts
- **Forms**: 0.1-0.2s for readability

## Accessibility

### Reduced Motion
Respects user's motion preferences automatically through Framer Motion's built-in support.

### Focus Management
Animations don't interfere with keyboard navigation or screen readers.

### Performance
Animations are optimized for 60fps and use GPU acceleration where possible.

## Best Practices

1. **Consistent Timing**: Use standardized durations
2. **Meaningful Motion**: Animations should enhance UX
3. **Performance First**: Avoid expensive animations
4. **Accessibility**: Respect motion preferences
5. **Progressive Enhancement**: Graceful degradation without animations