# Component Instructions



All components MUST follow the 4-file architecture pattern and strict implementation instructions below.

## Component Architecture Pattern

### MANDATORY File Structure

```text
component-name/
├── ComponentName.tsx        # Main component implementation
├── ComponentNameStyles.ts   # Themed style functions
├── ComponentNameTypes.ts    # TypeScript interfaces and types
└── index.ts                 # Barrel export
```

Example:

```text
custom-button/
├── CustomButton.tsx
├── CustomButtonStyles.ts
├── CustomButtonTypes.ts
└── index.ts
```

### File Naming Conventions

- **PascalCase**: Component files (`Button.tsx`, `ButtonStyles.ts`). File name and exported component name must match.
- **Interfaces**: Match component name (`ButtonProps`, `ButtonDefaultProps`)
- **Style function**: always named `styleSheet`
- **Barrel export**: always named `index.ts`

## Component Implementation (`ComponentName.tsx`)

### MANDATORY Component Structure

- Declare `const ComponentName: React.FC<ComponentNameProps>` — no anonymous function components
- Destructure props with defaults from `ComponentNameDefaultProps`
- Call `const { styles } = useTheme(styleSheet)` — see [Theme Instructions](theme.md)
- Every interactive element must have `accessibilityRole`, `accessibilityLabel`, and `testID`
- End of file: `export default ComponentName` then `ComponentName.displayName = 'ComponentName'`
- JSDoc comment required: describe purpose, features, and `@param props`
- Use `Strings.ModuleName.key` for all visible text — no hardcoded strings

```typescript
import React from 'react';
import { Pressable, Text } from 'react-native';
import { useTheme } from '../../hooks';
import { Strings } from '../../constants';
import styleSheet from './CustomButtonStyles';
import { CustomButtonDefaultProps } from './CustomButtonTypes';
import type { CustomButtonProps } from './CustomButtonTypes';

/**
 * The CustomButton component.
 * @param {CustomButtonProps} props - the props for the custom button component.
 * @returns {React.ReactElement} A React Element.
 */
const CustomButton: React.FC<CustomButtonProps> = (props) => {
  const {
    label = CustomButtonDefaultProps.label!,
    onPress,
    disabled = CustomButtonDefaultProps.disabled!,
    customStyle,
    testID = CustomButtonDefaultProps.testID!,
    accessibilityLabel,
  } = props;

  const { styles } = useTheme(styleSheet);

  return (
    <Pressable
      style={[styles.button, disabled && styles.disabled, customStyle]}
      onPress={onPress}
      disabled={disabled}
      testID={testID}
      accessible
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel ?? label}
      accessibilityState={{ disabled }}
    >
      <Text style={styles.label}>{label}</Text>
    </Pressable>
  );
};

export default CustomButton;
CustomButton.displayName = 'CustomButton';
```

## Types File (`ComponentNameTypes.ts`)

### MANDATORY Types File Structure

- Export `interface ComponentNameProps` — every prop documented with an inline JSDoc comment
- Always include: `customStyle?: StyleProp<ViewStyle>`, `testID?: string`, `accessibilityLabel?: string`
- Export `const ComponentNameDefaultProps: Partial<ComponentNameProps> = { testID: 'component-name' } as const`
- Additional variant/config types as union types (e.g. `type ButtonVariant = 'primary' | 'secondary'`)
- No `class` for data structures — interfaces only
- No `any` types

```typescript
import type { StyleProp, ViewStyle } from 'react-native';

export type CustomButtonVariant = 'primary' | 'secondary';

export interface CustomButtonProps {
  label: string;
  onPress?: () => void;
  disabled?: boolean;
  variant?: CustomButtonVariant;
  customStyle?: StyleProp<ViewStyle>;
  testID?: string;
  accessibilityLabel?: string;
}

export const CustomButtonDefaultProps: Partial<CustomButtonProps> = {
  disabled: false,
  variant: 'primary',
  testID: 'custom-button'
} as const;
```

## Styles File (`ComponentNameStyles.ts`)

### ApplicationStyles Concept

`ApplicationStyles` contains common, reusable styles (flex helpers, spacing, typography). Always spread it in every component's styleSheet.

### MANDATORY Styles File Structure

- Export `const styleSheet = (theme: ThemeMode, isDark?: boolean) => StyleSheet.create({ ...ApplicationStyles(theme), ... })`
- Always spread `ApplicationStyles(theme)` first — mandatory in every component
- All colors via `Colors[theme]?.colorName` — no hardcoded hex values
- All dimensions via `scale(value)` — no hardcoded pixel numbers
- Platform differences via `globalMetrics.isAndroid` / `globalMetrics.isIos` / `globalMetrics.isPad`
- Default export: `export default styleSheet`

```typescript
import { StyleSheet } from 'react-native';
import { ApplicationStyles, Colors, scale, globalMetrics, type ThemeMode } from '../../theme';

/**
 * Style function for CustomButton component
 *
 * @param theme Current theme mode
 * @param isDark Optional dark mode boolean
 * @returns StyleSheet object
 */
const styleSheet = (theme: ThemeMode, isDark?: boolean) =>
  StyleSheet.create({
    ...ApplicationStyles(theme), // MANDATORY: Inherit common styles
    button: {
      backgroundColor: Colors[theme]?.primary,
      borderRadius: scale(8),
      paddingVertical: scale(12),
      paddingHorizontal: scale(16),
      alignItems: 'center',
      elevation: globalMetrics.isAndroid ? scale(2) : 0
    },
    label: {
      color: Colors[theme]?.white,
      fontSize: scale(14)
    },
    disabled: {
      opacity: 0.5
    }
  });

export default styleSheet;
```

## Barrel Export (`index.ts`)

```typescript
export { default } from './CustomButton';
export type { CustomButtonProps } from './CustomButtonTypes';
```

## String Usage Requirements

- Check [Strings Instructions](strings.md)

## Accessibility Requirements

- `accessibilityRole` — required on every interactive element
- `accessibilityLabel` — meaningful, never omit it
- `accessibilityState` — required for elements with disabled/selected/checked states
- `accessibilityHint` — required for non-obvious interactions
- `testID` — required on every interactive and testable element

## Component Registration

Add to `app/components/index.ts`:

```typescript
export { default as CustomButton } from './custom-button';
export type { CustomButtonProps } from './custom-button';
```


