import { useEffect, useState } from "react";
import "./App.css";
import Chat from "./Chat";
import Sidebar from "./Sidebar";
import Pusher from "pusher-js";
import axios from "./axios.js";

function App() {
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    axios.get('/messages/sync')
      .then(response => {
        setMessages(response.data)
      })
  }, [])

  useEffect(() => {
    // Pusher.logToConsole = true;

    const pusher = new Pusher('bdd31165d8a174f39195', {
      cluster: 'ap2'
    });

    const channel = pusher.subscribe('message');
    channel.bind('inserted', (newMessage) => {
      // alert(JSON.stringify(newMessage));
      setMessages([...messages, newMessage])
    });

    return () => {
      channel.unbind_all();
      channel.unsubscribe();
    }
  }, [messages])

  console.log(messages);

  return (
    <div className='app'>
      <div className='app__body'>
        {/* SIDEBAR */}
        <Sidebar />

        {/* CHAT */}
        <Chat messages={messages} />
      </div>
    </div>
  );
}

export default App;
