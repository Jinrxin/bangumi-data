import fs from "fs";
import path from "path";
import axios from "axios";

import config from "../config.js";
import saveSubjectList from "./saveSubject.js";

/**
 * 保存动漫数据
 */
const saveBangumiData = async () => {
  try {
    console.log("开始保存基础数据");
    const res = await axios.get(config.DATA_URL);
    const data = res.data;
    // 检查目录是否存在，如果不存在则创建
    if (!fs.existsSync(config.distDir)) fs.mkdirSync(config.distDir);
    await fs.promises.writeFile(path.join(config.distDir, "data.json"), JSON.stringify(data));
    console.log("写入data.json完成");
    // 提取基础数据并写入
    const subjectIds = data.items
      .filter((item) => item.sites.some((site) => site.site === "bangumi"))
      .map((item) => item.sites.find((site) => site.site === "bangumi").id);
    console.log("开始写入基础数据");
    await saveSubjectList(subjectIds, 200, 1, data.items);
    console.log("保存基础数据完成");
  } catch (error) {
    console.error("开始写入基础数据", error);
    throw error;
  }
};

export default saveBangumiData;
