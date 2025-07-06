# BlurHash Integration with Unsplash API

This document explains how the application integrates `react-blurhash` with the Unsplash API to provide beautiful loading placeholders for images.

## Overview

The application now uses [BlurHash](https://blurha.sh/) - a compact representation of images that creates smooth, contextual loading placeholders. BlurHash generates a very small (~20-30 byte) string that represents the colors and luminance of an image.

## Components

### BlurHashImage

A basic image component with BlurHash placeholder support.

```tsx
import { BlurHashImage } from "../components/ui/BlurHashImage";

<BlurHashImage
  src="image-url"
  alt="Description"
  blurHash="blur-hash-string"
  className="w-full h-64"
/>;
```

### BlurHashImageWithCrossfade

Enhanced version with smooth crossfade animation between BlurHash and actual image.

```tsx
import { BlurHashImageWithCrossfade } from "../components/ui/BlurHashImage";

<BlurHashImageWithCrossfade
  src="image-url"
  alt="Description"
  blurHash="blur-hash-string"
  className="w-full h-64"
/>;
```

## Features

- **Automatic Fallback**: If no BlurHash is provided, falls back to skeleton loading
- **Smooth Transitions**: Crossfade animation between placeholder and actual image
- **Error Handling**: Displays error state if image fails to load
- **Performance Optimized**: Uses efficient background-position animations
- **Responsive**: Works with any aspect ratio and responsive layouts

## Integration Points

### API Types

Updated `UnsplashImage` interface to include `blur_hash`:

```typescript
export interface UnsplashImage {
  // ...existing fields
  blur_hash: string;
}
```

### Pin Interface

Added `blurHash` to the `Pin` interface:

```typescript
export interface Pin {
  // ...existing fields
  blurHash?: string;
}
```

### Data Transformation

The `transformImageToPin` function now maps `blur_hash` from Unsplash to `blurHash`:

```typescript
const transformImageToPin = (image: UnsplashImage): Pin => ({
  // ...other mappings
  blurHash: image.blur_hash,
});
```

## Usage in Components

### PinCard

```tsx
<BlurHashImageWithCrossfade
  src={imageUrl}
  alt={alt}
  blurHash={blurHash}
  className="w-full transition-transform group-hover:scale-105"
/>
```

### PinDetails

```tsx
<BlurHashImageWithCrossfade
  src={pin.imageUrl}
  alt={pin.title}
  blurHash={pin.blurHash}
  className="w-full h-auto object-cover"
/>
```

### PinGrid

The grid passes the `blur_hash` from Unsplash images to `PinCard` components:

```tsx
{
  images.map((image) => (
    <PinCard
      key={image.id}
      // ...other props
      blurHash={image.blur_hash}
    />
  ));
}
```

## Custom Hook

### useBlurHashImage

Manages image loading states for BlurHash components:

```typescript
const { isLoaded, hasError, showTransition } = useBlurHashImage({
  src: imageUrl,
  onLoad: () => console.log("Image loaded"),
  onError: () => console.log("Image failed"),
});
```

## Benefits

1. **Better UX**: Users see a contextual preview instead of blank space
2. **Perceived Performance**: Images appear to load faster with meaningful placeholders
3. **Bandwidth Efficient**: BlurHash strings are tiny compared to thumbnail images
4. **Consistent Branding**: Maintains visual continuity during loading states
5. **Accessible**: Provides meaningful alt text and loading states

## Browser Support

BlurHash works in all modern browsers. The `react-blurhash` library handles the canvas rendering automatically.

## Performance Notes

- BlurHash rendering is fast (~5ms on modern devices)
- Uses efficient CSS transitions for smooth animations
- Lazy loading is maintained for actual images
- No additional network requests for placeholders

## Configuration

### BlurHash Settings

- **Resolution**: 32x32 for optimal balance of quality and performance
- **Punch**: 1.0 for standard contrast (can be adjusted)
- **Animation Duration**: 1000ms for smooth transitions

### Fallback Behavior

If no BlurHash is available:

1. Falls back to skeleton loading animation
2. Maintains consistent loading states
3. Preserves all transition timing
