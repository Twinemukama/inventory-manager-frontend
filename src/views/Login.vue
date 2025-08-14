<template>
<div class="loginFormdiv">
    <h2 class="loginTitle">Login</h2>
    <form @submit.prevent="handleLogin" class="loginForm">
      <input v-model="email" type="email" placeholder="Email" class="emailInput" />
      <input v-model="password" type="password" placeholder="Password" class="passwordInput" />
      <button type="submit" class="loginBtn">Login</button>
    </form>
    <p class="mt-4 text-sm text-gray-600">
      Don't have an account? <router-link to="/signup" class="text-blue-500">Sign Up</router-link>
    </p>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { loginUser } from '../api/auth'
import { useAuth } from '../store/auth'
import { showToast } from '../helpers/toast'

const email = ref('')
const password = ref('')
const router = useRouter()
const { setToken, setUser } = useAuth();

const handleLogin = async () => {
  try {
    const res = await loginUser({ email: email.value, password: password.value })
    if (res.token) {
      setToken(res.token);
      setUser(res.user); // Assuming the response contains user data
      showToast("Login successful", "success");
      router.push("/items");
  } else {
    showToast("Invalid Credentials", "error");
  }
}
   catch (err) {
    showToast("Login Failed", "error")
  }
}
</script>

<style scoped>
.loginFormdiv {
  width: 300px;
  margin: 100px 0;
  padding: 20px;
  border: 1px solid var(--border-color);
  border-radius: 10px;
  background: var(--primary-bg);
}
.loginTitle {
  text-align: center;
  margin-bottom: 20px;
}
.loginForm {
  display: flex;
  flex-direction: column;
}
.emailInput, .passwordInput {
  margin-bottom: 10px;
  padding: 10px;
  border: 1px solid var(--border-color);
  border-radius: 5px;
}
.loginBtn {
  padding: 10px;
  background: none;
  color: var(--primary-text);
  border: 1px solid var(--primary-accent);
  border-radius: 5px;
  cursor: pointer;
}
.loginBtn:hover {
  background-color: var(--primary-accent);
}
</style>
