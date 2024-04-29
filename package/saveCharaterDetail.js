import axios from "axios";
import fs from "fs";
import path from "path";

import config from "../config.js";

/**
 * 保存角色详情信息
 */
const saveCharaterDetail = async (id) => {
    try {
        console.log(`开始保存角色信息ID:  ${id}`);
        const res = await axios.get(config.charaterDetailURL(id), {
            headers: {
                "User-Agent": config.USER_AGENT,
            },
        });
        if (!fs.existsSync(config.charaterDir)) fs.mkdirSync(config.charaterDir);
        await fs.promises.writeFile(
            path.join(config.charaterDir, `${id}.json`),
            JSON.stringify(res.data)
        );
    } catch (e) {
        console.log(`角色ID：${id}信息保存失败`);
    }
};

/**
 * 批量查询列表中的动漫角色信息并写入文件
 * @param {Array} list 动漫列表ID
 * @param {Number} wait 等待时间
 * @param {Number} concurrency 并发请求数量
 * @returns {Promise} 所有查询和写入操作的 Promise
 */
async function savaCharaterDetail(list, wait, concurrency) {
    const length = list.length;
    let cursor = 0;

    // 定义并发请求函数
    async function fetchAndWrite(id) {
        try {
            cursor++;
            // 番剧角色列表
            const res = await axios.get(config.charatersURL(id), {
                headers: {
                    "User-Agent": config.USER_AGENT,
                },
            });
            if (!fs.existsSync(config.subjectCharaterDir)) fs.mkdirSync(config.subjectCharaterDir);
            await fs.promises.writeFile(
                path.join(config.subjectCharaterDir, `${id}.json`),
                JSON.stringify(res.data)
            );
            console.log(
                `写入${id}.json完成，进度：${((cursor / length) * 100).toFixed(
                    2
                )}%, 数量：${cursor}  / ${length}`
            );
            // 写入角色详情信息
            if (res.data.length) {
                console.log(`开始写入${id}动漫角色详细信息`);
                await Promise.all(
                    res.data.map(async (item) => {
                        await saveCharaterDetail(item.id);
                    })
                );
            } else {
                console.log(`ID:${id}角色信息NO FOUND`);
            }
        } catch (error) {
            console.log(`ID:${id}角色信息NO FOUND`);
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

export default savaCharaterDetail;
