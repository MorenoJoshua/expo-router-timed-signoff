import React, {useCallback, useContext, useEffect, useReducer} from "react";
import {Alert} from "react-native";

enum AuthTransitions {
    signIn = 'signIn',
    signOut = 'signOut',
    resetAutoSignOut = 'resetAutoSignOut'
}

const authInitialState = {
    signedIn: false,
    authTime: -1,
    signIn: () => {
    },
    signOut: () => {
    },
    resetSignOutTimer: () => {
    },
}
export const AuthContext = React.createContext(authInitialState);

const authReducer = (state: typeof authInitialState, action: AuthTransitions) => {
    const compositeTransition = `${JSON.stringify(state.signedIn)}_${action}` as `${typeof authInitialState.signedIn}_${AuthTransitions}`;
    switch (`${JSON.stringify(state.signedIn)}_${action}` as `${typeof authInitialState.signedIn}_${AuthTransitions}`) {
        case "false_signIn":
            return {
                ...state,
                signedIn: true,
                authTime: Date.now(),
            }
        case "true_signOut":
            return {
                ...state,
                signedIn: false,
                authTime: -1,
            }
        case "true_resetAutoSignOut":
            return {
                ...state,
                authTime: Date.now(),
            }
        default:
            console.warn(`Strange auth transition passed: ${compositeTransition}`, JSON.stringify(action, null, 2))
    }
    return state;
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({children}) => {
    const [state, dispatchAuthAction] = useReducer(authReducer, authInitialState);

    useEffect(() => {
        const signOutInNMs = 20 * 1_000;
        if (state.signedIn) {
            const timerAutoSignOut = setTimeout(() => dispatchAuthAction(AuthTransitions.signOut), signOutInNMs);
            const timerSignOutWarning = setTimeout(() => {
                Alert.alert("Signing you out automatically in 10s", "OK?", [
                    {text: "Yeah auto sign out", style: "cancel"},
                    {
                        text: "Sign Out now",
                        style: "destructive",
                        onPress: () => dispatchAuthAction(AuthTransitions.signOut)
                    },
                    {
                        text: "Reset Timer",
                        isPreferred: true,
                        style: "default",
                        onPress: () => dispatchAuthAction(AuthTransitions.resetAutoSignOut)
                    },
                ])
            }, signOutInNMs - 10_000);

            return () => {
                clearTimeout(timerAutoSignOut);
                clearTimeout(timerSignOutWarning);
            };
        }
        return () => {
        }
    }, [state.authTime])

    const signIn = useCallback(() => dispatchAuthAction(AuthTransitions.signIn), [state.authTime])
    const signOut = useCallback(() => dispatchAuthAction(AuthTransitions.signOut), [state.authTime])
    const resetSignOutTimer = useCallback(() => dispatchAuthAction(AuthTransitions.resetAutoSignOut), [state.authTime])

    return <AuthContext.Provider value={{
        ...state,
        signIn,
        signOut,
        resetSignOutTimer
    }}>
        {children}
    </AuthContext.Provider>
}

export const useAuth = () => {
    return useContext(AuthContext)
};
