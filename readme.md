# lineでオウム返しするBot

Line Messaging APIを使ったLine Botです

SlackのOutgoing Webhook(Event API)を使用したBotと仕組みが同じ

## 事前準備

以下３つの準備が必要

- ドメイン
  - 無料ドメインでも良い
    - freenomを使用し、mlドメインを取得して使用
- SSL証明書
  - 証明機関によって証明できる証明書を使う必要がある
    - Let's Encryptを使用
- ポート番号
  - Line Developersが443以外のポート指定を許さない
    - 一つの環境で単一のBotを立てるだけの場合、考えなくて良い
    - １つの環境で複数のBotを立てたい場合には、外部からのドメインによるアクセスを振り分けるリバースプロキシ等の実装が必要
      - NginxやApacheで実装できる

## 動作環境

- ubuntu 18.04
- nodejs 8.11.0
- express framework

## 起動方法

```
# nodejsのインストール
$ git clone https://github.com/creationix/nvm ~/.nvm
$ source ~/.nvm/nvm.sh
$ echo "source ~/.nvm/nvm.sh" >> ~/.bashrc
$ nvm install 8.11.0
$ nvm use 8.11.0

# このアプリの起動
$ git clone https://github.com/sakkuntyo/line-oumukaesi-nodejs
$ cd line-oumukaesi-nodejs
$ ln -si /etc/letsencrypt/live/<ドメイン名>/fullchain.pem
$ ln -si /etc/letsencrypt/live/<ドメイン名>/privkey.pem
$ npm install
$ npm start

# デーモンにしたい場合、pm2を使う
$ npm install -g pm2
$ pm2 start bin/www line-oumukaesi
## OSの起動と同時に起動
$ pm2 startup
## 現在のpm2 listの状態を保存
$ pm2 save
```

## Line Developersのページで行う事

### 1.プロバイダー作成

### 2.チャネル作成

- Messaging APIでチャネルを作成する
  - 任意項目以外の全てを入力して作成

### 3.作成したチャネル（LineBot）を友達登録する

- 作成したチャネルのページにあるQRコードを使用して登録
  - 厳密にはしなくてもいい、グループに招待する際に楽をするため必要

### 4.Webhookを受け付ける様設定

- 作成したチャネルのページの「チャネル基本設定」から以下設定変更
  - Botのグループトーク参加可否を必要に応じて変更
  - Webhook送信を編集し、利用する に変更
  - Webhook URLを編集し、ドメイン名/lineに変更
  - URLを変更した後に現れる、接続確認ボタンを押して接続確認をしておく
    - エラーが出る原因としては以下に失敗している事が考えられる
      - ポート開放
      - ドメインとIPの紐づけ
      - 証明された証明書でのSSL化(Let's Encryptも可)
  - Line@の機能を停止
    - 自動応答メッセージを 利用しない に変更
    - 友達追加時あいさつを 利用しない に変更

### 5.Subscribe to Workspace Events に message.channels を追加して保存

Event Subscriptionsのページから設定できます

チャンネル内のメッセージが来た時に起こるイベント
