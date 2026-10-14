# Performance Instructions

All components and modules MUST follow these performance best practices.

## React Performance Optimization

### MANDATORY Component Optimization

- **`React.memo`**: Use for pure components that re-render frequently or receive stable props, especially list items and shared presentational components
- **`useCallback`**: Use for callbacks passed to memoized children, list items, or hook dependencies where stable identity matters
- **`useMemo`**: Memoize expensive derived values that perform loops, filtering, mapping, or object creation on frequently changing inputs
- **`renderItem`**: Prefer `useCallback(({ item }) => <Item ... />, [deps])` for `FlatList` and `SectionList` render functions
- **`keyExtractor`**: Prefer a stable function and avoid inline lambdas in performance-sensitive lists

### MANDATORY List Performance

Recommended `FlatList` props for large or performance-sensitive lists:

```typescript
<FlatList
  data={data}
  renderItem={renderItem}           // memoized with useCallback
  keyExtractor={keyExtractor}        // memoized with useCallback
  getItemLayout={getItemLayout}      // only when item height is known and fixed
  removeClippedSubviews={true}
  maxToRenderPerBatch={10}
  updateCellsBatchingPeriod={100}
  initialNumToRender={10}
  windowSize={10}
  onEndReachedThreshold={0.5}        // when implementing pagination
/>
```

- List item components should usually be wrapped in `React.memo` to reduce re-renders from parent list updates
- Custom comparator in `React.memo` is allowed when only specific props affect render output

### MANDATORY Image Optimization

- Set `resizeMode="cover"` (or explicit mode) on every `<Image>` — never omit it
- Show a placeholder (`<ActivityIndicator />` or skeleton) while the image is loading via `onLoad` state
- Show an error fallback via `onError` state — never leave a broken image blank
- Reusable image components that accept `source` as a prop should be considered for `React.memo` when they re-render frequently

## Navigation Performance

### MANDATORY Screen Optimization

```typescript
// REQUIRED: Use useFocusEffect for screen-specific start/stop logic
useFocusEffect(
  useCallback(() => {
    startExpensiveOperation();
    return () => {
      stopExpensiveOperation(); // runs on blur and unmount
    };
  }, [])
);
```

- Use `useFocusEffect` (not `useEffect`) for operations that must pause when the screen is not visible
- Use `useIsFocused()` only when conditional rendering depends on focus — prefer `useFocusEffect` for side effects
- Use navigator-specific lazy mounting options only when the navigator supports them and deferred first mount is acceptable for the screen flow

## State Management Performance

### MANDATORY Redux Optimization

```typescript
// REQUIRED: createSelector for any derived/filtered data
export const selectFilteredItems = createSelector(
  [selectItems, selectFilter, selectSearchQuery],
  (items, filter, searchQuery) =>
    items.filter((item) => item.name.toLowerCase().includes(searchQuery.toLowerCase()))
);

// REQUIRED: selector factory for parameterized selectors
export const makeSelectItemById = () =>
  createSelector([selectItems, (_state: RootState, id: string) => id], (items, id) =>
    items.find((item) => item.id === id)
  );
```

- **`useAppSelector`**: Select the narrowest possible slice — never select a whole sub-state object
  - ✅ `useAppSelector(state => state.items.loading)`
  - ❌ `useAppSelector(state => state.items)` — re-renders on every items change

### MANDATORY State Updates Optimization

```typescript
// REQUIRED: Debounce search/filter dispatches (300ms standard)
const debouncedSearch = useMemo(
  () => debounce((query: string) => dispatch(searchItems(query)), 300),
  [dispatch]
);

// REQUIRED: Throttle high-frequency scroll/drag handlers (16ms = 60fps)
const throttledScroll = useMemo(
  () =>
    throttle((event: NativeSyntheticEvent<NativeScrollEvent>) => {
      handleScrollPosition(event.nativeEvent.contentOffset.y);
    }, 16),
  []
);
```

## Memory Management

### MANDATORY Memory Optimization

```typescript
// REQUIRED: Always return a cleanup function from useEffect for timers,
// subscriptions, and async operations
useEffect(() => {
  const intervalId = setInterval(doWork, 1000);
  const subscription = someService.subscribe(handleUpdate);
  const abortController = new AbortController();

  fetchData(abortController.signal);

  return () => {
    clearInterval(intervalId);
    subscription.unsubscribe();
    abortController.abort();
  };
}, []);
```

- Every `setInterval`, `setTimeout`, event listener, and service subscription MUST be cleaned up in the `useEffect` return
- Every async operation started inside `useEffect` MUST be abortable — use `AbortController` and check for `AbortError`

### MANDATORY Large List Handling

- Use `FlatList` for homogeneous lists; use `SectionList` for grouped data; use `VirtualizedList` only when data format is non-standard
- `SectionList`: set `stickySectionHeadersEnabled={false}` unless sticky headers are a product requirement — it improves scroll performance
- For lists with 1000+ items: reduce `maxToRenderPerBatch` to 5 and `windowSize` to 5 to limit off-screen memory usage
- Pagination: implement `onEndReached` + `onEndReachedThreshold={0.5}` — never load all pages upfront

## Animation Performance

### MANDATORY Animation Optimization

```typescript
// REQUIRED: useNativeDriver: true on ALL Animated.timing/spring/decay
Animated.timing(animatedValue, {
  toValue: 1,
  duration: 300,
  useNativeDriver: true, // REQUIRED — runs on UI thread, no JS bridge cost
  easing: Easing.out(Easing.cubic)
}).start();

// REQUIRED: react-native-reanimated for gesture-driven or complex animations
const offset = useSharedValue(0);
const animatedStyles = useAnimatedStyle(() => ({
  transform: [{ translateX: withSpring(offset.value) }]
}));
```

- `useNativeDriver: true` is mandatory for every `Animated` call — only omit it when animating layout props that don't support native driver (e.g. `width`, `height`)
- Prefer `react-native-reanimated` (`useSharedValue` + `useAnimatedStyle`) over the core `Animated` API for gesture-tied or chained animations
- Never mutate `Animated.Value` directly outside of `Animated.*` APIs

## Bundle Size Optimization

### MANDATORY Import Optimization

```typescript
// ✅ Named sub-path import — only the function is bundled
import debounce from 'lodash/debounce';
import isEmpty from 'lodash/isEmpty';

// ❌ Barrel import — entire lodash is bundled
import _ from 'lodash';
import * as _ from 'lodash';
```

- Always use sub-path imports for `lodash` and similar large libraries
- Prefer SVG icons over PNG — SVGs are resolution-independent and smaller at runtime
- Image assets must provide `@2x` and `@3x` variants so React Native resolves the correct density automatically
- Prefer WebP over PNG for raster images when targeting Android API 17+
