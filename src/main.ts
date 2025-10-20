import TerminalApp from "./console/terminal-app";

async function main() {
  const app = new TerminalApp();

  try {
    await app.start();
  } catch (err) {
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