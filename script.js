// Importar o Firebase
import firebase from "firebase/app";
import "firebase/auth"; // Para autenticação
import "firebase/firestore"; // Para o Firestore (banco de dados)

// Configuração do Firebase
const firebaseConfig = {
  apiKey: "AIzaSyBJ1sMhLAMp7GpMxkVZIXMBQCUl7FrQYL4", // Sua chave de API
  authDomain: "goal-tracker-3f954.firebaseapp.com", // Domínio do seu projeto
  projectId: "goal-tracker-3f954", // ID do seu projeto
  storageBucket: "goal-tracker-3f954.appspot.com", // Bucket do Firebase
  messagingSenderId: "675317109213", // Sender ID
  appId: "1:675317109213:web:a617e32a11b1e91c7ec470" // App ID
};

// Inicializar o Firebase
firebase.initializeApp(firebaseConfig);

// Referências do Firebase
const auth = firebase.auth();
const db = firebase.firestore();

// Função para registrar um novo usuário
const registerUser = async (email, password, username, name) => {
  try {
    const userCredential = await auth.createUserWithEmailAndPassword(email, password);
    const user = userCredential.user;

    // Salvar dados do usuário no Firestore
    await db.collection("users").doc(user.uid).set({
      username: username,
      name: name,
      email: email,
      watchedGames: []
    });

    console.log("Usuário registrado com sucesso!");
    alert("Cadastro realizado com sucesso!");
  } catch (error) {
    console.error("Erro ao registrar usuário:", error.message);
    alert("Erro ao registrar usuário: " + error.message);
  }
};

// Função para fazer login de usuário
const loginUser = async (email, password) => {
  try {
    const userCredential = await auth.signInWithEmailAndPassword(email, password);
    const user = userCredential.user;

    console.log("Usuário logado:", user);
    alert("Login bem-sucedido!");
  } catch (error) {
    console.error("Erro ao fazer login:", error.message);
    alert("Erro ao fazer login: " + error.message);
  }
};

// Função para deslogar o usuário
const logoutUser = async () => {
  try {
    await auth.signOut();
    console.log("Usuário deslogado com sucesso!");
    alert("Desconectado com sucesso!");
  } catch (error) {
    console.error("Erro ao deslogar:", error.message);
    alert("Erro ao deslogar: " + error.message);
  }
};

// Função para atualizar jogos assistidos
const markGameAsWatched = async (gameId) => {
  const user = auth.currentUser;
  if (user) {
    try {
      // Adicionar o ID do jogo à lista de jogos assistidos do usuário
      const userRef = db.collection("users").doc(user.uid);
      await userRef.update({
        watchedGames: firebase.firestore.FieldValue.arrayUnion(gameId)
      });
      console.log("Jogo marcado como assistido:", gameId);
      alert("Jogo marcado como assistido!");
    } catch (error) {
      console.error("Erro ao marcar jogo:", error.message);
      alert("Erro ao marcar jogo: " + error.message);
    }
  } else {
    alert("Você precisa estar logado para marcar jogos!");
  }
};

// Função para carregar os jogos assistidos
const loadWatchedGames = async () => {
  const user = auth.currentUser;
  if (user) {
    try {
      const userRef = db.collection("users").doc(user.uid);
      const doc = await userRef.get();
      if (doc.exists) {
        const watchedGames = doc.data().watchedGames;
        console.log("Jogos assistidos:", watchedGames);
        // Aqui você pode fazer algo com a lista de jogos assistidos, como exibir na UI
      }
    } catch (error) {
      console.error("Erro ao carregar jogos assistidos:", error.message);
      alert("Erro ao carregar jogos assistidos: " + error.message);
    }
  } else {
    alert("Você precisa estar logado para carregar seus jogos!");
  }
};

// Monitorando o estado de autenticação
auth.onAuthStateChanged(user => {
  if (user) {
    console.log("Usuário logado:", user.email);
    // Exibir informações do usuário na interface, por exemplo
  } else {
    console.log("Usuário não está logado");
  }
});

// Exemplo de como registrar um novo usuário (pode ser adaptado para um formulário)
document.getElementById("registerForm").addEventListener("submit", (e) => {
  e.preventDefault();
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  const username = document.getElementById("username").value;
  const name = document.getElementById("name").value;

  registerUser(email, password, username, name);
});

// Exemplo de como fazer login (pode ser adaptado para um formulário)
document.getElementById("loginForm").addEventListener("submit", (e) => {
  e.preventDefault();
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  loginUser(email, password);
});

// Exemplo de como deslogar o usuário
document.getElementById("logoutBtn").addEventListener("click", () => {
  logoutUser();
});

// Exemplo de como marcar um jogo como assistido
document.getElementById("markGameBtn").addEventListener("click", () => {
  const gameId = "12345"; // Aqui você pode pegar o ID do jogo que o usuário assistiu
  markGameAsWatched(gameId);
});

// Exemplo de como carregar os jogos assistidos
document.getElementById("loadWatchedGamesBtn").addEventListener("click", () => {
  loadWatchedGames();
});
