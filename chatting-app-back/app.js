const express = require("express");
const app = express();
const mysql = require("mysql");
const bodyParser = require("body-parser");

const cors = require("cors");
// 정적 파일 서비스

// 채팅방 관리를 위한 객체
const chatRooms = {
  // newJeans: { name: "newJeans", messages: [] },
};

const connection = mysql.createConnection({
  host: "localhost",
  port: 3307, // MySQL 서버의 포트 번호
  user: "root",
  password: "ssafy",
  database: "ssafy", // 사용할 데이터베이스 이름
  timezone: "UTC", // 서버의 시간대 설정 (예: UTC)
  charset: "UTF8MB4_GENERAL_CI", // 문자 인코딩 설정 (예: UTF-8)
});

connection.connect((err) => {
  if (err) {
    console.error(err);
    return;
  }
  console.log("db 연결 성공");
});

app.use(express.static("public"));

app.use(
  cors({
    origin: "*", // 모든 출처 허용 옵션. true 를 써도 된다.
  })
);

app.use(bodyParser.json());

// 루트 경로 처리
app.get("/", (req, res) => {
  res.send("hi");
});

app.get("/roomList", (req, res) => {
  connection.query("select distinct name from chat_messages", (err, result) => {
    res.send(result);
  });
  // res.send(chatRooms);
});

// 웹소켓을 위한 Socket.IO 설정
const server = require("http").Server(app);
const io = require("socket.io")(server, { cors: { origin: "*" } });

io.on("connection", (socket) => {
  console.log("새로운 사용자가 연결되었습니다.");

  socket.on("join room", (roomName) => {
    // 채팅방에 참여하기
    socket.join(roomName);
    socket.emit("joined", roomName);

    // 채팅방 객체 생성 또는 가져오기
    let chatRoom = chatRooms[roomName];
    if (!chatRoom) {
      chatRoom = { name: roomName, messages: [] };
      chatRooms[roomName] = chatRoom;
    }

    // 채팅방의 이전 메시지를 클라이언트에 전송
    connection.query(
      "select * from chat_messages where name = ?",
      [roomName],
      (error, result) => {
        socket.emit("chat history", result);
      }
    );

    // socket.emit("chat history", chatRoom.messages);
  });

  socket.on("chat message", (data) => {
    console.log(data);
    const { roomName, message } = data;
    const chatRoom = chatRooms[roomName];

    // 메시지를 채팅방에 저장
    // chatRoom.messages.push(message);
    connection.query(
      "insert into chat_messages(name, user_name, messages) values (?, ?, ?)",
      [data.roomName, data.message.writer, data.message.content],
      (err, result) => {
        // 채팅 메시지를 해당 채팅방의 모든 클라이언트에게 전송
        io.to(roomName).emit("chat message", message);
      }
    );

    // 채팅 메시지를 해당 채팅방의 모든 클라이언트에게 전송
    // io.to(roomName).emit("chat message", message);
  });

  socket.on("disconnect", () => {
    console.log("사용자가 연결을 해제했습니다.");
  });
});

// 서버 시작
const port = process.env.PORT || 3000;
server.listen(port, () => {
  console.log("서버가 http://localhost:" + port + " 에서 실행 중입니다.");
});
