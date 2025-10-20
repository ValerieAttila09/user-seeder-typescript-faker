import readline from 'readline';
import chalk from 'chalk';
import Table from 'cli-table3';
import { UserService } from '../services/user-service';
import { User, UserInput } from '../interfaces/types';
import Seeder from '../seed';

class TerminalApp {
  private rl: readline.Interface;
  private userService: UserService;
  private isRunning: boolean = true;

  constructor() {
    this.rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });

    const seeder = new Seeder();
    this.userService = new UserService(seeder.getUsers());
  }

  private displayMenu(): void {
    console.log("\n" + chalk.cyan("🗂️ USER MANAGEMENT SYSTEM"));
    console.log(chalk.gray("==============================="));
    console.log(chalk.white("1. List All Users"));
    console.log(chalk.white("2. View User Details"));
    console.log(chalk.white("3. Add New User"));
    console.log(chalk.white("4. Edit User"));
    console.log(chalk.white("5. Delete user"));
    console.log(chalk.white("6. Search Users"));
    console.log(chalk.white("7. Statistics"));
    console.log(chalk.white("8. Exit"));
    console.log(chalk.gray("==============================="));
  }

  public async start(): Promise<void> {
    console.log(chalk.green.bold("🎉 Welcome to User Management System!"));

    while (this.isRunning) {
      this.displayMenu();
      const choice = await this.question(chalk.yellow("Choose an option (1-8) : "));

      switch (choice.trim()) {
        case '1':
          await this.listAllUsers();
          break;
        case '2':
          await this.viewUserDetails();
          break;
        case '3':
          await this.addUser();
          break;
        case '4':
          await this.editUser();
          break;
        case '5':
          await this.deleteUser();
          break;
        case '6':
          await this.searchUsers();
          break;
        case '7':
          await this.showStatistics();
          break;
        case '8':
          await this.exit();
          break;
        default:
          console.log(chalk.red("Invalid option! please choose 1-8."));
      }
    }
  }

  private question(prompt: string): Promise<string> {
    return new Promise((resolve => {
      this.rl.question(prompt, resolve);
    }));
  }

  private async listAllUsers(): Promise<void> {
    const users = this.userService.getAllUser();

    if (users.length === 0) {
      console.log(chalk.yellow("No users found."));
      return;
    }

    const table = new Table({
      head: [
        chalk.blue("ID"),
        chalk.blue("Username"),
        chalk.blue("Email"),
        chalk.blue("Posts"),
        chalk.blue("Created At"),
      ],
      colWidths: [10, 20, 25, 8, 20]
    });

    users.forEach((user) => {
      table.push([
        user.id.substring(0, 8) + "...",
        chalk.white(user.username),
        chalk.white(user.email),
        chalk.green(user.posts.length.toString()),
        user.createdAt.toLocaleDateString()
      ]);
    });

    console.log("\n", + chalk.cyan("All USERS"));
    console.log(table.toString());

    await this.question(chalk.gray('\nPress Enter to continue...'));
  }

  private async viewUserDetails(): Promise<void> {
    const userId = await this.question(chalk.yellow("Enter User ID : "));
    const user = this.userService.getUserById(userId);

    if (!user) {
      console.log(chalk.red("User not found!"));
      return;
    }

    console.log("\n" + chalk.cyan("USER DETAILS"));
    console.log(chalk.gray("==============================="));
    console.log(chalk.white(`ID : ${user.id}`));
    console.log(chalk.white(`Username : ${chalk.green(user.username)}`));
    console.log(chalk.white(`Email : ${chalk.green(user.email)}`));
    console.log(chalk.white(`Created At : ${chalk.green(user.createdAt.toLocaleTimeString())}`));
    console.log(chalk.white(`Total Posts : ${chalk.green(user.posts.length.toString())}`));

    if (user.posts.length > 0) {
      console.log("\n" + chalk.cyan("POSTS : "));
      user.posts.forEach((post, index) => {
        console.log(chalk.white(`${index + 1}. ${post.title}`));
        console.log(chalk.white(`\t${post.tag} | Created at : ${post.createdAt.toLocaleDateString()}`));
      });
    }

    await this.question(chalk.gray('Press Enter to continue...'));
  }

  private async addUser(): Promise<void> {
    console.log("\n" + chalk.cyan("ADD NEW USER"));

    const username = await this.question(chalk.yellow("Username : "));
    const email = await this.question(chalk.yellow("Email : "));
    const password = await this.question(chalk.yellow("Password : "));

    if (!username || !email || !password) {
      console.log(chalk.red("All fields are required!"));
      return;
    }

    const newUser: UserInput = { username, email, password };
    const createdUser = this.userService.addUser(newUser);

    console.log(chalk.green("User created successfully!"));
    console.log(chalk.white(`ID : ${createdUser.id}`));
    console.log(chalk.white(`Username : ${createdUser.username}`));
    console.log(chalk.white(`Email : ${createdUser.email}`));

    await this.question(chalk.gray("Press Enter to continue..."));
  }

  private async editUser(): Promise<void> {

  }

  private async deleteUser(): Promise<void> {

  }
  
  private async searchUsers(): Promise<void> {

  }
  
  private async showStatistics(): Promise<void> {

  }
  
  private async exit(): Promise<void> {

  }

}