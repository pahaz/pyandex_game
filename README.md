PYANdex game
============

**PYANdex** - карточная игра "пьяница" для компании yandex

### [Пример работы](http://dev.urfuclub.ru/pyandex/client/) ###

`lib` - логика игры.  
`client` - браузерная игра (client-side).  
`server` - пример работы игровой логики на стороне сервера (node.js / server-side).

HowTo
-----

    # server-side tests run
    cd server
    npm install
    npm start

    cd ..

    # run game
    cd client
    bower install
    cd ..
    python -m SimpleHTTPServer 8000
    open http://172.0.0.1:8000/client/

Правила
-------

 + Если у игрока нет карт что бы продолжить спор - он проиграл.
 + Если у свех игроков участвующих в споре нет больше карт - они оба проиграли и дальше спор продолжается среди всех игроков.
