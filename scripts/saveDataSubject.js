import fs from "fs";
import path from "path";
import axios from "axios";

import queryQueue from "./queryQueue.js";
import { DATA_URL, distDir } from "./constant.js";

const saveDataSubject = async (start, end, callback) => {
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
        const subset = data.items.slice(start, end);
        subset.forEach((item) => {
          const site = item.sites.filter((value) => {
            return value.site == "bangumi";
          });
          if (site[0]) {
            subjectIds.push(site[0].id);
          }
        });
        await queryQueue(subjectIds, 100);
        console.log("保存基础数据完成");
        callback();
      }
    );
  } catch (err) {
    console.error(err);
    throw err;
  }
};

export default saveDataSubject;

// saveDataSubject(0,3000)
// saveDataSubject(3000,6000)
// saveDataSubject(6000)
