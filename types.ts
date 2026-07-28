export interface Post {
  id: string
  createdAt: string
  name: string
  avatar: string
  title: string
  content: string
}

export interface CommentContract {
  id: string
  createdAt: string
  name: string
  avatar: string
  content: string
  parentId: null | string
}

export interface Comment extends CommentContract {
  postId: string
}

export interface CommentNode extends Comment {
  children: CommentNode[]
  replyCount: number
}

export type PostInput = Pick<Post, 'name' | 'avatar' | 'title' | 'content'>
export type CommentInput = Pick<CommentContract, 'name' | 'avatar' | 'content' | 'parentId'>
