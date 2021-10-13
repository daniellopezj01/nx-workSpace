const zipdir = require("zip-dir");
const path = require("path");
console.log(
  "**** RECUERDA HACER GIT COMMIT PARA QUE EL EB TOME EN CUENTA LOS .ZIP *****"
);
//joining path of directory
const directoryPathServer = path.join(__dirname, "dist/front/server");
const directoryPathBrowser = path.join(__dirname, "dist/front/browser");

// Make zip directory browser

zipdir(directoryPathBrowser, { saveTo: "./dist.browser.zip" }).then((res) => {
  console.log("ZIP Browser");
});

zipdir(directoryPathServer, { saveTo: "./dist.server.zip" }).then((res) => {
  console.log("ZIP Server");
});
