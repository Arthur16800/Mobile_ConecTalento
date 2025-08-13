import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  StyleSheet,
  Image,
  ImageBackground,
} from "react-native";
import api from "../axios/axios";
import { Ionicons } from "@expo/vector-icons";
import * as SecureStore from "expo-secure-store";
import backgroundLogin from "../../assets/backgroundLogin.png";
import logo from "../../assets/logo.png";

export default function Login({ navigation }) {
  const [user, setUser] = useState({
    cpf: "",
    password: "",
    showPassword: true,
  });

  const [focusedInput, setFocusedInput] = useState(null);

  async function saveToken(token) {
    await SecureStore.setItemAsync("token", token);
  }
  async function saveCpf(cpf) {
    await SecureStore.setItemAsync("userId", cpf);
  }

  async function handleLogin() {
    await api.postLogin(user).then(
      (response) => {
        Alert.alert(response.data.message);
        saveToken(response.data.token);
        saveCpf(user.cpf);
        navigation.navigate("Home", user.cpf);
      },
      (error) => {
        Alert.alert(error.response.data.error);
      }
    );
  }

  return (
    <View style={styles.container}>
      <ImageBackground source={backgroundLogin} style={styles.background}>
        <View style={styles.whiteboard}>
          <Text style={styles.title}>Login</Text>
          <Image source={logo} style={styles.logo} />

          <Text style={styles.subtitle}>
            Seja bem-vindo(a)! Faça seu Login na ConecTalento
          </Text>

          <View>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Usuário</Text>
            <View
              style={[
                styles.inputContainer,
                { borderColor: focusedInput === "cpf" ? "#215299" : "#ccc" },
              ]}
            >
              <TextInput
                placeholder="Digite seu CPF *"
                placeholderTextColor="#999"
                value={user.cpf}
                onChangeText={(value) => {
                  const numericValue = value
                    .replace(/[^0-9]/g, "")
                    .slice(0, 11);
                  setUser({ ...user, cpf: numericValue });
                }}
                style={styles.input}
                keyboardType="number-pad"
                maxLength={11}
                onFocus={() => setFocusedInput("cpf")}
                onBlur={() => setFocusedInput(null)}
              />
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Senha</Text>
            <View
              style={[
                styles.inputContainer,
                styles.passwordContainer,
                {
                  borderColor: focusedInput === "password" ? "#215299" : "#ccc",
                },
              ]}
            >
              <TextInput
                placeholder="Digite sua senha *"
                placeholderTextColor="#999"
                maxLength={50}
                secureTextEntry={user.showPassword}
                value={user.password}
                onChangeText={(value) => setUser({ ...user, password: value })}
                style={styles.input}
                onFocus={() => setFocusedInput("password")}
                onBlur={() => setFocusedInput(null)}
              />
              <TouchableOpacity
                onPress={() =>
                  setUser({ ...user, showPassword: !user.showPassword })
                }
                style={styles.eyeIcon}
              >
                <Ionicons
                  name={user.showPassword ? "eye-off" : "eye"}
                  size={24}
                  color="#808080"
                />
              </TouchableOpacity>
            </View>
          </View>
          </View>
          <View>
          <TouchableOpacity style={styles.button} onPress={handleLogin}>
            <Text style={styles.buttonText}>Entrar</Text>
          </TouchableOpacity>

          <View style={styles.footer}>
            <Text style={styles.footerText}>Não possui conta?</Text>
            <TouchableOpacity onPress={() => navigation.navigate("Cadastro")}>
              <Text style={styles.footerLink}>Cadastre-se</Text>
            </TouchableOpacity>
            </View>
          </View>
        </View>
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    width: "100%",
  },
  background: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "column",
  },
  whiteboard: {
    width: "90%",
    height: "90%",
    alignSelf: "center",
    backgroundColor: "#FFFFFF",
    padding: "5%",
    flexDirection: "column",
    justifyContent:"center",
    rowGap: 38,
  },
  inicio: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-evenly",
  },
  logo: {
    position: "absolute",
    right: 0,
    top: 10,
  },
  title: {
    fontSize: 50,
    fontFamily: "serif",
    fontWeight: "700",
    color: "#000000",
    textAlign: "center",
  },
  subtitle: {
    fontSize: 25,
    fontFamily: "serif",
    color: "000000",
    textAlign: "center",
    marginBottom: 40,
  },
  inputGroup: {
    marginBottom: 25,
  },
  label: {
    fontSize: 18,
    fontWeight: "600",
    color: "#000000",
    marginBottom: 8,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 2,
    borderRadius: 12,
    backgroundColor: "#fff",
    paddingHorizontal: 15,
    paddingVertical: 6,
  },
  passwordContainer: {
    justifyContent: "space-between",
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: "#333",
  },
  eyeIcon: {
    marginLeft: 10,
  },
  button: {
    backgroundColor: "#215299",
    borderRadius: 12,
    paddingVertical: 14,
    marginTop: 15,
    alignItems: "center",
    shadowColor: "#215299",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 5,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 18,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 25,
  },
  footerText: {
    color: "#555",
    fontSize: 16,
  },
  footerLink: {
    color: "#215299",
    fontWeight: "600",
    marginLeft: 6,
    fontSize: 16,
  },
});
