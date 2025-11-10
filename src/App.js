import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";

import Login from "./screens/Login";
import Cadastro from "./screens/Cadastro";
import Home from "./screens/Home";
import ProjetoInfo from "./screens/ProjetoInfo";
import Perfil from "./screens/Perfil";
import PerfilEdit from "./screens/PerfilEdit";
import Portifolio from "./screens/Portifolio";
import CriarProjeto from "./screens/CriarProjeto";
import Premium from "./screens/Premium";
import AtualizarProjeto from "./screens/AtualizarProjeto";


const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="Cadastro" component={Cadastro} />

        <Stack.Screen name="Home" component={Home} />
        <Stack.Screen name="ProjetoInfo" component={ProjetoInfo} />

        <Stack.Screen name="Perfil" component={Perfil} />
        <Stack.Screen name="PerfilEdit" component={PerfilEdit} />

        <Stack.Screen name="Portifolio" component={Portifolio} />

        <Stack.Screen name="CriarProjeto" component={CriarProjeto} />

        <Stack.Screen name="Premium" component={Premium} /> 
             
        <Stack.Screen name="AtualizarProjeto" component={AtualizarProjeto} />      
      </Stack.Navigator>
    </NavigationContainer>
  );
}
