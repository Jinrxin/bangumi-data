import child_process from "child_process";

import pkg from "../package.json" assert { type: "json" };

const remoteVersion = child_process
    .execSync(`npm view ${pkg.name} version`)
    .toString("utf-8")
    .trim();

const localVersion = pkg.version;

const remoteVersionList = remoteVersion.split(".").map(Number);
const localVersionList = localVersion.split(".").map(Number);

let result = 0;

for (let i = 0; i < 3; i++) {
    if (localVersionList[i] > remoteVersionList[i]) {
        result = 1;
        break;
    }
    if (localVersionList[i] < remoteVersionList[i]) {
        result = -1;
        break;
    }
}

if (result > 0) {
    console.log(`本地版本号更高 local:${localVersion} remote: ${remoteVersion}`);
    process.exit(0);
} else if (result < 0) {
    throw new Error(`本地版本号低 local:${localVersion} remote: ${remoteVersion}`);
} else {
    throw new Error(`版本号相同 local:${localVersion} remote: ${remoteVersion}`);
}
