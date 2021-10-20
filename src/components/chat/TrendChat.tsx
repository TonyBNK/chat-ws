import React, {ChangeEvent, KeyboardEvent, useEffect, useRef, useState} from "react";
import {MessageType, Nullable} from "../../types/types";
import cat_with_glasses from '../../images/cat_with_glasses.jpg';


const styles = {
    chatStyle: {
        padding: '10px',
        border: '1px solid black',
        height: '600px',
        overflowY: 'scroll' as 'scroll'
    },
    txtAreaStyle: {
        padding: '10px'
    },
    messageStyle: {
        marginBottom: '20px',
        display: 'flex',
        alignItems: 'center'
    },
    avatarStyle: {
        width: '60px',
        height: '60px',
        borderRadius: '50%'
    }
}

const TrendChat = () => {
    const [messages, setMessages] = useState<Array<MessageType>>([]);
    const [socket, setSocket] = useState<Nullable<WebSocket>>(null);
    const [newMessage, setNewMessage] = useState<string>('');
    const baseURL = 'social-network.samuraijs.com';
    const messagesRef = useRef<HTMLDivElement>(null);

    const onMessage = (messageEvent: MessageEvent) => {
        if (messageEvent.data) {
            const nextMessages = JSON.parse(messageEvent.data);
            setMessages([...messages, ...nextMessages]);
        }
    }

    const onClose = (closeEvent: CloseEvent) => {

    }

    if (socket) {
        socket.onmessage = onMessage;
        socket.onclose = onClose;
    }

    const onKeyPress = (e: KeyboardEvent) => {
        if (e.ctrlKey && e.key === '\n' && socket){
            socket.send(newMessage);
            setNewMessage('');
        }
    }

    const onClick = () => {
            socket && socket.send(newMessage);
            setNewMessage('');
    }

    const onChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
        setNewMessage(e.currentTarget.value);
    }

    useEffect(() => {
        setSocket(new WebSocket(`wss://${baseURL}/handlers/ChatHandler.ashx`));
    }, []);
    useEffect(() => {
        const div = messagesRef.current;
        div && div.scrollTo(0, div.scrollHeight);
    });

    return (
        <div>
            <h3>CHAT</h3>
            <div style={styles.chatStyle} ref={messagesRef}>
                {
                    messages.map((m: MessageType, index) => {
                            return <div key={index} style={styles.messageStyle}>
                                <img
                                    src={m.photo ? m.photo : cat_with_glasses}
                                    alt="ava"
                                    style={styles.avatarStyle}
                                />
                                <b>{m.userName}</b>: {m.message}
                            </div>
                        }
                    )
                }
            </div>
            <div style={styles.txtAreaStyle}>
                <textarea
                    onKeyPress={onKeyPress}
                    placeholder={'Add new message...'}
                    value={newMessage}
                    onChange={onChange}
                />
                <button onClick={onClick}>
                    Send
                </button>
            </div>
        </div>
    )
}

export default TrendChat;
