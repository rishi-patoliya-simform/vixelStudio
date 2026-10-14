# Assets Instructions

Keep assets centralized under `app/assets/`, follow existing export patterns, and prefer SVG for icons and simple graphics.

## Current Asset Architecture

```text
app/assets/
├── svgs/      # Preferred for icons/illustrations (named exports)
├── icons/     # PNG icon set with @1x/@2x/@3x (default object export)
├── images/    # PNG/JPG image set with @1x/@2x/@3x (default object export)
├── fonts/
└── index.ts   # Main barrel export
```

## Format Policy

| Asset type | Preferred format | Notes |
| --- | --- | --- |
| Icons, simple vectors | SVG | Primary choice for quality + bundle size |
| UI raster assets | PNG | Must provide `@2x` and `@3x` variants |
| Photos/complex images | JPG or PNG | Use JPG when acceptable for size savings |

## Export Patterns (Required)

### SVGs (`assets/svgs/index.ts`)

SVGs are imported as React components via **`react-native-svg-transformer`**. Each SVG file becomes a fully typed React component.

```typescript
export { default as company } from './company.svg';
export { default as verified } from './verified.svg';
```

SVG components automatically support these props:

```typescript
interface SVGComponentProps {
  width?: number | string;
  height?: number | string;
  fill?: string;
  stroke?: string;
  accessibilityLabel?: string;
  accessibilityRole?: string;
  testID?: string;
}
```

Dynamic SVG selection (conditional icon rendering):

```typescript
import { Svgs } from '../../assets';

const IconComponent = status === 'verified' ? Svgs.verified : Svgs.company;

<IconComponent
  width={scale(24)}
  height={scale(24)}
  accessibilityLabel="Status icon"
  accessibilityRole="image"
/>
```

### PNG icons/images (`assets/icons/index.ts`, `assets/images/index.ts`)

```typescript
export default {
  backArrow: require('./backArrow.png'),
  profile: require('./profile.png')
};
```

Multi-resolution files are **required** for every PNG icon/image:

```
backArrow.png      # @1x base resolution
backArrow@2x.png   # @2x high DPI
backArrow@3x.png   # @3x extra high DPI
```

React Native automatically selects the correct resolution at runtime — only export the base file (`backArrow.png`).

### Main barrel (`assets/index.ts`)

```typescript
export { default as Fonts } from './fonts';
export { default as Icons } from './icons';
export { default as Images } from './images';
import * as SvgsImport from './svgs';
export const Svgs = SvgsImport;
```

## Adding New Assets

### Add a new SVG

1. Add file to `assets/svgs/` using kebab-case (`new-icon.svg`).
2. Export in `assets/svgs/index.ts` as camelCase (`newIcon`).
3. Use through `Svgs` barrel import.

```typescript
import { Svgs } from '../../assets';

<Svgs.newIcon width={scale(24)} height={scale(24)} accessibilityLabel="New icon" accessibilityRole="image" />;
```

### Add a new PNG icon/image

1. Add `newIcon.png`, `newIcon@2x.png`, `newIcon@3x.png`.
2. Export only the base file (`newIcon.png`) in matching `index.ts` — React Native auto-selects @2x/@3x at runtime.
3. Consume through `Icons`/`Images` barrel import.

```typescript
import { Icons } from '../../assets';

<Image source={Icons.newIcon} style={styles.icon} accessibilityRole="image" accessibilityLabel="New icon" />;
```

## Theme Integration (Required)

SVGs support dynamic fill/stroke via theme colors. PNG icons use `tintColor`.

```typescript
import { Svgs, Icons } from '../../assets';
import { useTheme } from '../../hooks';
import { Colors, scale } from '../../theme';

const ThemedAssets = () => {
  const { styles, theme } = useTheme(styleSheet);

  return (
    <>
      {/* SVG with theme fill and stroke */}
      <Svgs.verified
        width={scale(20)}
        height={scale(20)}
        fill={Colors[theme]?.primary}
        stroke={Colors[theme]?.gray}
        accessibilityLabel="Verified"
        accessibilityRole="image"
      />
      {/* PNG with tintColor */}
      <Image
        source={Icons.backArrow}
        style={[styles.icon, { tintColor: Colors[theme]?.primary }]}
        accessibilityRole="image"
        accessibilityLabel="Back arrow"
      />
    </>
  );
};
```

## Accessibility (Required)

Every asset rendered to the screen must include:

```typescript
// SVG
<Svgs.verified
  width={scale(24)}
  height={scale(24)}
  accessibilityLabel="Verified status"
  accessibilityRole="image"
/>

// PNG
<Image
  source={Icons.backArrow}
  style={styles.icon}
  accessibilityRole="image"
  accessibilityLabel="Back arrow"
/>
```

## Performance

For long lists with many images, consider `react-native-fast-image` for disk/memory caching:

```typescript
import FastImage from 'react-native-fast-image';

<FastImage
  source={Images.profile}
  style={styles.image}
  resizeMode={FastImage.resizeMode.cover}
/>
```

## Naming Rules

- SVG files: kebab-case (`verified-star.svg`).
- PNG file bases: camelCase (`backArrow.png`, `backArrow@2x.png`).
- Export keys: camelCase.

## Forbidden Patterns

- ❌ Importing directly from asset subfolders (e.g., `../../assets/svgs/verified.svg`) instead of going through the barrel export.
- ❌ Inline `require('../assets/...')` in components when asset is already exported.
- ❌ Missing `@2x/@3x` variants for shipped PNG assets.
- ❌ Hardcoded tint/fill values that bypass theme colors.
- ❌ Omitting `accessibilityLabel` and `accessibilityRole` on rendered assets.
