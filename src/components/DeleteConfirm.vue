<template>
  <div class="deleteForm">
    <h2 class="title">Confirm Delete</h2>

    <div v-if="item">
      <p>Are you sure you want to delete <b>{{ item.name }}</b>?</p>
      <div class="itemDetails">
        <p class="itemDesc">{{ item.description }}</p>
        <p class="itemQuantity">Qty: {{ item.quantity }} | ${{ item.price }}</p>
      </div>

      <div class="modalActions">
        <button
          @click="handleDelete"
          :disabled="loading"
          class="deleteBtn"
        >
          {{ loading ? "Deleting..." : "Delete" }}
        </button>
        <button @click="router.push('/items')" class="cancelBtn">
          Cancel
        </button>
      </div>
    </div>

    <div v-else class="loading">Loading item details...</div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { showToast } from "../helpers/toast";
import { fetchItem, deleteItem } from "../api/items";

const route = useRoute();
const router = useRouter();
const itemId = route.params.id;

const item = ref(null);
const loading = ref(false);

onMounted(async () => {
  if (!itemId) {
    showToast("Invalid item ID", "error");
    router.push("/items");
    return;
  }

  try {
    item.value = await fetchItem(itemId);
  } catch (err) {
    console.error(err);
    showToast("Failed to load item", "error");
    router.push("/items");
  }
});


async function handleDelete() {
  loading.value = true;
  try {
    await deleteItem(itemId);
    showToast("Item deleted successfully", "success");
    router.push("/items");
  } catch (err) {
    console.error(err);
    showToast("Failed to delete item", "error");
  } finally {
    loading.value = false;
  }
}
</script>
<style scoped>
.deleteForm {
  padding: 20px;
  background: var(--primary-bg);
  border-radius: 8px;
  border: 1px solid var(--border-color);
  max-width: 500px;
  margin: 120px auto;
  color: var(--primary-text);
}
.title {
  font-size: 24px;
  margin-bottom: 20px;
  text-align: center;
}
.itemDetails {
  margin-bottom: 20px;
}
.itemDesc {
  font-size: 16px;
  color: var(--primary-text);
}
.itemQuantity {
  font-size: 14px;
  color: var(--primary-text);
}
.modalActions {
  display: flex;
  justify-content: right;
}
.deleteBtn,
.cancelBtn {
  padding: 10px 16px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}
.deleteBtn {
  background: red;
  color: var(--primary-text-opposite);
}
.cancelBtn {
  background: var(--primary-bg-opposite);
  color: var(--primary-text-opposite);
  border: 1px solid var(--border-color);
}
.deleteBtn:disabled {
  background: #ccc;
  cursor: not-allowed;
}
.cancelBtn:hover {
  background: var(--primary-bg-opposite);
  color: var(--primary-text-opposite);
}
.loading {
  text-align: center;
  color: var(--primary-text);
}
</style>