import readline from 'readline';
import chalk from 'chalk';
import Table from 'cli-table3';
import { UserService } from '../services/user-service';
import { User, UserInput } from '../interfaces/types';

class TerminalApp {
  private rl: readline.Interface;
  private userService: UserService;
  private isRunning: boolean = true;

  constructor() {
    this.rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });
    this.userService = new UserService([], 'users.json');
  }

  private showFileInfo(): void {
    const fileInfo = this.userService.getFileInfo();
    console.log(chalk.blue('📁 Data File: ') + chalk.white(fileInfo.filePath));
    console.log(chalk.blue('👥 Loaded Users: ') + chalk.white(fileInfo.userCount.toString()));
  }

  private async showIntro(): Promise<void> {
    console.clear();

    const title = `
${chalk.blue('██╗   ██╗')}███████╗${chalk.blue('██╗   ██╗')}██████╗ ${chalk.blue('██╗   ██╗')}███████╗${chalk.blue('██████╗ ')}
${chalk.blue('██║   ██║')}██╔════╝${chalk.blue('██║   ██║')}██╔══██╗${chalk.blue('╚██╗ ██╔╝')}██╔════╝${chalk.blue('██╔══██╗')}
${chalk.blue('██║   ██║')}█████╗  ${chalk.blue('██║   ██║')}██████╔╝${chalk.blue(' ╚████╔╝ ')}█████╗  ${chalk.blue('██████╔╝')}
${chalk.blue('╚██╗ ██╔╝')}██╔══╝  ${chalk.blue('██║   ██║')}██╔══██╗${chalk.blue('  ╚██╔╝  ')}██╔══╝  ${chalk.blue('██╔══██╗')}
${chalk.blue(' ╚████╔╝ ')}███████╗${chalk.blue('╚██████╔╝')}██║  ██║${chalk.blue('   ██║   ')}███████╗${chalk.blue('██║  ██║')}
${chalk.blue('  ╚═══╝  ')}╚══════╝${chalk.blue(' ╚═════╝ ')}╚═╝  ╚═╝${chalk.blue('   ╚═╝   ')}╚══════╝${chalk.blue('╚═╝  ╚═╝')}
    `;
    console.log(title);

    console.log(chalk.gray('╔════════════════════════════════════════════════════════════╗'));
    console.log(chalk.cyan('              USER MANAGEMENT SYSTEM v1.0'));
    console.log(chalk.gray('╚════════════════════════════════════════════════════════════╝'));
    console.log(chalk.white('💻 Platform: ') + chalk.green(process.platform));
    console.log(chalk.white('🔧 Node.js: ') + chalk.green(process.version));
    console.log(chalk.white('📂 Process ID: ') + chalk.green(process.pid.toString()));
    console.log(chalk.gray('┌────────────────────────────────────────────────────────────┐'));
    console.log(chalk.magenta('🚀 Ready to manage your users efficiently!'));
    console.log(chalk.gray('└────────────────────────────────────────────────────────────┘'));

    await this.question(chalk.yellow('\nPress Enter to continue...'));
    console.clear();
  }

  private displayMenu(): void {
    console.log('\n' + chalk.bgBlue.white(' 🗂️  USER MANAGEMENT SYSTEM '));
    console.log(chalk.gray('┌────────────────────────────────────────────────────────────┐'));
    console.log(chalk.gray('│') + chalk.white(' 1. 📋 List All Users                                       ') + chalk.gray('│'));
    console.log(chalk.gray('│') + chalk.white(' 2. 👤 View User Details                                    ') + chalk.gray('│'));
    console.log(chalk.gray('│') + chalk.white(' 3. ➕ Add New User                                         ') + chalk.gray('│'));
    console.log(chalk.gray('│') + chalk.white(' 4. ✏️  Edit User                                           ') + chalk.gray('│'));
    console.log(chalk.gray('│') + chalk.white(' 5. 🗑️  Delete User                                         ') + chalk.gray('│'));
    console.log(chalk.gray('│') + chalk.white(' 6. 🔍 Search Users                                         ') + chalk.gray('│'));
    console.log(chalk.gray('│') + chalk.white(' 7. 📊 Statistics                                           ') + chalk.gray('│'));
    console.log(chalk.gray('│') + chalk.white(' 8. 💾 Reload from File                                     ') + chalk.gray('│'));
    console.log(chalk.gray('│') + chalk.white(' 9. 🚪 Exit                                                 ') + chalk.gray('│'));
    console.log(chalk.gray('└────────────────────────────────────────────────────────────┘'));
  }

  public async start(): Promise<void> {
    await this.showIntro();
    console.log(chalk.green.bold("🎉 Welcome to User Management System!"));
    while (this.isRunning) {
      this.displayMenu();
      const choice = await this.question(chalk.yellow("\nChoose an option (1-9) : "));

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
          await this.reloadFromFile();
          break;
        case '9':
          await this.exit();
          break;
        default:
          console.log(chalk.red('❌ Invalid option! Please choose 1-9.'));
      }
    }
  }

  private question(prompt: string): Promise<string> {
    return new Promise((resolve => {
      this.rl.question(prompt, resolve);
    }));
  }

  private async listAllUsers(): Promise<void> {
    const users = this.userService.getAllUsers();

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
      colWidths: [16, 20, 25, 8, 20]
    });

    users.forEach((user) => {
      table.push([
        user.id.substring(0, 16) + "...",
        chalk.white(user.username),
        chalk.white(user.email),
        chalk.green(user.posts.length.toString()),
        user.createdAt.toLocaleDateString()
      ]);
    });

    console.log("\n", + chalk.cyan("All USERS"));
    console.log(table.toString());

    await this.question(chalk.gray('\n\nPress Enter to continue...'));
  }

  private async viewUserDetails(): Promise<void> {
    const userId = await this.question(chalk.yellow("Enter User ID : "));
    const user = this.userService.getUserById(userId);
    if (!user) {
      console.log(chalk.red("User not found!"));
      return;
    }

    console.log("\n" + chalk.cyan("USER DETAILS"));
    console.log(chalk.gray("┌────────────────────────────────────────────────────────────┐"));
    console.log(chalk.gray("│") + chalk.white(` ID : ${user.id}`.padEnd(60)) + chalk.gray("│"));
    console.log(chalk.gray("│") + chalk.white(` Username : ${chalk.green(user.username)}`.padEnd(70)) + chalk.gray("│"));
    console.log(chalk.gray("│") + chalk.white(` Email : ${chalk.green(user.email)}`.padEnd(70)) + chalk.gray("│"));
    console.log(chalk.gray("│") + chalk.white(` Created At : ${chalk.green(user.createdAt.toLocaleTimeString())}`.padEnd(70)) + chalk.gray("│"));
    console.log(chalk.gray("│") + chalk.white(` Total Posts : ${chalk.green(user.posts.length.toString())}`.padEnd(70)) + chalk.gray("│"));
    console.log(chalk.gray("└────────────────────────────────────────────────────────────┘"));

    if (user.posts.length > 0) {
      console.log("\n" + chalk.cyan("📝 POSTS"));
      console.log(chalk.gray("┌────────────────────────────────────────────────────────────┐"));
      
      user.posts.forEach((post, index) => {
        console.log(chalk.gray("│") + chalk.bgGreen.white(chalk.white(` ${index + 1}. ${chalk.bold(post.title)}`.padEnd(69))) + chalk.gray("│"));
        console.log(chalk.gray("├────────────────────────────────────────────────────────────┤"));
        
        console.log(chalk.gray("│") + chalk.white(` Tag : ${chalk.yellow(post.tag)}`.padEnd(70)) + chalk.gray("│"));
        console.log(chalk.gray("│") + chalk.white(` Created : ${chalk.green(post.createdAt.toLocaleDateString())}`.padEnd(70)) + chalk.gray("│"));
        
        const contentPreview = post.content.substring(0, 42) + (post.content.length > 42 ? "..." : "");
        console.log(chalk.gray("│") + chalk.white(` Content :`.padEnd(60)) + chalk.gray("│"));
        console.log(chalk.gray("│") + chalk.gray(` ${contentPreview}`.padEnd(60)) + chalk.gray("│"));
        
        if (index < user.posts.length - 1) {
          console.log(chalk.gray("├────────────────────────────────────────────────────────────┤"));
        }
      });
      console.log(chalk.gray("└────────────────────────────────────────────────────────────┘"));
    } else {
      console.log("\n" + chalk.yellow("No posts found for this user."));
    }
    await this.question(chalk.gray('\nPress Enter to continue...'));
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
    console.log(chalk.gray("┌────────────────────────────────────────────────────────────┐"));
    console.log(chalk.gray("│") + chalk.white(` ID : ${createdUser.id}`.padEnd(58)) + chalk.gray("│"));
    console.log(chalk.gray("│") + chalk.white(` Username : ${createdUser.username}`.padEnd(58)) + chalk.gray("│"));
    console.log(chalk.gray("│") + chalk.white(` Email : ${createdUser.email}`.padEnd(58)) + chalk.gray("│"));
    console.log(chalk.gray("└────────────────────────────────────────────────────────────┘"));

    await this.question(chalk.gray("\nPress Enter to continue..."));
  }

  private async editUser(): Promise<void> {
    const userId = await this.question(chalk.yellow("Enter User ID to edit : "));
    const user = this.userService.getUserById(userId);

    if (!user) {
      console.log(chalk.red("User not found!"));
      return;
    }

    console.log("\n" + chalk.cyan("EDIT USER"));
    console.log(chalk.gray("┌────────────────────────────────────────────────────────────┐"));
    console.log(chalk.gray("│") + chalk.white(" Leave blank to keep current value".padEnd(60)) + chalk.gray("│"));
    console.log(chalk.gray("└────────────────────────────────────────────────────────────┘"));

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
      console.log(chalk.gray("┌────────────────────────────────────────────────────────────┐"));
      console.log(chalk.gray("│") + chalk.white(` Username : ${updatedUser.username}`.padEnd(60)) + chalk.gray("│"));
      console.log(chalk.gray("│") + chalk.white(` Email : ${updatedUser.email}`.padEnd(60)) + chalk.gray("│"));
      console.log(chalk.gray("└────────────────────────────────────────────────────────────┘"));
    } else {
      console.log(chalk.red("Failed to update user!"));
    }

    await this.question(chalk.gray("\nPress Enter to continue..."));
  }

  private async deleteUser(): Promise<void> {
    const userId = await this.question(chalk.yellow("Enter User ID to delete : "));
    const user = this.userService.getUserById(userId);

    if (!user) {
      console.log(chalk.red("User not found!"));
      return;
    }

    console.log(chalk.gray("┌────────────────────────────────────────────────────────────┐"));
    console.log(chalk.red("│ WARNING: This action cannot be undone!".padEnd(60)) + chalk.gray("│"));
    console.log(chalk.gray("│") + chalk.white(` You are about to delete user : ${chalk.red(user.username)}`.padEnd(60)) + chalk.gray("│"));
    console.log(chalk.gray("│") + chalk.white(` This will also delete ${chalk.red(user.posts.length.toString())} posts.`.padEnd(60)) + chalk.gray("│"));
    console.log(chalk.gray("└────────────────────────────────────────────────────────────┘"));

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

    await this.question(chalk.gray('\nPress Enter to Continue...'));
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
      colWidths: [20, 20, 25, 8]
    });

    results.forEach((user) => {
      table.push([
        user.id.substring(0, 14) + "...",
        chalk.white(user.username),
        chalk.white(user.email),
        chalk.green(user.posts.length.toString())
      ]);
    });

    console.log("\n" + chalk.cyan(`SEARCH RESULTS (${results.length} found)`));
    console.log(table.toString());

    await this.question(chalk.gray("\nPress Enter to continue..."))
  }

  private async showStatistics(): Promise<void> {
    const users = this.userService.getAllUsers();
    const totalPosts = users.reduce((sum, user) => sum + user.posts.length, 0);
    const usersWithPosts = users.filter((user) => user.posts.length > 0).length;

    console.log("\n" + chalk.green("STATISTICS"));
    console.log(chalk.gray("┌────────────────────────────────────────────────────────────┐"));
    console.log(chalk.gray("│") + chalk.white(` Total Users : ${chalk.cyan(users.length.toString())}`.padEnd(70)) + chalk.gray("│"));
    console.log(chalk.gray("│") + chalk.white(` Total Posts : ${chalk.cyan(totalPosts.toString())}`.padEnd(70)) + chalk.gray("│"));
    console.log(chalk.gray("│") + chalk.white(` Users with Posts : ${chalk.cyan(usersWithPosts.toString())}`.padEnd(70)) + chalk.gray("│"));
    console.log(chalk.gray("│") + chalk.white(` Average Posts per User : ${chalk.cyan((totalPosts / users.length).toFixed(2))}`.padEnd(70)) + chalk.gray("│"));

    const recentUsers = users.filter((user) => {
      user.createdAt > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    });

    console.log(chalk.gray("│") + chalk.white(` New Users (last 7 days): ${chalk.green(recentUsers.length.toString())}`.padEnd(70)) + chalk.gray("│"));
    console.log(chalk.gray("└────────────────────────────────────────────────────────────┘"));

    await this.question(chalk.gray("\n\nPress Enter to continue..."))
  }

  private async reloadFromFile(): Promise<void> {
    console.log(chalk.yellow('🔄 Reloading data from users.json...'));

    this.userService = new UserService([], 'users.json');
    const users = this.userService.getAllUsers();

    console.log(chalk.green(`✅ Reloaded ${users.length} users from file`));
    this.showFileInfo();

    await this.question(chalk.gray('\nPress Enter to continue...'));
  }

  private async exit(): Promise<void> {
    console.log(chalk.green("\nThank you for using User Management System!"));
    this.isRunning = false;
    this.rl.close();
  }
}

export default TerminalApp;