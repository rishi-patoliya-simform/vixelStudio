# Theme Instructions

All styling MUST use the theme system. No hardcoded colors, dimensions, or styles.

## Theme Architecture

### Core Theme Integration

```typescript
import { useTheme } from '../../hooks';
import { Colors, scale, globalMetrics } from '../../theme';

// MANDATORY: Every component must use useTheme
const { styles, theme, isDark, changeTheme } = useTheme(styleSheet);
```

### Theme Mode Support

- **Modes**: `light`, `dark`, `system`
- **Storage**: Theme preferences persist via `MMKVKeys.themeMode`
- **Detection**: Automatic system theme detection when mode is 'system'

## Color Usage Rules

### ✅ CORRECT Color Usage

```typescript
// MANDATORY: Access colors through theme
backgroundColor: Colors[theme]?.white,     // Adaptive colors
color: Colors[theme]?.black,              // Swaps in dark mode
borderColor: Colors[theme]?.primary,      // Static themed colors
textColor: Colors[theme]?.error,          // Semantic colors
```

### ❌ FORBIDDEN Color Usage

```typescript
// NEVER use hardcoded colors
backgroundColor: '#FFFFFF',  // ❌ FORBIDDEN
color: '#000000',           // ❌ FORBIDDEN
borderColor: '#E53E3E',     // ❌ FORBIDDEN
```

### Color Categories

#### Adaptive Colors (swap between themes)

- `Colors[theme]?.white` - White in light, Black in dark
- `Colors[theme]?.black` - Black in light, White in dark
- `Colors[theme]?.transparentWhite` - Transparent white/black
- `Colors[theme]?.transparentBlack` - Transparent black/white

#### Static Theme Colors (consistent across themes)

- `Colors[theme]?.primary` - #141414
- `Colors[theme]?.secondary` - #F1C336
- `Colors[theme]?.gray` - #7B7B7B
- `Colors[theme]?.error` - #E53E3E
- `Colors[theme]?.pink` - #BA25EB
- `Colors[theme]?.orange` - #F39C3C
- `Colors[theme]?.lightBlue` - #3787FC
- `Colors[theme]?.red` - #DD2C2C
- `Colors[theme]?.darkBlue` - #374dfc

## Dimension & Scaling Rules

### ✅ CORRECT Dimension Usage

```typescript
// MANDATORY: Use scale() for ALL numeric values
fontSize: scale(14),              // Responsive font size
padding: scale(16),               // Responsive padding
margin: scale(8),                 // Responsive margin
borderRadius: scale(12),          // Responsive border radius
height: scale(50),                // Responsive height
width: scale(200),                // Responsive width
```

### ❌ FORBIDDEN Dimension Usage

```typescript
// NEVER use hardcoded dimensions
fontSize: 14,        // ❌ FORBIDDEN
padding: 16,         // ❌ FORBIDDEN
height: 50,          // ❌ FORBIDDEN
```

### Platform-Specific Scaling

```typescript
// MANDATORY: Handle platform differences
borderRadius: globalMetrics.isAndroid ? scale(8) : scale(12),
marginTop: globalMetrics.isAndroid ? scale(35) : scale(40),
paddingHorizontal: globalMetrics.isPad ? scale(50) : scale(20),
```

### Global Metrics Usage

```typescript
import { globalMetrics } from '../../theme';

// Platform detection
globalMetrics.isAndroid; // boolean
globalMetrics.isIos; // boolean
globalMetrics.isPad; // boolean
globalMetrics.isTablet; // boolean
globalMetrics.isTV; // boolean
globalMetrics.isWeb; // boolean
```

### Screen Dimensions

```typescript
import { width, height } from '../../theme/Metrics';

// Use for responsive layouts
width: width - scale(40),           // Full width minus padding
minHeight: height * 0.8,            // 80% of screen height
maxWidth: globalMetrics.isTablet ? width * 0.6 : width * 0.9,
```

## Style Function Pattern

### MANDATORY Style Function Structure

```typescript
/**
 * Style function for specific component/screen
 *
 * @param theme Current theme mode
 * @param isDark Optional dark mode boolean
 * @returns StyleSheet object
 */
const styleSheet = (theme: ThemeMode, isDark?: boolean) =>
  StyleSheet.create({
    ...ApplicationStyles(theme), // MANDATORY: Inherit common styles
    container: {
      backgroundColor: Colors[theme]?.white, // Theme colors
      padding: scale(16), // Scaled dimensions
      borderRadius: scale(12) // Scaled border radius
    },
    text: {
      color: Colors[theme]?.black, // Adaptive color
      fontSize: scale(14), // Scaled font size
      fontWeight: '600' // Static font weight
    },
    // Platform-specific styles
    platformSpecific: {
      height: globalMetrics.isAndroid ? scale(50) : scale(40),
      borderRadius: globalMetrics.isAndroid ? scale(8) : scale(12)
    }
  });
```

## Component Theme Integration

### MANDATORY useTheme Hook Usage

```typescript
const MyComponent = (props: MyComponentProps) => {
  // MANDATORY: Use useTheme hook
  const { styles, theme, isDark, changeTheme } = useTheme(styleSheet);

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Content</Text>
    </View>
  );
};
```

### Theme Context Access

```typescript
// Access theme properties
const { styles, theme, isDark, changeTheme } = useTheme(styleSheet);

// theme: 'light' | 'dark' | 'system'
// isDark: boolean - true if current effective theme is dark
// changeTheme: (newTheme: ThemeMode) => void
// styles: Generated styles object from styleSheet function
```

## ApplicationStyles Concept

### What is ApplicationStyles?

`ApplicationStyles` contains reusable styles common across components (flex utilities, base spacing, typography).

### Why It's Needed

- **Reusability** - Avoid redefining flex helpers, padding standards, or typography rules
- **Consistency** - Ensures components follow the same design patterns
- **Maintainability** - Update common styles in one place

### MANDATORY: Always Spread ApplicationStyles

**Always spread `ApplicationStyles(theme)`** in every component's styleSheet, regardless of whether you use its utilities:

```typescript
/**
 * Style function for specific component/screen
 *
 * @param theme Current theme mode
 * @returns StyleSheet object
 */
const styleSheet = (theme: ThemeMode) =>
  StyleSheet.create({
    ...ApplicationStyles(theme), // MANDATORY: Always spread
    customButton: {
      backgroundColor: Colors[theme]?.primary
    }
  });
```

## Theme System Requirements

### File Structure

- `theme/Colors.ts` - All color definitions
- `theme/Metrics.ts` - Dimension utilities and scaling
- `theme/ApplicationStyles.ts` - Common reusable styles
- `hooks/useTheme.ts` - Theme integration hook

### Storage Integration

- Theme preference stored in MMKV with key `MMKVKeys.themeMode`
- Automatic persistence across app sessions
- System theme detection when set to 'system' mode
