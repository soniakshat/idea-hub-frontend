import API from '../api';
import { Post } from '../types/Post'; // Define this interface if needed

/**
 * Filters posts based on a search query.
 * @param posts - The array of posts to search within.
 * @param query - The search query string.
 * @returns The filtered array of posts.
 */
export function handleSearch(posts: Post[], query: string): Post[] {
  return posts.filter(
    (post) =>
      post.title.toLowerCase().includes(query.toLowerCase()) ||
      post.content.toLowerCase().includes(query.toLowerCase())
  );
}