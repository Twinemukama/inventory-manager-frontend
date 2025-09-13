<script setup>
import { useRouter } from "vue-router";
import { useAuth } from "../store/auth";
import { computed, ref } from "vue";

const router = useRouter();
const { token, user, logout } = useAuth();

const isLoggedIn = computed(() => !!token.value);
const userInitial = computed(() =>
  user.value?.name?.[0]?.toUpperCase() ||
  user.value?.email?.[0]?.toUpperCase() ||
  "?"
);
const companyName = computed(() =>
  user.value?.company?.name || user.value?.companyName || ""
);
const showTooltip = ref(false);

function handleLogout() {
  logout();
  router.push("/login");
}
</script>

<template>
  <nav class="navBar">
    <div class="navTitle" @click="router.push('/items')">
      Inventory Manager
    </div>

    <div class="navRight">
      <span v-if="isLoggedIn && companyName" class="companyName">
        {{ companyName }}
      </span>
      <div
        v-if="isLoggedIn"
        class="initialCircle"
        @mouseenter="showTooltip = true"
        @mouseleave="showTooltip = false"
      >
        {{ userInitial }}
        <!-- <div v-if="showTooltip" class="userTooltip">
          <div><strong>{{ user.value?.name }}</strong></div>
          <div>{{ user.value?.email }}</div>
        </div> -->
      </div>
      <button
        v-if="isLoggedIn"
        @click="handleLogout"
        class="logoutBtn"
      >
        Logout
      </button>
    </div>
  </nav>
</template>

<style scoped>
.navBar {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 20px;
  background: var(--primary-bg);
  color: var(--primary-text);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.navTitle {
  font-size: 24px;
  cursor: pointer;
}
.navRight {
  display: flex;
  align-items: center;
}
.companyName {
  margin-right: 16px;
  font-weight: 600;
  font-size: 18px;
  color: var(--primary-text);
  letter-spacing: 0.5px;
}
.initialCircle {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  background: var(--primary-bg-opposite);
  color: var(--primary-text-opposite);
  font-size: 20px;
  font-weight: 900;
  margin-right: 10px;
  position: relative;
}
.initialCircle:hover {
  cursor: pointer;
}
.logoutBtn {
  padding: 8px 12px;
  background: #e74c3c;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}
.logoutBtn:hover {
  background-color: #c0392b;
}
.userTooltip {
  position: absolute;
  top: 110%;
  left: 50%;
  transform: translateX(-50%);
  background: var(--primary-bg);
  color: var(--primary-text);
  min-width: 180px;
  padding: 10px 16px;
  border-radius: 6px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.15);
  white-space: normal;
  z-index: 1200;
  font-size: 15px;
  text-align: left;
}
</style>
