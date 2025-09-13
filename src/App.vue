<script setup>
import { ref, onMounted, watch } from "vue";
import Navbar from "./components/Navbar.vue";
import Footer from "./components/Footer.vue";
import { initToast } from "./helpers/toast";
import { useAuth } from "./store/auth";
import { fetchMe } from "./api/auth";

const { token, user, logout } = useAuth();
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
    <div class="app-wrapper">
      <Navbar />
      <main class="main-content">
        <router-view />
      </main>
      <div class="theme-toggle">
        <label for="theme" class="theme">
          <span class="theme__toggle-wrap">
            <input id="theme" class="theme__toggle" type="checkbox" role="switch" name="theme" value="dark" v-model="isDark">
            <span class="theme__icon">
              <span class="theme__icon-part"></span>
              <span class="theme__icon-part"></span>
              <span class="theme__icon-part"></span>
              <span class="theme__icon-part"></span>
              <span class="theme__icon-part"></span>
              <span class="theme__icon-part"></span>
              <span class="theme__icon-part"></span>
              <span class="theme__icon-part"></span>
              <span class="theme__icon-part"></span>
            </span>
          </span>
        </label>
      </div>
      <Footer />
    </div>
</template>

<style>
.app-wrapper {
  min-height: 100vh;
  background: var(--primary-bg);
  color: var(--primary-text);
  display: flex;
  flex-direction: column;
}

.main-content {
  flex: 1 0 auto;
  padding-top: 60px;
  padding-bottom: 70px;
  background: var(--primary-bg);
}

.theme-toggle {
  position: fixed;
  left: 24px;
  bottom: 5px;
  z-index: 2000;
  background: none;
  border: none;
  box-shadow: none;
  padding: 0;
}

.theme {
  display: flex;
  align-items: center;
  -webkit-tap-highlight-color: transparent;
}


.theme__icon {
  transition: 0.3s;
}

.theme__icon,
.theme__toggle {
  z-index: 1;
}

.theme__icon,
.theme__icon-part {
  position: absolute;
}

.theme__icon {
  display: flex;
  align-items: center;
  justify-content: center;
  top: 0.75em;
  left: 0.75em;
  width: 1.5em;
  height: 1.5em;
}


.theme__icon-part {
  border-radius: 50%;
  box-shadow: 0.4em -0.4em 0 0.5em #ffe066 inset; /* yellow sun */
  top: calc(50% - 0.5em);
  left: calc(50% - 0.5em);
  width: 1em;
  height: 1em;
  transition: box-shadow var(--transDur, 0.3s) ease-in-out,
    opacity var(--transDur, 0.3s) ease-in-out,
    transform var(--transDur, 0.3s) ease-in-out;
  transform: scale(0.5);
}


.theme__icon-part ~ .theme__icon-part {
  background-color: #ffe066;
  border-radius: 0.05em;
  top: 50%;
  left: calc(50% - 0.05em);
  transform: rotate(0deg) translateY(0.5em);
  transform-origin: 50% 0;
  width: 0.1em;
  height: 0.2em;
}

.theme__icon-part:nth-child(3) {
  transform: rotate(45deg) translateY(0.45em);
}
.theme__icon-part:nth-child(4) {
  transform: rotate(90deg) translateY(0.45em);
}
.theme__icon-part:nth-child(5) {
  transform: rotate(135deg) translateY(0.45em);
}
.theme__icon-part:nth-child(6) {
  transform: rotate(180deg) translateY(0.45em);
}
.theme__icon-part:nth-child(7) {
  transform: rotate(225deg) translateY(0.45em);
}
.theme__icon-part:nth-child(8) {
  transform: rotate(270deg) translateY(0.5em);
}
.theme__icon-part:nth-child(9) {
  transform: rotate(315deg) translateY(0.5em);
}

.theme__label,
.theme__toggle,
.theme__toggle-wrap {
  position: relative;
}

.theme__toggle,
.theme__toggle:before {
  display: block;
}


.theme__toggle {
  background-color: #fff;
  border-radius: 25% / 50%;
  border: 1px solid var(--primary-texttext);
  box-shadow: 0 0 0 0.125em var(--primary-text);
  padding: 0.25em;
  width: 6em;
  height: 3em;
  -webkit-appearance: none;
  appearance: none;
  transition: background-color var(--transDur, 0.3s) ease-in-out,
    box-shadow 0.15s ease-in-out,
    transform var(--transDur, 0.3s) ease-in-out;
  display: flex;
  align-items: center;
  cursor: pointer;
}


.theme__toggle:before {
  background-color: #fff;
  border-radius: 50%;
  content: "";
  width: 2.5em;
  height: 2.5em;
  transition: 0.3s;
  display: flex;
  align-items: center;
  justify-content: center;
}

.theme__toggle:focus {
  box-shadow: 0 0 0 0.125em var(--primary-text);
  outline: transparent;
}

/* Checked */

.theme__toggle:checked {
  background-color: #111;
}

.theme__toggle:checked:before,
.theme__toggle:checked ~ .theme__icon {
  transform: translateX(3em);
}

.theme__toggle:checked:before {
  background-color: #111;
}

.theme__toggle:checked ~ .theme__fill {
  transform: translateX(0);
}


.theme__toggle:checked ~ .theme__icon .theme__icon-part:nth-child(1) {
  box-shadow: 0.2em -0.2em 0 0.2em #3f92eb inset;
  transform: scale(1);
  top: 0.2em;
  left: -0.2em;
}


.theme__toggle:checked ~ .theme__icon .theme__icon-part ~ .theme__icon-part {
  opacity: 0;
  background-color: #3f92eb;
}

.theme__toggle:checked ~ .theme__icon .theme__icon-part:nth-child(2) {
  transform: rotate(45deg) translateY(0.8em);
}
.theme__toggle:checked ~ .theme__icon .theme__icon-part:nth-child(3) {
  transform: rotate(90deg) translateY(0.8em);
}
.theme__toggle:checked ~ .theme__icon .theme__icon-part:nth-child(4) {
  transform: rotate(135deg) translateY(0.8em);
}
.theme__toggle:checked ~ .theme__icon .theme__icon-part:nth-child(5) {
  transform: rotate(180deg) translateY(0.8em);
}
.theme__toggle:checked ~ .theme__icon .theme__icon-part:nth-child(6) {
  transform: rotate(225deg) translateY(0.8em);
}
.theme__toggle:checked ~ .theme__icon .theme__icon-part:nth-child(7) {
  transform: rotate(270deg) translateY(0.8em);
}
.theme__toggle:checked ~ .theme__icon .theme__icon-part:nth-child(8) {
  transform: rotate(315deg) translateY(0.8em);
}
.theme__toggle:checked ~ .theme__icon .theme__icon-part:nth-child(9) {
  transform: rotate(360deg) translateY(0.8em);
}


</style>
