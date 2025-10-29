import HeaderK from "../components/HeaderKeyboard";
import BarraLateral from "../components/BarraLateral";
import { useLayoutEffect, useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  FlatList,
  StatusBar,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import Card from "../components/Card";
import api from "../axios/axios";

const screenHeight = Dimensions.get("window").height;
const screenWidth = Dimensions.get("window").width;

export default function Home({ navigation }) {
  const [projects, setProjects] = useState([]);
  const [isVisible, setIsVisible] = useState(false);
  const [filter, setFilter] = useState(false);
  const [whichFilter, setWhichFilter] = useState("recentes");
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");

  const toggleVisibleFalse = () => setIsVisible(false);
  const toggleVisibleTrue = () => setIsVisible(true);

  useLayoutEffect(() => {
    StatusBar.setBarStyle("dark-content");
    StatusBar.setBackgroundColor("transparent");
  }, []);

  async function getProjects() {
    try {
      setLoading(true);
      const response = await api.getProjects();
      setProjects(response.data.profile_projeto);
    } catch (error) {
      console.log("Erro na requisição:", error.data.message.error);
    } finally {
      setLoading(false);
      setFilter(false);
      setWhichFilter("recentes");
    }
  }
  useEffect(() => {
    getProjects();
  }, []);
  const decideStyle = (value, value2 = null) =>{
    if (value === whichFilter || value2 === whichFilter){
      return styles.circleChosen;
    }else{
      return styles.circle;
    }
  }
  const decideColor = (value, value2 = null) =>{
    if (value === whichFilter || value2 === whichFilter){
      return "white";
    }else{
      return "black";
    }
  }

  useEffect(()=>{
    const ordenados = [...projects];

    switch (whichFilter) {
      case "maisLike":
        ordenados.sort((a, b) => b.total_curtidas - a.total_curtidas);
        break;
      case "menosLike":
        ordenados.sort((a, b) => a.total_curtidas - b.total_curtidas);
        break;
      case "A-Z":
        ordenados.sort((a, b) => a.titulo.localeCompare(b.titulo));
        break;
      case "Z-A":
        ordenados.sort((a, b) => b.titulo.localeCompare(a.titulo));
        break;
      case "recentes":
      default:
        ordenados.sort((a, b) => b.ID_projeto - a.ID_projeto);
        break;
    }

    setProjects(ordenados);

  }, [whichFilter])

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
        setFilter(false);
        setWhichFilter("recentes");
      }
    }
  }

  const toggleFilter = () => {
    setFilter(!filter);
  };

  return (
    <View style={styles.container}>
      <StatusBar hidden={true} backgroundColor="#fff" />
      <HeaderK
        toggleVisible={toggleVisibleTrue}
        text={search}
        setText={setSearch}
        getFunction={searchProjects}
        filterFunction={toggleFilter}
      />
      {filter && (
        <View style={styles.filters}>
          <TouchableOpacity style={decideStyle("recentes")} onPress={()=>setWhichFilter("recentes")}>
            <Text style={{color:decideColor("recentes")}}>Mais Recentes</Text>
          </TouchableOpacity>

          <TouchableOpacity style={decideStyle("maisLike", "menosLike")} onPress={()=>{ if (whichFilter !== "maisLike") {setWhichFilter("maisLike")}else{setWhichFilter("menosLike")}}}>
            {whichFilter === "maisLike" ? <Text style={{color:decideColor("maisLike")}}>Menos Curtidos</Text>: <Text style={{color:decideColor("menosLike")}}>Mais Curtidos</Text>}
          </TouchableOpacity>

          <TouchableOpacity style={decideStyle("A-Z", "Z-A")} onPress={()=>{ if (whichFilter !== "A-Z") {setWhichFilter("A-Z")}else{setWhichFilter("Z-A")}}}>
          {whichFilter === "A-Z" ? <Text style={{color:decideColor("A-Z")}}>Título Z-A</Text>: <Text style={{color:decideColor("Z-A")}}>Título A-Z</Text>}
          </TouchableOpacity>
        </View>
      )}
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
  filters: {
    display: "flex",
    flexDirection: "row",
    marginVertical: screenHeight * 0.01,
    marginHorizontal: screenWidth * 0.05,
    gap:screenWidth * 0.1,
    width: screenWidth * 0.9,
    height: screenHeight * 0.05
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
  circle: {
    borderRadius: 30,
    borderWidth: 1,
    borderColor: "black",
    padding: 12,
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
    backgroundColor:"white"
  },
  circleChosen: {
    borderRadius: 30,
    borderWidth: 0,
    borderColor: "#803AD6",
    padding: 13,
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
    backgroundColor:"#803AD6",
    color:"#ffffff",
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
  },
});
