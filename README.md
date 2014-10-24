Foi utilizado o [Ionic Framework](http://ionicframework.com/).

### Como usar ionic app:

Para testar baixe o projeto, use uma IDE que suba um host automatico, não foi configurado nenhuma task manager para isso.

Va até a pasta www e mandar abrir o arquivo index.html

Recomendo IDE WebStorm foi a utilizada para desenvover este app

Criando novo app:

```bash
$ sudo npm install -g ionic cordova
$ ionic start myApp sidemenu
```

Executando o aplicativo no emulador do android
Necessario java instalado e cordova
Todos configurados e rodando

```bash
$ ionic platform add android
$ ionic build android
$ ionic emulate android
```

