const AdmZip = require("adm-zip");
const path = require("path");

//joining path of directory
const directoryPathServer = path.join(__dirname, "dist/front/server");
const directoryPathBrowser = path.join(__dirname, "dist/front/browser");

const zipBrowser = new AdmZip("./dist.browser.zip");
const zipServer = new AdmZip("./dist.server.zip");

zipBrowser.extractAllTo(directoryPathBrowser, true);
zipServer.extractAllTo(directoryPathServer, true);
