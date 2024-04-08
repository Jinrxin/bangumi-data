import fs from "fs";
import path from "path";
import axios from "axios";

import { DATA_URL, CALENDAR_URL, distDir, subjectDir } from "./constant.js";

const buildData = async (callback) => {
  try {
    // 获取bangumi-data
    const res = await axios.get(DATA_URL);
    const bangumiData = res.data;
    const items = bangumiData.items;
    // 处理动漫数据
    items.forEach((element) => {
      if (element.sites) {
        element.sites.forEach((value) => {
          if (value.site == "bangumi") {
            try {
              const fsdata = fs.readFileSync(
                path.join(subjectDir, `${value.id}.json`)
              );
              const objData = JSON.parse(fsdata.toString("utf-8"));
              if (objData.images && objData.images.grid) {
                element.image = objData.images.grid;
              }
            } catch (error) {
              console.error(error);
            }
          }
        });
      }
      if (!element.image) {
        element.image = "";
      }
    });
    // 获取当前动漫日历 & 汇总
    const res2 = await axios.get(CALENDAR_URL);
    const calendar = res2.data;
    bangumiData.calendar = calendar;
    fs.writeFile(
      path.join(distDir, "data.json"),
      JSON.stringify(bangumiData),
      (err) => {
        if (err) {
          console.error(err);
          throw err;
        }
        callback();
      }
    );
  } catch (err) {
    console.error(err);
    throw err;
  }
};

export default buildData;
