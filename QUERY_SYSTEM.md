# Query System Documentation

This project now includes a complete query system using TanStack Query (React Query) and Axios for fetching data from the backend.

## Structure

```
src/client/
├── types/
│   └── api.ts              # TypeScript types for API responses
├── lib/
│   ├── api.ts              # Axios API client
│   ├── queryOptions.ts     # TanStack Query options
│   ├── mutations.ts        # Mutation hooks for actions
│   └── index.ts            # Exports
├── hooks/
│   └── useQueries.ts       # Custom hooks for common patterns
└── components/
    └── examples/
        └── ExampleGallery.tsx  # Example usage
```

## Available API Endpoints

Based on the server routes, the following endpoints are available:

### Images

- `GET /api/images` - Get all images with pagination
- `GET /api/images/search?query=cats` - Search images
- `GET /api/images/:id/details` - Get single image details

### Comments

- `GET /api/images/:id/comments` - Get comments for an image
- `POST /api/images/:id/comments` - Add comment to an image

### Likes

- `GET /api/images/:id/likes` - Get likes for an image
- `POST /api/images/:id/like` - Like an image
- `DELETE /api/images/:id/like` - Unlike an image

## Usage Examples

### Basic Image Fetching

```tsx
import { useImages } from "../hooks/useQueries";

function MyComponent() {
  const {
    data: images,
    isLoading,
    error,
  } = useImages({ page: 1, perPage: 20 });

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div>
      {images?.map((image) => (
        <img
          key={image.id}
          src={image.urls.regular}
          alt={image.alt_description}
        />
      ))}
    </div>
  );
}
```

### Infinite Scrolling Gallery

```tsx
import { useGallery } from "../hooks/useQueries";

function InfiniteGallery() {
  const { images, isLoading, loadMore, hasNextPage, isFetchingNextPage } =
    useGallery();

  return (
    <div>
      {images.map((image) => (
        <ImageCard key={image.id} image={image} />
      ))}
      {hasNextPage && (
        <button onClick={loadMore} disabled={isFetchingNextPage}>
          {isFetchingNextPage ? "Loading..." : "Load More"}
        </button>
      )}
    </div>
  );
}
```

### Search with Debouncing

```tsx
import { useSearchWithDebounce } from "../hooks/useQueries";

function SearchGallery() {
  const [searchTerm, setSearchTerm] = useState("");
  const { searchResults, isSearching, debouncedSearchTerm } =
    useSearchWithDebounce(searchTerm);

  return (
    <div>
      <input
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder="Search images..."
      />
      {isSearching && <div>Searching...</div>}
      {searchResults.map((image) => (
        <ImageCard key={image.id} image={image} />
      ))}
    </div>
  );
}
```

### Like/Unlike Functionality

```tsx
import { useLikeToggle } from "../lib/mutations";
import { useImageLikes } from "../hooks/useQueries";

function LikeButton({ imageId, userId }: { imageId: string; userId: number }) {
  const { data: likesData } = useImageLikes(imageId, userId);
  const likeMutation = useLikeToggle(imageId, userId);

  const handleToggleLike = () => {
    likeMutation.mutate({
      isCurrentlyLiked: likesData?.isLiked || false,
    });
  };

  return (
    <button
      onClick={handleToggleLike}
      disabled={likeMutation.isPending}
      className={likesData?.isLiked ? "text-red-500" : "text-gray-500"}>
      ❤️ {likesData?.count || 0}
    </button>
  );
}
```

### Complete Pin Details

```tsx
import { usePinDetails } from "../hooks/useQueries";

function PinDetailsPage({ pinId, userId }: { pinId: string; userId: number }) {
  const { data: pin, isLoading, error } = usePinDetails(pinId, userId);

  if (isLoading) return <div>Loading pin details...</div>;
  if (error) return <div>Error loading pin</div>;

  return (
    <div>
      <img src={pin.imageUrl} alt={pin.title} />
      <h1>{pin.title}</h1>
      <p>{pin.description}</p>
      <p>By: {pin.author}</p>
      <p>Likes: {pin.likes}</p>
      <p>Liked: {pin.isLiked ? "Yes" : "No"}</p>

      <div>
        <h3>Comments ({pin.comments.length})</h3>
        {pin.comments.map((comment) => (
          <div key={comment.id}>
            <strong>{comment.content}</strong>
            <small>{comment.createdAt}</small>
          </div>
        ))}
      </div>
    </div>
  );
}
```

## Available Hooks

### Data Fetching Hooks

- `useImages(params)` - Get paginated images
- `useInfiniteImages(params)` - Get images with infinite scroll
- `useSearchImages(params)` - Search images
- `useInfiniteSearchImages(params)` - Search with infinite scroll
- `useImageDetails(imageId)` - Get single image details
- `useImageComments(imageId)` - Get image comments
- `useImageLikes(imageId, userId)` - Get image likes
- `usePinDetails(imageId, userId)` - Get complete pin data
- `usePinsList(params)` - Get transformed pins for UI

### Utility Hooks

- `useGallery(params)` - Complete gallery with infinite scroll
- `useSearchWithDebounce(searchTerm, delay)` - Debounced search

### Mutation Hooks

- `useLikeImageMutation(imageId)` - Like an image
- `useUnlikeImageMutation(imageId)` - Unlike an image
- `useToggleLikeMutation(imageId)` - Toggle like state
- `useAddCommentMutation(imageId)` - Add a comment
- `useLikeToggle(imageId, userId)` - Complete like/unlike with optimistic updates

## Query Options

All queries have sensible defaults for caching:

- `staleTime`: 5 minutes (data considered fresh)
- `gcTime`: 10 minutes (data kept in cache)
- Automatic background refetching
- Optimistic updates for mutations

## Error Handling

All API calls include proper error handling and will log errors to the console. Errors are also available in the query results for custom error displays.

## Next Steps

1. Update existing components to use these hooks
2. Add proper TypeScript types where needed
3. Implement real user authentication for like/comment features
4. Add loading states and error boundaries
5. Consider adding React Query DevTools for debugging
