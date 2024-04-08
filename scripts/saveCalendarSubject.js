import fs from "fs";
import path from "path";
import axios from "axios";
import { dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

import queryQueue from "./queryQueue.js";
import { CALENDAR_URL, distDir } from "./constant.js";

/**
 * 保存日历动漫
 */
const saveCalendarSubject = async (callback) => {
  try {
    // 获取日历
    const res = await axios.get(CALENDAR_URL);
    const calendar = res.data;
    // 写入日历内容
    fs.writeFile(
      path.join(distDir, "calendar.json"),
      JSON.stringify(calendar),
      async (err) => {
        if (err) {
          console.error(err);
          throw err;
        }
        // 写入完成，获取动漫ID列表
        const subjectIds = [];
        calendar.forEach((day) => {
          day.items.forEach((item) => {
            const id = item.id;
            subjectIds.push(id);
          });
        });
        // 放入消息队列
        await queryQueue(subjectIds, 500);
        console.log("保存每日放送表数据完成");
        callback()
      }
    );
  } catch (err) {
    console.error(err);
    throw err;
  }
};

export default saveCalendarSubject;
