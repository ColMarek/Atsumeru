# Changelog

## 0.1.2

- Fix downloading from Erai-raws  
  The temporary torrent file was downloaded to `./data/temp.torrent` which the application does not have access to. The file is now downloaded to the `userData` folder.

## 0.1.1

- Maximize window after the window is ready to show.  
  https://github.com/electron/electron/issues/20352

## 0.1.0

Initial release
