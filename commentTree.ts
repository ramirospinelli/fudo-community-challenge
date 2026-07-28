import type { Comment, CommentNode } from './types'

export function buildCommentTree(comments: Comment[]): CommentNode[] {
  const nodes = new Map<string, CommentNode>(comments.map((comment) => [comment.id, { ...comment, children: [], replyCount: 0 }]))
  const roots: CommentNode[] = []
  const hasParentCycle = (comment: Comment): boolean => {
    let parentId = comment.parentId
    const visited = new Set<string>()
    while (parentId) {
      if (parentId === comment.id) return true
      if (visited.has(parentId)) return false
      visited.add(parentId)
      parentId = nodes.get(parentId)?.parentId ?? null
    }
    return false
  }

  for (const comment of comments) {
    const node = nodes.get(comment.id)!
    const parent = comment.parentId ? nodes.get(comment.parentId) : undefined
    if (parent && parent !== node && !hasParentCycle(comment)) parent.children.push(node)
    else roots.push(node)
  }

  const count = (node: CommentNode): number => {
    node.replyCount = node.children.reduce((total, child) => total + count(child) + 1, 0)
    return node.replyCount
  }
  roots.forEach(count)
  return roots
}
