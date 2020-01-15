const electron = require("electron");
const ipc = electron.ipcRenderer;

// eslint-disable-next-line no-undef
const app = new Vue({
  el: "#app",
  data: {
    appVersion: null
  },
  methods: {
    closeWindow() {
      electron.remote.getCurrentWindow().close();
    },
    openAuthorLink() {
      electron.remote.shell.openExternal("https://colmarek.github.io");
    }
  }
});

ipc.on("about-data", function(_event, arg) {
  console.log("Received data");
  app.appVersion = arg.appVersion;
});
