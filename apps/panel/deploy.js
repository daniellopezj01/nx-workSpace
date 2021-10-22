const zipdir = require("zip-dir");
const path = require("path");

//joining path of directory
const directoryPathBrowser = path.join(__dirname, "dist/panelAdmin");

// Make zip directory browser

zipdir(directoryPathBrowser, { saveTo: "./dist.panelAdmin.zip" }).then(
  (res) => {
    console.log("ZIP Browser");
  }
);
