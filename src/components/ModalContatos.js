import { useState } from "react";
import {
  Text,
  View,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Modal,
} from "react-native";
export default function ModalContatos({
  modal,
  fechamodal,
  addcont,
}) {
  const [novoValor, setValor] = useState("");
  return (
    <Modal
      visible={modal}
      animationType="slide"
      transparent={true}
      onRequestClose={() => fechamodal()}
      style={styles.modal}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.whitebox}>
          <Text>Adicionar Contato:</Text>

          <View>
            <Text>Selecione a plataforma:</Text>
          </View>

          <View>
            <Text>Digite o contato (@, Nome de Usuário, etc...):</Text>
            <View style={styles.inputContainer}>
              <TextInput
                value={novoValor}
                onChangeText={(value) => setValor(value)}
                style={styles.input}
              />
            </View>
          </View>

          <TouchableOpacity style={styles.button} onPress={() => addcont(novaPlat, novoValor)}>
            <Text style={styles.buttonText}>Confirmar</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.buttonBack} onPress={() => fechamodal()}>
            <Text style={styles.buttonBackText}>Cancelar</Text>
          </TouchableOpacity>

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
  },
  inputGroup: { marginBottom: 20 },
  label: { fontSize: 17, fontWeight: "600", color: "#000000", marginBottom: 6 },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 2,
    borderRadius: 12,
    backgroundColor: "#fff",
    paddingHorizontal: 15,
    paddingVertical: 6,
  },
  input: { flex: 1, fontSize: 16, color: "#333" },
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
    marginBottom: 40,
  },
});
