import LoginScreen from "./screens/Login";
import CadastroScreen from "./screens/Cadastro";
import Home from "./screens/Home";
import Perfil from "./screens/Perfil";
import PerfilEdit from "./screens/PerfilEdit";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Cadastro" component={CadastroScreen} />

        <Stack.Screen name="Home" component={Home} />

        <Stack.Screen name="Perfil" component={Perfil} />
        <Stack.Screen name="PerfilEdit" component={PerfilEdit} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
