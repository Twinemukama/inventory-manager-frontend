<template>
  <div class="signupFormdiv">
    <h2 class="signupTitle">Sign Up</h2>
    <form @submit.prevent="handleSignup" class="space-y-4">
      <input v-model="username" type="text" placeholder="Name" class="signupName" />
      <input v-model="email" type="email" placeholder="Email" class="signUpemail" />
      <input v-model="password" type="password" placeholder="Password" class="signupPassword" />

      <div class="companyOption">
        <label>
          <input type="radio" value="new" v-model="companyChoice" />
          Create a new company
        </label>
        <label>
          <input type="radio" value="join" v-model="companyChoice" />
          Join existing company
        </label>
      </div>

      <input
        v-if="companyChoice === 'new'"
        v-model="companyName"
        type="text"
        placeholder="Company Name"
        class="signupCompany"
      />

      <select
        v-if="companyChoice === 'join'"
        v-model="companyId"
        class="signupCompany"
      >
        <option disabled value="">Select a company</option>
        <option v-for="c in companies" :key="c.id" :value="c.id">
          {{ c.Name }}
        </option>
      </select>

      <button type="submit" class="signupBtn">Sign Up</button>
    </form>

    <p class="mt-4 text-sm text-gray-600">
      Already have an account? <router-link to="/login" class="text-blue-500">Login</router-link>
    </p>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { signupUser, fetchCompanies } from '../api/auth'
import { showToast } from "../helpers/toast"
import { useAuth } from '../store/auth'
import { useRouter } from 'vue-router'

const username = ref('')
const email = ref('')
const password = ref('')
const companyChoice = ref('new')
const companyName = ref('')
const companyId = ref('')
const companies = ref([])

const { setToken } = useAuth()
const router = useRouter()

onMounted(async () => {
  try {
    companies.value = await fetchCompanies()
  } catch (err) {
    console.error("Failed to fetch companies", err)
  }
})

const handleSignup = async () => {
  try {
    let payload = {
      username: username.value,
      email: email.value,
      password: password.value,
    }

    if (companyChoice.value === 'new') {
      payload.companyName = companyName.value
    } else {
      payload.companyId = companyId.value
    }

    const res = await signupUser(payload)
    console.log("Signup response:", res)

    if (res.token) {
      setToken(res.token)
      showToast("Sign up successful", "success")
      router.push("/items")
    } else if (
      res.message &&
      res.message.toLowerCase().includes("user created")
    ) {
      showToast("Sign up successful! Please login.", "success")
      router.push("/login")
    } else if (res.error) {
      showToast(res.error, "error")
    } else {
      showToast("Unexpected signup response", "error")
    }
  } catch (err) {
    showToast("Sign up error", "error")
  }
}
</script>

<style scoped>
.signupFormdiv {
  width: auto;
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
.signupName, .signUpemail, .signupPassword, .signupCompany {
  width: 93%;
  padding: 10px;
  margin-bottom: 10px;
  border: 1px solid var(--border-color);
  border-radius: 5px;
}

.signupCompany{
  background: var(--primary-bg) ;
  color: var(--primary-text);
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
  background-color: var(--primary-accent);
}
.companyOption {
  display: flex;
  gap: 10px;
  margin-bottom: 10px;
}
</style>