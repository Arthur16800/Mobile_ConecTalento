import {
  View,
  Image,
  Text,
  TouchableOpacity,
  FlatList,
  StyleSheet,
} from "react-native";

import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";

export default function Perfil({ navigation }) {
  const emailAtual = "emailTeste";
  // SecureStore.getItemAsync("email");

  const user = {
    username: "testeUser",
    email: "emailTeste",
    bibliografia: "Bibliografia"
  };

  const contatos = {
    instagram:"insta",
    facebook:"face",
    twitter:"x"
  }

  return (
    <View style={styles.container}>
      {/* Imagem do usuário */}
      <Image source={"../../assets/Projeto.png"} size="30%" />

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
        renderItem={(item) => 
        <View>
          <Image source={`/rota/da/imagem/${item}`} />
        <Text style={styles.subtitle}>{contatos[item]}</Text>
        </View>
        }
        keyExtractor={(item)=>Object.keys(item)}
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
  },
});
