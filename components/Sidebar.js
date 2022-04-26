import styled from "styled-components";
import { Avatar, Button, IconButton } from '@mui/material'
import ChatIcon from '@mui/icons-material/Chat';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import SearchIcon from '@mui/icons-material/Search';
import * as EmailValidator from 'email-validator'
import { signOut } from "firebase/auth";
import { auth, db } from "../lib/firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { useCollection } from 'react-firebase-hooks/firestore'
import { addDoc, collection, query, where } from '@firebase/firestore'
import Chat from "./Chat";

function Sidebar() {
  
    const [user] = useAuthState(auth)
    const userChatRef = query(collection(db, 'chats'), where('users', 'array-contains', user.email));
    const [chatSnapshot] = useCollection(userChatRef);

  const createChat = () => {
      const input = prompt(`Please enter an email address for the user
      you wish to chat with`);

      if(!input) return null;
    
      // Add chat if it doesn't exist and if it is valid
      if(EmailValidator.validate(input) && !chatAlreadyExists(input) && input !== user.email) {
          addDoc(collection(db, 'chats'), { 
              users: [user.email, input],
          })
      }

  }

  const chatAlreadyExists = (recipientEmail) => {
    return !!chatSnapshot?.docs.find(chat => chat.data().users.find(user => user === recipientEmail)?.length > 0)
  }

 
  return (
    <Container>
        
       <Header>
        <UserAvatar src={user?.photoURL} onClick={() => signOut(auth)}/>
        <IconsContainer>
            <IconButton>
          <ChatIcon />
            </IconButton>
            <IconButton>
            <MoreVertIcon/>
            </IconButton>
        </IconsContainer>
      </Header>

        <Search>
           <SearchIcon/>
           <SearchInput placeholder="Search in chat"/>
        </Search>
       
      <SidebarButton onClick={createChat}>
          Start a new chat
      </SidebarButton>

      {/* List of chats */}
      {chatSnapshot?.docs.map(chat => {
          return <Chat key={chat.id} id={chat.id} users={chat.data().users} />
      }) 
      }

    </Container>
  ) 
}

export default Sidebar

const Container = styled.div`
flex: 0.45;
border-right: 1px solid whitesmoke;
height: 100vh;
min-width: 300px;
max-width: 350px;
overflow-y: scroll;

::-webkit-scrollbar {
  display: none;
}

-ms-overflow-style: none; /* IE and Edge */
scrollbar-width: none; /* Firefox */
`;

const Header = styled.div`
display: flex;
position: sticky;
top: 0;
background-color: white;
z-index: 1;
justify-content: space-between;
align-items: center;    
padding: 15px;
height: 80px;
border-bottom: 1px solid whitesmoke;
`;

const UserAvatar = styled(Avatar)`
cursor: pointer;

:hover {
    opacity: 0.8;
}
`;

const IconsContainer = styled.div``;

const Search = styled.div`
display: flex;
align-items: center;
padding: 20px;
border-radius: 2px;
`;

const SearchInput = styled.input`
outline-width: 0;
border: none;
flex: 1;
`;

 const SidebarButton = styled(Button)`
 width: 100%;
 &&& {
     border-top: 1px solid whitesmoke;
     border-bottom: 1px solid whitesmoke;
     color: #111111;
     :hover {
         background-color: rgba(236, 236, 236, 0.4);
 }
 };
 `