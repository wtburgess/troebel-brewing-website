import PocketBase from 'pocketbase';

// PocketBase URL - use environment variable or default to local server
const POCKETBASE_URL = process.env.NEXT_PUBLIC_POCKETBASE_URL || 'http://192.168.1.63:8055';

// Singleton instance for client-side usage
let clientInstance: PocketBase | null = null;

/**
 * Get PocketBase client instance
 * Server-side: creates new instance each time (SSR safe)
 * Client-side: returns singleton instance
 */
export function createPocketBase(): PocketBase {
  // Server-side: always create new instance
  if (typeof window === 'undefined') {
    return new PocketBase(POCKETBASE_URL);
  }

  // Client-side: use singleton
  if (!clientInstance) {
    clientInstance = new PocketBase(POCKETBASE_URL);
  }

  return clientInstance;
}

/**
 * Get file URL from PocketBase
 * @param record - The record containing the file
 * @param filename - The filename from the record
 * @returns Full URL to the file
 */
export function getFileUrl(
  collectionId: string,
  recordId: string,
  filename: string
): string {
  return `${POCKETBASE_URL}/api/files/${collectionId}/${recordId}/${filename}`;
}

/**
 * Admin login for admin pages (PocketBase v0.34+)
 * Uses _superusers collection instead of deprecated admins endpoint
 */
export async function adminLogin(email: string, password: string): Promise<boolean> {
  try {
    const pb = createPocketBase();
    await pb.collection('_superusers').authWithPassword(email, password);
    return true;
  } catch (error) {
    console.error('Admin login failed:', error);
    return false;
  }
}

/**
 * Get authenticated PocketBase client for admin operations
 * Must be called with valid admin credentials
 */
export async function getAuthenticatedPocketBase(): Promise<PocketBase | null> {
  try {
    const pb = createPocketBase();
    // Check if already authenticated
    if (pb.authStore.isValid) {
      return pb;
    }
    // Try to authenticate with stored credentials
    const email = 'admin@troebel.be';
    const password = process.env.ADMIN_PASSWORD || 'TroebelAdmin2024';
    await pb.collection('_superusers').authWithPassword(email, password);
    return pb;
  } catch (error) {
    console.error('Failed to get authenticated PocketBase:', error);
    return null;
  }
}

/**
 * Simple password-based admin auth (for custom admin page)
 * Uses environment variable ADMIN_PASSWORD
 */
export function checkAdminPassword(password: string): boolean {
  const adminPassword = process.env.ADMIN_PASSWORD;
  if (!adminPassword) {
    console.warn('ADMIN_PASSWORD not set in environment');
    return false;
  }
  return password === adminPassword;
}

export default createPocketBase;
