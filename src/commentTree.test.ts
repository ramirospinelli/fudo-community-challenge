import { describe, expect, it } from 'vitest'
import { buildCommentTree } from './commentTree'
import type { Comment } from './types'

const comment = (id: string, parentId: string | null = null): Comment => ({
  id,
  postId: '1',
  createdAt: '2026-01-01T00:00:00Z',
  name: `User ${id}`,
  avatar: '',
  content: `Comment ${id}`,
  parentId,
})

describe('buildCommentTree', () => {
  it('builds arbitrary nesting and counts all descendants', () => {
    const tree = buildCommentTree([comment('3', '2'), comment('1'), comment('2', '1')])
    expect(tree).toHaveLength(1)
    expect(tree[0].replyCount).toBe(2)
    expect(tree[0].children[0].replyCount).toBe(1)
    expect(tree[0].children[0].children[0].id).toBe('3')
  })

  it('keeps comments with an orphan parent visible at the root', () => {
    const tree = buildCommentTree([comment('1', 'missing')])
    expect(tree.map(({ id }) => id)).toEqual(['1'])
  })

  it('keeps comments involved in a parent cycle visible at the root', () => {
    const tree = buildCommentTree([comment('1', '2'), comment('2', '1')])
    expect(tree.map(({ id }) => id)).toEqual(['1', '2'])
  })
})
