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
    const userId = await this.question(chalk.yellow("Enter User ID to edit : "));
    const user = this.userService.getUserById(userId);

    if (!user) {
      console.log(chalk.red("User not found!"));
      return;
    }

    console.log("\n" + chalk.cyan("EDIT USER"));
    console.log(chalk.gray("Leave blank to keep current value\n"));

    const username = await this.question(chalk.yellow(`Username (${user.username}) : `));
    const email = await this.question(chalk.yellow(`Email (${user.email}) : `));
    const password = await this.question(chalk.yellow(`Passowrd (leave blank to keep) : `));

    const updates: Partial<UserInput> = {};
    if (username) updates.username = username;
    if (email) updates.email = email;
    if (password) updates.password = password;

    if (Object.keys(updates).length === 0) {
      console.log(chalk.yellow("No changes made."));
      return;
    }

    const updatedUser = this.userService.updateUser(userId, updates);

    if (updatedUser) {
      console.log(chalk.green("User updated successfull!"));
      console.log(chalk.white(`Username : ${updatedUser.username}`));
      console.log(chalk.white(`Email : ${updatedUser.email}`));
    } else {
      console.log(chalk.red("Failed to update user!"));
    }

    await this.question(chalk.gray("Press Enter to continue..."));
  }

  private async deleteUser(): Promise<void> {
    const userId = await this.question(chalk.yellow("Enter User ID to delete : "));
    const user = this.userService.getUserById(userId);

    if (!user) {
      console.log(chalk.red("User not found!"));
      return;
    }

    console.log(`\n${chalk.red("WARNING: This action cannot be undone!")}`);
    console.log(chalk.white(`You are about to delete user : ${chalk.red(user.username)}`));
    console.log(chalk.white(`This will also delete ${chalk.red(user.posts.length.toString())} posts.`));

    const confirm = await this.question(chalk.yellow("Type 'DELETE' to confirm : "));

    if (confirm.trim().toUpperCase() === "DELETE") {
      const success = this.userService.deleteUser(userId);
      if (success) {
        console.log(chalk.green("User deleted successfully!"));
      } else {
        console.log(chalk.red("Failed to delete user!"));
      }
    } else {
      console.log(chalk.yellow("Deletion cancelled."));
    }

    await this.question(chalk.gray('Press Enter to Continue...'));
  }
  
  private async searchUsers(): Promise<void> {
    const query = await this.question(chalk.yellow('Search by username or email : '));

    if (!query.trim()) {
      console.log(chalk.red("Please enter a search query!"));
      return;
    }

    const results = this.userService.searchUsers(query);

    if (results.length === 0) {
      console.log(chalk.yellow("No users found matching your search."));
      return;
    }

    const table = new Table({
      head: [
        chalk.blue("ID"),
        chalk.blue("Username"),
        chalk.blue("Email"),
        chalk.blue("Posts"),
      ],
      colWidths: [10, 20, 25, 8]
    });

    results.forEach((user) => {
      table.push([
        user.id.substring(0, 8) + "...",
        chalk.white(user.username),
        chalk.white(user.email),
        chalk.green(user.posts.length.toString())
      ]);
    });

    console.log("\n" + chalk.cyan(`SEARCH RESULTS (${results.length} found)`));
    console.log(table.toString());

    await this.question(chalk.gray("Press Enter to continue..."))
  }
  
  private async showStatistics(): Promise<void> {
    const users = this.userService.getAllUser();
    const totalPosts = users.reduce((sum, user) => sum + user.posts.length, 0);
    const usersWithPosts = users.filter((user) => user.posts.length > 0).length;

    console.log("\n" + chalk.green("STATISTICS"));
    console.log(chalk.gray("==============================="));
    console.log(chalk.white(`Total Users : ${chalk.cyan(users.length.toString())}`));
    console.log(chalk.white(`Total Posts : ${chalk.cyan(totalPosts.toString())}`));
    console.log(chalk.white(`Users with Posts : ${chalk.cyan(usersWithPosts.toString())}`));
    console.log(chalk.white(`Total Users : ${chalk.cyan((totalPosts / users.length).toFixed(2))}`));

    const recentUsers = users.filter((user) => {
      user.createdAt > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    });

    console.log(chalk.white(`New Users (last 7 days): ${chalk.green(recentUsers.length.toString())}`));

    await this.question(chalk.gray("\nPress Enter to continue..."))
  }
  
  private async exit(): Promise<void> {
    console.log(chalk.green("\nThank you for using User Management System!"));
    this.isRunning = false;
    this.rl.close();
  }
}

export default TerminalApp;