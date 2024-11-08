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

/**
 * Handles upvoting of a post.
 * @param postId - The ID of the post to upvote.
 * @param isUpvoted - Current upvote status of the post.
 * @param index - Index of the post in the list.
 * @param posts - The current list of posts.
 * @param setPosts - Function to update the list of posts.
 */
export async function handleUpvote(
  postId: string,
  isUpvoted: boolean,
  index: number,
  posts: Post[],
  setPosts: React.Dispatch<React.SetStateAction<Post[]>>
): Promise<void> {
  try {
    const increment = isUpvoted ? -1 : 1;
    const response = await API.put(`/api/posts/${postId}/upvote`, { increment });

    const updatedPosts = [...posts];
    updatedPosts[index] = {
      ...updatedPosts[index],
      upvotes: response.data.upvotes,
      isUpvoted: !isUpvoted,
    };
    setPosts(updatedPosts);
  } catch (error) {
    console.error('Error updating upvote:', error);
  }
}

/**
 * Handles downvoting of a post.
 * @param postId - The ID of the post to downvote.
 * @param isDownvoted - Current downvote status of the post.
 * @param index - Index of the post in the list.
 * @param posts - The current list of posts.
 * @param setPosts - Function to update the list of posts.
 */
export async function handleDownvote(
  postId: string,
  isDownvoted: boolean,
  index: number,
  posts: Post[],
  setPosts: React.Dispatch<React.SetStateAction<Post[]>>
): Promise<void> {
  try {
    const increment = isDownvoted ? -1 : 1;
    const response = await API.put(`/api/posts/${postId}/downvote`, { increment });

    const updatedPosts = [...posts];
    updatedPosts[index] = {
      ...updatedPosts[index],
      downvotes: response.data.downvotes,
      isDownvoted: !isDownvoted,
    };
    setPosts(updatedPosts);
  } catch (error) {
    console.error('Error updating downvote:', error);
  }
}
