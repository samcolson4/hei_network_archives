export type Episode = {
  id: string
  type: string
  attributes: {
    episode_url: string
    collection: string
    episode_title: string
    poster_url: string
    aired_at: Date
    show: string
    media_type: string
    created_at: Date
    updated_at: Date
  }
}
