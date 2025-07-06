export const formatRelativeTime = (dateString: string): string => {
  const date = new Date(dateString);
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 60) {
    return "just now";
  }

  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) {
    return `${diffInMinutes}m ago`;
  }

  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) {
    return `${diffInHours}h ago`;
  }

  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 7) {
    return `${diffInDays}d ago`;
  }

  const diffInWeeks = Math.floor(diffInDays / 7);
  if (diffInWeeks < 4) {
    return `${diffInWeeks}w ago`;
  }

  // For older dates, show the actual date
  return date.toLocaleDateString();
};

export const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength).trim() + "...";
};

export const validateComment = (
  content: string
): { isValid: boolean; error?: string } => {
  const trimmed = content.trim();

  if (!trimmed) {
    return { isValid: false, error: "Comment cannot be empty" };
  }

  if (trimmed.length < 3) {
    return {
      isValid: false,
      error: "Comment must be at least 3 characters long",
    };
  }

  if (trimmed.length > 500) {
    return {
      isValid: false,
      error: "Comment must be less than 500 characters",
    };
  }

  return { isValid: true };
};
