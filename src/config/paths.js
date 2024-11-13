// src/config/paths.js
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

// Setup untuk ES modules karena __dirname tidak tersedia
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const rootDir = path.resolve(__dirname, '..');

const paths = {
    models: path.join(rootDir, 'models'),
    services: path.join(rootDir, 'services'),
    routes: path.join(rootDir, 'routes')
};

export default paths;