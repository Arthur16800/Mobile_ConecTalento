import { View, StyleSheet, StatusBar } from "react-native";
import { useState } from "react";
import Header from "../components/Header";
import BarraLateral from "../components/BarraLateral";

export default function Portifolio({navigation}) {
  const [isVisible, setIsVisible] = useState(false);
  const toggleVisibleFalse = () => {
    setIsVisible(false);
  };
  const toggleVisibleTrue = () => {
    setIsVisible(true);
  };
  return (
    <View style={styles.container}>
      <StatusBar hidden={false} backgroundColor="#fff" />
      <Header toggleVisible={toggleVisibleTrue} />
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