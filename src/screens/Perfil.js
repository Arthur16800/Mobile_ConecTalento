import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  StatusBar,
} from "react-native";
import * as SecureStore from "expo-secure-store";
import { useState, useEffect } from "react";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import IoniconsUser from "@expo/vector-icons/Ionicons";
import Entypo from "@expo/vector-icons/Entypo";
import Header from "../components/Header";
import BarraLateral from "../components/BarraLateral";
import { ScrollView } from "react-native-gesture-handler";
import api from "../axios/axios";


export default function Perfil({ navigation }) {
  const [emailAtual, setEmail] = useState("");
  const [user, setUser] = useState({});
  const [isVisible, setIsVisible] = useState(false);

  const toggleVisibleFalse = () => {
    setIsVisible(false);
  };

  const toggleVisibleTrue = () => {
    setIsVisible(true);
  };

  async function getEmail() {
    setEmail(await SecureStore.getItemAsync("email"));
  }

  async function getUser(){
    try{
      const name = await SecureStore.getItemAsync("username");
      const response = await api.getUserByName(name);
      setUser(response.data.profile);
    }catch(error){
      console.log("Erro na requisição:", error.data.message.error);
    }
  }
  async function getContatos() {
    try {
      const response = await api.getContacts(userStore.username);
      setContatos(response.data.contacts);
    } catch (error) {
      console.log("Erro na requisição:", error.data.message.error);
    }
  }

  useEffect(() => {
    getEmail();
    getUser();
    // getContatos();
  }, []);

  const [contatos, setContatos] = useState([
    { tipo: "instagram", valor: "@instagramteste" },
    { tipo: "linkedin", valor: "LinkedinTeste" },
    { tipo: "facebook", valor: "FacebookTeste" },
    { tipo: "twitter", valor: "TwitterTeste" },
  ]);

  const renderIcon = (tipo) => {
    switch (tipo) {
      case "instagram":
        return <Entypo name="instagram" size={30} color="black" />;
      case "facebook":
        return <Entypo name="facebook" size={30} color="black" />;
      case "twitter":
        return <Entypo name="twitter" size={30} color="black" />;
      case "linkedin":
        return <Entypo name="linkedin" size={30} color="black" />;
    }
  };

  return (
    <View style={styles.container}>
      
      <StatusBar hidden={false} backgroundColor="#fff" />
      <Header toggleVisible={toggleVisibleTrue} />
      <ScrollView style={styles.scrollContainer} contentContainerStyle={{ paddingBottom: 80 }}>

      {/* Ícone de usuário */}
      <View style={styles.fundoUser}>
        <IoniconsUser name="person" size={100} color="#949599" />
      </View>

      {/* Nome do usuário e ícone de lápis ao lado */}
      <View style={styles.nomeWrapper}>
        <Text style={styles.name}>{user.username}</Text>
        {emailAtual === user.email && (
          <TouchableOpacity
            onPress={() => navigation.navigate("PerfilEdit")}
            style={styles.editIconWrapper}
          >
            <MaterialCommunityIcons
              name="pencil-outline"
              size={30}
              color="black"
            />
          </TouchableOpacity>
        )}
      </View>

      {/* Biografia */}
      {user.biografia && (
        <Text style={styles.subtitle}>{user.biografia}</Text>
      )}

      {/* Contatos */}
      <Text style={styles.title}>Contatos</Text>
        {contatos.map((item) => (
          <View key={item.tipo} style={styles.contatoItem}>
            {renderIcon(item.tipo)}
          <Text style={styles.contactText}>{item.valor}</Text>
          </View>
        ))}

      {/* Botão para ver projetos */}
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate("Portifolio")}
      >
        <Text style={styles.buttonText}>Ver meus projetos</Text>
      </TouchableOpacity>
      </ScrollView>
      <BarraLateral
        isVisible={isVisible}
        onClose={toggleVisibleFalse}
        navigation={navigation}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  scrollContainer: {
    paddingTop: 20,
    paddingHorizontal: 20,
    paddingBottom: 180,
  },
  fundoUser: {
    backgroundColor: "#d2d3d5",
    width: 170,
    height: 170,
    borderRadius: 85,
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "center",
    marginBottom: 15,
  },
  nomeWrapper: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    position: "relative",

    marginBottom: 15,
  },
  editIconWrapper: {
    position: "absolute",
    right: 5,
    top: "50%",
    transform: [{ translateY: -13 }],
  },

  title: {
    fontSize: 30,
    textAlign: "center",
    marginTop: 2,
  },
  name: {
    fontSize: 40,
    fontWeight: "bold",
    textAlign: "center",
  },
  subtitle: {
    fontSize: 20,
    textAlign: "justify",
    lineHeight: 24,
    marginBottom: 20,
  },
  contatosContainer: {
    marginBottom: 20,
  },
  contatoItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  contactText: {

    fontSize: 18,

    marginLeft: 10,
  },
  button: {
    backgroundColor: "#803AD6",
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 25,
    alignItems: "center",
    shadowColor: "#803AD6",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 5,
    marginTop: 40,     
    marginBottom: 60,  
    width: "80%",
    position: "absolute",
    bottom: 30,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 20,
  },
});