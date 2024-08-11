import {DarkTheme, DefaultTheme, ThemeProvider} from '@react-navigation/native';
import {useFonts} from 'expo-font';
import {Stack} from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import {useEffect} from 'react';
import 'react-native-reanimated';

import {useColorScheme} from '@/hooks/useColorScheme';
import {AuthProvider, useAuth} from "@/context/authContext";

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
    const colorScheme = useColorScheme();
    const [loaded] = useFonts({
        SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
    });

    useEffect(() => {
        if (loaded) {
            SplashScreen.hideAsync();
        }
    }, [loaded]);

    if (!loaded) {
        return null;
    }

    return (
        <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
            <AuthProvider>
                <App/>
            </AuthProvider>
        </ThemeProvider>
    );
}

const App = () => {
    const {
        signedIn
    } = useAuth()
    return (
        <Stack initialRouteName={signedIn ? 'inside' : 'index'}>
            <Stack.Screen redirect={signedIn} name={'index'}/>
            <Stack.Screen redirect={!signedIn} name={'inside'}/>
            <Stack.Screen name="+not-found"/>
        </Stack>
    )
}
