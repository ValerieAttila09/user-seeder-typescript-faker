"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateSampleData = generateSampleData;
exports.generateUserWithPosts = generateUserWithPosts;
const seed_1 = __importDefault(require("./seed"));
function generateSampleData() {
    const seeder = new seed_1.default();
    return seeder.getUsers();
}
function generateUserWithPosts() {
    const seeder = new seed_1.default();
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
