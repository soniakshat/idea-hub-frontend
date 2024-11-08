// src/utils/utils.ts

/**
 * Formats a timestamp into a readable date string.
 * @param timestamp - ISO string or Date object.
 * @param locale - Optional locale for date formatting.
 * @returns Formatted date string.
 */
export function formatDate(timestamp: string | Date, locale: string = 'en-US'): string {
  const date = new Date(timestamp);
  return date.toLocaleString(locale, {
    weekday: 'short',
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });
}

/**
 * Generates a unique ID based on the current timestamp.
 * @returns A unique ID string.
 */
export function generateUniqueId(): string {
  return Date.now().toString();
}

/**
 * Parses a comma-separated string into a trimmed array of strings.
 * @param input - The comma-separated string.
 * @returns Array of trimmed strings.
 */
export function parseCommaSeparatedValues(input: string): string[] {
  return input
    .split(',')
    .map((value) => value.trim())
    .filter((value) => value !== '');
}

/**
 * Safely retrieve an item from local storage.
 * @param key - The key of the item in local storage.
 * @returns The stored value or `null` if not found.
 */
export function getLocalStorageItem(key: string): string | null {
  try {
    return localStorage.getItem(key);
  } catch (error) {
    console.error(`Error accessing localStorage key "${key}":`, error);
    return null;
  }
}
