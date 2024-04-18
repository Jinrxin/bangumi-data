import fs from "fs";
import path from "path";
import axios from "axios";

import config from "../config.js";
import saveSubjectList from "./saveSubject.js";

/**
 * 查询近一年内放送的动漫
 */
const saveRecentDataSubject = async () => {
    try {
        console.log("开始查询近一年内放送的动漫");
        const res = await axios.get(config.DATA_URL);
        const data = res.data;
        await fs.promises.writeFile(path.join(config.distDir, "data.json"), JSON.stringify(data));
        console.log("写入data.json完成");
        // 近一年动漫列表id
        const subjectIds = [];
        data.items.forEach((item) => {
            const site = item.sites.filter((value) => value.site == "bangumi");
            if (site[0] && isRecent(item.begin)) {
                subjectIds.push(site[0].id);
            }
        });
        // 写入动漫
        await saveSubjectList(subjectIds, 500, 10);
        console.log("保存近一年内放送的动漫完成");
    } catch (error) {
        console.error("保存近一年内放送的动漫失败:", error);
        throw error;
    }
};

/**
 * 动漫是否放在近一年内放送
 * @param {string} date 放送日期
 * @returns boolean
 */
function isRecent(date) {
    const airTime = new Date(date).valueOf();
    return Math.abs(new Date().valueOf() - airTime) < config.TIME_YEAR;
}

export default saveRecentDataSubject;
