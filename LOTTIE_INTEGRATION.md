# Lottie Animation Integration

Integrated Lottie animations for enhanced user feedback using `@lottiefiles/react-lottie-player`.

## Installation

```bash
npm install @lottiefiles/react-lottie-player
```

## Components

### LottieAnimation (`/components/animations/LottieAnimation.tsx`)
Base wrapper component for Lottie animations with Framer Motion integration:
```tsx
<LottieAnimation
  src="animation-url"
  size="lg"
  loop={false}
  show={true}
  onComplete={() => console.log('Animation complete')}
/>
```

### FeedbackAnimation (`/components/animations/FeedbackAnimation.tsx`)
Predefined feedback animations with consistent styling:
```tsx
<FeedbackAnimation
  type="success"
  show={true}
  size="xl"
  message="Operation completed!"
  onComplete={handleComplete}
/>
```

### AnimationModal (`/components/animations/AnimationModal.tsx`)
Modal wrapper for displaying feedback animations:
```tsx
<AnimationModal
  isOpen={showModal}
  onClose={handleClose}
  type="success"
  title="Success!"
  message="Operation completed successfully"
  autoClose={true}
  duration={2000}
/>
```

## Animation Types

### Success Animation
- **Trigger**: Login success, registration complete, operation success
- **Style**: Green checkmark with celebration effect
- **Duration**: 2-3 seconds

### Error Animation
- **Trigger**: Login failure, validation errors, 404 pages
- **Style**: Red X or warning symbol with shake effect
- **Duration**: 2-3 seconds

### Unlock Animation
- **Trigger**: Module access granted, feature unlocked
- **Style**: Golden key or lock opening animation
- **Duration**: 2-3 seconds

### Complete Animation
- **Trigger**: Simulation finished, training completed
- **Style**: Progress completion with confetti
- **Duration**: 3-4 seconds

### Loading Animation
- **Trigger**: Data fetching, processing operations
- **Style**: Spinning loader or progress indicator
- **Duration**: Continuous loop

## Implementation Examples

### Login Success
```tsx
const [showSuccessModal, setShowSuccessModal] = useState(false)

const handleLogin = async () => {
  const success = await login(email, password)
  if (success) {
    setShowSuccessModal(true)
    setTimeout(() => router.push('/dashboard'), 2000)
  }
}

<AnimationModal
  isOpen={showSuccessModal}
  type="success"
  title="Login Successful!"
  message="Welcome back to CyberSentinel AI"
/>
```

### Module Unlock
```tsx
const { animation, triggerUnlock, hideAnimation } = useAnimationTrigger()

const handleCardClick = (module: string) => {
  triggerUnlock('Module Unlocked!', `${module} is now available`)
}

<AnimationModal
  isOpen={animation.show}
  type={animation.type}
  title={animation.title}
  message={animation.message}
/>
```

### 404 Error Page
```tsx
<FeedbackAnimation
  type="error"
  show={true}
  size="xl"
  message="Page Not Found"
/>
```

## Custom Hook

### useAnimationTrigger (`/hooks/useAnimationTrigger.ts`)
Manages animation state and provides trigger functions:
```tsx
const { 
  animation, 
  triggerSuccess, 
  triggerError, 
  triggerUnlock, 
  triggerComplete, 
  hideAnimation 
} = useAnimationTrigger()

// Trigger animations
triggerSuccess('Success!', 'Operation completed')
triggerError('Error!', 'Something went wrong')
triggerUnlock('Unlocked!', 'New feature available')
triggerComplete('Complete!', 'Task finished')
```

## Animation URLs

Lottie animations are hosted on LottieFiles:
```typescript
const ANIMATIONS = {
  success: 'https://lottie.host/success-animation.json',
  error: 'https://lottie.host/error-animation.json',
  unlock: 'https://lottie.host/unlock-animation.json',
  complete: 'https://lottie.host/complete-animation.json',
  loading: 'https://lottie.host/loading-animation.json'
}
```

## State-Based Triggers

### Component State Changes
- Form submission success/failure
- Data loading states
- User interaction feedback
- Navigation confirmations

### User Actions
- Button clicks
- Form submissions
- Module access attempts
- Feature interactions

### System Events
- Authentication status changes
- Data fetch completion
- Error conditions
- Success confirmations

## Performance Considerations

### Lazy Loading
Animations load only when needed to reduce initial bundle size.

### Auto-cleanup
Animations automatically hide after completion to prevent memory leaks.

### Optimized Rendering
Uses AnimatePresence for smooth enter/exit transitions.

### Responsive Sizing
Animations scale appropriately across different screen sizes.

## Accessibility

### Reduced Motion
Respects user's motion preferences through CSS media queries.

### Screen Readers
Includes appropriate ARIA labels and announcements.

### Keyboard Navigation
Modal animations don't interfere with keyboard focus management.

## Pages Updated

- **Login**: Success animation on successful authentication
- **Register**: Success animation on account creation
- **Admin**: Unlock animations for module access
- **404**: Error animation for page not found
- **Unauthorized**: Error feedback for access denied

The Lottie integration provides consistent, engaging feedback that enhances the user experience while maintaining performance and accessibility standards.