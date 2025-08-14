import { ref } from "vue";
import { showToast } from "../helpers/toast";

const token = ref(localStorage.getItem("token") || "");
const user = ref(
  (() => {
    try {
      return JSON.parse(localStorage.getItem("user") || "null");
    } catch {
      return null;
    }
  })()
);


function setToken(newToken) {
  token.value = newToken;
  localStorage.setItem("token", newToken);
}
function setUser(newUser) {
  user.value = newUser;
  localStorage.setItem("user", JSON.stringify(newUser));
}

function logout() {
  token.value = null;
  user.value = null;
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  showToast("Logged out", "info")
}

export function useAuth() {
  return { token, user, setToken, setUser, logout };
}
