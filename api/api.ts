import type { Comment, CommentInput, Post, PostInput } from '../types'

const API_URL = 'https://665de6d7e88051d60408c32d.mockapi.io'

export class ApiError extends Error {
  constructor(message: string, readonly status: number) {
    super(message)
  }
}

async function request<T>(path: string, init: RequestInit = {}): Promise<T> {
  let response: Response
  try {
    response = await fetch(`${API_URL}${path}`, {
      ...init,
      headers: init.body ? { 'Content-Type': 'application/json', ...init.headers } : init.headers,
    })
  } catch (error) {
    if (error instanceof DOMException && error.name === 'AbortError') throw error
    throw new ApiError('No se pudo conectar con el servidor. Revisá tu conexión.', 0)
  }

  if (!response.ok) {
    const detail = await response.text().catch(() => '')
    throw new ApiError(detail || `La solicitud falló (${response.status}).`, response.status)
  }
  if (response.status === 204) return undefined as T
  return response.json() as Promise<T>
}

export const api = {
  posts: (signal?: AbortSignal) => request<Post[]>('/post', { signal }),
  post: (id: string, signal?: AbortSignal) => request<Post>(`/post/${id}`, { signal }),
  createPost: (input: PostInput) => request<Post>('/post', { method: 'POST', body: JSON.stringify(input) }),
  updatePost: (post: Post, input: PostInput) => request<Post>(`/post/${post.id}`, { method: 'PUT', body: JSON.stringify({ ...post, ...input }) }),
  deletePost: (id: string) => request<void>(`/post/${id}`, { method: 'DELETE' }),
  comments: async (postId: string, signal?: AbortSignal) => {
    try {
      return await request<Comment[]>(`/post/${postId}/comment`, { signal })
    } catch (error) {
      if (error instanceof ApiError && error.status === 404) return []
      throw error
    }
  },
  createComment: (postId: string, input: CommentInput) => request<Comment>(`/post/${postId}/comment`, { method: 'POST', body: JSON.stringify({ ...input, postId }) }),
  updateComment: (comment: Comment, input: CommentInput) => request<Comment>(`/post/${comment.postId}/comment/${comment.id}`, { method: 'PUT', body: JSON.stringify({ ...comment, ...input }) }),
  deleteComment: (comment: Comment) => request<void>(`/post/${comment.postId}/comment/${comment.id}`, { method: 'DELETE' }),
}
