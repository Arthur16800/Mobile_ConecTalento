import { FlatList, TouchableOpacity } from "react-native";
import * as SecureStore from "expo-secure-store";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";

export default function Perfil({ navigation, email }) {
  const emailAtual = SecureStore.getItemAsync("email");
  return (
    <View>
      {/* Imagem do usuário */}
      <Image source={{ uri: "rota da imagem" }} />

      <View style={styles.nomeEdit}>
        {/* Texto com nome do usuário */}
        <Text>{user.username}</Text>

        {/* Ícone de Lápis */}
        {emailAtual === email ? (
          <TouchableOpacity onPress={navigation.navigate("EditPerfil")}>
            <MaterialCommunityIcons
              name="pencil-outline"
              size={24}
              color="black"
            />
          </TouchableOpacity>
        ) : null}
      </View>
      {/* Biografia */}
      <Text>Perfil do Usuário</Text>
      {user.bibliografia && <Text>{user.bibliografia}</Text>}

      {/* Contatos */}
      <Text>Contatos</Text>
      <FlatList data={contatos} renderItem={(item) => <Text>{item}</Text>} />
    </View>
  );
}
