<template>
    <el-tabs type="border-card">
        <el-tab-pane label="用户管理">
            <div>
            <div class="content">
                <div class="chat-container">
                    <Chat v-if="visible"
                          :participants="participants"
                          :myself="myself"
                          :messages="messages"
                          :on-type="onType"
                          :on-message-submit="onMessageSubmit"
                          :chat-title="chatTitle"
                          :placeholder="placeholder"
                          :colors="colors"
                          :border-style="borderStyle"
                          :on-close="onClose"
                          :hide-close-button="hideCloseButton"
                          :close-button-icon-size="closeButtonIconSize"
                          :submit-icon-size="submitIconSize"
                          :load-more-messages="toLoad.length > 0 ? loadMoreMessages : null"
                          :async-mode="asyncMode"/>
                </div>
                <div class="external-controller">
                    <div class="controller-btn-container">
                        <button class="btn-message" @click="addMessage">Adicionar mensagem</button>
                        <button class="btn-participant" @click="addParticipant">Adicionar participante</button>
                    </div>
                    <div class="message-list">
                        <ol>
                            <li v-for="(message, index) in messages" :key="index">
                                {{message.content}}
                            </li>
                        </ol>
                    </div>
                </div>
            </div>
            </div>
        </el-tab-pane>
        <el-tab-pane label="配置管理">配置管理</el-tab-pane>
        <el-tab-pane label="角色管理">角色管理</el-tab-pane>
        <el-tab-pane label="定时任务补偿">定时任务补偿</el-tab-pane>
    </el-tabs>
</template>


<script>
    import { Chat } from 'vue-quick-chat'

    export default {
        name: 'HChat',
        components: {
            Chat
        },
        data() {
            return {
                visible: true,
                participants: [
                    {
                        name: 'Arnaldo',
                        id: 1
                    },
                    {
                        name: 'Adam',
                        id: 2
                    }
                ],
                myself: {
                    name: 'John Doe',
                    id: 3
                },
                messages: [
                    {
                        content: "Really?! I don't care! Haha",
                        myself: false,
                        participantId: 1,
                        timestamp: {year: 2012, month: 3, day: 5, hour: 20, minute: 10, second: 3, millisecond: 123},
                        uploaded: true,
                        viewed: true
                    },
                    {
                        content: "Really?! I don't care! Haha",
                        myself: false,
                        participantId: 1,
                        timestamp: {year: 2012, month: 3, day: 5, hour: 20, minute: 10, second: 3, millisecond: 123},
                        uploaded: true,
                        viewed: true
                    },
                    {
                        content: "Really?! I don't care! Haha",
                        myself: false,
                        participantId: 1,
                        timestamp: {year: 2012, month: 3, day: 5, hour: 20, minute: 10, second: 3, millisecond: 123},
                        uploaded: true,
                        viewed: true
                    },
                    {
                        content: "Really?! I don't care! Haha",
                        myself: false,
                        participantId: 1,
                        timestamp: {year: 2012, month: 3, day: 5, hour: 20, minute: 10, second: 3, millisecond: 123},
                        uploaded: true,
                        viewed: true
                    },
                    {
                        content: "Really?! I don't care! Haha",
                        myself: false,
                        participantId: 1,
                        timestamp: {year: 2012, month: 3, day: 5, hour: 20, minute: 10, second: 3, millisecond: 123},
                        uploaded: true,
                        viewed: true
                    },
                    {
                        content: "Really?! I don't care! Haha",
                        myself: false,
                        participantId: 1,
                        timestamp: {year: 2012, month: 3, day: 5, hour: 20, minute: 10, second: 3, millisecond: 123},
                        uploaded: true,
                        viewed: true
                    },
                ],
                chatTitle: 'My chat title',
                placeholder: 'send your message',
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
                            //bg: 'rgb(247, 243, 243)',
                            //bg: '#f7f3f3'
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
                toLoad: [
                    {
                        content: 'Hey, John Doe! How are you today?',
                        myself: false,
                        participantId: 2,
                        timestamp: { year: 2011, month: 3, day: 5, hour: 10, minute: 10, second: 3, millisecond: 123 },
                        uploaded: true,
                        viewed: true
                    },
                    {
                        content: "Hey, Adam! I'm feeling really fine this evening.",
                        myself: true,
                        participantId: 3,
                        timestamp: { year: 2010, month: 0, day: 5, hour: 19, minute: 10, second: 3, millisecond:123 },
                        uploaded: true,
                        viewed: true
                    },
                ]
            }
        },
        created() {
            // moment.locale('pt-br')
        },
        methods: {
            // eslint-disable-next-line
            onType: function () {
                // eslint-disable-next-line
                console.log('typing');
            },
            loadMoreMessages(resolve) {
                setTimeout(() => {
                    resolve(this.toLoad);
                    //Make sure the loaded messages are also added to our local messages copy or they will be lost
                    this.messages.unshift(...this.toLoad);
                    this.toLoad = [];
                }, 1000);
            },
            onMessageSubmit(message) {
                /*
                * example simulating an upload callback.
                * It's important to notice that even when your message wasn't send
                * yet to the server you have to add the message into the array
                */
                this.messages.push(message);

                /*
                * you can update message state after the server response
                */
                // timeout simulating the request
                setTimeout(() => {
                    message.uploaded = true
                }, 2000)
            },
            onClose() {
                this.visible = false;
            },
            addMessage() {
                this.messages.push(
                    {
                        content: "Update state",
                        myself: false,
                        participantId: 1,
                        timestamp: {year: 2014, month: 3, day: 5, hour: 20, minute: 10, second: 3, millisecond: 123},
                        uploaded: true,
                        viewed: true
                    }
                )
            },
            addParticipant() {
                let participant = {
                    name: 'Karl',
                    id: 4
                };
                this.participants.push(participant)
            }
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
        @media not all and (min-resolution:.001dpcm)
        { @supports (-webkit-appearance:none) {

            .message-container{
                display:-webkit-box !important;
            }

        }}

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
