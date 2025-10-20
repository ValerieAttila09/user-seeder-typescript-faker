import Seeder from "./seed";

export function generateSampleData() {
  const seeder = new Seeder();
  return seeder.getUsers();
}

export function generateUserWithPosts() {
  const seeder = new Seeder();
  const users = seeder.getUsers();

  return users.map((user) => ({
    user: {
      id: user.id,
      username: user.username,
      email: user.email,
      password: user.password,
      createdAt: user.createdAt,
    },
    posts: user.posts.map((post) => ({
      id: post.id,
      title: post.title,
      tag: post.tag,
      content: post.content,
      createdAt: post.createdAt,
      publishedBy: post.publishedBy
    }))
  }));
}