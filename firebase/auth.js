import { onAuthStateChanged, signOut as authSignOut } from "firebase/auth";
import { useContext, useEffect, useState, createContext } from "react";
import { auth } from './firebase';

/* The code is creating a context object called `AuthUserContext` using the `createContext` function
from React. The initial value of the context is an object with three properties: `authUser`,
`isLoading`, and `signOut`. */
const AuthUserContext = createContext({
    authUser: null,
    isLoading: true,
    signOut: async () => {}
});

/**
 * The function `useFirebaseAuth` is a custom hook that manages the authentication state of a Firebase
 * user, including the user's information, loading state, and sign out functionality.
 * @returns The function `useFirebaseAuth` returns an object with three properties: `authUser`,
 * `isLoading`, and `signOut`.
 */
export default function useFirebaseAuth(){
    const [authUser, setAuthUser] = useState(null);
    const [isLoading, setIsLoading]= useState(true);

    const clear = ()=>{
        setAuthUser(null);
        setIsLoading(false);
    }

  /**
   * The function `authStateChanged` updates the state with the user's authentication information and
   * sets the loading state accordingly.
   * @param user - The user parameter is an object that represents the authenticated user. It typically
   * contains information such as the user's unique identifier (uid) and email address.
   */
    const authStateChanged = async (user) => {
        setIsLoading(true);
        if (!user){
            clear();
            return;
        }
        setAuthUser({
            uid: user.uid,
            email: user.email
        });
        setIsLoading(false);
    };

    const signOut = ()=> authSignOut(auth).then(clear());

   /* The `useEffect` is used to subscribe to the authentication state changes 
      using the `onAuthStateChanged` function from Firebase. */
    useEffect(()=>{
        const unsubscribe = onAuthStateChanged(auth, authStateChanged);
        return () => unsubscribe();
    }, []);

    return{
        authUser,
        isLoading,
        signOut
    }

}

/**
 * The AuthUserProvider function is a React component that provides authentication information to its
 * children components.
 * @returns The `AuthUserProvider` component is returning a `AuthUserContext.Provider` component with
 * the `auth` value as the context value, and the `children` as the content of the provider.
 */
export function AuthUserProvider({children}){
    const auth= useFirebaseAuth();
    return <AuthUserContext.Provider value={auth}>{children}</AuthUserContext.Provider>;
}

/**
 * The useAuth function returns the current authenticated user from the AuthUserContext.
 */

export const useAuth = () => useContext(AuthUserContext);