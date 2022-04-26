import { collection, collectionGroup, doc, getDoc, getDocs, orderBy, query } from "firebase/firestore"
import Head from "next/head"
import { useAuthState } from "react-firebase-hooks/auth"
import styled from "styled-components"
import ChatScreen from "../../components/ChatScreen"
import Sidebar from "../../components/Sidebar"
import { auth, db } from "../../lib/firebase"
import getRecipientEmail from "../../lib/getRecipientEmail"


function Chat({ chat, messages }) {
  const [user] = useAuthState(auth);


  return (
    <Container>
       <Head>
          <title>Chat with {getRecipientEmail(chat.users, user)}</title>
       </Head>
       <Sidebar />
       <ChatContainer>
         <ChatScreen chat={chat} messages={messages}/>
       </ChatContainer>
    </Container>
  )
}

export default Chat


export async function getServerSideProps(context) {

// Context allows us to acces params / route url on the server


 
 const ref = doc(collection(db, "chats"), context.query.id)

// Prep the messages on the server
 const messagesRes = await getDocs(query(collection(ref, "messages"), orderBy("timestamp", "asc")))

 const messages = messagesRes.docs.map(doc =>  ({
   id: doc.id,
   ...doc.data(),
  })).map(messages => ({
    ...messages,
    timestamp: messages.timestamp.toDate().getTime(),
  }))
  
  
 // Prep the chats

 const chatRes = await getDoc(ref);

 const chat = {
     id: chatRes.id,
     ...chatRes.data(),
 }


 return {
     props: {
         messages: JSON.stringify(messages),
         chat: chat,
     }
 }

}

const ChatContainer = styled.div`
  flex: 1;
  overflow: scroll;
  height: 100vh;
  ::-webkit-scrollbar {
      display: none
  }

  -ms-overflow-style: none;
  scrollbar-width: none;
`

const Container = styled.div`
  display: flex;
`