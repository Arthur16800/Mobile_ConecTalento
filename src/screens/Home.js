import { View, StyleSheet, Image } from "react-native";
import Projeto from "../../assets/Projeto.png"

export default function Home() {
  return (
    <View style={styles.container}>
      
    <Image source={Projeto} style={styles.imagem}/>
    <Image source={Projeto} style={styles.imagem}/>
      
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 30,
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
