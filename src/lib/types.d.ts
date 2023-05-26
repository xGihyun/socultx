export type UserData = {
  username: string | null,
  email: string | null,
  isLoggedIn: boolean,
  uid: string | null,
  posts: Post[],
}

type Post = {
  id: string,
  content: string,
  userUID: string,
  user: string,
}