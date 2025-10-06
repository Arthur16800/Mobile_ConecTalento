import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  StatusBar
} from "react-native";
import { useState } from "react";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import IoniconsUser from "@expo/vector-icons/Ionicons";
import Entypo from "@expo/vector-icons/Entypo";
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
      "Entendi. O que está acontecendo é que o uso de SafeAreaView (especialmente no iOS) reserva espaço automaticamente para a barra de status e outras (como a notch, ou entalhe), e dependendo do dispositivo, isso pode parecer uma “barra grande” visualmente.",
  };

  const contatos = [
    { tipo: "instagram", valor: "@instagramteste" },
    { tipo: "linkedin", valor: "LinkedinTeste" },
    { tipo: "facebook", valor: "FacebookTeste" },
    { tipo: "twitter", valor: "TwitterTeste" },
  ];

  const renderIcon = (tipo) => {
    switch (tipo) {
      case "instagram":
        return <Entypo name="instagram" size={20} color="black" />;
      case "facebook":
        return <Entypo name="facebook" size={20} color="black" />;
      case "twitter":
        return <Entypo name="twitter" size={20} color="black" />;
      case "linkedin":
        return <Entypo name="linkedin" size={20} color="black" />;
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar hidden={false} backgroundColor="#fff" />
      <Header toggleVisible={toggleVisibleTrue} />

      {/* Ícone de usuário */}
      <View style={styles.fundoUser}>
        <IoniconsUser name="person" size={80} color="#949599" />
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
            <Text style={styles.contactText}>{item.valor}</Text>
          </View>
        )}
        keyExtractor={(item) => item.tipo}
      />

      {/* Botão para ver projetos */}
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
    justifyContent: "flex-start",
    paddingTop: 10,
    paddingBottom: 20, 
  },
  fundoUser: {
    backgroundColor: "#d2d3d5",
    width: 120,
    height: 120,
    borderRadius: 60,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
    marginTop: 20,
  },
  icon: {
    position: "absolute",
  },
  nomeWrapper: {
    flexDirection: "row", 
    alignItems: "center",
    justifyContent: "center",
    gap: 3,
  },
  editIconWrapper: {
    marginLeft: 5,
    marginTop: -10,
  },
  editIcon: {
    marginTop: 10,
  },
  title: {
    fontSize: 30,
    textAlign: "center",
    marginTop: 10,
    fontWeight: 'bold',
  },
  name: {
    fontSize: 30,
    textAlign: "center",
    marginBottom: 20,
  },
  subtitle: {
    display: 'flex',
    fontSize: 20,
    paddingHorizontal: "5%",
    textAlign: 'center',
    justifyContent:'center',
  },
  contatoItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    padding: 10,
  },
  contactText: {
    fontSize: 20,
    marginLeft: 10, 
  },
  button: {
    backgroundColor: "#803AD6",
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 22,
    alignItems: "center",
    shadowColor: "#803AD6",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 5,
    width: "80%",
    position: "absolute",
    bottom: 70, 
  },
  buttonText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 18,
  },
});
