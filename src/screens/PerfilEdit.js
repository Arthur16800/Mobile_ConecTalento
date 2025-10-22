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
import { Image as RNImage } from "react-native";
import * as ImagePicker from "expo-image-picker";

export default function PerfilEdit({ navigation }) {
  const [email, setEmail] = useState("");
  const [contatos, setContatos] = useState([
    { id: 0, type: "instagram", value: "@instagramteste" },
    { id: 1, type: "email", value: "EmailTeste" },
    { id: 2, type: "linkedin", value: "LinkedinTeste" },
    { id: 3, type: "facebook", value: "FacebookTeste" },
    { id: 4, type: "twitter", value: "TwitterTeste" },
  ]);

  const [user, setUser] = useState({});
  const [passwords, setPasswords] = useState({
    passwordNow: "",
    passwordNew: "",
    confirmPassword: "",
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

  async function pickImage() {
    // Pedir permissão para acessar galeria
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (permission.status !== "granted") {
      Alert.alert(
        "Permissão negada",
        "Permita o acesso à galeria para escolher uma imagem."
      );
      return;
    }
    // Abrir galeria
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      const imageUri = result.assets[0].uri; // caminho local da imagem
      console.log("Imagem selecionada:", imageUri);
      setUser({...user, image: imageUri});
    }
  }

  async function uploadUserImage(userId, imageUri) {
    const formData = new FormData();

    // Extrai nome e tipo do arquivo
    const filename = imageUri.split("/").pop();
    const match = /\.(\w+)$/.exec(filename);
    const type = match ? `image/${match[1]}` : "image";

    formData.append("imagem", {
      uri: imageUri,
      name: filename,
      type,
    });

    try {
      const response = await axios.put(
        `http://192.168.x.x:5000/api/v1/user/${userId}`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      console.log("Upload concluído:", response.data);
    } catch (error) {
      console.log("Erro no upload:", error.message);
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

  async function putUser() {
    try {
      const userId = await SecureStore.getItemAsync("id");
      const response = await api.putUser(
        userId,
        {
          email: user.email,
          biografia: user.biografia,
          username: user.username,
          name: user.name,
        },
        user.imagem
      );
      Alert.alert(response.data.message);
      navigation.navigate("Perfil");
    } catch (error) {
      console.log("Erro na requisição:", error);
      console.log({
        email: user.email,
        biografia: user.biografia,
        username: user.username,
        name: user.name,
        imagem: imageDefaultUri,
      });
    }
  }

  async function getEmail() {
    setEmail(await SecureStore.getItemAsync("email"));
  }

  async function getUser() {
    try {
      const uname = await SecureStore.getItemAsync("username");
      const response = await api.getUserByName(uname);
      console.log(response.data.profile);
      setUser(response.data.profile);
    } catch (error) {
      console.log("Erro na requisição:", error);
    }
  }

  useEffect(() => {
    getEmail();
    getUser();
  }, []);

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
              <TouchableOpacity onPress={uploadUserImage}>
                {user.imagem ? (
                  <Image
                    source={{
                      uri: `data:${user.tipo_imagem};base64,${user.imagem}`,
                    }}
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
            onPress={() => putUser()}
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
});
