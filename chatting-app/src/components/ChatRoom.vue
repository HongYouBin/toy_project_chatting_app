<template>
  <div class="chat-room">
    <h2>방</h2>
    <div class="chat-messages">
      <!-- 채팅 메시지를 보여주는 영역 -->
    </div>
    <div class="chat-input">
      <input type="text" v-model="message" placeholder="메시지 입력" />
      <button @click="sendMessage">전송</button>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      selectedRoom: null,
      message: "",
    };
  },
  methods: {
    sendMessage() {
      // 메시지 전송 로직을 작성합니다.
      // 예: 서버로 메시지를 전송하거나, 로컬 상태에 메시지를 추가합니다.
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
</style>
