import { afterEach, describe, expect, it, vi } from 'vitest'

afterEach(() => {
  vi.unstubAllGlobals()
  vi.resetModules()
})

describe('api.comments', () => {
  it('treats a missing comment collection as an empty list', async () => {
    const fetchMock = vi.fn().mockResolvedValue(new Response('Not found', { status: 404 }))
    vi.stubGlobal('fetch', fetchMock)
    const { api } = await import('./api')

    await expect(api.comments('36')).resolves.toEqual([])
    expect(fetchMock).toHaveBeenCalledOnce()
    expect(fetchMock).toHaveBeenCalledWith(
      'https://665de6d7e88051d60408c32d.mockapi.io/post/36/comment',
      { signal: undefined },
    )
  })

  it('lists comments through the singular route', async () => {
    const comments = [{ id: '1', postId: '36', createdAt: '', name: 'Ada', avatar: '', content: 'Hola', parentId: null }]
    const fetchMock = vi.fn().mockResolvedValue(Response.json(comments))
    vi.stubGlobal('fetch', fetchMock)
    const { api } = await import('./api')

    await expect(api.comments('36')).resolves.toEqual(comments)
    expect(fetchMock.mock.calls.map(([url]) => url)).toEqual([
      'https://665de6d7e88051d60408c32d.mockapi.io/post/36/comment',
    ])
  })

  it('creates, updates and deletes comments through the singular route', async () => {
    const created = { id: '9', postId: '36', createdAt: '2026-07-24', name: 'Ada', avatar: '', content: 'Hola', parentId: '7' }
    const updated = { ...created, name: 'Grace', content: 'Editado' }
    const fetchMock = vi.fn()
      .mockResolvedValueOnce(Response.json(created))
      .mockResolvedValueOnce(Response.json(updated))
      .mockResolvedValueOnce(new Response(null, { status: 204 }))
    vi.stubGlobal('fetch', fetchMock)
    const { api } = await import('./api')

    const comment = await api.createComment('36', { name: 'Ada', avatar: '', content: 'Hola', parentId: '7' })
    await api.updateComment(comment, { name: 'Grace', avatar: '', content: 'Editado', parentId: '7' })
    await api.deleteComment(updated)

    expect(fetchMock.mock.calls.map(([url, init]) => [url, init.method])).toEqual([
      ['https://665de6d7e88051d60408c32d.mockapi.io/post/36/comment', 'POST'],
      ['https://665de6d7e88051d60408c32d.mockapi.io/post/36/comment/9', 'PUT'],
      ['https://665de6d7e88051d60408c32d.mockapi.io/post/36/comment/9', 'DELETE'],
    ])
    expect(JSON.parse(fetchMock.mock.calls[1][1].body)).toEqual(updated)
  })

  it('sends null parentId for a root comment', async () => {
    const created = { id: '9', postId: '36', createdAt: '2026-07-24', name: 'Ada', avatar: '', content: 'Hola', parentId: null }
    const fetchMock = vi.fn().mockResolvedValue(Response.json(created))
    vi.stubGlobal('fetch', fetchMock)
    const { api } = await import('./api')

    await api.createComment('36', { name: 'Ada', avatar: '', content: 'Hola', parentId: null })

    expect(JSON.parse(fetchMock.mock.calls[0][1].body)).toEqual({
      name: 'Ada', avatar: '', content: 'Hola', parentId: null, postId: '36',
    })
  })
})

describe('api.post', () => {
  it('keeps a missing post as a 404 instead of treating it as an empty conversation', async () => {
    const fetchMock = vi.fn().mockResolvedValue(new Response('Not found', { status: 404 }))
    vi.stubGlobal('fetch', fetchMock)
    const { api, ApiError } = await import('./api')

    await expect(api.post('missing')).rejects.toMatchObject({ status: 404 })
    await expect(api.post('missing')).rejects.toBeInstanceOf(ApiError)
  })

  it('uses complete resources for post updates and only removes after a successful delete', async () => {
    const post = { id: '1', createdAt: '2026-07-24', name: 'Ada', avatar: '', title: 'Old', content: 'Old content' }
    const updated = { ...post, title: 'New', content: 'New content' }
    const fetchMock = vi.fn()
      .mockResolvedValueOnce(Response.json(updated))
      .mockResolvedValueOnce(new Response(null, { status: 204 }))
    vi.stubGlobal('fetch', fetchMock)
    const { api } = await import('./api')

    await expect(api.updatePost(post, { name: 'Ada', avatar: '', title: 'New', content: 'New content' })).resolves.toEqual(updated)
    await expect(api.deletePost(post.id)).resolves.toBeUndefined()
    expect(JSON.parse(fetchMock.mock.calls[0][1].body)).toEqual(updated)
    expect(fetchMock.mock.calls[1][1].method).toBe('DELETE')
  })
})
