# Blur Image Loader System

This project includes a sophisticated image loading system designed to provide smooth user experiences while images load, particularly optimized for Unsplash images used in the gallery.

## Components

### 1. `UnsplashBlurImage`

**Location**: `src/client/components/ui/UnsplashBlurImage.tsx`

The main component optimized for Unsplash images that creates low-resolution blur placeholders automatically.

**Features**:

- Automatically generates low-res blur placeholders from Unsplash URLs
- Smooth transitions from blur to sharp image
- Error handling with fallback skeleton
- Lazy loading support

**Usage**:

```tsx
import { UnsplashBlurImage } from "../components";

<UnsplashBlurImage
  src="https://images.unsplash.com/photo-xyz"
  alt="Beautiful landscape"
  className="w-full h-auto object-cover"
  onLoad={() => console.log("Image loaded")}
  onError={() => console.log("Image failed to load")}
/>;
```

### 2. `BlurImage` & `ProgressiveBlurImage`

**Location**: `src/client/components/ui/BlurImage.tsx`

Generic blur image components for non-Unsplash images.

**Features**:

- Customizable blur placeholders
- Progressive loading with multiple quality levels
- Shimmer, blur, and empty placeholder options
- Error states with retry functionality

**Usage**:

```tsx
import { BlurImage, ProgressiveBlurImage } from '../components';

// Basic blur image
<BlurImage
  src="image.jpg"
  alt="Description"
  placeholder="shimmer" // 'blur' | 'shimmer' | 'empty'
  className="w-full h-64 object-cover"
/>

// Progressive loading
<ProgressiveBlurImage
  lowQualitySrc="image-low.jpg"
  mediumQualitySrc="image-medium.jpg"
  src="image-high.jpg"
  alt="Description"
  className="w-full h-64 object-cover"
/>
```

### 3. Loading Components

**Location**: `src/client/components/ui/LoadingComponents.tsx`

Skeleton loading components for different UI sections.

**Components**:

- `LoadingGrid` - Pinterest-style grid skeleton
- `SearchLoadingGrid` - Search results skeleton
- `PinDetailsLoading` - Pin details page skeleton
- `ImageSkeleton` - Individual image skeleton

**Usage**:

```tsx
import { LoadingGrid, SearchLoadingGrid, ImageSkeleton } from '../components';

// Gallery loading
<LoadingGrid count={12} />

// Search results loading
<SearchLoadingGrid count={8} />

// Individual image skeleton
<ImageSkeleton className="w-full h-48" />
```

## How It Works

### Unsplash Image Optimization

The `UnsplashBlurImage` component automatically optimizes Unsplash URLs by:

1. **Creating blur placeholder**: Modifies the original URL to create a 20x20px, low-quality, blurred version
2. **Preloading main image**: Loads the full-resolution image in the background
3. **Smooth transition**: Fades from blur to sharp image when loaded

**URL Transformation Example**:

```
Original: https://images.unsplash.com/photo-xyz?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80
Blur:     https://images.unsplash.com/photo-xyz?ixlib=rb-4.0.3&auto=format&fit=crop&w=20&h=20&q=20&blur=2
```

### Loading States

The system handles three main states:

1. **Loading**: Shows blur placeholder or skeleton
2. **Loaded**: Displays the actual image with smooth transition
3. **Error**: Shows error state with retry option

### CSS Animations

Custom CSS animations in `App.css`:

```css
/* Shimmer animation */
@keyframes shimmer {
  0% {
    transform: translateX(-100%);
  }
  100% {
    transform: translateX(100%);
  }
}

.animate-shimmer {
  animation: shimmer 2s infinite;
}

/* Skeleton loading */
.skeleton-loading {
  background: linear-gradient(
    90deg,
    var(--color-card) 25%,
    var(--color-card-hover) 50%,
    var(--color-card) 75%
  );
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
}
```

## Integration

### In PinCard

```tsx
// Before
<img src={imageUrl} alt={alt} className="w-full" />

// After
<UnsplashBlurImage
  src={imageUrl}
  alt={alt}
  className="w-full transition-transform group-hover:scale-105"
/>
```

### In PinGrid

```tsx
// Loading state with skeleton grid
if (isLoading) {
  return (
    <div className="space-y-6">
      <div className="text-center py-8">
        <p>Loading amazing photos...</p>
      </div>
      <LoadingGrid count={12} />
    </div>
  );
}
```

### In PinDetails

```tsx
// High-quality image with blur loading
<UnsplashBlurImage
  src={pin.imageUrl}
  alt={pin.title}
  className="w-full h-auto object-cover"
/>
```

## Performance Benefits

1. **Perceived Performance**: Users see content immediately instead of blank spaces
2. **Smooth UX**: Eliminates jarring image pop-ins
3. **Bandwidth Efficient**: Blur placeholders are tiny (~1KB vs 100KB+ for full images)
4. **Error Resilience**: Graceful fallbacks for failed images
5. **SEO Friendly**: Proper alt text and lazy loading

## Customization

### Custom Placeholder Colors

```tsx
// Modify the generateBlurDataURL function
const generateBlurDataURL = (
  width = 10,
  height = 10,
  colors = ["#f3f4f6", "#e5e7eb"]
) => {
  // Custom gradient colors
};
```

### Custom Loading Animation

```tsx
<BlurImage
  src="image.jpg"
  alt="Description"
  placeholder="shimmer" // Use shimmer animation
  className="custom-loading-class"
/>
```

### Progressive Enhancement

```tsx
<ProgressiveBlurImage
  lowQualitySrc={`${baseUrl}?w=50&q=10`}
  mediumQualitySrc={`${baseUrl}?w=200&q=50`}
  src={`${baseUrl}?w=800&q=80`}
  alt="Progressive loading example"
/>
```

## Best Practices

1. **Always provide alt text** for accessibility
2. **Use appropriate placeholder types** (blur for photos, shimmer for UI elements)
3. **Implement error boundaries** around image components
4. **Consider image dimensions** to prevent layout shifts
5. **Test with slow connections** to ensure good UX
6. **Use lazy loading** for images below the fold

## Browser Support

- Modern browsers with CSS filters support
- Graceful degradation for older browsers
- Canvas API for blur generation (fallback to CSS only)

The blur image loader system significantly enhances the gallery experience by providing smooth, professional-looking loading states that keep users engaged while content loads.
