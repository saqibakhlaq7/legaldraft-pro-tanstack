// Mock for Lovable integrations
export const supabase = null;
export const googleAuth = {
  signIn: () => Promise.resolve(),
  signOut: () => Promise.resolve(),
};
