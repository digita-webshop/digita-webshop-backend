const authPaths = require('./auth');
const articlesPaths = require('./articles');

const paths = {
    paths: {
        ...authPaths,
        ...articlesPaths,
    },
};

module.exports = paths;
