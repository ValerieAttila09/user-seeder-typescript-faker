import Seeder from './seed';
import chalk from 'chalk';

function initializeData() {
  console.log(chalk.blue('🚀 Initializing application data...'));
  
  const seeder = new Seeder();
  seeder.saveToUsersJSON();
  
  console.log(chalk.green('✅ Application ready! Run npm start to begin.'));
}

if (require.main === module) {
  initializeData();
}