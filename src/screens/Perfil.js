import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Image,
} from "react-native";
import { useState } from "react";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import AntDesign from "@expo/vector-icons/AntDesign";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import Header from "../components/Header";
import BarraLateral from "../components/BarraLateral";

export default function Perfil({ navigation }) {
  const [isVisible, setIsVisible] = useState(false);

  const toggleVisibleFalse = () => {
    setIsVisible(false);
  };

  const toggleVisibleTrue = () => {
    setIsVisible(true);
  };

  const emailAtual = "emailTeste";

  const user = {
    username: "Cláudio Ramos",
    email: "emailTeste",
    bibliografia:
      "Entendi. O que está acontecendo é que o uso de SafeAreaView (especialmente no iOS) reserva espaço automaticamente para a barra de status e outras  (como a notch, ou entalhe), e dependendo do dispositivo, isso pode parecer uma “barra grande” visualmente.",
  };

  const contatos = [
    { tipo: "instagram", valor: "@instagramteste" },
    { tipo: "linkedin", valor: "LinkedinTeste" },
    { tipo: "facebook", valor: "FacebookTeste" },
    { tipo: "twitter", valor: "Teste" },
  ];

  const renderIcon = (tipo) => {
    switch (tipo) {
      case "instagram":
        return <AntDesign name="instagram" size={50} color="black" />;
      case "facebook":
        return <AntDesign name="facebook-square" size={50} color="black" />;
      case "twitter":
        return <FontAwesome6 name="x-twitter" size={50} color="black" />;
      case "linkedin":
        return <AntDesign name="linkedin-square" size={50} color="black" />;
      default:
        return <AntDesign name="questioncircleo" size={50} color="gray" />;
    }
  };

  return (
    <View style={styles.container}>
      <Header toggleVisible={toggleVisibleTrue} />

      <View style={styles.nomeEdit}>
        {/* Texto com nome do usuário */}
        <Text style={styles.title}>{user.username}</Text>

        {/* Ícone de Lápis */}
        {emailAtual === user.email ? (
          <TouchableOpacity onPress={() => navigation.navigate("PerfilEdit")}>
            <MaterialCommunityIcons
              name="pencil-outline"
              size={40}
              color="black"
            />
          </TouchableOpacity>
        ) : null}
      </View>

      {/* Biografia */}
      <Text style={styles.title}>Perfil do Usuário</Text>
      {user.bibliografia && (
        <Text style={styles.subtitle}>{user.bibliografia}</Text>
      )}

      {/* Contatos */}
      <Text style={styles.title}>Contatos</Text>
      <FlatList
        data={contatos}
        renderItem={({ item }) => (
          <View style={styles.contatoItem}>
            {renderIcon(item.tipo)}
            <Text style={styles.title}>{item.valor}</Text>
          </View>
        )}
        keyExtractor={(item) => item.tipo}
      />
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate("Portifolio")}
      >
        <Text style={styles.buttonText}>Ver meus projetos</Text>
      </TouchableOpacity>

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
    alignItems: "center",
  },
  nomeEdit: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    maxHeight: "10%",
    gap: 15,
  },
  title: {
    fontSize: 40,
  },
  subtitle: {
    fontSize: 20,
    paddingHorizontal: "5%",
  },
  contatoItem: {
    flexDirection: "row",
    alignItems: "flex-end",
    padding: 12,
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
});
