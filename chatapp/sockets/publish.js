'use strict';

module.exports = function (socket, io) {
    // 投稿メッセージを送信する
    socket.on('publish', function (data) {
      //　データが受け取れているか確認する
      if (!data) {
        return false;
      }

      // データを整形して渡す
      const myMessage = `あなた：　${data.message}`;
      const otherMessage = `${data.userName}さん：　${data.message}`;
      

      // 自クライアントにreceiveMyMessageEventを通知する
      socket.emit('receiveMyMessageEvent', myMessage);

      // 他クライアントにreceiveOtherMessageEventを通知する
      socket.broadcast.emit('receiveOtherMessageEvent', otherMessage);

    });
};
