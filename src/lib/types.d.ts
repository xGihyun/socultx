export type PostData = {
  email: string | null,
  posts: Post[],
}

type Post = {
  id: string,
  content: string,
  userUID: string,
  user: string,
}