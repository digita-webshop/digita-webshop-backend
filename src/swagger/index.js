const fs = require("fs");
const path = require("path");
const YAML = require("yaml");

const options = fs.readFileSync(path.join(__dirname, 'options.yaml'), 'utf8');
const optionsParse = YAML.parse(options);

const paths = require("./paths");
const definitions = require("./definitions");

const swaggerDocument = {
    ...optionsParse,
    ...paths,
    ...definitions,
};

module.exports = swaggerDocument;