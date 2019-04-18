'use strict';

module.exports = function (socket) {
    // 入室メッセージをクライアントに送信する
    socket.on('enter', function (data) {
      const msg = `${data.userName}さんが入室しました。`;
      socket.broadcast.emit('enterOtherEvent', msg);
    });
};
