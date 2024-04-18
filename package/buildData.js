import fs from "fs";
import path from "path";
import axios from "axios";

import config from "../config.js";


const buildData = async () => {
    try {
        // 获取bangumi-data
        const res = await axios.get(config.DATA_URL);
        const bangumiData = res.data;
        // 获取当前动漫日历 & 汇总
        const { data } = await axios.get(config.CALENDAR_URL);
        const calendar = data;
        bangumiData.calendar = calendar;
        await fs.promises.writeFile(
            path.join(config.distDir, "data.json"),
            JSON.stringify(bangumiData)
        );
    } catch (error) {
        console.error(error);
        throw error;
    }
};

export default buildData;
