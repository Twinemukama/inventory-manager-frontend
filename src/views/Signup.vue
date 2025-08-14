<template>
  <div class="signupFormdiv">
    <h2 class="signupTitle">Sign Up</h2>
    <form @submit.prevent="handleSignup" class="space-y-4">
      <input v-model="username" type="text" placeholder="Name" class="signupName" />
      <input v-model="email" type="email" placeholder="Email" class="signUpemail" />
      <input v-model="password" type="password" placeholder="Password" class="signupPassword" />
      <button type="submit" class="signupBtn">Sign Up</button>
    </form>
    <p class="mt-4 text-sm text-gray-600">
      Already have an account? <router-link to="/login" class="text-blue-500">Login</router-link>
    </p>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { signupUser } from '../api/auth'
import { showToast } from "../helpers/toast"
import { useAuth } from '../store/auth'
import { useRouter } from 'vue-router'

const username = ref('')
const email = ref('')
const password = ref('')
const { setToken } = useAuth()
const router = useRouter()


const handleSignup = async () => {
  try {
    const res = await signupUser({ 
      name: username.value,
      email: email.value,
      password: password.value,
    })

   if (res.token) {
  setToken(res.token);
  showToast("Sign up successful", "success");
  router.push("/items");
} else if (res.message === "User created") {
  showToast("Sign up successful! Please login.", "success");
  router.push("/login");
} else if (res.error) {
  showToast(res.error, "error");
  }
 } catch (err) {
    showToast("Sign up error", "error")
  }
}
</script>
<style scoped>
.signupFormdiv {
  width: 300px;
  margin: 100px auto;
  padding: 20px;
  border: 1px solid var(--border-color);
  border-radius: 10px;
  background: var(--primary-bg);
}
.signupTitle {
  text-align: center;
  margin-bottom: 20px;
}
.signupForm {
  display: flex;
  flex-direction: column;
}  
.signupName, .signUpemail, .signupPassword {
  width: 93%;
  padding: 10px;
  margin-bottom: 10px;
  border: 1px solid var(--border-color);
  border-radius: 5px;
}
.signupBtn {
  width: 100%;
  padding: 10px;
  background: none;
  color: var(--primary-text);
  border: 1px solid var(--primary-accent);
  border-radius: 5px;
  cursor: pointer;
}
.signupBtn:hover {
  background-color:var(--primary-accent);
}
</style>