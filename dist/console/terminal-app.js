"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const readline_1 = __importDefault(require("readline"));
const chalk_1 = __importDefault(require("chalk"));
const cli_table3_1 = __importDefault(require("cli-table3"));
const user_service_1 = require("../services/user-service");
class TerminalApp {
    constructor() {
        this.isRunning = true;
        this.rl = readline_1.default.createInterface({
            input: process.stdin,
            output: process.stdout
        });
        this.userService = new user_service_1.UserService([], 'users.json');
        this.showFileInfo();
    }
    showFileInfo() {
        const fileInfo = this.userService.getFileInfo();
        console.log(chalk_1.default.blue('📁 Data File: ') + chalk_1.default.white(fileInfo.filePath));
        console.log(chalk_1.default.blue('👥 Loaded Users: ') + chalk_1.default.white(fileInfo.userCount.toString()));
    }
    displayMenu() {
        console.log('\n' + chalk_1.default.cyan('🗂️  USER MANAGEMENT SYSTEM'));
        console.log(chalk_1.default.gray('========================================'));
        console.log(chalk_1.default.white('1. 📋 List All Users'));
        console.log(chalk_1.default.white('2. 👤 View User Details'));
        console.log(chalk_1.default.white('3. ➕ Add New User'));
        console.log(chalk_1.default.white('4. ✏️  Edit User'));
        console.log(chalk_1.default.white('5. 🗑️  Delete User'));
        console.log(chalk_1.default.white('6. 🔍 Search Users'));
        console.log(chalk_1.default.white('7. 📊 Statistics'));
        console.log(chalk_1.default.white('8. 💾 Reload from File'));
        console.log(chalk_1.default.white('9. 🚪 Exit'));
        console.log(chalk_1.default.gray('========================================'));
    }
    async start() {
        console.log(chalk_1.default.green.bold("🎉 Welcome to User Management System!"));
        while (this.isRunning) {
            this.displayMenu();
            const choice = await this.question(chalk_1.default.yellow("Choose an option (1-9) : "));
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
                    console.log(chalk_1.default.red('❌ Invalid option! Please choose 1-9.'));
            }
        }
    }
    question(prompt) {
        return new Promise((resolve => {
            this.rl.question(prompt, resolve);
        }));
    }
    async listAllUsers() {
        const users = this.userService.getAllUsers();
        if (users.length === 0) {
            console.log(chalk_1.default.yellow("No users found."));
            return;
        }
        const table = new cli_table3_1.default({
            head: [
                chalk_1.default.blue("ID"),
                chalk_1.default.blue("Username"),
                chalk_1.default.blue("Email"),
                chalk_1.default.blue("Posts"),
                chalk_1.default.blue("Created At"),
            ],
            colWidths: [16, 20, 25, 8, 20]
        });
        users.forEach((user) => {
            table.push([
                user.id.substring(0, 16) + "...",
                chalk_1.default.white(user.username),
                chalk_1.default.white(user.email),
                chalk_1.default.green(user.posts.length.toString()),
                user.createdAt.toLocaleDateString()
            ]);
        });
        console.log("\n", +chalk_1.default.cyan("All USERS"));
        console.log(table.toString());
        await this.question(chalk_1.default.gray('\n\nPress Enter to continue...'));
    }
    async viewUserDetails() {
        const userId = await this.question(chalk_1.default.yellow("Enter User ID : "));
        const user = this.userService.getUserById(userId);
        if (!user) {
            console.log(chalk_1.default.red("User not found!"));
            return;
        }
        console.log("\n" + chalk_1.default.cyan("USER DETAILS"));
        console.log(chalk_1.default.gray("==============================="));
        console.log(chalk_1.default.white(`ID : ${user.id}`));
        console.log(chalk_1.default.white(`Username : ${chalk_1.default.green(user.username)}`));
        console.log(chalk_1.default.white(`Email : ${chalk_1.default.green(user.email)}`));
        console.log(chalk_1.default.white(`Created At : ${chalk_1.default.green(user.createdAt.toLocaleTimeString())}`));
        console.log(chalk_1.default.white(`Total Posts : ${chalk_1.default.green(user.posts.length.toString())}`));
        if (user.posts.length > 0) {
            console.log("\n" + chalk_1.default.cyan("POSTS : "));
            user.posts.forEach((post, index) => {
                console.log(chalk_1.default.white(`${index + 1}. ${post.title}`));
                console.log(chalk_1.default.white(`${post.tag} | Created at : ${post.createdAt.toLocaleDateString()}`));
                console.log(chalk_1.default.white(`Content : \n${chalk_1.default.gray(post.content.substring(0, 369))}...\n`));
            });
        }
        await this.question(chalk_1.default.gray('\nPress Enter to continue...'));
    }
    async addUser() {
        console.log("\n" + chalk_1.default.cyan("ADD NEW USER"));
        const username = await this.question(chalk_1.default.yellow("Username : "));
        const email = await this.question(chalk_1.default.yellow("Email : "));
        const password = await this.question(chalk_1.default.yellow("Password : "));
        if (!username || !email || !password) {
            console.log(chalk_1.default.red("All fields are required!"));
            return;
        }
        const newUser = { username, email, password };
        const createdUser = this.userService.addUser(newUser);
        console.log(chalk_1.default.green("User created successfully!"));
        console.log(chalk_1.default.white(`ID : ${createdUser.id}`));
        console.log(chalk_1.default.white(`Username : ${createdUser.username}`));
        console.log(chalk_1.default.white(`Email : ${createdUser.email}`));
        await this.question(chalk_1.default.gray("\nPress Enter to continue..."));
    }
    async editUser() {
        const userId = await this.question(chalk_1.default.yellow("Enter User ID to edit : "));
        const user = this.userService.getUserById(userId);
        if (!user) {
            console.log(chalk_1.default.red("User not found!"));
            return;
        }
        console.log("\n" + chalk_1.default.cyan("EDIT USER"));
        console.log(chalk_1.default.gray("Leave blank to keep current value\n"));
        const username = await this.question(chalk_1.default.yellow(`Username (${user.username}) : `));
        const email = await this.question(chalk_1.default.yellow(`Email (${user.email}) : `));
        const password = await this.question(chalk_1.default.yellow(`Passowrd (leave blank to keep) : `));
        const updates = {};
        if (username)
            updates.username = username;
        if (email)
            updates.email = email;
        if (password)
            updates.password = password;
        if (Object.keys(updates).length === 0) {
            console.log(chalk_1.default.yellow("No changes made."));
            return;
        }
        const updatedUser = this.userService.updateUser(userId, updates);
        if (updatedUser) {
            console.log(chalk_1.default.green("User updated successfull!"));
            console.log(chalk_1.default.white(`Username : ${updatedUser.username}`));
            console.log(chalk_1.default.white(`Email : ${updatedUser.email}`));
        }
        else {
            console.log(chalk_1.default.red("Failed to update user!"));
        }
        await this.question(chalk_1.default.gray("\nPress Enter to continue..."));
    }
    async deleteUser() {
        const userId = await this.question(chalk_1.default.yellow("Enter User ID to delete : "));
        const user = this.userService.getUserById(userId);
        if (!user) {
            console.log(chalk_1.default.red("User not found!"));
            return;
        }
        console.log(`\n${chalk_1.default.red("WARNING: This action cannot be undone!")}`);
        console.log(chalk_1.default.white(`You are about to delete user : ${chalk_1.default.red(user.username)}`));
        console.log(chalk_1.default.white(`This will also delete ${chalk_1.default.red(user.posts.length.toString())} posts.`));
        const confirm = await this.question(chalk_1.default.yellow("Type 'DELETE' to confirm : "));
        if (confirm.trim().toUpperCase() === "DELETE") {
            const success = this.userService.deleteUser(userId);
            if (success) {
                console.log(chalk_1.default.green("User deleted successfully!"));
            }
            else {
                console.log(chalk_1.default.red("Failed to delete user!"));
            }
        }
        else {
            console.log(chalk_1.default.yellow("Deletion cancelled."));
        }
        await this.question(chalk_1.default.gray('\nPress Enter to Continue...'));
    }
    async searchUsers() {
        const query = await this.question(chalk_1.default.yellow('Search by username or email : '));
        if (!query.trim()) {
            console.log(chalk_1.default.red("Please enter a search query!"));
            return;
        }
        const results = this.userService.searchUsers(query);
        if (results.length === 0) {
            console.log(chalk_1.default.yellow("No users found matching your search."));
            return;
        }
        const table = new cli_table3_1.default({
            head: [
                chalk_1.default.blue("ID"),
                chalk_1.default.blue("Username"),
                chalk_1.default.blue("Email"),
                chalk_1.default.blue("Posts"),
            ],
            colWidths: [20, 20, 25, 8]
        });
        results.forEach((user) => {
            table.push([
                user.id.substring(0, 14) + "...",
                chalk_1.default.white(user.username),
                chalk_1.default.white(user.email),
                chalk_1.default.green(user.posts.length.toString())
            ]);
        });
        console.log("\n" + chalk_1.default.cyan(`SEARCH RESULTS (${results.length} found)`));
        console.log(table.toString());
        await this.question(chalk_1.default.gray("\nPress Enter to continue..."));
    }
    async showStatistics() {
        const users = this.userService.getAllUsers();
        const totalPosts = users.reduce((sum, user) => sum + user.posts.length, 0);
        const usersWithPosts = users.filter((user) => user.posts.length > 0).length;
        console.log("\n" + chalk_1.default.green("STATISTICS"));
        console.log(chalk_1.default.gray("==============================="));
        console.log(chalk_1.default.white(`Total Users : ${chalk_1.default.cyan(users.length.toString())}`));
        console.log(chalk_1.default.white(`Total Posts : ${chalk_1.default.cyan(totalPosts.toString())}`));
        console.log(chalk_1.default.white(`Users with Posts : ${chalk_1.default.cyan(usersWithPosts.toString())}`));
        console.log(chalk_1.default.white(`Total Users : ${chalk_1.default.cyan((totalPosts / users.length).toFixed(2))}`));
        const recentUsers = users.filter((user) => {
            user.createdAt > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
        });
        console.log(chalk_1.default.white(`New Users (last 7 days): ${chalk_1.default.green(recentUsers.length.toString())}`));
        await this.question(chalk_1.default.gray("\n\nPress Enter to continue..."));
    }
    async reloadFromFile() {
        console.log(chalk_1.default.yellow('🔄 Reloading data from users.json...'));
        this.userService = new user_service_1.UserService([], 'users.json');
        const users = this.userService.getAllUsers();
        console.log(chalk_1.default.green(`✅ Reloaded ${users.length} users from file`));
        this.showFileInfo();
        await this.question(chalk_1.default.gray('\nPress Enter to continue...'));
    }
    async exit() {
        console.log(chalk_1.default.green("\nThank you for using User Management System!"));
        this.isRunning = false;
        this.rl.close();
    }
}
exports.default = TerminalApp;
