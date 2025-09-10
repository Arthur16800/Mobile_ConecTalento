import { View, Text, TouchableOpacity, StyleSheet, Image } from "react-native";
import Header from "../components/Header";
import InputUser from "../components/InputObj";
import InputPassword from "../components/InputPassword";
import IoniconsUser from "@expo/vector-icons/Ionicons";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useState } from "react";

export default function PerfilEdit({ navigation }) {
  const emailAtual = "emailTeste";
  const [user, setUser] = useState({
    username: "testeUser",
    email: "emailTeste",
    bibliografia: "Bibliografia",
    password: "",
    confirmPassword: "",
    showPassword: true,
    showPassword2: true,
  });

  return (
    <View style={styles.container}>
      <Header />

      {/* Painel do usuário */}
      <View style={styles.painel}>
        {/* Barrinha colorida */}
        <Image style={styles.colorBar} />

        {/* Linha do usuário */}
        <View style={styles.lineUser}>
          {/*Ícone Usuário */}
          <View style={styles.backIcon}>
            <IoniconsUser name="person" size={45} color="#949599" />
          </View>

          {/*Nome do Usuário */}
          <Text style={styles.title}>{user.username} </Text>

          {/*Botão Deletar */}
          <MaterialIcons name="do-not-disturb-on" size={35} color="red" />
        </View>

        {/* Botão para salvar Perfil */}
        <TouchableOpacity
          style={[styles.button, { marginBottom: "2%", width: "95%" }]}
          onPress=""
        >
          <Text style={styles.buttonText}>Salvar Perfil</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.title}>Perfil do Usuário</Text>

      <View style={styles.nomeEdit}>
        {/* Campo com nome do usuário */}
        <InputUser
          atributo={"Nome"}
          variavel={"username"}
          texto={"Nome anterior(fazer com axios api)"}
          obj={user}
          setobj={setUser}
          style={styles.input}
        />

        {/* Campo com email do usuário */}
        <InputUser
          atributo={"Email"}
          variavel={"email"}
          texto={"Email anterior(fazer com axios api)"}
          obj={user}
          setobj={setUser}
          style={styles.input}
        />

        {/* Campo da senha do usuário */}
        <InputPassword
          titulo={"Senha"}
          texto={"********"}
          variavel={"password"}
          showpassword={"showPassword"}
          obj={user}
          setobj={setUser}
          style={styles.input}
        />

        {/* Campo de confirmação da senha do usuário */}
        <InputPassword
          titulo={"Confirme sua senha"}
          texto={"********"}
          variavel={"ConfirmPassword"}
          showpassword={"showPassword2"}
          obj={user}
          setobj={setUser}
          style={styles.input}
        />

        {/* Biografia */}
        {user.bibliografia && (
          <InputUser
            atributo={"Bibliografia"}
            variavel={"bibliografia"}
            texto={"Texto anterior(fazer com axios api)"}
            obj={user}
            setobj={setUser}
            style={styles.input}
          />
        )}
      </View>

      <TouchableOpacity style={styles.button} onPress="">
        {/* Botão para Adicionar Contatos */}
        <Text style={styles.buttonText}>Adicionar Contatos</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress="">
        {/* Botão para Ver projetos */}
        <Text style={styles.buttonText}>Ver meus projetos</Text>
      </TouchableOpacity>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    display:"flex",
    justifyContent:"space-evenly",
    alignItems: "center",
    width:"100%",

  },
  painel: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    alignItems: "center",
    width: "70%",
    height: "20%",
    borderRadius: 20,
    borderWidth: 2,
    borderColor: "black",
    backgroundColor: "white",
  },
  colorBar: {
    height: "25%",
    width: "100%",
    borderWidth: 2,
    borderBottomWidth: 2,
    borderBottomColor: "black",
    borderTopWidth: 0,
    borderLeftWidth: 0,
    borderRightWidth: 0,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  lineUser: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  backIcon: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: "100%",
    backgroundColor: "grey",
    height: 65,
    width: 65,
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
  title: {
    fontSize: 40,
  },
  nomeEdit: {
    flex: 1,
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "space-between",
    width:"85%",
    maxHeight: "10%",
  },
  input:{
    width:"100%",
  },
});
