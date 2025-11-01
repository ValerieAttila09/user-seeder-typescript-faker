"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserService = void 0;
const faker_1 = require("@faker-js/faker");
const fs_1 = require("fs");
const path_1 = require("path");
const chalk_1 = __importDefault(require("chalk"));
class UserService {
    constructor(users = [], dataFile = 'users.json') {
        this.users = [];
        this.dataFile = (0, path_1.join)(__dirname, '..', dataFile);
        this.users = users.length > 0 ? users : this.loadUsersFromFile();
    }
    loadUsersFromFile() {
        try {
            if (!(0, fs_1.existsSync)(this.dataFile)) {
                console.log(chalk_1.default.yellow('📁 users.json not found. Creating new file...'));
                this.saveUsersToFile([]);
                return [];
            }
            const data = (0, fs_1.readFileSync)(this.dataFile, 'utf8');
            const parsedData = JSON.parse(data);
            const users = parsedData.map((user) => ({
                ...user,
                createdAt: new Date(user.createdAt),
                posts: user.posts.map((post) => ({
                    ...post,
                    createdAt: new Date(post.createdAt)
                }))
            }));
            console.log(chalk_1.default.green(`✅ Loaded ${users.length} users from ${this.dataFile}`));
            return users;
        }
        catch (error) {
            console.log(chalk_1.default.red(`❌ Error loading users from file: ${error}`));
            return [];
        }
    }
    saveUsersToFile(users) {
        try {
            const data = JSON.stringify(users, null, 2);
            (0, fs_1.writeFileSync)(this.dataFile, data, 'utf8');
        }
        catch (error) {
            console.log(chalk_1.default.red(`❌ Error saving users to file: ${error}`));
        }
    }
    getAllUsers() {
        this.users = this.loadUsersFromFile();
        return this.users;
    }
    getUserById(id) {
        this.users = this.loadUsersFromFile();
        return this.users.find(user => user.id === id);
    }
    addUser(userInput) {
        this.users = this.loadUsersFromFile();
        const newUser = {
            id: faker_1.faker.string.uuid(),
            username: userInput.username,
            email: userInput.email,
            password: userInput.password,
            createdAt: new Date(),
            posts: this.generateDefaultPosts()
        };
        this.users.push(newUser);
        this.saveUsersToFile(this.users);
        console.log(chalk_1.default.green('💾 Data saved to users.json'));
        return newUser;
    }
    updateUser(id, updates) {
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
        console.log(chalk_1.default.green('💾 Data saved to users.json'));
        return updatedUser;
    }
    deleteUser(id) {
        this.users = this.loadUsersFromFile();
        const initialLength = this.users.length;
        this.users = this.users.filter(user => user.id !== id);
        if (this.users.length < initialLength) {
            this.saveUsersToFile(this.users);
            console.log(chalk_1.default.green('💾 Data saved to users.json'));
            return true;
        }
        return false;
    }
    generateDefaultPosts() {
        const postCount = faker_1.faker.number.int({ min: 1, max: 3 });
        return Array.from({ length: postCount }, (_, index) => ({
            id: faker_1.faker.string.uuid(),
            title: `Welcome post ${index + 1}`,
            tag: faker_1.faker.helpers.arrayElement(['general', 'personal', 'update']),
            content: faker_1.faker.lorem.paragraphs(2),
            createdAt: new Date(),
            publishedBy: 'new-user'
        }));
    }
    searchUsers(query) {
        this.users = this.loadUsersFromFile();
        const lowerQuery = query.toLowerCase();
        return this.users.filter(user => user.username.toLowerCase().includes(lowerQuery) ||
            user.email.toLowerCase().includes(lowerQuery));
    }
    getUsersWithPostCount() {
        this.users = this.loadUsersFromFile();
        return this.users.map(user => ({
            user,
            postCount: user.posts.length
        }));
    }
    backupData(backupName = `backup-${Date.now()}.json`) {
        const backupFile = (0, path_1.join)(__dirname, '..', 'backups', backupName);
        this.saveUsersToFile(this.users);
        console.log(chalk_1.default.green(`📦 Backup created: ${backupName}`));
    }
    getFileInfo() {
        const exists = (0, fs_1.existsSync)(this.dataFile);
        return {
            filePath: this.dataFile,
            exists,
            userCount: this.users.length
        };
    }
}
exports.UserService = UserService;
