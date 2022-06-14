<template>
  <div class="hello">
    <div> current user: {{ myself.name }}</div>
    <div> system message: {{ systemMsg }}</div>
    <el-tabs type="card" @tab-click="handleClick">
      <el-tab-pane
          v-for="item in editableTabs"
          :key="item.sessionId"
          :label="item.nickName"
          :name="item.name">
      </el-tab-pane>
    </el-tabs>
    <div class="chat-container">
      <el-row>
        <el-col :span="12"><div class="grid-content bg-purple">
          <Chat v-if="visible"
                :participants="participants"
                :myself="myself"
                :messages="messages"
                :on-type="onType"
                :on-message-submit="onMessageSubmit"
                :chat-title="chatTitle"
                :colors="colors"
                :placeholder="placeholder"
                :border-style="borderStyle"
                :hide-close-button="hideCloseButton"
                :close-button-icon-size="closeButtonIconSize"
                :submit-icon-size="submitIconSize"
                :async-mode="asyncMode"/>
        </div></el-col>
        <el-col :span="2"><div class="grid-content"></div></el-col>
        <el-col :span="8"><div class="grid-remark bg-purple-light">
          <p>如果自动配置的随机用户是 “小痞”，那么当前与你对话的是基于腾讯云API的闲聊机器人。</p>
          <p>你可以试着问问他: </p>
          <ul>
            <li>北京的天气怎么样？</li>
            <li>周杰伦的歌你最喜欢哪一首？</li>
            <li>李白是谁？</li>
            <li>《盗梦空间》是关于什么的？</li>
            <li>什么先来：鸡还是蛋? </li>
          </ul>

        </div></el-col>
        <el-col :span="2"><div class="grid-content">

        </div></el-col>
      </el-row>

    </div>
  </div>
</template>


<script>
import {Chat} from 'vue-quick-chat'
import 'vue-quick-chat/dist/vue-quick-chat.css';
import consts from '@/consts'
import moment from 'moment'
import {uuid} from 'vue-uuid';
import {format} from 'util'
import {wsuri} from '../config'

