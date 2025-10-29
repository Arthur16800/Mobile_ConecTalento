import HeaderK from "../components/HeaderKeyboard";
import BarraLateral from "../components/BarraLateral";
import React, { useState, useEffect } from "react";
import { View, StyleSheet, Dimensions, FlatList, StatusBar, ActivityIndicator, } from "react-native";
import Card from "../components/Card";
import api from "../axios/axios";

const screenHeight = Dimensions.get("window").height;
const screenWidth = Dimensions.get("window").width;

export default function Home({ navigation }) {
  const [projects, setProjects] = useState([]);
  const [isVisible, setIsVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");

  const toggleVisibleFalse = () => setIsVisible(false);
  const toggleVisibleTrue = () => setIsVisible(true);



  async function getProjects() {
    try {
      setLoading(true);
      const response = await api.getProjects();
      setProjects(response.data.profile_projeto);
    } catch (error) {
      console.log("Erro na requisição:", error.data.message.error);
    } finally {
      setLoading(false);
    }
  }
  useEffect(() => {
    getProjects();
  }, []);

  async function searchProjects() {
    if (search === "") {
      getProjects();
    } else {
      try {
        setLoading(true);
        const response = await api.searchProjects(String(search));
        setProjects(response.data);
        console.log(response.data || "empty");
      } catch (error) {
      } finally {
        setLoading(false);
      }
    }
  }

  return (
    <View style={styles.container}>
      <StatusBar hidden={false} backgroundColor="#fff" />
      <HeaderK
        toggleVisible={toggleVisibleTrue}
        text={search}
        setText={setSearch}
        getFunction={searchProjects}
      />
      {loading ? <ActivityIndicator style={{ flexGrow: 1 }} size={70} color="black" /> :
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
            paddingBottom:25
          }}
        />}

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
