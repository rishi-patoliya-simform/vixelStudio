# Color Instructions

Colors must come from `theme/Colors.ts` and be consumed as `Colors[theme]?.key`. No hardcoded hex values in components. If a needed color doesn't exist, define it in `theme/Colors.ts` first.

## Color Architecture

```typescript
export type ThemeMode = 'light' | 'dark' | 'system';

export interface ThemeColors {
  white: string;
  black: string;
  primary: string;
  secondary: string;
  // ... project-specific keys
}

export const Colors: Record<ThemeMode, ThemeColors> = {
  light: lightTheme,
  dark: darkTheme,
  system: systemTheme
};
```

## Adaptive vs Static Colors

| Category | Behavior | Typical keys |
| --- | --- | --- |
| Adaptive | Swap by theme | `white`, `black`, transparent variants |
| Static | Same in light/dark | `primary`, `secondary`, `error`, accents |

Light/dark swap examples:

| Key | Light | Dark |
| --- | --- | --- |
| `white` | `#FFFFFF` | `#000000` |
| `black` | `#000000` | `#FFFFFF` |
| `transparentWhite` | `#FFFFFF00` | `#00000000` |
| `transparentBlack` | `#00000000` | `#FFFFFF00` |

## Swap in Practice

### How adaptive colors work in theme/Colors.ts

```typescript
// Define common adaptive colors
const commonColors: Record<CommonKeys, string> = {
  white: '#FFFFFF',
  black: '#000000'
};

// Light theme: colors unchanged
const light: ThemeColors = {
  ...themeColors, // Static colors
  white: commonColors.white,    // #FFFFFF
  black: commonColors.black     // #000000
};

// Dark theme: adaptive colors SWAP
const dark: ThemeColors = {
  ...themeColors, // Static colors
  white: commonColors.black,    // #000000 ← Swapped!
  black: commonColors.white     // #FFFFFF ← Swapped!
};
```

### Component code automatically adapts

```typescript
// Same code works in both themes
const styleSheet = (theme: ThemeMode) => StyleSheet.create({
  container: {
    backgroundColor: Colors[theme]?.white  // Light: #FFF, Dark: #000
  },
  text: {
    color: Colors[theme]?.black            // Light: #000, Dark: #FFF
  }
});
```

## Usage Rules (Required)

```typescript
const styleSheet = (theme: ThemeMode) =>
  StyleSheet.create({
    container: {
      backgroundColor: Colors[theme]?.white,
      borderColor: Colors[theme]?.gray
    },
    title: {
      color: Colors[theme]?.black
    },
    errorText: {
      color: Colors[theme]?.error
    }
  });
```

### Semantic intent

- Status: `success`, `warning`, `error`, `info`.
- Content hierarchy: `primary`, `secondary`, `inverse`.
- Interaction: `focus`, `disabled`, `border`.

## Accessibility Requirements

- Meet WCAG AA contrast targets for text and critical UI.
- Do not rely on color alone for meaning (add icon/text/state cue).
- Validate major screens in both light and dark themes.

## Forbidden Patterns

```typescript
// ❌ FORBIDDEN: hardcoded color values in components
const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF'
  }
});
```

- ❌ Inline style color literals.
- ❌ Fallback color chains that bypass theme (`Colors[theme]?.x || '#fff'`).
- ❌ Defining new component-local palette objects.
