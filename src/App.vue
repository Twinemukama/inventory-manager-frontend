<script setup>
import { ref, onMounted, watch } from "vue";
import Navbar from "./components/Navbar.vue";
import Footer from "./components/Footer.vue";
import { initToast } from "./helpers/toast";
import { useAuth } from "./store/auth";
import { fetchMe } from "./api/auth";

const { token, user, logout } = useAuth(); // <-- use your composable

const isDark = ref(true);

watch(isDark, (val) => {
  document.documentElement.setAttribute("data-theme", val ? "dark" : "light");
});
document.documentElement.setAttribute("data-theme", isDark.value ? "dark" : "light");

onMounted(async () => {
  initToast();
  if (token.value) {
    try {
      const userData = await fetchMe();
      user.value = userData;
    } catch {
      logout();
    }
  }
});
</script>

<template>
    <Navbar />
    <div style="padding-top: 60px; padding-bottom: 70px;">
      <router-view />
    </div>
    <div class="theme-toggle">
      <label>
        <input type="checkbox" v-model="isDark" />
        <span>{{ isDark ? "🌙" : "☀️" }}</span>
      </label>
    </div>
    <Footer />
</template>

<style>
.theme-toggle {
  position: fixed;
  left: 24px;
  bottom: 5px;
  background: var(--primary-bg);
  color: var(--primary-text);
  border: 1px solid var(--border-color);
  border-radius: 20px;
  padding: 8px 16px;
  z-index: 2000;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  font-size: 1.1em;
  user-select: none;
}

.theme-toggle input[type="checkbox"] {
  margin-right: 8px;
  cursor: pointer;
}
</style>
