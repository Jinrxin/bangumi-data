import child_process from "child_process";
import buildData from "../package/buildData.js";
import updateVersion from "../package/updateVersion.js";
import saveCalendar from "../package/saveCalendar.js";
import saveRecentDataSubject from "../package/saveRecent.js";

/**
 * main
 */
const main = async () => {
    try {
        await saveCalendar();
        await saveRecentDataSubject();
        await buildData();
        await updateVersion((version) => {
            child_process.execSync(`git config --local user.email GithubAction`);
            child_process.execSync(`git config --local user.name GithubAction@Jinrxin.com`);
            child_process.execSync("git add .");
            child_process.execSync(`git commit -m 'Github Action auto commit for ${version}'`);
            child_process.execSync("git pull origin master");
        });
    } catch (error) {
        console.log(error);
    }
};
main();
