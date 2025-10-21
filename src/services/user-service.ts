import { User, UserInput, Post } from '../interfaces/types';
import { faker } from '@faker-js/faker';
import { readFileSync, writeFileSync, existsSync } from 'fs';
import { join } from 'path';
import chalk from 'chalk';

export class UserService {
  private users: User[] = [];
  private dataFile: string;

  constructor(users: User[] = [], dataFile: string = 'users.json') {
    this.dataFile = join(__dirname, '..', dataFile);
    this.users = users.length > 0 ? users : this.loadUsersFromFile();
  }

  private loadUsersFromFile(): User[] {
    try {
      if (!existsSync(this.dataFile)) {
        console.log(chalk.yellow('📁 users.json not found. Creating new file...'));
        this.saveUsersToFile([]);
        return [];
      }

      const data = readFileSync(this.dataFile, 'utf8');
      const parsedData = JSON.parse(data);
      
      const users = parsedData.map((user: any) => ({
        ...user,
        createdAt: new Date(user.createdAt),
        posts: user.posts.map((post: any) => ({
          ...post,
          createdAt: new Date(post.createdAt)
        }))
      }));

      console.log(chalk.green(`✅ Loaded ${users.length} users from ${this.dataFile}`));
      return users;
    } catch (error) {
      console.log(chalk.red(`❌ Error loading users from file: ${error}`));
      return [];
    }
  }

  private saveUsersToFile(users: User[]): void {
    try {
      const data = JSON.stringify(users, null, 2);
      writeFileSync(this.dataFile, data, 'utf8');
    } catch (error) {
      console.log(chalk.red(`❌ Error saving users to file: ${error}`));
    }
  }

  public getAllUsers(): User[] {
    this.users = this.loadUsersFromFile();
    return this.users;
  }

  public getUserById(id: string): User | undefined {
    this.users = this.loadUsersFromFile();
    return this.users.find(user => user.id === id);
  }

  public addUser(userInput: UserInput): User {
    this.users = this.loadUsersFromFile();

    const newUser: User = {
      id: faker.string.uuid(),
      username: userInput.username,
      email: userInput.email,
      password: userInput.password,
      createdAt: new Date(),
      posts: this.generateDefaultPosts()
    };

    this.users.push(newUser);
    this.saveUsersToFile(this.users);
    console.log(chalk.green('💾 Data saved to users.json'));
    
    return newUser;
  }

  public updateUser(id: string, updates: Partial<UserInput>): User | null {
    this.users = this.loadUsersFromFile();
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
    };

    this.users[userIndex] = updatedUser;
    this.saveUsersToFile(this.users);
    console.log(chalk.green('💾 Data saved to users.json'));
    
    return updatedUser;
  }

  public deleteUser(id: string): boolean {
    this.users = this.loadUsersFromFile();
    const initialLength = this.users.length;
    this.users = this.users.filter(user => user.id !== id);
    
    if (this.users.length < initialLength) {
      this.saveUsersToFile(this.users);
      console.log(chalk.green('💾 Data saved to users.json'));
      return true;
    }
    
    return false;
  }

  private generateDefaultPosts(): Post[] {
    const postCount = faker.number.int({ min: 1, max: 3 });
    return Array.from({ length: postCount }, (_, index) => ({
      id: faker.string.uuid(),
      title: `Welcome post ${index + 1}`,
      tag: faker.helpers.arrayElement(['general', 'personal', 'update']),
      content: faker.lorem.paragraphs(2),
      createdAt: new Date(),
      publishedBy: 'new-user'
    }));
  }

  public searchUsers(query: string): User[] {
    this.users = this.loadUsersFromFile();
    const lowerQuery = query.toLowerCase();
    return this.users.filter(user => 
      user.username.toLowerCase().includes(lowerQuery) ||
      user.email.toLowerCase().includes(lowerQuery)
    );
  }

  public getUsersWithPostCount(): { user: User, postCount: number }[] {
    this.users = this.loadUsersFromFile();
    return this.users.map(user => ({
      user,
      postCount: user.posts.length
    }));
  }

  public backupData(backupName: string = `backup-${Date.now()}.json`): void {
    const backupFile = join(__dirname, '..', 'backups', backupName);
    this.saveUsersToFile(this.users);
    console.log(chalk.green(`📦 Backup created: ${backupName}`));
  }

  public getFileInfo(): { filePath: string, exists: boolean, userCount: number } {
    const exists = existsSync(this.dataFile);
    return {
      filePath: this.dataFile,
      exists,
      userCount: this.users.length
    };
  }
}