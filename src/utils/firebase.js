import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDsB76vTUlfr3akfe0U0Vp8jYRgUL5oIHU",
  authDomain: "fityro-c5c0a.firebaseapp.com",
  projectId: "fityro-c5c0a",
  appId: "1:865453846495:web:37b532f60e30b7925f5e6a",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();
