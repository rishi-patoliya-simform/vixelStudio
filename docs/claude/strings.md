# Strings Instructions

All user-facing text MUST use the centralized string system. No hardcoded strings in components.

## String Architecture

### Centralized String System

```typescript
// constants/Strings.ts - MANDATORY structure
import I18n from '../translations/i18n';

const freezeStringsObject = <T extends Record<string, string>>(obj: T): Readonly<T> => {
  return Object.freeze(obj);
};

// Module-based organization
const Home = freezeStringsObject({
  homeScreenTitle: I18n.t('home:title'),
  welcomeMessage: I18n.t('home:welcome'),
  details: I18n.t('home:details')
});

const Auth = freezeStringsObject({
  hintEmail: I18n.t('auth:hintEmail'),
  btnSignIn: I18n.t('auth:btnSignIn'),
  forgotPassword: I18n.t('auth:forgotPassword')
});

export const Strings = {
  Home,
  Auth,
  // ... other modules
} as const;
```

### Translation File Structure

```json
// translations/en.json - MANDATORY structure
{
  "home": {
    "title": "Home Screen",
    "welcome": "Welcome to vixelStudio",
    "details": "View Details"
  },
  "auth": {
    "hintEmail": "Email Address",
    "btnSignIn": "Sign In",
    "forgotPassword": "Forgot Password?"
  },
  "apiError": {
    "networkError": "Network connection failed",
    "serverError": "Server error occurred"
  },
  "yupError": {
    "required": "This field is required",
    "emailInvalid": "Please enter a valid email"
  }
}
```

## String Organization Rules

### MANDATORY Module Grouping

Organize strings by **cohesive feature module**. Before creating a new module, check if the screen/feature belongs to an existing module — do NOT blindly create a new object for each screen. Group related screens together (e.g., `ForgotPassword` and `SignUp` belong in `Auth`, not separate modules). Every new screen or feature should extend an existing module first.

### Naming Conventions

#### String Key Patterns

| Prefix | Usage | Example |
| ------ | ----- | ------- |
| `btn` | Button labels | `btnSignIn`, `btnSave` |
| `hint` | Input placeholders / hints | `hintEmail`, `hintPassword` |
| `label` | Form field labels | `labelEmail`, `labelPassword` |
| `title` / module key | Screen or section titles | `homeScreenTitle`, `title` |
| `msg` / `success` | User-facing status messages | `msgWelcome`, `successSaved` |
| `err` / `validation` | Error and validation messages | `errNetworkFailed`, `validationRequired` |

## String Usage Rules

### ✅ CORRECT String Usage

```typescript
import { Strings } from '../../constants';

// REQUIRED: Use centralized strings
const MyComponent = () => {
  return (
    <View>
      <Text>{Strings.Auth.signInTitle}</Text>
      <Button title={Strings.Auth.btnSignIn} />
      <TextInput placeholder={Strings.Auth.hintEmail} />
    </View>
  );
};

// REQUIRED: Dynamic string usage
const DynamicComponent = ({ userName }: { userName: string }) => {
  return (
    <Text>
      {I18n.t('home:welcomeUser', { name: userName })}
    </Text>
  );
};
```

### ❌ FORBIDDEN String Practices

```typescript
// ❌ NEVER use hardcoded strings
const BadComponent = () => {
  return (
    <View>
      <Text>Sign In</Text>                    // ❌ FORBIDDEN
      <Button title="Submit" />               // ❌ FORBIDDEN
      <TextInput placeholder="Enter email" /> // ❌ FORBIDDEN
    </View>
  );
};

// ❌ NEVER define strings inline
const styles = StyleSheet.create({
  // Even in comments, prefer descriptive names over hardcoded text
});
```

## Internationalization (i18n) Integration

### MANDATORY i18n Setup

```typescript
// translations/i18n.ts - REQUIRED configuration
import I18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import { getLocales } from 'react-native-localize';
import { Storage } from '../services';
import { MMKVKeys } from '../constants';

// Translation resources
import en from './en.json';
import es from './es.json'; // Additional languages as needed

const resources = {
  en: { translation: en },
  es: { translation: es }
};

// MANDATORY: Device locale detection
const deviceLanguage = getLocales()[0]?.languageCode || 'en';
const savedLanguage = Storage.getString(MMKVKeys.appLanguage) || deviceLanguage;

I18n.use(initReactI18next).init({
  resources,
  lng: savedLanguage,
  fallbackLng: 'en',

  interpolation: {
    escapeValue: false // React already escapes values
  },

  // Namespace support for module organization
  defaultNS: 'translation',
  ns: ['translation']
});

export default I18n;
```

### Language Switching

```typescript
// REQUIRED: Language switching — update i18n and persist preference
const changeLanguage = async (languageCode: string) => {
  await I18n.changeLanguage(languageCode);
  Storage.setString(MMKVKeys.appLanguage, languageCode);
};
```

## Dynamic String Handling

### Parameterized Strings

```typescript
// Translation file with parameters
{
  "welcome": "Welcome back, {{name}}!",
  "itemsCount": "You have {{count}} items",
  "lastSeen": "Last seen {{time}} ago"
}

// REQUIRED: Usage with parameters
const WelcomeMessage = ({ userName }: { userName: string }) => {
  return (
    <Text>
      {I18n.t('welcome', { name: userName })}
    </Text>
  );
};

const ItemCounter = ({ count }: { count: number }) => {
  return (
    <Text>
      {I18n.t('itemsCount', { count })}
    </Text>
  );
};
```

### Pluralization Support

```typescript
// Translation with pluralization
{
  "items": {
    "zero": "No items",
    "one": "One item",
    "other": "{{count}} items"
  }
}

// REQUIRED: Pluralization usage
const ItemsList = ({ count }: { count: number }) => {
  return (
    <Text>
      {I18n.t('items', { count })}
    </Text>
  );
};
```

## String Storage & Performance

### MMKV Integration

```typescript
// Language preference storage
const LANGUAGE_KEY = MMKVKeys.appLanguage;

// Save language preference
const saveLanguagePreference = (languageCode: string) => {
  Storage.setString(LANGUAGE_KEY, languageCode);
};

// Load language preference
const loadLanguagePreference = (): string => {
  return Storage.getString(LANGUAGE_KEY) || 'en';
};
```

### Performance Optimization

```typescript
// REQUIRED: Lazy loading for large string sets
const getLargeStringSet = () => {
  return freezeStringsObject({
    // Large set of strings loaded on demand
  });
};
```

## Accessibility & String Instructions

### Screen Reader Support

```typescript
// REQUIRED: Separate accessibility strings per module using the same pattern
const Accessibility = freezeStringsObject({
  labelSignInButton: I18n.t('a11y:label.signInButton'),
  hintDoubleTap: I18n.t('a11y:hint.doubleTap'),
});

// Usage
<Button
  title={Strings.Auth.btnSignIn}
  accessibilityLabel={Strings.Accessibility.labelSignInButton}
  accessibilityHint={Strings.Accessibility.hintDoubleTap}
/>
```