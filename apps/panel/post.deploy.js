const AdmZip = require("adm-zip");
const path = require("path");

//joining path of directory
const directoryPathBrowser = path.join(__dirname, "dist/panelAdmin");

const zipBrowser = new AdmZip("./dist.panelAdmin.zip");

zipBrowser.extractAllTo(directoryPathBrowser, true);
