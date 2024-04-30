import child_process from "child_process";
import buildData from "../package/buildData.js";
import saveBangumiData from "../package/saveBgm.js";
import saveCalendar from "../package/saveCalendar.js";
import saveSubjectCharaters from "../package/saveCharater.js";


/**
 * 每日更新数据
 */
const daily = async () => {
    try {
        await saveCalendar();
        await saveBangumiData();
        await saveSubjectCharaters()
        await buildData();
        child_process.execSync(`git config --local user.email GithubAction`);
        child_process.execSync(`git config --local user.name GithubAction@Jinrxin.com`);
        child_process.execSync("git add .");
        child_process.execSync(`git commit -m 'Github Action daily update'`);
        child_process.execSync("git pull origin master");
    } catch (error) {
        console.log(error);
    }
};
daily();
