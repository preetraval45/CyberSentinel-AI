# Dark Theme UI Refactor

Complete frontend UI refactor with dark theme, glassmorphism effects, and consistent styling using Tailwind CSS.

## Design System

### Color Palette
- **Background**: `bg-gray-900` (primary dark)
- **Cards**: `bg-gray-800/30` with backdrop blur (glassmorphism)
- **Text**: `text-gray-100` (primary), `text-gray-300` (secondary), `text-gray-400` (muted)
- **Borders**: `border-gray-700/50` with neon accents
- **Accents**: Blue (`text-blue-400`), Purple (`text-purple-400`), Green (`text-green-400`)

### Component Classes

#### Glass Cards
```css
.glass-card {
  @apply bg-gray-800/30 backdrop-blur-md border border-gray-700/50 rounded-xl;
}
```

#### Form Inputs
```css
.glass-input {
  @apply bg-gray-800/50 backdrop-blur-sm border border-gray-600/50 rounded-lg px-4 py-3 text-gray-100 placeholder-gray-400 focus:border-blue-500/70 focus:ring-2 focus:ring-blue-500/20 focus:outline-none transition-all duration-200;
}
```

#### Buttons
```css
.neon-button {
  @apply bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-lg font-semibold transition-all duration-300 hover:from-blue-500 hover:to-purple-500 hover:shadow-lg hover:shadow-blue-500/25 focus:outline-none focus:ring-2 focus:ring-blue-500/50 active:scale-95;
}
```

#### Dark Cards
```css
.dark-card {
  @apply bg-gray-800/40 backdrop-blur-lg border border-gray-700/30 rounded-xl p-6 hover:bg-gray-800/50 transition-all duration-300;
}
```

## Updated Components

### Authentication Pages
- **Login**: Glass card with blue accent, animated shield icon
- **Register**: Glass card with purple accent, form validation styling
- **Unauthorized**: Centered glass card with error styling

### Role-Based Pages
- **Admin**: SuperAdmin panel with blue/green/purple accent cards
- **User Panel**: User dashboard with blue/green accent cards  
- **Limited Access**: Basic dashboard with yellow accent

### Form Elements
- **Inputs**: Glassmorphism background with focus states
- **Buttons**: Gradient backgrounds with hover effects and shadows
- **Labels**: Consistent spacing and icon integration
- **Error States**: Red accent with background highlighting

## Accessibility Features

### Focus States
- Ring outlines on interactive elements
- Color contrast ratios meet WCAG standards
- Keyboard navigation support

### Hover Effects
- Smooth transitions (200-300ms)
- Scale transforms on buttons
- Color shifts on interactive elements
- Shadow effects for depth

### Visual Hierarchy
- Consistent text sizing and spacing
- Proper heading structure
- Color coding for different content types
- Clear visual separation between sections

## Animation & Effects

### Transitions
- `transition-all duration-300` for smooth interactions
- `hover:scale-95` for button press feedback
- Color transitions on hover states

### Glassmorphism
- `backdrop-blur-md` for glass effect
- Semi-transparent backgrounds
- Subtle border styling

### Grid Background
- Animated grid pattern overlay
- Low opacity for subtle texture
- Responsive to different screen sizes

## Implementation Notes

- All components use consistent spacing (multiples of 4)
- Border radius standardized to `rounded-lg` and `rounded-xl`
- Color opacity levels consistent across components
- Responsive design maintained across all breakpoints