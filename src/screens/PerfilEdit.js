import {
  View,
  ScrollView,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  KeyboardAvoidingView,
  Platform,
  StatusBar,
} from "react-native";
import { useState } from "react";
import backgroundImage from "../../assets/backgroundLogin.png"
import Header from "../components/Header";
import InputUser from "../components/InputObj";
import InputPassword from "../components/InputPassword";
import ModalContatos from "../components/ModalContatos";
import IoniconsUser from "@expo/vector-icons/Ionicons";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import BarraLateral from "../components/BarraLateral";

export default function PerfilEdit({ navigation }) {
  const [contatos, setContatos] = useState([
    { id: 0, type: "instagram", value: "@instagramteste" },
    { id: 1, type: "email", value: "EmailTeste" },
    { id: 2, type: "linkedin", value: "LinkedinTeste" },
    { id: 3, type: "facebook", value: "FacebookTeste" },
    { id: 4, type: "twitter", value: "TwitterTeste" },
  ]);

  const [user, setUser] = useState({
    username: "Cláudio Ramos",
    email: "emailTeste",
    bibliografia:
      "Entendi. O que está acontecendo é que o uso de SafeAreaView (especialmente no iOS) reserva espaço automaticamente para a barra de status e outras  (como a notch, ou entalhe), e dependendo do dispositivo, isso pode parecer uma “barra grande” visualmente.",
    password: "",
    confirmPassword: "",
    showPassword: true,
    showPassword2: true,
  });

  // Modal BarraLateral;
  const [isVisible, setIsVisible] = useState(false);
  const toggleVisibleFalse = () => {
    setIsVisible(false);
  };
  const toggleVisibleTrue = () => {
    setIsVisible(true);
  };
  // Fim Modal

  // Modal AddContatos
  const [contatosVisible, setContatosVisible] = useState(false);
  const toggleContatosModalFalse = () => {
    setContatosVisible(false);
  };
  const toggleContatosModalTrue = () => {
    setContatosVisible(true);
  };
  // Fim Modal;

  // Modal MudarSenha
  const [senhaModal, setSenhaModal] = useState(false);
  const toggleSenhaModalFalse = () => {
    setSenhaModal(false);
  };
  const toggleSenhaModalTrue = () => {
    setSenhaModal(true);
  };
  // Fim Modal

  const addcont = (id, plataforma, valor) => {
    setContatos((contatos) => [
      ...contatos,
      { id: id, type: plataforma, value: valor },
    ]);
    toggleContatosModalFalse();
  };
  const changecont = (id, plataforma, valor) => {
    setContatos(
      contatos.map(
        (contato) =>
          contato.id === id
            ? { ...contato, type: plataforma, value: valor } 
            : contato
      )
    );
    toggleContatosModalFalse();
  };
  const deletecont = (id) => {
    setContatos(contatos.filter((contato)=>contato.id !== id));
    toggleContatosModalFalse();
  };

  return (
    <KeyboardAvoidingView
      style={styles.wrapper}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <StatusBar hidden={false} backgroundColor="#fff" />
      <ScrollView contentContainerStyle={styles.container}>
        <Header toggleVisible={toggleVisibleTrue} />

        <View style={styles.painel}>
          <Image style={styles.colorBar} source={backgroundImage} />

          <View style={styles.lineUser}>
            <View style={styles.backIcon}>
              <IoniconsUser name="person" size={45} color="#949599" />
            </View>
            <Text style={styles.title}>{user.username} </Text>
            <MaterialIcons name="do-not-disturb-on" size={35} color="red" />
          </View>

          <TouchableOpacity
            style={[styles.button, { marginBottom: "2%", width: "95%" }]}
            onPress={() => navigation.navigate("Perfil")}
          >
            <Text style={styles.buttonText}>Salvar Perfil</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.title}>Perfil do Usuário</Text>

        <View style={styles.nomeEdit}>
          <InputUser
            atributo={"Nome"}
            variavel={"username"}
            texto={"Nome anterior(fazer com axios api)"}
            obj={user}
            setobj={setUser}
            style={styles.input}
          />

          <InputUser
            atributo={"Email"}
            variavel={"email"}
            texto={"Email anterior(fazer com axios api)"}
            obj={user}
            setobj={setUser}
            style={styles.input}
          />

          <InputPassword
            titulo={"Senha"}
            texto={"********"}
            variavel={"password"}
            showpassword={"showPassword"}
            obj={user}
            setobj={setUser}
            style={styles.input}
          />

          <InputPassword
            titulo={"Confirme sua senha"}
            texto={"********"}
            variavel={"ConfirmPassword"}
            showpassword={"showPassword2"}
            obj={user}
            setobj={setUser}
            style={styles.input}
          />

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

        <View style={styles.botView}>
          <TouchableOpacity
            style={styles.button}
            onPress={() => toggleContatosModalTrue()}
          >
            <Text style={styles.buttonText}>Gerenciar Contatos</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.button}
            onPress={() => toggleSenhaModalTrue()}
          >
            <Text style={styles.buttonText}>Mudar minha senha</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      <BarraLateral
        isVisible={isVisible}
        onClose={toggleVisibleFalse}
        navigation={navigation}
      />

      <ModalContatos
        modal={contatosVisible}
        fechamodal={toggleContatosModalFalse}
        contacts={contatos}
        addcont={addcont}
        changecont={changecont}
        deletecont={deletecont}
      />
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#fff", // mesmo fundo do header, se quiser
  },
  wrapper: {
    flex: 1,
  },
  container: {
    paddingTop: 0,
    paddingVertical: 20,
    alignItems: "center",
    width: "100%",
    gap: 20,
  },
  painel: {
    flexDirection: "column",
    justifyContent: "space-between",
    alignItems: "center",
    width: "85%",
    minHeight: 160,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: "black",
    backgroundColor: "white",
  },
  colorBar: {
    height: 40,
    width: "100%",
    backgroundColor: "magenta", // PLACEHOLDER
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  lineUser: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "90%",
    paddingVertical: 10,
  },
  backIcon: {
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 9999,
    backgroundColor: "grey",
    height: 65,
    width: 65,
  },
  button: {
    backgroundColor: "#803AD6",
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 20,
    alignItems: "center",
    shadowColor: "#803AD6",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 5,
    width: "100%",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 18,
  },
  title: {
    fontSize: 30,
    marginBottom: 10,
  },
  nomeEdit: {
    width: "85%",
    gap: 12,
  },
  botView: {
    width: "85%",
    gap: 15,
    marginBottom: 30,
  },
  input: {
    width: "100%",
  },
});
