const chalk = require("chalk");

console.red = (...args) => {
    console.log(chalk.red(...args));
};

module.exports = {};
