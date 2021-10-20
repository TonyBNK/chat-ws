import React, {KeyboardEvent, useEffect, useState} from "react";
import {MessageType, Nullable} from "../../types/types";


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

const TrendChat = () => {
    const [messages, setMessages] = useState<Array<MessageType>>([]);
    const [socket, setSocket] = useState<Nullable<WebSocket>>(null);
    const baseURL = 'social-network.samuraijs.com';
    const messagesRef = React.createRef<HTMLDivElement>();


    const onMessage = (messageEvent: MessageEvent) => {
        if (messageEvent.data) {
            const nextMessages = JSON.parse(messageEvent.data);
            setMessages([...messages, ...nextMessages])
        }
    }

    const onClose = (closeEvent: CloseEvent) => {

    }

    const onKeyPress = (e: KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.ctrlKey && e.key === '\n' && socket) {
            socket.send(e.currentTarget.value);
            e.currentTarget.value = '';
        }
    }

    useEffect(() => {
        setSocket(new WebSocket(`wss://${baseURL}/handlers/ChatHandler.ashx`));
    }, []);
    useEffect(() => {
        if (socket) {
            socket.onmessage = onMessage;
            socket.onclose = onClose;
        }
    });
    useEffect(() => {
        const div = messagesRef.current;
        div && div.scrollTo(0, div.scrollHeight);
    });

    return (
        <div>
            <h3>CHAT</h3>
            <div style={styles.chatStyle} ref={messagesRef}>
                {
                    messages.map((m: MessageType) => <div>
                            <b>{m.userName}</b> {m.message}
                        </div>
                    )
                }
            </div>
            <div style={styles.txtAreaStyle}>
                <textarea onKeyPress={onKeyPress}>

                </textarea>
            </div>
        </div>
    )
}

export default TrendChat;
