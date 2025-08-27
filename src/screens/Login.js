import {useState} from "react"
import {
  View,
  Text,
  TouchableOpacity,
  Alert,
  StyleSheet,
  Image,
  ImageBackground,
} from "react-native";
import * as SecureStore from "expo-secure-store";
// axios
import api from "../axios/axios";
// Componentes
import InputUser from "../components/InputUser";
import InputPassword from "../components/InputPassword";
// Imagens
import backgroundLogin from "../../assets/backgroundLogin.png";
import logo from "../../assets/logo.png";

export default function Login({ navigation }) {
  const [user, setUser] = useState({
    email: "",
    password: "",
    showPassword: true,
  });

  async function saveToken(token) {
    await SecureStore.setItemAsync("token", token);
  }

  async function handleLogin() {
    await api.postLogin(user).then(
      (response) => {
        Alert.alert(response.data.message);
        saveToken(response.data.token);
        navigation.navigate("Home");
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
            <InputUser
              atributo={"Usuário"}
              variavel={"email"}
              texto={"Digite seu E-mail:"}
              user={user}
              setuser={setUser}
            />

            <InputPassword
              titulo={"Senha"}
              texto={"Digite sua senha"}
              variavel={"password"}
              showpassword={"showPassword"}
              user={user}
              setuser={setUser}
            />
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
    justifyContent: "center",
    rowGap: 38,
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
