const electron = require("electron");
const ipc = electron.ipcRenderer;

const data = { feed: null };
// eslint-disable-next-line no-undef
const app = new Vue({
  el: "#app",
  data
});

if (process.platform !== "darwin") {
  const customTitlebar = require("custom-electron-titlebar");
  new customTitlebar.Titlebar({
    backgroundColor: customTitlebar.Color.fromHex("#373f47"),
    icon: "../assets/img/icon.ico"
  });
}

ipc.on("feed-data", function(_event, arg) {
  app.feed = arg;
});
