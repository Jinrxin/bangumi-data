import fs from "fs";
import path from "path";
import pkg from "../package.json" assert { type: "json" };

import { dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const updateVersion = (callback) => {
    let version = pkg.version.split(".");
    version[2] = version[2] - 0 + 1;
    const newVersion = version.join(".");
    pkg.version = newVersion;
    fs.writeFileSync(path.join(__dirname, "..", "package.json"), JSON.stringify(pkg));
    callback(newVersion);
};

export default updateVersion;
