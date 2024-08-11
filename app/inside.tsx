import {SafeAreaView} from "react-native-safe-area-context";
import {Button, Text, View} from "react-native";
import {useAuth} from "@/context/authContext";

const Inside = () => {
    const {
        signedIn,
        authTime,
        signOut,
        resetSignOutTimer
    } = useAuth()
    return (
        <SafeAreaView style={{
            paddingHorizontal: 12
        }}>
            <View>
                <Text>Inside the gate</Text>
                <Text>{JSON.stringify({
                    signedIn,
                    authTime
                })}</Text>
                <Button title={"Reset timer"} onPress={() => resetSignOutTimer()}/>
                <Button title={"Sign out"} onPress={() => signOut()}/>
            </View>
        </SafeAreaView>
    )
}

export default Inside;

