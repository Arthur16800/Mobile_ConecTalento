import HeaderK from "../components/HeaderKeyboard";
import BarraLateral from "../components/BarraLateral";
import React, { useState, useEffect } from "react";
import { View, StyleSheet, Dimensions, FlatList, StatusBar } from "react-native";
import Card from "../components/Card";
import api from "../axios/axios";

const screenHeight = Dimensions.get("window").height;
const screenWidth = Dimensions.get("window").width;

export default function Home({ navigation }) {
  const [projects, setProjects] = useState([]);
  const [isVisible, setIsVisible] = useState(false);
  const [search, setSearch] = useState("");

  const toggleVisibleFalse = () => setIsVisible(false);
  const toggleVisibleTrue = () => setIsVisible(true);

  const handleLike = (newLikedState) => {
    console.log("Curtido:", newLikedState);
  };

  async function getProjects() {
    try {
      const response = await api.getProjects();
      setProjects(response.data.profile_projeto);
    } catch (error) {
      console.log("Erro na requisição:", error.data.message.error);
    }
  }
  async function searchProjects(text){
    try{
      const response = await api.searchProjects(text);
      setProjects(response.data.profile_projeto);
    }catch(error){
      console.log("Erro na busca:", error.data.message.error);
    }
  }

  useEffect(() => {
    getProjects();
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

      <FlatList
        data={projects}
        keyExtractor={(item) => item.ID_projeto}
        renderItem={({ item }) => {
          const uriImage =
            "data:" + item.tipo_imagem + ";base64," + item.imagem;

          return (
            <Card
              imageSource={uriImage}
              title={item.titulo}
              onLike={handleLike}
              styleCard={styles.card}
            />
          );
        }}
        contentContainerStyle={{
          flexGrow: 1,
          alignItems: "center",
          paddingHorizontal: 10,
        }}
      />

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
    width: screenWidth * 0.8,
    height: screenHeight * 0.3,
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
