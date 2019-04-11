'use strict';

module.exports = function (socket, io) {
    // 投稿メッセージを送信する
    socket.on('publish', function (data) {
      //　データが受け取れているか確認する
      if (!data) {
        return false;
      }

      // データを整形して渡す
      const message = `${data.userName}さん：　${data.message}`;

      io.sockets.emit('receiveMessageEvent', message);

    });
};
