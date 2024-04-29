import path from "path";

import { dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const TIME_YEAR = 365 * 86400000;

// 请求头
const USER_AGENT =
    "Jinrxin/bangumi-data(program-database)(https://github.com/Jinrxin/bangumi-data)";

// 数据地址
const DATA_URL = "https://unpkg.com/bangumi-data@0.3/dist/data.json";
const CALENDAR_URL = "https://api.bgm.tv/calendar";

// 主题数据
const subjectURL = (id) => {
    return `https://api.bgm.tv/v0/subjects/${id}`;
};

// 分集数据
const episodesURL = (id, limit = 100, offset = 0) => {
    return `https://api.bgm.tv/v0/episodes?subject_id=${id}&limit=${limit}&offset=${offset}`;
};

// 主题角色数据
const charatersURL = (id) => {
    return `https://api.bgm.tv/v0/subjects/${id}/characters`;
};
// 角色详情数据
const charaterDetailURL = (id) => {
    return `https://api.bgm.tv/v0/characters/${id}`;
};

// 数据存放目录
const distDir = path.join(__dirname, ".", "dist");
const subjectDir = path.join(distDir, "subject");
const subjectCharaterDir = path.join(distDir, "subject_charaters");
const charaterDir = path.join(distDir, "charater");

const config = {
    TIME_YEAR,
    USER_AGENT,
    DATA_URL,
    CALENDAR_URL,
    distDir,
    subjectDir,
    charaterDir,
    subjectCharaterDir,
    subjectURL,
    episodesURL,
    charatersURL,
    charaterDetailURL,
};

export default config;
