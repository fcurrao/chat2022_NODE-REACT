import React, { useEffect, useRef, useState } from 'react';
import './App.css';
import io from 'socket.io-client';

const socket = io('http://localhost:4000');

function App() {
  const [messages, setMessages] = useState([]);
  const [user, setUser] = useState('');
  const [inputValue, setInputValue] = useState('');
  const [valueName, setValueName] = useState('');

  // Referencia para el final de los mensajes
  const endOfMessagesRef = useRef(null);

  useEffect(() => {
    // Configura el listener de eventos cuando el componente se monta
    const handleMessage = (message) => {
      setMessages(prevMessages => [...prevMessages, message]);
    };

    socket.on('chat message', handleMessage);

    // Limpia el listener cuando el componente se desmonta
    return () => {
      socket.off('chat message', handleMessage);
    };
  }, []);

  useEffect(() => {
    // Desplaza el contenedor al final cuando hay un nuevo mensaje
    if (endOfMessagesRef.current) {
      endOfMessagesRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  const sendMessage = () => {
    if (inputValue.trim() === "") return;
    const objMsj = { user: user, mensaje: inputValue };
    socket.emit('chat message', objMsj);
    setInputValue('');
  };

  const setName = () => {
    setUser(valueName);
    setValueName("");
  };

  return (
    <div className="chat-container">
      <div className="flex-item">
        {user === "" ? (
          <>
            <div className='imgChat'>
              <img className='chat-image' src='https://img.freepik.com/vector-premium/icono-vector-chat_676179-133.jpg?w=826' alt="chat" />
            </div>
            <input
              type="text"
              placeholder='COLOCA TU NOMBRE'
              value={valueName}
              onChange={e => setValueName(e.target.value)}
              onKeyDown={e => {
                if (e.key === "Enter") {
                  setName();
                }
              }}
              className="input-field init"
            />
            <button onClick={setName} className="btn">Ingresar</button>
          </>
        ) : (
          <div>
            <header className="chat-header">
              {(user === 'fede' || user === 'FEDE') ? (
                <img src="https://fcurrao.github.io/fcurrao-1/images/yo.png" alt="User" className="user-image" />
              ) : (
                <img src="https://lh3.googleusercontent.com/a/ACg8ocKEr5yINp3zpfk6nzOhe8zRvu855_MXrYSg2zhGcBY8nF2fxFuSYg=s83-c-mo" alt="User" className="user-image" />
              )}
              <p className="user-name"> Usuario:&nbsp; {user.toLocaleUpperCase()}</p>
            </header>

            <div className="message-list">
              {messages.length !== 0 ? (
                messages.map((message, index) => (
                  <div key={index} className={`message-item ${message.user === user ? 'self' : 'other'}`}>
                    {(message.user !== 'fede' && message.user !== 'FEDE') && <img src="https://lh3.googleusercontent.com/a/ACg8ocKEr5yINp3zpfk6nzOhe8zRvu855_MXrYSg2zhGcBY8nF2fxFuSYg=s83-c-mo" alt="User" className="message-user-image" />}
                    {(message.user === 'fede' || message.user === 'FEDE') && <img src="https://fcurrao.github.io/fcurrao-1/images/yo.png" alt="User" className="message-user-image" />}
                    <div className="message-bubble">
                      <p className='noP'>{message.mensaje}</p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="empty-chat">CHAT VACIO</p>
              )}
              {/* Esta referencia sirve para desplazarse al final */}
              <div ref={endOfMessagesRef} />
            </div>
            <div className="d-flex">
              <textarea
                value={inputValue}
                onChange={e => setInputValue(e.target.value)}
                onKeyDown={e => {
                  if (e.key === "Enter") {
                    sendMessage();
                  }
                }}
                className="textarea-field"
              />
              <button onClick={sendMessage} className="btn send">Enviar</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
