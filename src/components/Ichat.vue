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
        </div>
    </div>
</template>


<script>
    import {Chat} from 'vue-quick-chat'
    import consts from '@/consts'
    import moment from 'moment'
    import {format} from 'util'

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
                    id: 0
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
                hideCloseButton: false,
                submitIconSize: "20px",
                closeButtonIconSize: "20px",
                asyncMode: true,
                // sessionId -> participants
                allParticipants: {},
                participants: [],
                allMessages: {},
                messages: [],

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
                const wsuri = "ws://127.0.0.1:18224/ws";
                this.websock = new WebSocket(wsuri);
                this.websock.onmessage = this.websocketOnMessage;
                this.websock.onopen = this.websocketOnOpen;
                this.websock.onerror = this.websocketOnError;
                this.websock.onclose = this.websocketClose;
            },
            websocketOnOpen() { //连接建立之后执行send方法发送数据
                // 请求创建新账号
                let actions = {
                    "cmd": "CRT_ACCOUNT",
                    "nickName": this.$store.state.nickName
                };
                let data = JSON.stringify(actions);
                // eslint-disable-next-line no-console
                console.log(data);
                this.websock.send(data);
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
                        uploaded: false,
                        viewed: true
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
                    case "CRT_ACCOUNT":
                        // 设置chat
                        this.myself.id = obj.accountId;

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
                        break;
                    case "PUSH_DIALOGUE":
                        this.allMessages[obj.sessionId].push(
                            {
                                content: obj.content,
                                myself: false,
                                participantId: obj.senderId,
                                timestamp: moment(),
                                uploaded: false,
                                viewed: true
                            }
                        );
                        break;
                    default:
                        // eslint-disable-next-line no-console
                        console.log('unknow cmd: ' + cmd)
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
                    uploaded: false,
                    viewed: true
                });
            },
            websocketClose(e) {  //关闭
                // eslint-disable-next-line no-console
                console.log('断开连接', e);
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
                    // eslint-disable-next-line no-console
                    console.log(message);
                    this.messages.push(message);
                    let actions = {
                        "cmd": "DIALOGUE",
                        "senderId": this.myself.id,
                        "sessionId": this.activeSession,
                        "content": message.content
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

<style lang="less">
    .quick-chat-container {
        display: flex;
        width: 100%;
        height: 100%;
        background: #f0eeee;
        flex-direction: column;
        align-items: stretch;
        overflow: hidden;
    }

    .quick-chat-container .header-container {
        height: 70px;
        display: flex;
        padding: 0 20px 0 10px;
        align-items: center;
        -webkit-box-shadow: 0 2px 20px 2px rgba(90, 90, 90, 0.47);
        box-shadow: 0 2px 20px 2px rgba(90, 90, 90, 0.47);
        z-index: 5;

        .header-title {
            padding: 10px;
            flex: 1;
            text-align: left;
        }

        .header-title-text {
            margin-bottom: 0;
        }

        .header-paticipants-text {
            color: #e4e4e4;
            font-size: 12px;
            margin-top: 5px;
            max-height: 30px;
            overflow: hidden;
        }

        .header-exit-button {
            text-decoration: none;
            color: #fff;
            font-size: 20px;
        }

        .icon-close-chat {
            color: #fff;
            width: 100%;
        }

        .icon-close-chat:hover {
            color: rgb(238, 121, 121)
        }
    }

    .quick-chat-container .container-message-display {
        flex: 1;
        overflow-y: scroll;
        overflow-x: hidden;
        display: flex;
        flex-direction: column;
        padding-bottom: 10px;
        max-height: 100%;
        /************** Safari 10.1+ ********************/
        @media not all and (min-resolution: .001dpcm) {
            @supports (-webkit-appearance:none) {

                .message-container {
                    display: -webkit-box !important;
                }

            }
        }

        .message-text {
            background: #fff;
            padding: 6px 10px;
            line-height: 14px;
            border-radius: 15px;
            margin: 5px 0 5px 0;
            max-width: 70%;
            overflow-wrap: break-word;
            text-align: left;
            white-space: pre-wrap;
        }

        .message-text > p {
            margin: 5px 0 5px 0;
            font-size: 14px;
        }

        .message-timestamp {
            padding: 2px 7px;
            border-radius: 15px;
            margin: 0;
            max-width: 50%;
            overflow-wrap: break-word;
            text-align: left;
            font-size: 10px;
            color: #bdb8b8;
            width: 100%;
            display: flex;
            align-items: center;
        }

        .my-message > .message-timestamp {
            text-align: right;
        }

        .my-message {
            justify-content: flex-end;
            padding-right: 15px;
            align-items: flex-end;
        }

        .other-message {
            justify-content: flex-start;
            padding-left: 15px;
            align-items: flex-start;
        }

        .other-message > .message-text {
            color: #fff;
            border-bottom-left-radius: 0;
        }

        .my-message > .message-text {
            border-bottom-right-radius: 0;
        }

        .message-container {
            display: flex;
            flex-wrap: wrap;
            flex-direction: column;
        }

        .message-username {
            font-size: 10px;
            font-weight: bold;
        }

        .icon-sent {
            width: 12px;
            padding-left: 5px;
            color: rgb(129, 127, 127);
        }

        .message-loading {
            height: 8px;
            width: 8px;
            border: 1px solid rgb(187, 183, 183);
            border-left-color: rgb(59, 59, 59);
            border-radius: 50%;
            margin-left: 5px;
            display: inline-block;
            animation: spin 1.3s ease infinite;
        }

        .loader .message-loading {
            width: 16px;
            height: 16px;
            margin: 5px 0 0 0;
        }
    }

    .quick-chat-container .container-message-manager {
        height: 65px;
        background: #fff;
        display: flex;
        align-items: center;
        padding: 0 20px 0 20px;
        -webkit-box-shadow: 0px -2px 40px 0px rgba(186, 186, 186, 0.67);
        box-shadow: 0px -2px 40px 0px rgba(186, 186, 186, 0.67);

        .message-text-box {
            padding: 0 10px 0 10px;
            flex: 1;
            overflow: hidden;
        }

        .message-input {
            width: 100%;
            resize: none;
            border: none;
            outline: none;
            box-sizing: border-box;
            font-size: 15px;
            font-weight: 400;
            line-height: 1.33;
            white-space: pre-wrap;
            word-wrap: break-word;
            color: #565867;
            -webkit-font-smoothing: antialiased;
            max-height: 40px;
            bottom: 0;
            overflow: scroll;
            overflow-x: hidden;
            overflow-y: auto;
            text-align: left;
            cursor: text;
            display: inline-block;
        }

        .message-input:empty:before {
            /*content: attr(placeholder);*/
            display: block; /* For Firefox */
            filter: contrast(15%);
            outline: none;
        }

        .message-input:focus {
            outline: none;
        }

        .container-send-message {
            margin-left: 10px;
        }

        .container-send-message svg {
            -webkit-box-sizing: content-box;
            box-sizing: content-box;
        }

        .icon-send-message {
            width: 20px;
            cursor: pointer;
            opacity: 0.7;
            transition: 0.3s;
            border-radius: 11px;
            padding: 8px;
        }

        .icon-send-message:hover {
            opacity: 1;
            background: #eee;
        }
    }

    .content {
        width: 100%;
        display: flex;
        align-items: center;
        justify-content: space-evenly;
        flex-wrap: wrap;
    }

    .chat-container {
        display: flex;
        align-items: center;
        justify-content: center;
        background: rgb(247, 243, 243);
        padding: 10px 0 10px 0;
        height: 500px;
        width: 350px;
    }

    .external-controller {
        background: #2c3e50;
        height: 300px;
        width: 600px;
        display: flex;
        color: #eee;
    }

    .controller-btn-container {
        display: flex;
        justify-content: center;
        align-items: center;
        padding-left: 20px;
        padding-right: 20px;
        flex-wrap: wrap;
    }

    .btn-message {
        cursor: pointer;
        background: #eee;
        border: none;
        height: 40px;
        color: #2c3e50;
        border-radius: 5px;
        outline: none;
        transition: 0.3s;
    }

    .btn-participant {
        cursor: pointer;
        background: #eee;
        border: none;
        height: 40px;
        color: #2c3e50;
        border-radius: 5px;
        outline: none;
        transition: 0.3s;
    }

    .btn-message:hover {
        background: rgb(255, 255, 255);
    }

</style>
