const fs = require("fs");
const path = require("path");
const YAML = require('yaml');

const createUser = fs.readFileSync(path.join(__dirname, 'user.yaml'), 'utf8');
const createUserParse = YAML.parse(createUser);

// articles
const article = fs.readFileSync(path.join(__dirname, 'article.yaml'), 'utf8');
const articleParse = YAML.parse(article);

const definitions = {
    definitions: {
        ...createUserParse,
        ...articleParse,
    },
};

module.exports = definitions;
