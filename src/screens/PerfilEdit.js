import {
  View,
  Image,
  Text,
  TouchableOpacity,
  FlatList,
  StyleSheet,
} from "react-native";

import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";

import InputUser from "../components/InputObj";
import { useState } from "react";

export default function PerfilEdit({ navigation }) {
  const emailAtual = "emailTeste";
  const [user, setUser] = useState({
    username: "testeUser",
    email: "emailTeste",
    bibliografia: "Bibliografia",
  });
  const [contatos, setContatos] = useState({
    instagram: "insta",
    facebook: "face",
    twitter: "x",
  });

  return (
    <View style={styles.container}>
      {/* Imagem do usuário */}
      <Image source={"../../assets/Projeto.png"} size="30%" />

      <View style={styles.nomeEdit}>
        {/* Texto com nome do usuário */}
        <InputUser
          atributo={"Nome"}
          variavel={"username"}
          texto={"Nome anterior(fazer com axios api)"}
          obj={user}
          setobj={setUser}
        />

        {/* Ícone de Lápis */}
        {emailAtual === user.email ? (
          <TouchableOpacity onPress={() => handleSalvar()}>
            <MaterialCommunityIcons
              name="content-save"
              size={40}
              color="black"
            />
          </TouchableOpacity>
        ) : null}
      </View>

      {/* Biografia */}
      <Text style={styles.title}>Perfil do Usuário</Text>
      {user.bibliografia && (
        <InputUser
          atributo={"Bibliografia"}
          variavel={"bibliografia"}
          texto={"Texto anterior(fazer com axios api)"}
          obj={user}
          setobj={setUser}
        />
      )}

      {/* Contatos */}
      <Text style={styles.title}>Contatos</Text>
      <FlatList
        data={contatos}
        renderItem={(item) => (
          <View>
            <Image source={`/rota/da/imagem/${item}`} />
            <Text style={styles.subtitle}>{contatos[item]}</Text>
          </View>
        )}
        keyExtractor={(item) => Object.keys(item)}
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
