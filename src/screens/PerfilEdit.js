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
  Alert,
} from "react-native";
import { useEffect, useState } from "react";
import api from "../axios/axios";
import backgroundImage from "../../assets/backgroundLogin.png";
import Header from "../components/Header";
import InputUser from "../components/InputObj";
import ModalContatos from "../components/ModalContatos";
import IoniconsUser from "@expo/vector-icons/Ionicons";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import BarraLateral from "../components/BarraLateral";
import ModalMudarSenha from "../components/ModalMudarSenha";
import * as SecureStore from "expo-secure-store";
import ModalConfirmEmail from "../components/ModalConfirmEmail";
import * as ImagePicker from "expo-image-picker";

export default function PerfilEdit({ navigation }) {
  const [email, setEmail] = useState("");
  const [isVisible, setIsVisible] = useState(false);
  const [contatosVisible, setContatosVisible] = useState(false);
  const [senhaModal, setSenhaModal] = useState(false);
  const [controlLoad, setControlLoad] = useState(false);
  const [modalEmail, setModalEmail] = useState(false);

  const [user, setUser] = useState({
    ID_user: "",
    name: "",
    username: "",
    email: "",
    biografia: "",
    imagem: "",
    tipo_imagem: "",
    code: "",
  });
  const [passwords, setPasswords] = useState({
    passwordNow: "",
    passwordNew: "",
    confirmPassword: "",
  });
  const [contatos, setContatos] = useState([
    { id: 0, type: "instagram", value: "@instagramteste" },
    { id: 1, type: "email", value: "EmailTeste" },
    { id: 2, type: "linkedin", value: "LinkedinTeste" },
    { id: 3, type: "facebook", value: "FacebookTeste" },
    { id: 4, type: "twitter", value: "TwitterTeste" },
  ]);

    // INICIO DAS FUNÇÕES DE ESTADO

  const toggleVisibleFalse = () => setIsVisible(false);
  const toggleVisibleTrue = () => setIsVisible(true);

  const toggleContatosModalFalse = () => setContatosVisible(false);
  const toggleContatosModalTrue = () => setContatosVisible(true);

  const toggleSenhaModalFalse = () => setSenhaModal(false);
  const toggleSenhaModalTrue = () => setSenhaModal(true);

  const toggleModalEmailTrue = () => setModalEmail(true);
  const toggleModalEmailFalse = () => setModalEmail(false);

  const addcont = (id, plataforma, valor) => {
    setContatos((contatos) => [
      ...contatos,
      { id: id, type: plataforma, value: valor },
    ]);
    toggleContatosModalFalse();
  };
  const changecont = (id, plataforma, valor) => {
    setContatos(
      contatos.map((contato) =>
        contato.id === id
          ? { ...contato, type: plataforma, value: valor }
          : contato
      )
    );
    toggleContatosModalFalse();
  };
  const deletecont = (id) => {
    setContatos(contatos.filter((contato) => contato.id !== id));
    toggleContatosModalFalse();
  };

  // INICIO DAS FUNÇÕES

  async function getEmail() {
    setEmail(await SecureStore.getItemAsync("email"));
  }

  async function getUser() {
    try {
      const uname = await SecureStore.getItemAsync("username");
      const response = await api.getUserByName(uname);
      setUser(response.data.profile);
      console.log("setou")
    } catch (error) {
      console.log("Erro na requisição:", error);
    }
  }

  useEffect(() => {
    getEmail();
    getUser();
  }, []);

  async function pickImage() {
    // Pedir permissão
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (permission.status !== "granted") {
      Alert.alert(
        "Permissão negada",
        "Permita o acesso à galeria para escolher uma imagem."
      );
      return;
    }

    // Abrir a galeria
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1], // recorte quadrado (perfil)
      quality: 1,
    });

    // Se o usuário não cancelou
    if (!result.canceled) {
      const imageUri = result.assets[0].uri;
      const type = result.assets[0].mimeType || "image/jpeg"; // tipo da imagem
      console.log("Imagem selecionada:", imageUri, type);

      // Atualiza o estado do usuário com a nova imagem
      setUser((prevUser) => ({
        ...prevUser,
        imagem: imageUri,
        tipo_imagem: type,
      }));
    }
  }

  async function updateUser() {
    setControlLoad(true);
    try {
      const fd = new FormData();

      const biografiaToSend =
        !user.biografia || user.biografia.trim() === ""
          ? "Nenhuma biografia cadastrada."
          : user.biografia;

      fd.append("email", user.email);
      fd.append("biografia", biografiaToSend);
      fd.append("username_", user.username);
      fd.append("name", user.name);

      let imageToSend = user.imagem;
      if (imageToSend && typeof imageToSend === "string") {
        imageToSend = base64ToFile(imageToSend, "perfil_atual.jpg");
      }
      if (imageToSend) fd.append("imagens", imageToSend);

      const emailMudou = user.email !== email;

      const temCodigo = (user.code || "").trim() !== "";

      if (emailMudou && !temCodigo) {
        const res = await api.updateUser(user.ID_user, fd);
        toggleModalEmailTrue();
        setControlLoad(false);
        return;
      }

      if (temCodigo) {
        fd.append("code", formData.code);
      }

      const response = await api.updateUser(user.ID_user, fd);

      const img = response.data?.profile?.imagem;
      let updatedAvatar = null;

      if (img) {
        const isBase64 = img.startsWith("data:image");
        const base64Src = isBase64 ? img : `data:image/jpeg;base64,${img}`;
        updatedAvatar = base64Src;
      }

      setUser((prev) => ({
        ...prev,
        name: user.name,
        username: user.username,
        email: user.email,
        biografia: biografiaToSend,
        code: "",
        imagem: updatedAvatar,
      }));

      if (emailMudou) {
        setEmail(user.email);
        await SecureStore.setItemAsync("email", user.email);
      }
      Alert.alert(response.data.message || "Perfil atualizado com sucesso!")
      setEditing(false); 
      toggleModalEmailTrue();
      saveInfo(response.data.token, user);
      navigation.navigate("Perfil", {username:user.username});

    } catch (error) {
      console.error("Erro no updateUser:", error);
      Alert.alert("Um Erro Ocorreu", error.response?.data?.error || "Erro ao atualizar perfil.");
    } finally {
      setControlLoad(false);
    }
  }

  async function putSenha() {
    if (passwords.confirmPassword !== passwords.passwordNew) {
      Alert.alert("Digite e confirme a mesma nova senha!");
    } else {
      try {
        const response = await api.updatePassword(
          user.ID_user,
          passwords.passwordNow,
          passwords.passwordNew
        );
        Alert.alert(response.data.message);
      } catch (error) {
        console.log("Erro na requisição:", error.data.message.error);
      }
    }
  }

  async function saveInfo(token, userP) {
    await SecureStore.setItemAsync("token", token);
    await SecureStore.setItemAsync("username", userP.username);
    await SecureStore.setItemAsync("email", userP.email);
    await SecureStore.setItemAsync("id", userP.ID_user.toString());
  }
  
  const URIProfile = `data:${user.tipo_imagem};base64,${user.imagem}`;

  return (
    <KeyboardAvoidingView
      style={styles.wrapper}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <StatusBar hidden={false} backgroundColor="#fff" />
      <ScrollView contentContainerStyle={styles.container}>
        <Header toggleVisible={toggleVisibleTrue} user={user} />

        <View style={styles.painel}>
          <Image style={styles.colorBar} source={backgroundImage} />

          <View style={styles.lineUser}>
            <View style={styles.backIcon}>
              <TouchableOpacity onPress={pickImage}>
                {URIProfile ? (
                  <Image
                    source={{ uri: URIProfile }}
                    style={styles.profileImage}
                  />
                ) : (
                  <IoniconsUser name="person" size={100} color="#949599" />
                )}
              </TouchableOpacity>
            </View>
            <Text style={styles.title}>{user.username}</Text>
            <MaterialIcons name="do-not-disturb-on" size={35} color="red" />
          </View>

          <TouchableOpacity
            style={[styles.button, { marginBottom: "2%", width: "95%" }]}
            onPress={() => updateUser()}
          >
            <Text style={styles.buttonText}>Salvar Perfil</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.title}>Perfil do Usuário</Text>

        <View style={styles.nomeEdit}>
          <InputUser
            atributo={"Nome"}
            variavel={"name"}
            texto={user.name}
            obj={user}
            setobj={setUser}
            style={styles.input}
          />

          <InputUser
            atributo={"Email"}
            variavel={"email"}
            texto={user.email}
            obj={user}
            setobj={setUser}
            style={styles.input}
          />

          <InputUser
            atributo={"Biografia"}
            variavel={"biografia"}
            texto={user.biografia}
            multiline={true}
            rows={4}
            obj={user}
            setobj={setUser}
            style={styles.input}
          />
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

      <ModalMudarSenha
        modal={senhaModal}
        fechamodal={toggleSenhaModalFalse}
        user={user}
        setUser={setUser}
        putSenha={putSenha}
      />

      <ModalConfirmEmail
        fechamodal={toggleModalEmailFalse}
        code={"code"}
        user={user}
        setuser={setUser}
        handle={updateUser}
        modal={modalEmail}
        clickable={controlLoad}
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
    fontSize: 25,
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
  profileImage: {
    width: 65,
    height: 65,
    borderRadius: 9999,
    resizeMode: "cover",
  },  
});