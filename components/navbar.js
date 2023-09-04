import LogoutIcon from '@mui/icons-material/Logout';
import { AppBar, Box, Button, Container, Stack, Toolbar, Typography } from '@mui/material';
import { useAuth } from '../firebase/auth';
import styles from '../styles/navbar.module.scss';

export default function NavBar() {
  const {authUser, signOut}= useAuth();

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static" className={styles.appbar}>
        <Toolbar className={styles.toolbar}>
          <Container className={styles.container}>
            <Typography variant="h4" sx={{ flexGrow: 1, alignSelf: "center" }}>
              EXPENSE TRACKER
            </Typography>
            <Stack direction="row" spacing={2} sx={{ alignItems: "center" }}>
              <Typography variant="h6" sx={{ flexGrow: 1 }}>
               Bentornato\a {authUser?.email}
              </Typography>
              <Button variant="text" color="secondary" onClick={signOut}>
                <LogoutIcon />
              </Button>
            </Stack>
          </Container>
        </Toolbar>
      </AppBar>
    </Box>
  );
}