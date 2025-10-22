import { View, StyleSheet, StatusBar, FlatList } from "react-native";
import { useState, useEffect } from "react";
import * as SecureStore from "expo-secure-store";
import HeaderK from "../components/HeaderKeyboard";
import BarraLateral from "../components/BarraLateral";

export default function Portifolio({navigation}) { 
  const pegarUsername = async ()=> {const username = SecureStore.getItemAsync("username");}
  
  const [projects, setProjects] = useState([]);
  const [search, setSearch] = useState("");
  const [isVisible, setIsVisible] = useState(false);
  const toggleVisibleFalse = () => {
    setIsVisible(false);
  };
  const toggleVisibleTrue = () => {
    setIsVisible(true);
  };

  async function searchProjects(text){
    try{
      const response = await api.searchProjects(text);
      setProjects(response.data.profile_projeto);
    }catch(error){
      console.log("Erro na busca:", error.data.message.error);
    }
  }
  async function getProjects() {
    try {
      const response = await api.getProjectsByUser(username);
      setProjects(response.data.profile_projeto);
    } catch (error) {
      console.log("Erro na requisição:", error.data.message.error);
    }
  }
  useEffect(() => {
    pegarUsername();
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
      backgroundColor: "#FFFFFF",
      alignItems:"center",
      justifyContent: "space-between",
    },
  });