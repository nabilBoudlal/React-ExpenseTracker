import '../styles/global.scss'
import '../styles/firebaseui-styling.global.scss';
import { ThemeProvider } from '@mui/material/styles';
import { darkTheme, theme } from '../styles/theme.js';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import { AuthUserProvider } from '../firebase/auth';

/**
 * The function is a React component that wraps the main component with providers for localization,
 * authentication, and theming.
 * @returns a JSX element.
 */
export default function App({ Component, pageProps }) {
  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <AuthUserProvider>
      <ThemeProvider theme={theme}>
        <Component {...pageProps} />
      </ThemeProvider>
      </AuthUserProvider>
    </LocalizationProvider>);
}