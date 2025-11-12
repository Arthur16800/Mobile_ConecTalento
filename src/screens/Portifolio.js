import {
  View,
  StyleSheet,
  StatusBar,
  FlatList,
  Dimensions,
  ActivityIndicator,
  Text,
} from "react-native";
import { useLayoutEffect, useState, useEffect, useCallback } from "react";
import { useFocusEffect } from "@react-navigation/native"; // Importante!
import * as SecureStore from "expo-secure-store";
import HeaderK from "../components/HeaderKeyboard";
import BarraLateral from "../components/BarraLateral";
import sheets from "../axios/axios";
import Card from "../components/Card";

const screenHeight = Dimensions.get("window").height;
const screenWidth = Dimensions.get("window").width;

export default function Portifolio({ navigation }) {
  const [loading, setLoading] = useState(false);
  const [projects, setProjects] = useState([]);
  const [search, setSearch] = useState("");
  const [isVisible, setIsVisible] = useState(false);
  const [username, setUsername] = useState("");
  const [user, setUser] = useState({
    imagem: "",
    tipo_imagem: "",
  });

  useLayoutEffect(() => {
    StatusBar.setBarStyle("dark-content");
    StatusBar.setBackgroundColor("transparent");
  }, []);

  const toggleVisibleFalse = () => setIsVisible(false);
  const toggleVisibleTrue = () => setIsVisible(true);

  // Função para buscar projetos (agora acessível pelo useFocusEffect)
  async function getProjects(uname) {
    if (!uname) return;
    try {
      // Opcional: setLoading(true) se quiser mostrar o loading toda vez que focar
      const response = await sheets.getProjectsByUser(uname);
      setProjects(response.data.profile_projeto);
    } catch (error) {
      console.log("Erro ao buscar projetos do portfólio:", error);
    }
  }

  async function getUser(uname) {
    try {
      const response = await sheets.getUserByName(uname);
      setUser({
        tipo_imagem: response.data.profile.tipo_imagem,
        imagem: response.data.profile.imagem,
      });
    } catch (error) {
      console.log("Erro na requisição getUser:", error);
    }
  }

  // >>> ATUALIZAÇÃO AUTOMÁTICA AO ENTRAR EM FOCO <<<
  useFocusEffect(
    useCallback(() => {
      if (username) {
        getProjects(username);
        getUser(username); // Opcional: atualizar dados do usuário também
      }
    }, [username]) // Recarrega se o username mudar (login diferente, por exemplo)
  );

  // Carga inicial
  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        const storedUsername = await SecureStore.getItemAsync("username");
        setUsername(storedUsername);
        if (storedUsername) {
          await getProjects(storedUsername);
          await getUser(storedUsername);
        }
      } catch (error) {
        console.log("Erro inicial:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  async function handleSearch() {
    setLoading(true);
    if (search === "") {
      await getProjects(username);
      setLoading(false);
    } else {
      try {
        const response = await sheets.searchProjects(String(search));
        // Nota: Idealmente, filtre aqui para mostrar apenas os projetos DO USUÁRIO se a API retornar todos.
        setProjects(response.data);
      } catch (error) {
        console.log("Erro na busca:", error);
      } finally {
        setLoading(false);
      }
    }
  }

  return (
    <View style={styles.container}>
      <StatusBar hidden backgroundColor="#fff" />
      <HeaderK
        toggleVisible={toggleVisibleTrue}
        text={search}
        setText={setSearch}
        getFunction={handleSearch}
        user={user}
      />

      {loading ? (
        <ActivityIndicator style={{ flexGrow: 1 }} size={70} color="black" />
      ) : (
        <FlatList
          data={projects}
          keyExtractor={(item) => String(item.ID_projeto)}
          renderItem={({ item }) => {
            const uriImage =
              "data:" + item.tipo_imagem + ";base64," + item.imagem;

            return (
              <Card
                imageSource={uriImage}
                item={item}
                styleCard={styles.card}
              />
            );
          }}
          contentContainerStyle={{
            flexGrow: 1,
            alignItems: "center",
            paddingHorizontal: 10,
            paddingBottom: 25,
          }}
          ListEmptyComponent={
            !loading && (
              <Text style={{ marginTop: 20, color: "#666" }}>
                Você ainda não tem projetos.
              </Text>
            )
          }
        />
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
    justifyContent: "center",
    width: "100%",
  },
  card: {
    width: screenWidth * 0.85,
    height: screenHeight * 0.32,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#DADADA",
    marginBottom: 10,
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 5,
    marginTop: 75,
  },
});