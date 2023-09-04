import { useEffect, useState } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import StyledFirebaseAuth from 'react-firebaseui/StyledFirebaseAuth';
import { EmailAuthProvider, GoogleAuthProvider } from 'firebase/auth';
import { Button, CircularProgress, Container, Dialog, Typography } from '@mui/material';
import { useAuth } from '../firebase/auth';
import { auth } from '../firebase/firebase';
import styles from '../styles/landing.module.scss';

const REDIRECT_PAGE= '/dashboard';

/* FirebaseUI is an open-source JavaScript library for Web that provides simple, customizable UI bindings 
   on top of Firebase SDKs to eliminate boilerplate code and promote best practices.  */
const uiConfig = {
  signInFlow: 'popup', 
  signInSuccessUrl: REDIRECT_PAGE,
  signInOptions:[
    EmailAuthProvider.PROVIDER_ID,
    GoogleAuthProvider.PROVIDER_ID,
  ]
}

export default function Home() {
  const {authUser, isLoading}= useAuth();
  const [login, setLogin]= useState(false);
  const router = useRouter();

 
/* The `useEffect` hook is used to redirect the user to the dashboard page if they are already
   authenticated and the loading state is false. */
  useEffect(()=>{
    if(!isLoading && authUser){
      router.push('/dashboard');
    }
  }, [authUser,isLoading])


  /* `(isLoading || (!isLoading && !!authUser)` is a conditional statement that checks if the
  `   isLoading` variable is true or if `isLoading` is false and `authUser` is truthy. */
  return ( (isLoading || (!isLoading && !!authUser)) ?
  /* displays a circular loading indicator. */
  <CircularProgress color='inherit' sx={{marginLeft: '50%',marginTop: '25%'}}/>
  :
    <div>
      <Head>
        <title>ExpenseTracker</title>
      </Head>

      <main>
        <Container className={styles.container}>
          <Typography variant="h1">Benvenuto su ExpenseTracker</Typography>
          <Typography variant="h2">La tua applicazione web per tenere traccia delle tue spese</Typography>
          <div className={styles.buttons}>
            <Button variant="contained" color="secondary"
               onClick={() => setLogin(true)}>
              Login / SignUp
            </Button>
          </div>
          <Dialog open={login} onClose={()=> setLogin(false)}>
           <StyledFirebaseAuth uiConfig={uiConfig} firebaseAuth={auth}></StyledFirebaseAuth>
          </Dialog>
        </Container>
      </main>
    </div>);
}