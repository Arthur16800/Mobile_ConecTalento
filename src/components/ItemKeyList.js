import { TouchableOpacity } from "react-native";
import { FlatList } from "react-native-gesture-handler";
import { View } from "react-native-reanimated/lib/typescript/Animated";
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import InputObj from "./InputObj";

export default function ItemKeyList(contatos, setcontatos) {
    const setContatos = setcontatos;
  return (
    <View>
    <FlatList
      data={contatos}
      keyExtractor={(item) => Object.keys(item)}
      contentContainerStyle={{ paddingBottom: 80, paddingHorizontal: 10 }}
      renderItem={({ item }) => (
        <TouchableOpacity onPress={openModal}>
          <Text> {Object.keys(item)}</Text>
          <Text>{Object.values(item)}</Text>
        </TouchableOpacity>
      )}
    />
    <TouchableOpacity onPress={openModal}>
      <MaterialCommunityIcons name="plus" size={24} color="black" />
    </TouchableOpacity>
    <Modal>
                <InputObj
                  atributo={"Novo Contato"}
                  variavel={"username"}
                  texto={"Nome anterior(fazer com axios api)"}
                  obj={contatos}
                  setobj={setContatos}
                />
    </Modal>
    </View>
  );
}
