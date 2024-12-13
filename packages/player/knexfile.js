import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * @type { Object.<string, import("knex").Knex.Config> }
 */
const config = {
  production: {
    client: "sqlite3",
    useNullAsDefault: true,
    migrations: { directory: path.join(__dirname, "resources", "migrations") }
  }
};

export default config;
