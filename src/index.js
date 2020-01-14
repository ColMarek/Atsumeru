const electron = require("electron");
const moment = require("moment");
const ipc = electron.ipcRenderer;

// eslint-disable-next-line no-undef
const app = new Vue({
  el: "#app",
  data: {
    feed: null,
    loading: true,
    error: null
  },
  methods: {
    download(item) {
      ipc.send("download", item);
    },
    openAnime(item) {
      ipc.send("open-anime", item);
    }
  }
});

if (process.platform !== "darwin") {
  const customTitlebar = require("custom-electron-titlebar");
  new customTitlebar.Titlebar({
    backgroundColor: customTitlebar.Color.fromHex("#252A30"),
    icon: "../assets/img/icon.ico"
  });
}

ipc.on("feed-data", function(_event, arg) {
  console.log("Received data");
  arg = arg.map(i => {
    if (i.description != null) {
      i.description = i.description.replace(/(<([^>]+)>)/gi, "");
    }
    return { ...i, dateFormatted: moment.unix(i.date).format("D MMM, h:mm A") };
  });
  app.feed = arg;
  app.loading = false;
});

ipc.on("error", (_event, arg) => {
  console.error(arg);
  app.loading = false;
  app.feed = null;
  app.error = arg;
});
