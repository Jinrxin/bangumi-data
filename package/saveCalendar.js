import fs from "fs";
import path from "path";
import axios from "axios";

import config from "../config.js";
import saveSubjectList from "./saveSubject.js";
import { convertUTCtoTimeZone } from "./util/time-util.js";

/**
 * 处理日历中的每个项目
 * @param {Object} calendarItem 日历项目
 * @param {Object} data 动漫数据
 * @returns {Promise} 处理结果的 Promise
 */
const processCalendarItem = async (calendarItem, data) => {
    const bangumiMap = data.items.reduce((acc, item) => {
        item.sites.forEach((site) => {
            if (
                site.site === "bangumi" &&
                calendarItem.items.some((anime) => anime.id.toString() === site.id)
            ) {
                acc[site.id] = {
                    type: item.type,
                    lang: item.lang,
                    officialSite: item.officialSite,
                    begin: item.begin,
                    broadcast: item.broadcast,
                    tokyoTime: convertUTCtoTimeZone(item.begin, "Asia/Tokyo"),
                    shanghaiTime: convertUTCtoTimeZone(item.begin, "Asia/Shanghai"),
                };
            }
        });
        return acc;
    }, {});

    await Promise.all(
        calendarItem.items.map(async (anime) => {
            const bangumi = bangumiMap[anime.id.toString()];
            if (!bangumi) anime.data = null;
            else {
                anime.data = {};
                anime.data.type = bangumi.type;
                anime.data.lang = bangumi.lang;
                anime.data.officialSite = bangumi.officialSite;
                anime.data.begin = bangumi.begin;
                anime.data.broadcast = bangumi.broadcast;
                anime.data.tokyoTime = bangumi.tokyoTime;
                anime.data.shanghaiTime = bangumi.shanghaiTime;
            }
            // 查询分集信息
            try {
                const res = await axios.get(config.episodesURL(anime.id), {
                    headers: {
                        "User-Agent": config.USER_AGENT,
                    },
                });
                const episodes = res.data;
                // 获取当前日期和时间
                const currentDate = new Date();
                // 找到播出日期在当前日期之前，并且集数最大的那一集
                let latestEpisode = null;
                for (const episode of episodes.data) {
                    const episodeDate = new Date(episode.airdate);
                    if (
                        episodeDate <= currentDate &&
                        (!latestEpisode || episode.ep > latestEpisode.ep)
                    ) {
                        latestEpisode = episode;
                    }
                }
                // anime.episodes = episodes.data
                anime.latestEpisode = latestEpisode
            } catch (error) {
                console.log(`ID:${anime.id}信息不存在`);
            }
        })
    );
};

/**
 * 保存日历动漫
 */
const saveCalendar = async () => {
    try {
        console.log("开始获取每日放送表数据");
        // 请求获取动漫和日历数据
        const [resData, resCalendar] = await Promise.all([
            axios.get(config.DATA_URL),
            axios.get(config.CALENDAR_URL),
        ]);
        const data = resData.data;
        const calendar = resCalendar.data;

        // 处理日历数据
        await Promise.all(
            calendar.map(async (calendarItem) => {
                await processCalendarItem(calendarItem, data);
            })
        );

        // 检查目录是否存在，如果不存在则创建
        if (!fs.existsSync(config.distDir)) fs.mkdirSync(config.distDir);

        // 写入日历内容
        await fs.promises.writeFile(
            path.join(config.distDir, "calendar.json"),
            JSON.stringify(calendar)
        );

        console.log("开始写入每日放送动漫详细信息");
        // 写入完成，获取动漫ID列表
        const subjectIds = calendar.flatMap((day) => day.items.map((item) => item.id));

        // 保存动漫详细信息
        await saveSubjectList(subjectIds, 200, 5);

        console.log("写入完成");
        console.log("保存每日放送表数据完成");
    } catch (error) {
        throw error;
    }
};

export default saveCalendar;
