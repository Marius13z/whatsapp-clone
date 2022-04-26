import { useAuthState } from 'react-firebase-hooks/auth'
import styled from 'styled-components'
import { auth, db } from '../lib/firebase'
import { useRouter } from 'next/router'
import { Avatar, IconButton } from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import { useCollection } from 'react-firebase-hooks/firestore'
import { addDoc, collection, doc, orderBy, query, serverTimestamp, setDoc, where } from 'firebase/firestore';
import InsertEmoticonIcon from '@mui/icons-material/InsertEmoticon';
import MicIcon from '@mui/icons-material/Mic';
import { useRef, useState } from 'react';
import Message from './Message';
import getRecipientEmail from '../lib/getRecipientEmail'
import TimeAgo from 'timeago-react';

function ChatScreen({ chat, messages }) {
  const [user] = useAuthState(auth);
  const router = useRouter();
  const [input, setInput] = useState("");
  const endOfMessagesRef = useRef(null);
  const ref = doc(collection(db, "chats"), router.query.id);
  const [messagesSnapshot] = useCollection(query(collection(ref, "messages"), orderBy("timestamp", "asc")));
  const [recipientSnapshot] = useCollection(query(collection(db, "users"), where('email', '==', getRecipientEmail(chat.users, user))));

  const showMessages = () => {

      if(messagesSnapshot) {
        return messagesSnapshot?.docs.map(message => {
         return <Message id={message.id}
          key={message.id} 
          user={message.data().user}
          message={{
            ...message.data(),
            timestamp: message.data().timestamp?.toDate().getTime(),
          }}
          />
        })
      } else {
        return JSON.parse(messages).map(message => {
          return <Message id={message.id} key={message.id} user={message.user} message={message} />
        })
      }
  }

  const sendMessage = (e) => {
      e.preventDefault();
 
     setDoc(doc(collection(db, "users"), user.uid), {
       lastSeen: serverTimestamp()
     }, {merge: true})

     addDoc(collection(ref, "messages"), {
       timestamp: serverTimestamp(),
       message: input,
       user: user.email,
       photoURL: user.photoURL,
     })

     setInput("");
     scrollToBottom();
  }

  const recipientEmail = getRecipientEmail(chat.users, user);

  console.log(recipientEmail)

  const recipient = recipientSnapshot?.docs?.[0]?.data();

  console.log(recipient)

  const scrollToBottom = () => {
    endOfMessagesRef.current.scrollIntoView({
      behavior: "smooth",
      block: "start",
    })
  }

  return (
     <Container>
        <Header>
        {recipient ? ( 
        <Avatar referrerpolicy="no-referrer-when-downgrade" src={recipient?.photoURL}/>
      ) : (
        <Avatar>{recipientEmail[0]}</Avatar>
      )}

         <HeaderInformation>
           <h3>{recipientEmail}</h3>
           {recipientSnapshot ? (
             <p>Last active: {' '} {recipient?.lastSeen?.toDate() ? 
            (<TimeAgo datetime={recipient?.lastSeen?.toDate()} />) :
            ("Unavailable")
            }</p>
           ) : (
             <p>Loading last active...</p>
           )}
           
         </HeaderInformation>
         <HeaderIcons>
            <IconButton>
               <MoreVertIcon/>
            </IconButton>
            <IconButton>
              <AttachFileIcon/>
            </IconButton>
         </HeaderIcons>
        </Header>

        <MessageContainer>
          {showMessages()}
          <EndOfMessage ref={endOfMessagesRef} />
        </MessageContainer>

        <InputContainer>
         <InsertEmoticonIcon/>
         <Input value={input} onChange={e => setInput(e.target.value)}/>
         <button hidden disabled={!input} type="submit" onClick={sendMessage} >Send message</button>
         <MicIcon/>
        </InputContainer>

     </Container>
  )
}

export default ChatScreen

const Container = styled.div`

`

const Header = styled.div`
position: sticky;
background-color: white;
z-index: 100;
top: 0;
display: flex;
padding: 11px;
height: 80px;
align-items: center;
border-bottom: 1px solid whitesmoke;
`

const HeaderInformation = styled.div`
margin-left: 15px;
flex: 1;

> h3 {
  margin-bottom: 3px;
}

> p {
  font-size: 14px;
  color: gray;
}
`

const HeaderIcons = styled.div`

`

const EndOfMessage = styled.div`
 margin-bottom: 50px;
`

const MessageContainer = styled.div`
padding: 30px;
background-color: #e5ded8;
min-height: 90vh;
`

const InputContainer = styled.form`
display: flex;
align-items: center;
padding: 10px;
position: sticky;
bottom: 0;
background-color: white;
z-index: 100;
`

const Input = styled.input`
flex: 1;
outline: 0;
border: none;
border-radius: 10px;
background-color: whitesmoke;
padding: 20px;
margin-left: 15px;
margin-right: 15px;
`