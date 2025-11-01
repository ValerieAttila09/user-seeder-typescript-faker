"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const seed_1 = __importDefault(require("./seed"));
const chalk_1 = __importDefault(require("chalk"));
function initializeData() {
    console.log(chalk_1.default.blue('🚀 Initializing application data...'));
    const seeder = new seed_1.default();
    seeder.saveToUsersJSON();
    console.log(chalk_1.default.green('✅ Application ready! Run npm start to begin.'));
}
if (require.main === module) {
    initializeData();
}
