import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  StatusBar,
} from "react-native";
import * as SecureStore from "expo-secure-store";
import { useLayoutEffect, useState, useEffect } from "react";
import IoniconsUser from "@expo/vector-icons/Ionicons";
import Entypo from "@expo/vector-icons/Entypo";
import Header from "../components/Header";
import BarraLateral from "../components/BarraLateral";
import { ScrollView } from "react-native-gesture-handler";
import api from "../axios/axios";
import AntDesign from "@expo/vector-icons/AntDesign";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import FontAwesome from "@expo/vector-icons/FontAwesome";

export default function Perfil({ route, navigation }) {
  // --- parâmetros recebidos (caso venha de ProjetoInfo)
  const params = route.params || {};
  const usernameParam = params.username || null;

  const [emailAtual, setEmail] = useState("");
  const [iconUser, setIconUser] = useState({
    imagem: null,
    tipo_imagem: null,
  });
  const [user, setUser] = useState({
    extrainfo: {
      link_insta: null,
      link_facebook: null,
      link_github: null,
      link_pinterest: null,
      numero_telefone: null,
    },
  });
  const [contatos, setContatos] = useState([]);
  const [isVisible, setIsVisible] = useState(false);

  const toggleVisibleFalse = () => setIsVisible(false);
  const toggleVisibleTrue = () => setIsVisible(true);

  // --- barra de status
  useLayoutEffect(() => {
    StatusBar.setBarStyle("dark-content");
    StatusBar.setBackgroundColor("transparent");
  }, []);

  // --- busca email do logado
  async function getEmail() {
    setEmail(await SecureStore.getItemAsync("email"));
  }

  // --- busca usuário: logado ou de outro perfil
  async function getUser() {
    try {
      if (usernameParam) {
        //  perfil de outro usuário
        const response = await api.getUserByName(usernameParam);
        setUser(response.data.profile || response.data);
        //  perfil do usuário logado
        const name = await SecureStore.getItemAsync("username");
        const response2 = await api.getUserByName(name);
        setIconUser(response2.data.profile || response2.data);
      } else {
        const name = await SecureStore.getItemAsync("username");
        const response = await api.getUserByName(name);
        setUser(response.data.profile || response.data);
        setIconUser(response.data.profile || response.data);
      }
    } catch (error) {
      console.log("Erro na requisição:", error);
    }
  }

  // --- filtra contatos não vazios
  function contatos_filter(contatos) {
    return contatos.filter((item) => item.valor);
  }

  // --- carregamento inicial
  useEffect(() => {
    getEmail();
    getUser();
  }, [usernameParam]);

  // --- atualiza lista de contatos quando user muda
  useEffect(() => {
    if (user.extrainfo) {
      const contatosIniciais = [
        { tipo: "instagram", valor: user.extrainfo.link_insta },
        { tipo: "facebook", valor: user.extrainfo.link_facebook },
        { tipo: "pinterest", valor: user.extrainfo.link_pinterest },
        { tipo: "github", valor: user.extrainfo.link_github },
      ];
      setContatos(contatos_filter(contatosIniciais));
    }
  }, [user]);

  // --- renderiza ícones
  const renderIcon = (tipo) => {
    switch (tipo) {
      case "instagram":
        return <Entypo name="instagram" size={30} color="black" />;
      case "facebook":
        return <Entypo name="facebook" size={30} color="black" />;
      case "pinterest":
        return <FontAwesome name="pinterest" size={30} color="black" />;
      case "github":
        return <AntDesign name="github" size={30} color="black" />;
      default:
        return null;
    }
  };

  const URIProfile = `data:${user.tipo_imagem};base64,${user.imagem}`;

  return (
    <View style={styles.container}>
      <StatusBar hidden backgroundColor="#fff" />
      <Header toggleVisible={toggleVisibleTrue} user={iconUser} />

      <ScrollView
        style={styles.scrollContainer}
        contentContainerStyle={{
          paddingBottom: 80,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {/* Imagem do usuário */}
        <View style={styles.fundoUser}>
          {URIProfile ? (
            <Image
              source={{ uri:URIProfile }}
              style={{ width: "100%", height: "100%", borderRadius: 9999 }}
            />
          ) : (
            <IoniconsUser name="person" size={100} color="#949599" />
          )}
        </View>

        {/* Nome e botão de editar */}
        <Text style={styles.name} numberOfLines={0}>
            {user.name || "Loading..."}
          </Text>
        <View style={styles.nomeWrapper}>
          <Text style={styles.name} numberOfLines={0}>
            {user.username || "Loading..."}
          </Text>
          {emailAtual === user.email && (
            <TouchableOpacity
              onPress={() => navigation.navigate("PerfilEdit")}
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
          <Text style={styles.subtitle}>{user.biografia || "Carregando Biografia..."}</Text>
        )}

        {/* Título */}
        <Text style={styles.title}>
          {usernameParam ? "Contatos do usuário" : "Meus contatos"}
        </Text>

        {/* Contatos */}
        {contatos.map((item) => (
          <View key={item.tipo} style={styles.contatoItem}>
            {renderIcon(item.tipo)}
            <Text style={styles.contactText}>{item.valor}</Text>
          </View>
        ))}
      </ScrollView>

      {/* Botão de projetos (só para o próprio perfil) */}
      {!usernameParam && (
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate("Portifolio")}
        >
          <Text style={styles.buttonText}>Ver meus projetos</Text>
        </TouchableOpacity>
      )}

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
    flex:1,
    flexDirection:"row",
    width:"100%",
    alignItems:"center",
    justifyContent:"center",
    marginBottom: 15,
  },
  title: {
    fontSize: 30,
    textAlign: "center",
    marginTop: 2,
  },
  name: {
    fontSize: 35,
    fontWeight: "bold",
    alignSelf:"center",
    marginHorizontal:20
  },
  subtitle: {
    fontSize: 20,
    textAlign: "justify",
    lineHeight: 24,
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
    width: "80%",
    position: "absolute",
    bottom: 80,
    alignSelf: "center",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 20,
  },
});
