import styled from "styled-components"
import  Head  from "next/head"
import { Button } from "@mui/material"
import { auth, provider } from "../lib/firebase"
import {signInWithPopup} from 'firebase/auth'


function Login() {

    const signIn = () => {
        signInWithPopup(auth, provider).catch(alert)
    }

  return (
    <Container>
      <Head>
          <title>Login</title>
      </Head>

      <LoginContainer>
          <Logo src="http://assets.stickpng.com/images/580b57fcd9996e24bc43c543.png"/>
          <ButtonC onClick={signIn} variant="outlined">Sign in with Google</ButtonC>
      </LoginContainer>
    </Container>
  )
}

export default Login

const ButtonC = styled(Button)`
&&& {
    border: 1px solid #111111;
    color: #111111;
    :hover {
        border: 1px solid rgba(191, 191, 191, 1);
        background-color: white;
    }
}
`

const Logo = styled.img`
height: 200px;
width: 200px;
margin-bottom: 50px;
`

const LoginContainer = styled.div`
display: flex;
flex-direction: column;
padding: 100px;
align-items: center;
background-color: white;
border-radius: 5px;
box-shadow: 0px 4px 14px -3px rgba(0, 0, 0, 0.7)
`

const Container = styled.div`
display: grid;
place-items: center;
height: 100vh;
background-color: whitesmoke;
`