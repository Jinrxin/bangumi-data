import child_process from "child_process";
import buildData from "../scripts/buildData.js";
import updateVersion from "../scripts/updateVersion.js";
import saveCalendarSubject from "../scripts/saveCalendarSubject.js";
import saveRecentDataSubject from "../scripts/saveRecentDataSubject.js";

const main = () => {
  try {
    saveCalendarSubject(() => {
      saveRecentDataSubject(() => {
        buildData(() => {
          updateVersion((version) => {
            console.log(version);
            child_process.execSync(
              `git config --local user.email GithubAction`
            );
            child_process.execSync(
              `git config --local user.name GithubAction@Jinrxin.com`
            );
            child_process.execSync("git add .");
            child_process.execSync(
              `git commit -m 'Github Action auto commit for ${version}'`
            );
            child_process.execSync("git pull origin master");
          });
        });
      });
    });
  } catch (error) {
    console.log(error);
  }
};
main();
