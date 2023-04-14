const fs = require("fs");
const path = require("path");
const YAML = require('yaml');

// find all article
const findAllArticles = fs.readFileSync(path.join(__dirname, 'find-all.articles.yaml'), 'utf8');
const findAllArticlesParse = YAML.parse(findAllArticles);

// find one article
const findOneArticles = fs.readFileSync(path.join(__dirname, 'find-one.article.yaml'), 'utf8');
const findOneArticlesParse = YAML.parse(findOneArticles);


const authPaths = {
    '/articles': {
        ...findAllArticlesParse,
    },
    '/articles/find/{id}': {
        ...findOneArticlesParse,
    }
}

module.exports = authPaths;
