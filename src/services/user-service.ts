import { User, UserInput, Post } from "../interfaces/types";
import { faker } from "@faker-js/faker";

export class UserService {
  private users: User[] = [];

  constructor(users: User[] = []) {
    this.users = users;
  }

  public getAllUser(): User[] {
    return this.users;
  }

  public getUserById(id: string): User | undefined {
    return this.users.find(user => user.id === id);
  }

  public addUser(userInput: UserInput): User {
    const newUser: User = {
      id: faker.string.uuid(),
      username: userInput.username,
      email: userInput.email,
      password: userInput.password,
      createdAt: new Date(),
      posts: this.generateDefaultPosts()
    }

    this.users.push(newUser);
    return newUser;
  }

  public updateUser(id: string, updates: Partial<UserInput>): User | null {
    const userIndex = this.users.findIndex(user => user.id === id);
    if (userIndex === -1) {
      return null;
    }

    const updatedUser = {
      ...this.users[userIndex],
      ...updates,
      id: this.users[userIndex].id,
      createdAt: this.users[userIndex].createdAt,
      posts: this.users[userIndex].posts
    }

    this.users[userIndex] = updatedUser;
    return updatedUser;
  }

  public deleteUser(id: string): boolean {
    const initialLength = this.users.length;
    this.users = this.users.filter((user) => user.id !== id);
    return this.users.length < initialLength;
  }

  private generateDefaultPosts(): Post[] {
    const postCount = faker.number.int({ min: 1, max: 3 });
    return Array.from({ length: postCount }, (_, index) => ({
      id: faker.string.uuid(),
      title: `Post ${index + 1} by new user`,
      tag: faker.helpers.arrayElement(['general', 'personal', 'updated']),
      content: faker.lorem.paragraphs(2),
      createdAt: new Date(),
      publishedBy: 'new-user'
    }));
  }

  private searchUsers(query: string): User[] {
    const lowerQuery = query.toLowerCase();
    return this.users.filter((user) => {
      user.username.toLowerCase().includes(lowerQuery) ||
      user.email.toLowerCase().includes(lowerQuery)
    });
  }

  private getUsersWithPostCount(): { user: User, postCount: number }[] {
    return this.users.map((user) => ({
      user,
      postCount: user.posts.length
    }));
  }
}