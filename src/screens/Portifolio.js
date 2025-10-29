import { View, StyleSheet, StatusBar, FlatList, Dimensions, ActivityIndicator } from "react-native";
import { useState, useEffect } from "react";
import * as SecureStore from "expo-secure-store";
import HeaderK from "../components/HeaderKeyboard";
import BarraLateral from "../components/BarraLateral";
import api from "../axios/axios";
import Card from "../components/Card";

const screenHeight = Dimensions.get("window").height;
const screenWidth = Dimensions.get("window").width;

export default function Portifolio({ navigation }) {
  const [loading, setLoading] = useState(false);
  const [projects, setProjects] = useState([]);
  const [search, setSearch] = useState("");
  const [isVisible, setIsVisible] = useState(false);
  const [username, setUsername] = useState("");

  const toggleVisibleFalse = () => {
    setIsVisible(false);
  };
  const toggleVisibleTrue = () => {
    setIsVisible(true);
  };

  async function searchProjects(text) {
    try {
      const response = await api.searchProjects(text);
      setProjects(response.data.profile_projeto);
    } catch (error) {
      console.log("Erro completo:", error);
      const errorMessage =
        error?.response?.data?.message?.error ||
        error?.message ||
        "Erro desconhecido";
      console.log("Erro na busca:", errorMessage);
    }
  }
  async function searchProjects() {
    setLoading(true);
    if (search === "") {
      getProjects(username);
      setLoading(false);
    } else {
      try {
        const response = await api.searchProjects(String(search));
        setProjects(response.data);
        console.log(response.data || "empty");
      } catch (error) {
        console.log("Erro completo:", error);
      } finally {
        setLoading(false);
      }
    }
  }

  async function getProjects(username) {
    try {
      const response = await api.getProjectsByUser(username);
      setProjects(response.data.profile_projeto);
    } catch (error) {
      console.log("Erro completo:", error);
      const errorMessage =
        error?.response?.data?.message?.error ||
        error?.message ||
        "Erro desconhecido";
      console.log("Erro na requisição:", errorMessage);
    }
  }
  useEffect(() => {
    async function fetchData() {
      try {
        const storedUsername = await SecureStore.getItemAsync("username");
        setUsername(storedUsername);

        if (storedUsername) {
          await getProjects(storedUsername); 
        }
      } catch (error) {
        console.log("Erro ao pegar username ou projetos:", error);
      }
    }
    fetchData();
  }, []);

  return (
    <View style={styles.container}>
      <StatusBar hidden={false} backgroundColor="#fff" />
      <HeaderK
        toggleVisible={toggleVisibleTrue}
        text={search}
        setText={setSearch}
        getFunction={searchProjects}
      />

      {loading ? (
        <ActivityIndicator style={{ flexGrow: 1 }} size={70} color="black" />
      ) : (
        <FlatList
          data={projects}
          keyExtractor={(item) => item.ID_projeto}
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
  title: {
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
  },
});
