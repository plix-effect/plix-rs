# plix-rs
Текущая инфа (проверено на node v16.14.0):
* rpi-ws281x-v2 - не работает, надо заменять на rpi-ws281x-native
* npm install ломается из-за react: 
`npm install --legacy-peer-deps` или `npm install yarn -g && yarn`
* обязательно установить mplayer: `sudo apt-get install mplayer`
* Звуковая карта нужна внешняя илии Bluetooth. В настройках надо отключить основной аудио, чтобы наверняка:

`sudo nano /etc/modprobe.d/snd-blacklist.conf`
Добавляем `blacklist snd_bcm2835`

А далее
`sudo nano /boot/config.txt`

Комментим решеткой линию `dtparam=audio=on` -> `#dtparam=audio=on`

Не забываем ребутнуть после этого `sudo reboot`
