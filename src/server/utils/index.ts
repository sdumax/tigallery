export const isValidUnsplashId = (id: string): boolean => {
  if (!id || typeof id !== "string") return false;

  return /^[a-zA-Z0-9-_]{10,20}$/.test(id);
};
