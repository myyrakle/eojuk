const chalk = require("chalk");

console.red = (...args) => console.log(chalk.red(chalk.bold(...args)));
console.blue = (...args) => console.log(chalk.blue(chalk.bold(...args)));
console.green = (...args) => console.log(chalk.green(chalk.bold(...args)));
console.yellow = (...args) => console.log(chalk.yellow(chalk.bold(...args)));

module.exports = {};
