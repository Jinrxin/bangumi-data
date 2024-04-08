import path from "path";

import { dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const TIME_YEAR = 365 * 86400000;

const DATA_URL = "https://unpkg.com/bangumi-data@0.3/dist/data.json";
const CALENDAR_URL = "https://api.bgm.tv/calendar";

const distDir = path.join(__dirname, "..", "dist");
const subjectDir = path.join(distDir, "subject");

const subjectURL = (id) => {
  return `https://api.bgm.tv/subject/${id}`;
};

export {
  TIME_YEAR,
  DATA_URL,
  CALENDAR_URL,
  distDir,
  subjectDir,
  subjectURL,
};
