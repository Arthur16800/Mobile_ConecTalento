import Feather from "@expo/vector-icons/Feather";
import {
    View,
    TouchableOpacity,
    Text,
    Image,
    StyleSheet,
} from "react-native"

export default function AddImagem({image, delimage, index}) {
  return (
    <View>
      <View style={styles.topLine}>
        <TouchableOpacity style={styles.orbClose} onPress={()=>delimage(index)}>
          <Feather name="x" size={30} color="white" />
        </TouchableOpacity>
      </View>

      <View style={styles.botSpace}>
        <Text style={styles.title}> Preview da Foto {index + 1}: </Text>
        <Image source={{ uri: image }} style={styles.photo} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  topLine: {
    display:"flex",
    flexDirection:"row",
    justifyContent:"flex-end",
    height:40
  },
  orbClose:{
    display:"flex",
    justifyContent:"center",
    alignItems:"center",
    borderRadius:9999,
    backgroundColor:"red",
    width:40,
    heigth:"100%",
  },
  title: {
    fontSize: 40,
  },
  photo: {
    width: "100%",
    height: 400,
  },
});
