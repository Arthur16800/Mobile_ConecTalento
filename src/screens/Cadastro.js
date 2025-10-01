import React, { use, useState } from "react";
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  Alert,
  StyleSheet,
  Image,
  ImageBackground,
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
    name:"",
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    showPassword: false,
    showPassword2: false,
    code: "",
  });
  
  const [modalConf, setModalConf] = useState(false);
  const visibModal = () => {
    setModalConf(true);
  };
  const fecharModal = () => {
    setModalConf(false);
  };
  async function saveInfo(token, user) {
    await SecureStore.setItemAsync("token", token);
    await SecureStore.setItemAsync("user", user);
  }
  async function handleCadastro() {
    try{
      const response = await api.postCadastro(user);
      console.log(response.data.message);
      if(response.data.message === "Código válido. Usuário autenticado."){
        saveInfo(response.data.token, response.data.user);
        navigation.navigate("Home");
      }else if(response.data.message === "Código reenviado ao e-mail." || "Código enviado ao e-mail."){
        visibModal();
      }
    }catch(error){
      Alert.alert("Erro no cadastro", error.data.message.error)
    }
  }
  return (
    <View style={styles.container}>
      <ImageBackground source={backgroundLogin} style={styles.background}>
        <View style={styles.whiteboard}>
          <Text style={styles.title}>Cadastro</Text>
          <Image source={logo} style={styles.logo} />
          <InputUser
            atributo={"Nome"}
            variavel={"name"}
            texto={"Digite seu nome:"}
            obj={user}
            setobj={setUser}
          />
          <InputUser
            atributo={"Nome de Usuário"}
            variavel={"username"}
            texto={"Digite seu nome de usuário:"}
            obj={user}
            setobj={setUser}
          />
          <InputUser
            atributo={"E-mail"}
            variavel={"email"}
            texto={"Digite seu e-mail:"}
            obj={user}
            setobj={setUser}
          />
          <InputPassword
            titulo={"Senha"}
            texto={"Digite sua senha"}
            variavel={"password"}
            showpassword={"showPassword"}
            obj={user}
            setobj={setUser}
          />
          <InputPassword
            titulo="Confirme sua senha"
            texto="Digite sua senha novamente"
            variavel="confirmPassword"
            obj={user}
            setobj={setUser}
            showpassword={"showPassword2"}
          />
          <View>
            <TouchableOpacity style={styles.button} onPress={()=>handleCadastro()}>
              <Text style={styles.buttonText}>Criar Conta</Text>
            </TouchableOpacity>
            <View style={styles.footer}>
              <Text style={styles.footerText}>Já possui conta?</Text>
              <TouchableOpacity onPress={() => navigation.navigate("Login")}>
                <Text style={styles.footerLink}>Faça Login</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ImageBackground>

      <ModalConfirmEmail
        fechamodal={fecharModal}
        code={"code"}
        user={user}
        setuser={setUser}
        handle={handleCadastro}
        modal={modalConf}
      />
    </View>
  );
}
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FFFFFF", width: "100%" },
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
    rowGap: "2%",
    borderRadius: "3%",
  },
  logo: { position: "absolute", right: 0, top: 10 },
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

  buttonText: { color: "#fff", fontWeight: "700", fontSize: 18 },

  footer: { flexDirection: "row", justifyContent: "center", marginTop: 25 },
  footerText: { color: "#555", fontSize: 16 },
  footerLink: {
    color: "#215299",
    fontWeight: "600",
    marginLeft: 6,
    fontSize: 16,
  },
  whitebox: {
    width: "100%",
    height: "100%",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
  },
});
