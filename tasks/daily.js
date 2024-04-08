import child_process from "child_process";
import buildData from "../scripts/buildData.js";
import saveDataSubject from "../scripts/saveDataSubject.js";
import saveCalendarSubject from "../scripts/saveCalendarSubject.js";

const daily = () => {
  try {
    saveCalendarSubject(() => {
      saveDataSubject(0, 10000, () => {
        buildData(() => {
          child_process.execSync(`git config --local user.email GithubAction`);
          child_process.execSync(
            `git config --local user.name GithubAction@Jinrxin.com`
          );
          child_process.execSync("git add .");
          child_process.execSync(`git commit -m 'Github Action daily update'`);
          child_process.execSync("git pull origin master");
        });
      });
    });
  } catch (error) {
    console.log(error);
  }
};
daily();
