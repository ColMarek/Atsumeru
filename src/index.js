if (process.platform !== "darwin") {
  const customTitlebar = require("custom-electron-titlebar");
  new customTitlebar.Titlebar({
    backgroundColor: customTitlebar.Color.fromHex("#373f47"),
    icon: "../assets/img/icon.ico"
  });
}
