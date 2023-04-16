const fs = require("fs");
const path = require("path");
const YAML = require('yaml');

// find all article
const findAllArticles = fs.readFileSync(path.join(__dirname, 'find-all.articles.yaml'), 'utf8');
const findAllArticlesParse = YAML.parse(findAllArticles);

// find one article
const findOneArticles = fs.readFileSync(path.join(__dirname, 'find-one.article.yaml'), 'utf8');
const findOneArticlesParse = YAML.parse(findOneArticles);

// find all articles reviews
const findAllArticlesReviews = fs.readFileSync(path.join(__dirname, 'find-all-reviews.article.yaml'), 'utf8');
const findAllArticlesReviewsParse = YAML.parse(findAllArticlesReviews);

// find one article reviews
const findOneArticleReviews = fs.readFileSync(path.join(__dirname, 'find-one-reviews.article.yaml'), 'utf8');
const findOneArticleReviewsParse = YAML.parse(findOneArticleReviews);


const authPaths = {
    '/articles': {
        ...findAllArticlesParse,
    },
    '/articles/find/{id}': {
        ...findOneArticlesParse,
    },
    '/articles/reviews': {
        ...findAllArticlesReviewsParse,
    },
    '/articles/reviews/{aid}': {
        ...findOneArticleReviewsParse,
    }
}

module.exports = authPaths;
