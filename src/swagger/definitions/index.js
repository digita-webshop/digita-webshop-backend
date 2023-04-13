const fs = require("fs");
const path = require("path");
const YAML = require('yaml');

const createUser = fs.readFileSync(path.join(__dirname, 'user.yaml'), 'utf8');
const createUserParse = YAML.parse(createUser);

const definitions = {
    definitions: {
        ...createUserParse,
    },
};

module.exports = definitions;
