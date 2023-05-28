export type UserData = {
  username: string | null,
  email: string | null,
  photoURL: string | null,
  isLoggedIn: boolean,
  uid: string | null,
  posts: Post[],
  inbox: Inbox[]
}

type Post = {
  id: string,
  content: string,
  userUID: string,
  user: string,
}

type Inbox = {
  chat_id: string,
  chat_name: string
}