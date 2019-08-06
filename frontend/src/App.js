import React from 'react';
import { handleInput, joinChat, sendMessage, endChat, sendTranscript } from './methods.js';
import { ToastContainer } from 'react-toastify';

import 'react-toastify/dist/ReactToastify.min.css';
import './App.css';

class App extends React.Component {
  constructor() {
    super();
    this.state = {
      showTranscriptDialog: false,
      transcriptEmail: "",
      username: "",
      currentRoom: null,
      currentUser: null,
      messages: [],
      newMessage: "",
    }

    this.handleInput = handleInput.bind(this);
    this.joinChat = joinChat.bind(this);
    this.sendMessage = sendMessage.bind(this);
    this.endChat = endChat.bind(this);
    this.sendTranscript = sendTranscript.bind(this);
  }

  render() {
    const { currentUser, messages, newMessage, showTranscriptDialog } = this.state;

    const messageList = messages.map(message => {
      const arr = message.parts.map(p => {
        return (
          <span className="message-text">{p.payload.content}</span>
        );
      });

      return (
        <li className="message" key={message.id}>
          <div>
            <span className="user-id"><strong>{message.sender.name}: </strong></span>
            {arr}
          </div>
        </li>
      )
    });

    return (
      <div className="App">
        {!currentUser ? (
          <div className="login-form">
            <h2>Chat with a Support Agent</h2>
            <form onSubmit={this.joinChat}>
                <label htmlFor="username">Enter your username</label>
                <input onChange={this.handleInput} type="text" id="username" name="username"
                  placeholder="Username" />
                  <button type="submit">Start chatting!</button>
                </form>
              </div>
        ) : (
          <div className="chat-widget">
            <header className="chat-header">
              <h2>Support</h2>
              <button onClick={this.endChat} className="end-chat">
                End Chat
              </button>
            </header>
            <ul className="chat-messages">
              {messageList}
            </ul>

            <form onSubmit={this.sendMessage} className="message-form">
              <input
                className="message-input"
                autoFocus
                name="newMessage"
                placeholder="Compose your message and hit ENTER to send"
                onChange={this.handleInput}
                value={newMessage}
              />
            </form>
          </div>
          )}

          <ToastContainer />

          {showTranscriptDialog ? (
            <div className="dialog-container">
              <div className="dialog">
                <form className="dialog-form" onSubmit={this.sendTranscript}>
                  <label htmlFor="email">Send a transcript of the chat to the following email address:</label>
                  <input onChange={this.handleInput} type="email" id="email" name="transcriptEmail"
                    placeholder="name@example.com" />
                  <button type="submit" className="submit-btn">
                    Send transcript
                  </button>
                  </form>
                </div>
              </div>
          ) : null}
      </div>
    );
  }
}

export default App;
