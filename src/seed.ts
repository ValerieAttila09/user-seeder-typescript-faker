import { Post, User } from './interfaces/types';
import { faker } from "@faker-js/faker";
import { writeFileSync } from 'fs';
import { join } from 'path';
import chalk from 'chalk';

class Seeder {
  public users: User[] = [];

  constructor() {
    this.generatedData();
  }

  private generateUsername(): string {
    return faker.internet.username().toLowerCase().replace(/[^a-z0-9_]/g, '');
  }

  private generateEmail(username: string): string {
    return `${username}@${faker.internet.domainName()}`;
  }

  private generatePassword(): string {
    return faker.internet.password() + 'A1!';
  }

  private generatePost(userId: string): Post {
    return {
      id: faker.string.uuid(),
      title: faker.lorem.sentence(),
      tag: faker.helpers.arrayElement(['technology', 'lifestyle', 'travel', 'food', 'health', 'education']),
      content: faker.lorem.paragraphs(3),
      createdAt: faker.date.recent({ days: 60 }),
      publishedBy: userId
    };
  }

  private generateUser(): User {
    const username = this.generateUsername();
    const userId = faker.string.uuid();

    const postCount = faker.number.int({ min: 1, max: 5 });
    const posts: Post[] = Array.from({ length: postCount }, () => this.generatePost(userId));

    return {
      id: userId,
      username,
      email: this.generateEmail(username),
      password: this.generatePassword(),
      createdAt: faker.date.past({ years: 1 }),
      posts
    }
  }

  private generatedData(): void {
    this.users = Array.from({ length: 20 }, () => this.generateUser());
  }

  public getUsers(): User[] {
    return this.users;
  }

  public saveToJSON(filename: string = "seed-data.json"): void {
    const data = {
      generatedAt: new Date().toISOString(),
      totalUsers: this.users.length,
      totalPosts: this.users.reduce((sum, user) => sum + user.posts.length, 0),
      users: this.users
    };

    const filePath = join(__dirname, '..', filename);
    writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');
    console.log(`Data berhasil disimpan ke: ${filePath}`);
  }

  public saveToUsersJSON(filename: string = 'users.json'): void {
    const filePath = join(__dirname, '..', filename);
    writeFileSync(filePath, JSON.stringify(this.users, null, 2), 'utf8');
    console.log(chalk.green(`✅ ${this.users.length} users saved to: ${filePath}`));
  }

  public displaySummary(): void {
    console.log("\n SUMMARY DATA DUMMY ");
    console.log("===================");
    console.log(`Total users : ${this.users.length}`);
    console.log(`Total posts : ${this.users.reduce((sum, user) => sum + user.posts.length, 0)} posts`);

    console.log("\n5 User Pertama :");
    this.users.slice(0, 5).forEach((user, index) => {
      console.log(`${index + 1}. ${user.username} \t ${user.email} \t ${user.posts.length} posts`)
    });

    console.log("\nContoh Post : ");
    const firstUser = this.users[0];
    if (firstUser && firstUser.posts.length > 0) {
      const firstPost = firstUser.posts[0];
      console.log(`Title : ${firstPost.title}`);
      console.log(`Tag : ${firstPost.tag}`);
      console.log(`Content : ${firstPost.content.substring(0, 100)} ...`);
    }
  }
}

const main = () => {
  console.log("Menghasilkan data dummy ...");

  const seeder = new Seeder();
  seeder.displaySummary();
  seeder.saveToJSON();
  seeder.saveToJSON('users-data.json');
}

if (require.main === module) {
  main();
}

export default Seeder;