export type Folder = {
    id: string
    name: string
    color: string | null
    parent_id: string | null
    user_id: string
    created_at: string
}

export type Note = {
    id: string
    title: string
    content: any
    folder_id: string | null
    is_favorite: boolean
    is_trashed: boolean
    created_at: string
    updated_at: string
}

export type Password = {
    id: string
    title: string
    username: string
    website: string | null
    is_favorite: boolean
    is_trashed: boolean
    // password_encrypted and notes aren't fetched in lists to save bandwidth usually, only details.
}

export type Mindmap = {
    id: string
    title: string
    is_favorite: boolean
    is_trashed: boolean
}
