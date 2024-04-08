import fs from "fs";
import path from "path";
import axios from "axios";

import { subjectURL, subjectDir } from "./constant.js";

/**
 * 查询列表动漫详细信息
 * @param {Array} list 动漫列表ID
 * @param {Number} wait 等待时间
 * @returns
 */
function queryQueue(list, wait) {
  return new Promise((resolve) => {
    // 当前下标
    let cursor = 0;
    const length = list.length;
    const run = async () => {
      if (cursor < length) {
        console.log(`当前第${cursor + 1}项，剩余${length - cursor}项`);
        try {
          // 动漫ID
          const id = list[cursor];
          const res = await axios.get(subjectURL(id));
          fs.writeFile(
            path.join(subjectDir, `${id}.json`),
            JSON.stringify(res.data),
            (err) => {
              if (err) {
                console.error(err);
              }
              console.log(
                `写入${id}.json完成，进度${cursor + 1}/${length}=${(
                  ((cursor + 1) / length) *
                  100
                ).toFixed(2)}%`
              );
            }
          );
        } catch (error) {
          console.error(error);
        }
        setTimeout(() => {
          cursor++;
          console.log(`已经等待${wait}毫秒，准备开始下一次`);
          run();
        }, wait);
      } else {
        console.log("队列已完成");
        resolve();
      }
    };
    run();
  });
}

export default queryQueue;
