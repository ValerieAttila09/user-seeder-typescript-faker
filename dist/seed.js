"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const faker_1 = require("@faker-js/faker");
const fs_1 = require("fs");
const path_1 = require("path");
const chalk_1 = __importDefault(require("chalk"));
class Seeder {
    constructor() {
        this.users = [];
        this.generatedData();
    }
    generateUsername() {
        return faker_1.faker.internet.username().toLowerCase().replace(/[^a-z0-9_]/g, '');
    }
    generateEmail(username) {
        return `${username}@${faker_1.faker.internet.domainName()}`;
    }
    generatePassword() {
        return faker_1.faker.internet.password() + 'A1!';
    }
    generatePost(userId) {
        return {
            id: faker_1.faker.string.uuid(),
            title: faker_1.faker.lorem.sentence(),
            tag: faker_1.faker.helpers.arrayElement(['technology', 'lifestyle', 'travel', 'food', 'health', 'education']),
            content: faker_1.faker.lorem.paragraphs(3),
            createdAt: faker_1.faker.date.recent({ days: 60 }),
            publishedBy: userId
        };
    }
    generateUser() {
        const username = this.generateUsername();
        const userId = faker_1.faker.string.uuid();
        const postCount = faker_1.faker.number.int({ min: 1, max: 5 });
        const posts = Array.from({ length: postCount }, () => this.generatePost(userId));
        return {
            id: userId,
            username,
            email: this.generateEmail(username),
            password: this.generatePassword(),
            createdAt: faker_1.faker.date.past({ years: 1 }),
            posts
        };
    }
    generatedData() {
        this.users = Array.from({ length: 20 }, () => this.generateUser());
    }
    getUsers() {
        return this.users;
    }
    saveToJSON(filename = "seed-data.json") {
        const data = {
            generatedAt: new Date().toISOString(),
            totalUsers: this.users.length,
            totalPosts: this.users.reduce((sum, user) => sum + user.posts.length, 0),
            users: this.users
        };
        const filePath = (0, path_1.join)(__dirname, '..', filename);
        (0, fs_1.writeFileSync)(filePath, JSON.stringify(data, null, 2), 'utf-8');
        console.log(`Data berhasil disimpan ke: ${filePath}`);
    }
    saveToUsersJSON(filename = 'users.json') {
        const filePath = (0, path_1.join)(__dirname, '..', filename);
        (0, fs_1.writeFileSync)(filePath, JSON.stringify(this.users, null, 2), 'utf8');
        console.log(chalk_1.default.green(`✅ ${this.users.length} users saved to: ${filePath}`));
    }
    displaySummary() {
        console.log("\n SUMMARY DATA DUMMY ");
        console.log("===================");
        console.log(`Total users : ${this.users.length}`);
        console.log(`Total posts : ${this.users.reduce((sum, user) => sum + user.posts.length, 0)} posts`);
        console.log("\n5 User Pertama :");
        this.users.slice(0, 5).forEach((user, index) => {
            console.log(`${index + 1}. ${user.username} \t ${user.email} \t ${user.posts.length} posts`);
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
};
if (require.main === module) {
    main();
}
exports.default = Seeder;
