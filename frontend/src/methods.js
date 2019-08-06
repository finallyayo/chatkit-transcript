import axios from 'axios';
import { ChatManager, TokenProvider } from '@pusher/chatkit-client'
import { toast } from 'react-toastify';
import randomWords from 'random-words';

function handleInput(event) {
  const { value, name } = event.target;

  this.setState({
    [name]: value
  });
}

function addSupportStaffToRoom() {
  const { currentRoom, currentUser } = this.state;

  return currentUser.addUserToRoom({
    userId: "support",
    roomId: currentRoom.id
  });
};

function createRoom() {
  const { currentUser } = this.state;

  currentUser
    .createRoom({
      name: randomWords({ exactly: 2, join: ' ' }),
      private: true
    })
    .then(room => connectToRoom.call(this, room.id))
    .then(() => addSupportStaffToRoom.call(this))
    .catch(console.error);
};

function connectToRoom(id) {
  const { currentUser } = this.state;

  return currentUser
    .subscribeToRoomMultipart({
      roomId: `${id}`,
      messageLimit: 100,
      hooks: {
        onMessage: message => {
          this.setState({
            messages: [...this.state.messages, message]
          });
        },
      }
    })
    .then(currentRoom => {
      this.setState({
        currentRoom
      });
    });
}

function joinChat(event) {
  event.preventDefault();

  const { username } = this.state;

  if (username.trim() === "") {
    alert("A valid username is required");
  } else {
    axios
      .post("http://localhost:5200/users", { username })
      .then(() => {
        const tokenProvider = new TokenProvider({
          url: "<your test token provider>"
        });

        const chatManager = new ChatManager({
          instanceLocator: "<your chatkit instance locator>",
          userId: username,
          tokenProvider
        });

        return chatManager.connect().then(currentUser => {
          this.setState(
            {
              currentUser,
            },
            () => createRoom.call(this)
          );
        });
      })
      .catch(console.error);
  }
}

function sendMessage(event) {
  event.preventDefault();
  const { newMessage, currentUser, currentRoom } = this.state;

  if (newMessage.trim() === "") return;

  currentUser.sendSimpleMessage({
    roomId: `${currentRoom.id}`,
    text: newMessage
  });

  this.setState({
    newMessage: "",
  });
}

function endChat(event) {
  event.preventDefault();

  this.setState({
    showTranscriptDialog: true
  });
}

function sendTranscript(event) {
  event.preventDefault();

  const { currentRoom, currentUser, transcriptEmail } = this.state;

  axios.post("http://localhost:5200/transcript", {
    roomId: currentRoom.id,
    email: transcriptEmail,
    name: currentUser.name,
  })
    .then(res => {
      toast.success("Transcript sent successfully!");

      this.setState({
        showTranscriptDialog: false,
        transcriptEmail: "",
      })
    })
    .catch(err => {
      console.error(err);
      toast.error("An problem occured");
    })
    .finally(() => {
      currentUser.disconnect();
      this.setState({
        currentUser: null,
        currentRoom: null,
        messages: [],
        newMessage: "",
      })
    });
}

export {
  handleInput,
  joinChat,
  sendMessage,
  endChat,
  sendTranscript,
}
