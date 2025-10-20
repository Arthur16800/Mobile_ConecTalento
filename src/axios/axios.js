import axios from "axios";
import * as SecureStore from "expo-secure-store";

function base64ToFile(base64, filename) {
    if (!base64) return null;
    const arr = base64.split(",");
    const mime = arr[0].match(/:(.*?);/)[1];
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], filename, { type: mime });
  }

const api = axios.create({
  baseURL: "http://10.89.240.87:5000/api/v1/",
  headers: { accept: "application/json" },
});

api.interceptors.request.use(
  async (config) => {
    const token = await SecureStore.getItemAsync("token");
    if (token) {
      config.headers.Authorization = `${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

const sheets = {
  postLogin: (user) => api.post("login", user),
  postCadastro: (user) => api.post("user", user),
  getProjects: () => api.get("projects"),
  searchProjects: (text) => api.post("project/search", text),
  getUserByName: (username) => api.get(`user/${username}`),
  putUser: (
    userId, 
    user
  ) => {
    const data = new FormData();

  for (let key in user) {
    data.append(key, user[key]);
  }
  let imageToSend = data.imagens
  if (imageToSend && typeof imageToSend === "string") { 
    imageToSend = base64ToFile(imageToSend, "perfil_atual.jpg");
  }

  if(imageToSend) {
    data.append("imagens", imageToSend);
  }

const isForm = typeof FormData !== "undefined" && user instanceof FormData;
    const config = {
      headers: {
        ...(isForm ? { "Content-Type": "multipart/form-data" } : {}),
        Accept: "application/json",
      },
    };
    return api.put(`/user/${userId}`, user, config);
},
  deleteUser: (id) => api.delete(`user/${id}`),
  updatePassword: (id, oldPassword, newPassword) =>
    api.put(`user/newpassword/${id}`, {
      senha_atual: oldPassword,
      nova_senha: newPassword,
    }),
  getProjectsByUser: (username) => api.get(`projects/${username}`),
  postProject: async (projeto, imageUri, idUser) => {
    const data = new FormData();

    for (let key in projeto) {
      data.append(key, projeto[key]);
    }

    if (imageUri) {
      imageUri.map((image)=>{
        const filename = image.split("/").pop();
      const match = /\.(\w+)$/.exec(filename);
      const type = match ? `image/${match[1]}` : "image";
      data.append("imagem", {
        uri: image,
        name: filename,
        type: type,
      });
      })
      
    }

    return api.post(`projects/${idUser}`, projeto, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  }, // TENHO QUE ESTUDAR COMO FUNCIONA O "ENVIAR MULTIPLAS IMAGENS PARA O SERVIDOR"
  putProject: async (projeto, imageUri, id) => {
    const data = new FormData();

    for (let key in projeto) {
      data.append(key, projeto[key]);
    }

    if (imageUri) {
      const filename = imageUri.split("/").pop();
      const match = /\.(\w+)$/.exec(filename);
      const type = match ? `image/${match[1]}` : "image";
      data.append("imagem", {
        uri: imageUri,
        name: filename,
        type: type,
      });
    }

    return api.put(`projects/${id}`, projeto, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  }, // TENHO QUE ESTUDAR COMO FUNCIONA O "ENVIAR MULTIPLAS IMAGENS PARA O SERVIDOR"
};

export default sheets;
