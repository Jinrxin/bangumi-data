import fs from "fs";
import path from "path";
import axios from "axios";

import queryQueue from "./queryQueue.js";
import { TIME_YEAR, DATA_URL, distDir } from "./constant.js";

/**
 * 查询近一年内放送的动漫
 */
const saveRecentDataSubject = async (callback) => {
  try {
    console.log(`开始获取${DATA_URL}`);
    const res = await axios.get(DATA_URL);
    const data = res.data;
    console.log(`获取${DATA_URL}完成`);
    fs.writeFile(
      path.join(distDir, "data.json"),
      JSON.stringify(data),
      async (err) => {
        if (err) {
          console.error(err);
          throw err;
        }
        console.log("data.json完成");
        const subjectIds = [];
        const subset = data.items;
        subset.forEach((item) => {
          const site = item.sites.filter((value) => value.site == "bangumi");
          if (site[0] && isRecent(item.begin)) {
            subjectIds.push(site[0].id);
          }
        });
        await queryQueue(subjectIds, 500);
        callback()
      }
    );
  } catch (err) {
    console.error(err);
    throw err;
  }
};

/**
 * 动漫是否放在近一年内放送
 * @param {string} date 放送日期
 * @returns boolean
 */
function isRecent(date) {
  const airTime = new Date(date).valueOf();
  return Math.abs(new Date().valueOf() - airTime) < TIME_YEAR;
}

export default saveRecentDataSubject;
