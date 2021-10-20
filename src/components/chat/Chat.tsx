import React, {KeyboardEvent} from "react";
import {MessageType} from "../../types/types";


const styles = {
    chatStyle: {
        padding: '10px',
        border: '1px solid black',
        height: '600px',
        overflowY: 'scroll' as 'scroll'
    },
    txtAreaStyle: {
        padding: '10px'
    }
}

class Chat extends React.Component<any, any> {
    state = {
        messages: []
    }
    baseURL = 'social-network.samuraijs.com';
    socket = new WebSocket(`wss://${this.baseURL}/handlers/ChatHandler.ashx`);

    componentDidMount() {
        this.socket.onmessage = this.onMessage.bind(this);
        this.socket.onclose = this.onClose.bind(this);
    }

    onMessage(messageEvent: MessageEvent) {
        if (messageEvent.data) {
            const messages = JSON.parse(messageEvent.data);
            this.setState({
                messages: [...this.state.messages, ...messages]
            });
        }
    }

    onClose(closeEvent: CloseEvent){

    }

    onKeyPress(e: KeyboardEvent<HTMLTextAreaElement>) {
        if (e.ctrlKey && e.key === '\n') {
            this.socket.send(e.currentTarget.value);
            e.currentTarget.value = '';
        }
    }

    render() {
        return <div>
            <h3>CHAT</h3>
            <div style={styles.chatStyle}>
                {
                    this.state.messages.map((m: MessageType) => <div>
                            <b>{m.userName}</b> {m.message}
                        </div>
                    )
                }
            </div>
            <div style={styles.txtAreaStyle}>
                <textarea onKeyPress={this.onKeyPress.bind(this)}>

                </textarea>
            </div>
        </div>
    }
}

export default Chat;
