import React, { useEffect, useRef } from "react";
import {
  Animated,
  FlatList,
  StyleSheet,
  Text,
  View,
  Dimensions,
} from "react-native";
import AntDesign from '@expo/vector-icons/AntDesign';

const { width } = Dimensions.get("window");

const BarraLateral = ({ isVisible }) => {
  // Cria um valor animado que começa fora da tela (à direita)
  const translateX = useRef(new Animated.Value(width)).current;

  useEffect(() => {
    // Quando isVisible mudar, executa a animação:
    Animated.timing(translateX, {
      toValue: isVisible ? 0 : width, // 0 = visível, width = fora da tela
      duration: 300, // duração em milissegundos
      useNativeDriver: true, // animação mais performática
    }).start();
  }, [isVisible]);

  return (
    <Animated.View style={[styles.container, { transform: [{ translateX }] }]}>
      <FlatList
        data={[
          { key: "Cláudio Ramos" },
          { key: "Página Inicial" },
          { key: "Meu perfil" },
          { key: "Portifólio" },
          { key: "Criar um novo objeto" },
          { key: "Desconectar (Log-out)" },
        ]}
        renderItem={({ item }) => (
          <View><Text
            style={[
              styles.item,
              item.key === "Cláudio Ramos" && styles.nomeUsuario, 
            ]}
          >
            {item.key}
          </Text > <AntDesign name="right" size={24} color="white" /></View>
          
        )}
        keyExtractor={(item) => item.key}
      />
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "absolute", // para sobrepor outros elementos
    right: 0, // começa na borda direita da tela
    top: 0,
    height: "100%",
    width: 300,
    backgroundColor: "#6917CC",
    paddingTop: 22,
    elevation: 5, // sombra no Android
    zIndex: 10, // garante que fique por cima no iOS
  },
  item: {
    padding: 30,
    fontSize: 30,
    color: "#FFFFFF",
  },
  nomeUsuario: {
    fontSize: 23
  }
});

export default BarraLateral;
