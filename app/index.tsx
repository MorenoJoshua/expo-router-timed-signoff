import {SafeAreaView} from "react-native-safe-area-context";
import {Button, Text, View} from "react-native";
import {AuthContext} from "@/context/authContext";
import {useContext} from "react";

const SignInPage = () => {
    const {
        signIn,
        signedIn,
        authTime,
        resetSignOutTimer
    } = useContext(AuthContext);

    return <SafeAreaView style={{
        paddingHorizontal: 12
    }}>
        <View>
            <Text>This could be somewhere outside the gate</Text>
            <Text>{JSON.stringify({
                signedIn,
                authTime
            })}</Text>
            <Button title={"Sign me in"} onPress={() => signIn()}/>
            <Button title={"Reset timer"} onPress={() => resetSignOutTimer()}/>
        </View>
    </SafeAreaView>
}


export default SignInPage;
