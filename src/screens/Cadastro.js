import { useLayoutEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Alert,
  StyleSheet,
  Image,
  ImageBackground,
  ActivityIndicator,
  StatusBar,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import api from "../axios/axios";
import * as SecureStore from "expo-secure-store";
import backgroundLogin from "../../assets/backgroundLogin.png";
import InputUser from "../components/InputObj";
import InputPassword from "../components/InputPassword";
import logo from "../../assets/logo.png";
import ModalConfirmEmail from "../components/ModalConfirmEmail";

export default function Cadastro({ navigation }) {
  const [user, setUser] = useState({
    name: "",
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    showPassword: false,
    showPassword2: false,
    code: "",
  });
  const [controlLoad, setControlLoad] = useState(false);
  const [modalConf, setModalConf] = useState(false);

  const visibModal = () => setModalConf(true);
  const fecharModal = () => setModalConf(false);

  useLayoutEffect(() => {
    StatusBar.setBarStyle("dark-content");
    StatusBar.setBackgroundColor("transparent");
  }, []);

  async function saveInfo(token, userP) {
    await SecureStore.setItemAsync("token", token);
    await SecureStore.setItemAsync("username", userP.username);
    await SecureStore.setItemAsync("email", userP.email);
    await SecureStore.setItemAsync("id", userP.ID_user.toString());
  }

  async function handleCadastro() {
    try {
      setControlLoad(true);
      const response = await api.postCadastro(user);

      if (response.data.message === "Código válido. Usuário autenticado.") {
        await saveInfo(response.data.token, response.data.user);
        Alert.alert("Usuário criado com sucesso!");
        navigation.navigate("Home");
      } else if (
        response.data.message === "Código reenviado ao e-mail." ||
        response.data.message === "Código enviado ao e-mail."
      ) {
        visibModal();
      }
    } catch (error) {
      Alert.alert(
        "Erro no cadastro",
        error?.data?.message?.error || "Erro desconhecido"
      );
    } finally {
      setControlLoad(false);
    }
  }

  return (
    <View style={styles.container}>
      <StatusBar hidden backgroundColor="#fff" />

      <ImageBackground source={backgroundLogin} style={styles.background}>
        <KeyboardAvoidingView behavior={"padding"} style={styles.whiteboard}>
          <ScrollView
            contentContainerStyle={styles.scrollContent}
            keyboardShouldPersistTaps="handled" // permite tocar fora para fechar teclado
          >
            <View style={styles.whiteboard}>
              <Image source={logo} style={styles.logo} />
              <Text style={styles.title}>Cadastro</Text>

              <InputUser
                atributo="Nome"
                variavel="name"
                texto="Digite seu nome:"
                obj={user}
                setobj={setUser}
              />
              <InputUser
                atributo="Nome de Usuário"
                variavel="username"
                texto="Digite seu nome de usuário:"
                obj={user}
                setobj={setUser}
              />
              <InputUser
                atributo="E-mail"
                variavel="email"
                texto="Digite seu e-mail:"
                obj={user}
                setobj={setUser}
              />
              <InputPassword
                titulo="Senha"
                texto="Digite sua senha"
                variavel="password"
                showpassword="showPassword"
                obj={user}
                setobj={setUser}
              />
              <InputPassword
                titulo="Confirme sua senha"
                texto="Digite sua senha novamente"
                variavel="confirmPassword"
                obj={user}
                setobj={setUser}
                showpassword="showPassword2"
                submitFunc={handleCadastro}
              />

              <TouchableOpacity
                style={styles.button}
                onPress={handleCadastro}
                disabled={controlLoad}
              >
                {controlLoad ? (
                  <ActivityIndicator color="white" />
                ) : (
                  <Text style={styles.buttonText}>Criar Conta</Text>
                )}
              </TouchableOpacity>

              <View style={styles.footer}>
                <Text style={styles.footerText}>Já possui conta?</Text>
                <TouchableOpacity onPress={() => navigation.navigate("Login")}>
                  <Text style={styles.footerLink}>Faça Login</Text>
                </TouchableOpacity>
              </View>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </ImageBackground>

      <ModalConfirmEmail
        fechamodal={fecharModal}
        code={"code"}
        user={user}
        setuser={setUser}
        handle={handleCadastro}
        modal={modalConf}
        clickable={controlLoad}
      />
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
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: "center",
    paddingTop:"5%"
  },
  whiteboard: {
    width: "90%",
    height: "90%",
    alignSelf: "center",
    backgroundColor: "#FFFFFF",
    padding: "5%",
    borderRadius: 12,
  },
  logo: {
    position: "absolute",
    right: -30,
    top: -50,
  },
  title: {
    fontSize: 50,
    fontFamily: "serif",
    fontWeight: "700",
    color: "#000",
    textAlign: "center",
    marginBottom: 10,
  },
  button: {
    backgroundColor: "#803AD6",
    borderRadius: 12,
    paddingVertical: 14,
    marginTop: 15,
    alignItems: "center",
    shadowColor: "#803AD6",
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
