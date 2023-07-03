<template>
  <div class="chat-wrapper">
    <h2>채팅방 목록</h2>

    <div class="chat-room-list">
      <h2>채팅방 목록</h2>
      <ul>
        <li
          v-for="(room, index) in getRooms"
          :key="index"
          @click="joinChat(room)"
        >
          {{ room.name }}
        </li>
      </ul>
    </div>
    <div class="chat-room" v-if="roomOpened">
      <div class="chat-room">
        <h2>{{ currentRoom }}</h2>
        <div class="chat-messages">
          <!-- 채팅 메시지를 보여주는 영역 -->
          <div
            class="chat"
            v-for="(chatting, index) in getChattings"
            :key="index"
          >
            <div style="color: chocolate">{{ chatting.writer }}</div>
            <div>{{ chatting.content }}</div>
          </div>
        </div>
        <div class="chat-input">
          <input type="text" v-model="writer" placeholder="이름 입력" />
          <input type="text" v-model="content" placeholder="메시지 입력" />
          <button @click="sendMessage">전송</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import io from "socket.io-client";
import axios from "axios";
export default {
  data() {
    return {
      writer: "",
      newRoom: "",
      roomList: [],
      roomOpened: false,
      socket: null,
      chattings: [],
      room: null,
      content: "",
    };
  },
  created() {
    this.socket = io("http://localhost:3000");
    this.socket.on("connect", () => {
      console.log("Socket connected");
    });
    this.socket.on("disconnect", () => {
      console.log("Socket disconnected");
    });
    this.socket.on("joined", (room) => {
      this.currentRoom = "현재 채팅방: " + room;
    });
    this.socket.on("chat history", (chatHistory) => {
      console.log(chatHistory);

      chatHistory.forEach((data) => {
        this.chattings.push({
          writer: data.user_name,
          content: data.messages,
        });
      });

      // this.chattings = chatHistory;
    });
    this.socket.on("chat message", (msg) => {
      console.log(msg);

      this.chattings.push(msg);
    });
  },
  mounted() {
    this.getRoomList();
  },
  methods: {
    joinChat(room) {
      if (this.socket.readyState === this.socket.OPEN) {
        console.log("다른 방 접속");
        // this.socket.disconnect();
        this.chattings = [];
      }
      console.log(room);
      this.writer = "";
      this.content = "";
      this.room = room;
      this.roomOpened = true;
      this.socket.emit("join room", room.name);
    },

    getRoomList() {
      axios.get("http://localhost:3000/roomList").then((res) => {
        console.log(res);
        this.roomList = res.data;
      });
    },
    sendMessage() {
      let data = {
        roomName: this.room.name,
        message: {
          content: this.content,
          writer: this.writer,
        },
      };
      this.socket.emit("chat message", data);
      this.content = "";
      this.writer = "";
    },
  },
  beforeUnmount() {
    this.socket.disconnect(); // 컴포넌트가 파괴되기 전에 소켓 연결을 해제합니다.
  },
  computed: {
    getChattings() {
      return this.chattings;
    },
    getRooms() {
      return this.roomList;
    },
  },
};
</script>

<style scoped>
.chat-room-list {
  padding: 20px;
  background-color: #f2f2f2;
}

.chat-room-list h2 {
  font-size: 24px;
  margin-bottom: 10px;
}

.chat-room-list ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.chat-room-list li {
  padding: 10px;
  background-color: #fff;
  margin-bottom: 5px;
  cursor: pointer;
  border-radius: 5px;
}

.chat-room-list li:hover {
  background-color: #eaeaea;
}

.chat-room {
  padding: 20px;
  background-color: #f2f2f2;
}

.chat-room h2 {
  font-size: 24px;
  margin-bottom: 10px;
}

.chat-messages {
  height: 300px;
  overflow-y: scroll;
  background-color: #fff;
  padding: 10px;
  border-radius: 5px;
}

.chat-input {
  margin-top: 10px;
}

.chat-input input[type="text"] {
  padding: 5px;
  width: 70%;
  border-radius: 5px;
}

.chat-input button {
  padding: 5px 10px;
  border-radius: 5px;
  background-color: #007bff;
  color: #fff;
  border: none;
  cursor: pointer;
}

.chat-input button:hover {
  background-color: #0056b3;
}

.chat-input {
  display: flex;
}

button {
  width: 10%;
}

.chat {
  padding-bottom: 20px;
}
</style>
