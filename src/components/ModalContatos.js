import { useState } from "react";
import {
  Text,
  View,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Modal,
  FlatList,
} from "react-native";
import DropDownPicker from "react-native-dropdown-picker";
import Entypo from "@expo/vector-icons/Entypo";
import Feather from "@expo/vector-icons/Feather";
import { MaterialCommunityIcons } from "@expo/vector-icons";

export default function ModalContatos({
  modal,
  fechamodal,
  addcont,
  changecont,
  deletecont,
  contacts,
}) {
  const [novoValor, setValor] = useState("");
  const [novaPlat, setNovaPlat] = useState("");
  const [open, setOpen] = useState(false);
  const [edit, setEdit] = useState({
    editing: false,
    contId: null,
    contType: "",
  });

  const optionsPlat = [
    { label: "Instagram", value: "instagram" },
    { label: "Facebook", value: "facebook" },
    { label: "Twitter / X", value: "twitter" },
    { label: "LinkedIn", value: "linkedin" },
  ];

  const renderIcon = (tipo) => {
    switch (tipo) {
      case "email":
        return <Entypo name="email" size={20} color="black" />;
      case "instagram":
        return <Entypo name="instagram" size={20} color="black" />;
      case "facebook":
        return <Entypo name="facebook" size={20} color="black" />;
      case "twitter":
        return <Entypo name="twitter" size={20} color="black" />;
      case "linkedin":
        return <Entypo name="linkedin" size={20} color="black" />;
    }
  };

  return (
    <Modal
      visible={modal}
      animationType="slide"
      transparent={true}
      onRequestClose={() => fechamodal()}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.whitebox}>
          <View style={{display:"flex", }}>
            <Text style={styles.subtitle}>Contatos Existentes:</Text>
            {contacts.length === 0 ? (
              <Text style={styles.label}>Nenhum contato!!</Text>
            ) : (
              <FlatList
                data={contacts}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => {
                  return (
                    <View
                      style={{ display: "flex", flexDirection: "row", gap: 10 }}
                    >
                      {renderIcon(item.type)}
                      <Text style={styles.label}>{item.value}</Text>

                      <TouchableOpacity
                        onPress={
                          edit.editing
                            ? () =>
                                setEdit({
                                  editing: false,
                                  contId: null,
                                  contType: "",
                                })
                            : () =>
                                setEdit({
                                  editing: true,
                                  contId: item.id,
                                  contType: item.type,
                                })
                        }
                      >
                        {edit.editing && edit.contId === item.id ? (
                          <Feather name="x" size={32} color="black" />
                        ) : (
                          <MaterialCommunityIcons
                            name="pencil-outline"
                            size={20}
                            color="black"
                          />
                        )}
                      </TouchableOpacity>
                      {edit.editing && edit.contId === item.id ? (
                        <TouchableOpacity
                          onPress={() => {
                            deletecont(item.id);
                            setEdit({
                              editing: false,
                              contId: null,
                              contType: "",
                            });
                          }}
                        >
                          <MaterialCommunityIcons
                            name="trash-can-outline"
                            size={24}
                            color="black"
                          />
                        </TouchableOpacity>
                      ) : null}
                    </View>
                  );
                }}
                contentContainerStyle={{
                  flexGrow: 1,
                  alignItems: "center",
                  paddingHorizontal: 10,
                }}
              />
            )}
          </View>
          <View>
            <Text style={styles.subtitle}>
              {edit.editing ? "Editar Contato:" : "Adicionar Contato:"}
            </Text>

            {edit.editing ? null : (
              <View>
                <Text style={styles.subtitle}>Selecione a plataforma:</Text>
                <DropDownPicker
                  open={open}
                  value={novaPlat}
                  items={optionsPlat}
                  setOpen={setOpen}
                  setValue={setNovaPlat}
                  closeAfterSelecting={true}
                  closeOnBackPressed={true}
                  textStyle={{
                    marginLeft: 10,
                    fontSize: 20,
                  }}
                />
              </View>
            )}

            <View>
              {edit.editing ? null : (
                <Text style={styles.subtitle}>
                  Digite o contato(@, Nome de Usuário, etc...):
                </Text>
              )}

              <View style={styles.inputContainer}>
                <TextInput
                  value={novoValor}
                  onChangeText={(value) => setValor(value)}
                  style={styles.input}
                />
              </View>
            </View>

            <TouchableOpacity
              style={styles.button}
              onPress={
                edit.editing
                  ? () => {
                      changecont(edit.contId, edit.contType, novoValor);
                      setEdit({ editing: false, contId: null, contType: "" });
                    }
                  : () => {
                      addcont(contacts.length, novaPlat, novoValor);
                    }
              }
            >
              <Text style={styles.buttonText}>Confirmar</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.buttonBack}
              onPress={() => {
                setEdit({ editing: false, contId: null, contType: "" });
                fechamodal();
              }}
            >
              <Text style={styles.buttonBackText}>Cancelar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}
const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  whitebox: {
    backgroundColor: "#ffffff",
    borderRadius: "5%",
    width: "100%",
    padding: "20",
    gap: 10,
  },
  inputGroup: { marginBottom: 20 },
  label: { fontSize: 17, fontWeight: "600", color: "#000000", marginBottom: 6, textAlign: "center", },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 2,
    borderRadius: 12,
    backgroundColor: "#fff",
    paddingHorizontal: 15,
    paddingVertical: 6,
  },
  input: { flex: 1, fontSize: 20, color: "#333" },
  button: {
    backgroundColor: "#803AD6",
    borderRadius: 12,
    paddingVertical: 14,
    marginTop: 15,
    alignItems: "center",
    shadowColor: "#803AD6",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 5,
  },
  buttonText: { color: "#fff", fontWeight: "700", fontSize: 18 },
  buttonBack: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#803AD6",
    borderRadius: 12,
    paddingVertical: 14,
    marginTop: 15,
    alignItems: "center",
    shadowColor: "#803AD6",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 5,
  },
  buttonBackText: {
    color: "#803AD6",
    fontWeight: "600",
    fontSize: 16,
  },
  subtitle: {
    fontSize: 25,
    fontFamily: "serif",
    color: "000000",
    textAlign: "center",
    marginBottom: 10,
  },
});
