import { View, StyleSheet, Image } from "react-native";
import Projeto from "../../assets/Projeto.png"
import Header from "../components/Header";
import BarraLateral from "../components/BarraLateral";
import { useState } from 'react';

export default function Home() {

  const [isVisible, setIsVisible] = useState(false);

  const toggleVisibleFalse = ()=>{
    setIsVisible(false);
  }

  const toggleVisibleTrue = ()=>{
    setIsVisible(true);
  }
  return (

    <View style={styles.container}> 
    <Header
    toggleVisible={toggleVisibleTrue}
    />

    <Image source={Projeto} style={styles.imagem}/>
    <Image source={Projeto} style={styles.imagem}/>

    <BarraLateral
    isVisible={isVisible}
    
    />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    alignItems:"center",
    justifyContent: "space-evenly",
  },
  
  button: {
    backgroundColor: "#215299",
    paddingVertical: 16,
    borderRadius: 12,
    marginBottom: 20,
    alignItems: "center",
    shadowColor: "#215299",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  imagem: {

  }
});
