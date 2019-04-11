'use strict';

// 直近の投稿ユーザー
let prePostUser;

module.exports = function (socket, io) {
    // 投稿メッセージを送信する
    socket.on('publish', function (data) {
      //　データが受け取れているか確認する
      if (!data) {
        return false;
      }

      if (prePostUser === data.userName) {
        socket.emit('contPostError', '同じユーザが連続で投稿することはできません。');
        return false;
      }
      prePostUser = data.userName;

      // データを整形して渡す
      const message = `${data.userName}さん：　${data.message}`;

      socket.broadcast.emit('receiveMessageEvent', message);

    });
};
