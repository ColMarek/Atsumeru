# Changelog

## 0.2.0

- Change font to Rubik
- Add input field to filter filter by anime title

## 0.1.4

- Prevent failure when fetching anime fails

## 0.1.3

- Add support for 'half' episodes
  e.g. episode 06.5
- Add support for titles with hypens.
  e.g. 'Uchi Tama - Uchi no Tama Shirimasen ka'. The regex used previously to remove the episode number
  part would also remove this part. Resulting in parsing the anime title as 'Uchi TamaUchi no Tama Shirimasen ka'. Later when removing the title to obtain the episode it would not work.

## 0.1.2

- Fix downloading from Erai-raws  
  The temporary torrent file was downloaded to `./data/temp.torrent` which the application does not have access to. The file is now downloaded to the `userData` folder.

## 0.1.1

- Maximize window after the window is ready to show.  
  https://github.com/electron/electron/issues/20352

## 0.1.0

Initial release
