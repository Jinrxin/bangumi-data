import axios from "axios";

import config from "../config.js";
import savaCharaterDetail from "./saveCharaterDetail.js";

/**
 * 番剧角色列表
 */
const saveSubjectCharaters = async () => {
    try {
        // 获取番剧列表
        const res = await axios.get(config.DATA_URL);
        const data = res.data;
        // 提取bangumi存在的番剧列表ID
        // 提取基础数据并写入
        const subjectIds = data.items
            .filter((item) => item.sites.some((site) => site.site === "bangumi"))
            .map((item) => item.sites.find((site) => site.site === "bangumi").id);
        console.log(subjectIds);
        await savaCharaterDetail(subjectIds, 200, 1);
    } catch (e) {
        console.log(e);
    }
};

export default saveSubjectCharaters;
