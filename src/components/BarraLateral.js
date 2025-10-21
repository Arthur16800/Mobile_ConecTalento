import { useEffect, useState, useRef } from "react";
import {
  Animated,
  FlatList,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Dimensions,
} from "react-native";
import * as SecureStore from "expo-secure-store";
import AntDesign from "@expo/vector-icons/AntDesign";
import Feather from '@expo/vector-icons/Feather';

const { width } = Dimensions.get("window");

const BarraLateral = ({ navigation, isVisible, onClose }) => {
  const translateX = useRef(new Animated.Value(width)).current;
  const opacity = useRef(new Animated.Value(0)).current;
  const [userName, setUserName] = useState("");

  useEffect(() => {
    Animated.parallel([
      Animated.timing(translateX, {
        toValue: isVisible ? 0 : width,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(opacity, {
        toValue: isVisible ? 1 : 0,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start();
  }, [isVisible]);

  useEffect(() => {
    async function getuserName() {
      const name = await SecureStore.getItemAsync("username");
      setUserName(name);
    }
    getuserName()
  }, []);

  const logOut = () => {
    SecureStore.deleteItemAsync("token");
    SecureStore.deleteItemAsync("user");
    navigation.navigate("Login");
  };

  if (!isVisible && opacity.__getValue() === 0) return null;

  return (
    <View style={StyleSheet.absoluteFill} pointerEvents={isVisible ? "auto" : "none"}>
      <TouchableWithoutFeedback onPress={onClose}>
        <Animated.View
          style={[
            StyleSheet.absoluteFillObject,
            {
              backgroundColor: "rgba(0, 0, 0, 0.5)",
              opacity,
              zIndex: 1,
            },
          ]}
        />
      </TouchableWithoutFeedback>

      <Animated.View style={[styles.container, { transform: [{ translateX }] }]}>
        <FlatList
          data={[
            { key: "" },
            { key: userName },
            { key: "Página Inicial", page: "Home" },
            { key: "Meu perfil", page: "Perfil" },
            { key: "Portifólio", page: "Portifolio" },
            { key: "Criar um novo Projeto", page: "CriarProjeto" },
            { key: "Desconectar (Log-out)" },
          ]}
          renderItem={({ item }) => {
            if (item.key === userName) {
              return (
                <TouchableOpacity style={[styles.styleRender, { justifyContent: "space-between" }]} onPress={onClose}>
                  <Text style={[styles.item, styles.nomeUsuario]}>
                    {item.key}
                  </Text>
                </TouchableOpacity>
              );
            }

            if (item.key === "") {
              return (
                <TouchableOpacity style={[styles.styleRender, { justifyContent: "flex-end", padding: "10" }]} onPress={onClose}>
                  <Feather name="x" size={32} color="white" />
                </TouchableOpacity>
              );
            }

            if (item.key === "Desconectar (Log-out)") {
              return (
                <TouchableOpacity style={styles.styleRender} onPress={logOut} >
                  <AntDesign name="right" size={24} color="red" />
                  <Text style={[styles.item, { color: "red" }]}>{item.key}</Text>
                </TouchableOpacity>
              );
            }

            return (
              <TouchableOpacity
                style={styles.styleRender}
                onPress={() => {
                  navigation.navigate(item.page);
                  onClose();
                }}
              >
                <AntDesign name="right" size={24} color="white" />
                <Text style={styles.item}>{item.key}</Text>
              </TouchableOpacity>
            );
          }}
          keyExtractor={(item) => item.key}
        />
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    right: 0,
    top: 0,
    height: "100%",
    width: 300,
    backgroundColor: "#6917CC",
    paddingTop: 22,
    elevation: 5,
    zIndex: 2,
  },
  item: {
    padding: 30,
    fontSize: 30,
    color: "#FFFFFF",
  },
  nomeUsuario: {
    fontSize: 30,
  },
  styleRender: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
  },
});

export default BarraLateral;
