# Static Data Instructions

All static data MUST be centrally managed. No inline static arrays, objects, or hardcoded data structures in components.

## Static Data Architecture

### Static Data Organization Rules

#### 1. **MANDATORY Data Categories**

```typescript
// REQUIRED: Import necessary types and constants
import { JobTypes, NotificationSettings, ValidationError } from '../types';
import { Strings } from '../constants';
import { ROUTES } from '../navigation';
import { Svgs } from '../assets';

// REQUIRED: Organize static data by functional categories

// ✅ Form Options Data
export const jobTypes: JobTypes = [
  { id: 1, title: 'Full-time', isSelected: false },
  { id: 2, title: 'Part-time', isSelected: false },
  { id: 3, title: 'Contract', isSelected: false }
];

// ✅ Navigation Configuration Data
export const tabConfig = [
  { id: 1, title: Strings.Workplaces.myWorkplaces, isSelected: true },
  { id: 2, title: Strings.Workplaces.jobs, isSelected: false },
  { id: 3, title: Strings.Workplaces.myApplications, isSelected: false }
];

// ✅ Geographic Data
export const provincesList = [
  { id: 'AB', name: 'Alberta', country: 1 },
  { id: 'BC', name: 'British Columbia', country: 1 }
  // ... more provinces/states
];

// ✅ Mock/Development Data (clearly marked)
export const dummyJobList = [
  {
    id: 1,
    title: 'Radiology Specialist',
    address: '456 Pine Street, Vancouver, BC, V6B 1A1',
    datePosted: '2025-01-28T15:30:00.906Z',
    designation: 'PSW',
    jobType: 'Full-time'
  }
  // ... more dummy data
];
```

## Data Structure Rules

### MANDATORY Immutability Patterns

```typescript
// REQUIRED: Import necessary constants
import { Strings } from '../constants';

// REQUIRED: Use 'as const' for immutable arrays and objects
export const weekDays = [
  Strings.WeekDays.sunday,
  Strings.WeekDays.monday,
  Strings.WeekDays.tuesday,
  Strings.WeekDays.wednesday,
  Strings.WeekDays.thursday,
  Strings.WeekDays.friday,
  Strings.WeekDays.saturday
];
```

## Static Data Categories

### 1. **Form Configuration Data**

```typescript
// REQUIRED: Centralize all form-related static data
export const formConfigs = {
  // Dropdown options
  jobClassifications: [
    { id: 1, name: 'Personal Support Worker', isSelected: false },
    { id: 2, name: 'Registered Practical Nurse', isSelected: false },
    { id: 3, name: 'Janitor', isSelected: false }
  ],

  // Validation rules
  passwordRules: {
    minLength: 8,
    requireUppercase: true,
    requireNumbers: true,
    requireSpecialChars: true
  },

  // File upload constraints
  fileUploadLimits: {
    maxSize: 5 * 1024 * 1024, // 5MB
    allowedTypes: ['application/pdf', 'image/jpeg', 'image/png'],
    maxFiles: 5
  }
};
```

### 2. **Navigation & Menu Data**

```typescript
// REQUIRED: Import necessary components and constants
import React from 'react';
import { Strings } from '../constants';
import { Svgs } from '../assets';
import { ROUTES } from '../navigation';

// REQUIRED: Centralize navigation-related data
export const navigationData = {
  // Account menu items
  accountMenuItems: [
    {
      id: 1,
      title: Strings.Account.profile,
      route: ROUTES.Profile,
      icon: <Svgs.verified />
    },
    {
      id: 2,
      title: Strings.Account.payment,
      route: ROUTES.Settings,
      icon: <Svgs.company />
    }
    // ... more menu items
  ],

  // Tab navigation
  bottomTabs: [
    {
      name: 'Dashboard',
      component: 'DashboardScreen',
      icon: 'dashboard',
      label: Strings.Navigation.dashboard
    }
    // ... more tabs
  ]
};
```

### 3. **Configuration & Settings Data**

```typescript
// REQUIRED: Centralize app configuration
export const appSettings = {
  // Feature flags
  features: {
    darkModeEnabled: true,
    biometricLoginEnabled: true,
    pushNotificationsEnabled: true,
    offlineModeEnabled: false
  },

  // Timing configurations
  timeouts: {
    apiRequest: 30000,
    authentication: 900000, // 15 minutes
    sessionRefresh: 3600000 // 1 hour
  },

  // UI configurations
  ui: {
    animationDuration: 300,
    maxRetryAttempts: 3,
    defaultPageSize: 20,
    maxImageSize: 2 * 1024 * 1024 // 2MB
  }
};
```

### 4. **Business Logic Configuration**

```typescript
// REQUIRED: Centralize business rules and constants
export const businessRules = {
  // Shift management rules
  shifts: {
    maxAdvanceBooking: 30, // days
    minCancellationNotice: 24, // hours
    maxDailyHours: 12,
    overtimeThreshold: 8
  },

  // Payment rules
  payments: {
    biweeklyPayoutDay: 'Friday',
    minimumPayout: 50, // CAD
    processingDays: 3,
    currency: 'CAD'
  },

};
```
