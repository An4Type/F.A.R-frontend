import * as React from "react";
import {
  StyleSheet,
  Text,
  View,
  ImageBackground,
} from "react-native";
import { Button } from "react-native-paper";
import TextInput from "@/components/Login/TextInput";
import { registerRequest } from "./services/auth";

export default function LoginPage() {
  const [email, setEmail] = React.useState({ value: "" });
  const [password, setPassword] = React.useState({ value: "" });
  const [username, setUsername] = React.useState({ value: "" });

  const handleSignUp = async () => {
    try {
      await registerRequest(username.value, email.value, password.value);
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  return (
    <View style={styles.index}>
      <ImageBackground
        source={require("../assets/texture.png")}
        style={[styles.header, { opacity: 1 }]}
        resizeMode="cover"
      >
        <Text style={styles.title}>AnyMeal</Text>
      </ImageBackground>
      <View style={styles.main}>
        <View style={styles.form}>
          <Text style={styles.titleBlack}>Sign up</Text>
          <TextInput
            label="Username"
            returnKeyType="next"
            onChangeText={(text) => setUsername({ value: text })}
            autoCapitalize="none"
            textContentType="emailAddress"
            keyboardType="email-address"
          />
          <TextInput
            label="Email"
            returnKeyType="next"
            onChangeText={(text) => setEmail({ value: text })}
            autoCapitalize="none"
            textContentType="emailAddress"
            keyboardType="email-address"
          />
          <TextInput
            label="Password"
            returnKeyType="next"
            onChangeText={(text) => setPassword({ value: text })}
            autoCapitalize="none"
            textContentType="password"
            secureTextEntry={true}
            keyboardType="default"
          />

          <Button
            buttonColor="#89BD71"
            style={styles.button}
            icon=""
            mode="contained"
            onPress={handleSignUp}
          >
            Sign up
          </Button>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  index: {
    flex: 1,
    backgroundColor: "#89BD71",
  },
  container: {
    paddingHorizontal: 30,
  },
  appbarHeader: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    backgroundColor: "#89BD71",
  },

  titleBlack: {
    fontSize: 35,
    color: "#4a4a4a",
    fontWeight: "400",
  },
  title: {
    fontSize: 35,
    color: "white",
    fontWeight: "400",
  },
  header: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: 250,
    width: "100%",
    backgroundColor: "#89BD71", // Fallback color in case texture image isn't loaded
  },
  main: {
    display: "flex",
    flex: 1,
    backgroundColor: "white",
    borderTopLeftRadius: 35,
    borderTopRightRadius: 35,
  },
  form: {
    top: "15%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 50,
    paddingHorizontal: 50,
  },
  button: {
    marginTop: 30,
    width: "95%",
    height: 40,
  },
});
