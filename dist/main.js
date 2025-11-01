"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const terminal_app_1 = __importDefault(require("./console/terminal-app"));
async function main() {
    const app = new terminal_app_1.default();
    try {
        await app.start();
    }
    catch (err) {
        console.error(`Application error : ${err}`);
        process.exit(1);
    }
}
process.on("SIGINT", () => {
    console.log("\n Goodbye!");
    process.exit(0);
});
if (require.main === module) {
    main();
}
