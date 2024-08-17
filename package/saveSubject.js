import axios from "axios";
import fs from "fs";
import path from "path";

import config from "../config.js";

function filterByBangumiId(items, bangumiId) {
  return items.find((item) =>
    item.sites.some((site) => site.site === "bangumi" && site.id === bangumiId)
  );
}

/**
 * 批量查询列表中的动漫信息并写入文件
 * @param {Array} list 动漫列表ID
 * @param {Number} wait 等待时间
 * @param {Number} concurrency 并发请求数量
 * @param {Object} data 总数据
 * @returns {Promise} 所有查询和写入操作的 Promise
 */
async function saveSubjectList(list, wait, concurrency, data) {
  const length = list.length;
  let cursor = 0;

  // 定义并发请求函数
  async function fetchAndWrite(id) {
    try {
      cursor++;
      const res = await axios.get(config.subjectURL(id), {
        headers: {
          "User-Agent": config.USER_AGENT,
        },
      });
      if (!fs.existsSync(config.subjectDir)) fs.mkdirSync(config.subjectDir);
      // 存入原始数据
      const bangumi = {
        bangumi: res.data,
        bangumiData: filterByBangumiId(data, id),
      };
      await fs.promises.writeFile(
        path.join(config.subjectDir, `${id}.json`),
        JSON.stringify(bangumi)
      );
      console.log(
        `写入${id}.json完成，进度：${((cursor / length) * 100).toFixed(
          2
        )}%, 数量：${cursor}  / ${length}`
      );
    } catch (error) {
      console.log(`ID:${id}主题信息NO FOUND`);
    }
  }

  // 并发执行查询和写入操作
  async function run() {
    while (cursor < length) {
      const batch = list.slice(cursor, cursor + concurrency);
      await Promise.all(batch.map((id) => fetchAndWrite(id)));
      console.log(`已经等待${wait}毫秒，准备开始下一批次`);
      await new Promise((resolve) => setTimeout(resolve, wait));
    }
  }

  // 执行并发请求函数
  await run();
}

export default saveSubjectList;
