// src/config/paths.js
const path = require('path');

const rootDir = path.resolve(__dirname, '..');

module.exports = {
    models: path.join(rootDir, 'models'),
    services: path.join(rootDir, 'services'),
    routes: path.join(rootDir, 'routes')
};