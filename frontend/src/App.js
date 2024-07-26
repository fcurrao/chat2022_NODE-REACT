import React, { useEffect, useState } from 'react';
import './App.css';
import io from 'socket.io-client'; //// importo el io 

//// CONECTO EL IO DE BACK Y LO LLAMO SOCKET
const socket = io('http://localhost:4000');

function App() {
  const [messages, setMessages] = useState([]);
  const [user, setUser] = useState('');
  const [inputValue, setInputValue] = useState('');
  const [valueName, setValueName] = useState('');
  

  useEffect(() => {
    socket.on('chat message', message => { //// RECIBO EL MENSAJE DEL SERVIDOR Y LO SETEO EN SETMENSAGES, LO AGREGO.  (TIPO PUSH)
      setMessages([...messages, message]); //// le agrega a los mensajes el mensaje 
    });
  }, [messages]); //// ESTE USEEFFECT SE EJECUTA CUANDO ESCUCHA CHAT MESSAGE (lo emite en sendMessage) - y no cuando cambia mensaje por set



  const sendMessage = () => {
    if (inputValue.trim() === "") return; 
    const objMsj = { user: user, mensaje: inputValue } //// FORMATEO EL MENSAJE, CREANDOLO COMO OBJETO
    // setMessages([...messages, objMsj]);
    socket.emit('chat message', objMsj); //// ENVIO ESE OBJETO AL SERVIDOR 
    setInputValue(''); //// REINICIA EL VALOR DEL INPUT EN " "

    setInputValue("");
  };

  // const sendMessage = () => {
  // };

  const setName = () => {
    setUser(valueName);
    setValueName("");
  };




  return (
<div className="chat-container">
  <div className="flex-item">
    
    {user === "" ? (
      <> 
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
    ) : ( <>
      <img src="https://lh3.googleusercontent.com/a/ACg8ocKEr5yINp3zpfk6nzOhe8zRvu855_MXrYSg2zhGcBY8nF2fxFuSYg=s83-c-mo" alt="User" className="user-image" />
      </>
    )}
      <p className="user-name"> USUARIO INGRESADO :  {user}</p>
    </header>
        

        <div className="message-list">
          {messages.length !== 0 ? (
            messages.map((message, index) => (
              <div key={index} className={`message-item ${message.user === user ? 'self' : 'other'}`}>
                {(message.user !== 'fede'  &&  message.user !== 'FEDE')  && <img src="https://lh3.googleusercontent.com/a/ACg8ocKEr5yINp3zpfk6nzOhe8zRvu855_MXrYSg2zhGcBY8nF2fxFuSYg=s83-c-mo" alt="User" className="message-user-image" />}
                {(message.user === 'fede' || message.user === 'FEDE') && <img src="https://fcurrao.github.io/fcurrao-1/images/yo.png" alt="User" className="message-user-image" />}
                <div className="message-bubble">
                  <p className='noP'>{message.mensaje}</p>
                </div>
              </div>
            ))
          ) : (
            <p className="empty-chat">CHAT VACIO</p>
          )}
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