export default {
  name: 'IChat',
  components: {
    Chat
  },
  data() {
    return {
      websock: null,
      systemMsg: "",
      activeSession: -1,
      // activeName: undefined, // 当前激活是哪个tab
      editableTabs: [],
      // editableTabs: [{nickName:"", sessionId:-1, name:"session:01"}],
      sessionMap: {},
      // 以下为chat相关的数据
      visible: false,
      placeholder: 'send your message',
      myself: {
        name: this.$store.state.nickName,
        id: 0,
        token: ""
      },
      chatTitle: "",
      // placeholder: 'send your message',
      colors: {
        header: {
          bg: '#d30303',
          text: '#fff'
        },
        message: {
          myself: {
            bg: '#fff',
            text: '#bdb8b8'
          },
          others: {
            bg: '#fb4141',
            text: '#fff'
          },
          messagesDisplay: {
            bg: '#f7f3f3'
          }
        },
        submitIcon: '#b91010'
      },
      borderStyle: {
        topLeft: "10px",
        topRight: "10px",
        bottomLeft: "10px",
        bottomRight: "10px",
      },
      hideCloseButton: true,
      submitIconSize: "20px",
      closeButtonIconSize: "20px",
      asyncMode: true,
      // sessionId -> participants
      allParticipants: {},
      participants: [],
      allMessages: {},
      messages: [],
      // 用于异步修改消息的状态，是否upload，是否viewed
      ackMessage: {},
      // 用于连接断开后的重试
      retry: 0,
    }
  },
  created() {
    this.initWebSocket();
  },
  destroyed() {
    this.websock.close() //离开路由之后断开websocket连接
  },
  methods: {
    reRender() {
      this.visible = false;
      this.$nextTick(() => {
        this.visible = true
      })
    },
    initWebSocket() {
      this.websock = new WebSocket(wsuri);
      this.websock.onmessage = this.websocketOnMessage;
      this.websock.onopen = this.websocketOnOpen;
      this.websock.onerror = this.websocketOnError;
      this.websock.onclose = this.websocketClose;
    },
    websocketOnOpen() {
      //连接建立之后执行send方法发送数据
      if (this.myself.id <= 0) {
        // 请求创建新账号
        let actions = {
          "cmd": "CRT_ACCOUNT",
          "nickName": this.$store.state.nickName
        };
        let data = JSON.stringify(actions);
        // eslint-disable-next-line no-console
        console.log(data);
        this.websock.send(data);
      } else {
        let actions = {
          "cmd": "RECONNECT",
          "accountId": this.myself.id,
          "token": this.myself.token
        };
        let data = JSON.stringify(actions);
        // eslint-disable-next-line no-console
        console.log(data);
        this.websock.send(data);
      }

      this.retry = 0
    },
    websocketOnError() {//连接建立失败重连
      this.initWebSocket();
    },
    switchSession(sessionId) {
      this.activeSession = sessionId;
      // 重新加载内容
      this.participants = this.allParticipants[this.activeSession];
      this.messages = this.allMessages[this.activeSession];
      // this.chatTitle = "chat with " + this.participants[0].nickName;
      this.reRender();
    },
    // activeFlag 是否切换新会话变成活跃会话
    startNewSession(sessionId, partnerId, partnerName, activeFlag) {
      this.systemMsg = "";
      let session = this.sessionMap[sessionId];
      if (session == null) { // 创建新的session
        this.editableTabs.push({
          nickName: partnerName,
          sessionId: sessionId,
          name: "session:" + sessionId
        });
        this.sessionMap[sessionId] = consts.ON_LINE;
      }
      // participants
      this.allParticipants[sessionId] = [
        {
          name: partnerName,
          id: partnerId
        },
        {
          name: "system",
          id: 0,
        }
      ];
      // // messages
      this.allMessages[sessionId] = [
        {
          content: "Now you can chat with " + partnerName,
          myself: false,
          participantId: 0,
          timestamp: moment(),
          uploaded: true,
          viewed: true,
          msgId: 0 // fake
        }
      ];
      this.visible = true;
      if (activeFlag) {
        this.switchSession(sessionId);
      }

    },

    websocketOnMessage(e) {
      // eslint-disable-next-line no-console
      console.log('get msg', e.data);
      let obj = JSON.parse(e.data);
      let cmd = obj.cmd;
      switch (obj.cmd) {
        case "RECONNECT":
          // eslint-disable-next-line no-console
          console.log("reconnect resp:", obj.code === 0);
          break;
        case "CRT_ACCOUNT":
          // 创建账号成功，就可以开始请求匹配其它聊天对象了
          // 设置chat
          this.myself.id = obj.accountId;
          this.myself.token = obj.token

          var actions = {
            "cmd": "MATCH",
            "accountId": obj.accountId
          };
          var data = JSON.stringify(actions);
          this.websock.send(data);
          break;
        case "MATCH":
          if (obj.code === 0) {
            this.startNewSession(obj.sessionId, obj.partnerId, obj.partnerName, true);
          } else {
            // eslint-disable-next-line no-console
            console.log(obj.code, "retry to match in 3 seconds");
            this.systemMsg = "There is no uers now. System will retry to match in 3 seconds.";
            // 尝试继续匹配
            setTimeout(() => {
              if (this.activeSession === -1) {
                let actions = {
                  "cmd": "MATCH",
                  "accountId": this.myself.id
                };
                let data = JSON.stringify(actions);
                this.websock.send(data);
                // eslint-disable-next-line no-console
                console.log("retry to match");
              }
            }, 3000)
          }
          break;
        case "PUSH_SIGNAL":
          // 收到了其它人创建的session
          if ("NewSession" === obj.signalType) {
            this.startNewSession(obj.sessionId, obj.data.accountId,
                obj.data.nickName, true);
          } else if ("PartnerExit" === obj.signalType) {
            this.sessionDismiss(obj.sessionId, obj.data.accountId);
          }
          break;

        case "PING":
          if (obj.accountId === this.myself.id) {
            let actions = {
              "cmd": "PONG",
              "accountId": this.myself.id
            };
            let data = JSON.stringify(actions);
            this.websock.send(data);
          }
          break;
        case "DIALOGUE":
          // eslint-disable-next-line no-console
          console.log("DIALOGUE", obj.code);
          if (obj.code === 0) {
            // 消息发送成功
            this.ackMessage[obj.requestId]["uploaded"] = true;
            this.ackMessage[obj.requestId]["msgId"] = obj.msgId;
          }
          break;
        case "PUSH_DIALOGUE":
          this.allMessages[obj.sessionId].push(
              {
                content: obj.content,
                myself: false,
                participantId: obj.senderId,
                timestamp: moment(),
                uploaded: true,
                viewed: true,
                msgId: obj.msgId
              }
          );
          // send view ack
          if (obj.sessionId === this.activeSession) {
            let actions = {
              "cmd": "VIEWED_ACK",
              "sessionId": this.activeSession,
              "accountId": this.myself.id,
              "msgId": obj.msgId
            };
            let data = JSON.stringify(actions);
            // eslint-disable-next-line no-console
            console.log(data);
            this.websock.send(data);
          }
          break;
        case "VIEWED_ACK":
          // eslint-disable-next-line no-console
          console.log("VIEWED_ACK", obj.code);
          break;
        case "PUSH_VIEWED_ACK":
          // eslint-disable-next-line no-console
          console.log("PUSH_VIEWED_ACK", obj.msgId);
          var messages = this.allMessages[obj.sessionId];
          for (var i = messages.length - 1; i >= 0; i--) {
            if (messages[i].myself && messages[i].viewed) {
              break;
            }
            if (messages[i].myself && messages[i].msgId <= obj.msgId) {
              messages[i].viewed = true;
            }
          }
          break;
        default:
          // eslint-disable-next-line no-console
          console.log('unknow cmd: ' + cmd);
      }
    },
    // session解散
    sessionDismiss(sessionId, exiterId) {
      this.sessionMap[sessionId] = consts.OFF_LINE;
      // 写入消息，提示会话的参与者
      let partnerName = "";
      // eslint-disable-next-line no-console
      console.log("exiterId", exiterId)
      for (let item of this.allParticipants[sessionId]) {
        if (item["id"] === exiterId) {
          partnerName = item.name;
          break;
        }
      }
      this.allMessages[sessionId].push({
        content: format("Partner %s has exit.", partnerName),
        myself: false,
        // system
        participantId: 0,
        timestamp: moment(),
        uploaded: true,
        viewed: true,
        msgId: 0  // fake
      });
    },

    websocketClose(e) {  //关闭
      // eslint-disable-next-line no-console
      console.log('websocketClose', e.data);
      if(this.retry < 5){
        this.retry++
        this.systemMsg = `Connection is disconnected. Try to reconnection in ${ this.retry } seconds.`
        setTimeout(this.initWebSocket, this.retry * 1000);
      }else {
        this.systemMsg = "Connection is disconnected.Please close the window."
      }
    },
    handleClick(obj, event) {
      // eslint-disable-next-line no-console
      console.log(obj.$vnode.key);
      // eslint-disable-next-line no-console
      console.log(typeof (event));
      this.switchSession(obj.$vnode.key)
    },
    onMessageSubmit(message) {
      /*
      * example simulating an upload callback.
      * It's important to notice that even when your message wasn't send
      * yet to the server you have to add the message into the array
      */

      if (this.sessionMap[this.activeSession] === consts.OFF_LINE) {
        let partnerId = 0;
        for (let item of this.participants) {
          if (item.id !== this.myself.id && item.id !== 0) {
            partnerId = item.id;
            break;
          }
        }
        this.sessionDismiss(this.activeSession, partnerId);
      } else {
        let requestId = uuid.v1();
        // 暂存，方便后期更新状态
        this.ackMessage[requestId] = message;

        this.messages.push(message);
        let actions = {
          "cmd": "DIALOGUE",
          "senderId": this.myself.id,
          "sessionId": this.activeSession,
          "content": message.content,
          "requestId": requestId
        };
        let data = JSON.stringify(actions);
        // eslint-disable-next-line no-console
        console.log(data);
        this.websock.send(data);
      }
    },
    onType: function () {
      // eslint-disable-next-line
      console.log('typing');
    },
  }
}
</script>

<style>
.bg-purple {
  background: #d3dce6;
}
.bg-purple-light {
  background: #e5e9f2;
}
.grid-content {
  margin: 10px;
  border-radius: 4px;
  height: 500px;
  padding:5px;
}
.grid-remark {
  border-radius: 4px;
  height: 500px;
  padding:10px;
  margin: 10px;
}

</style>