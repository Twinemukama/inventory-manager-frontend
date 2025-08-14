<template>
  <div class="newCategoryForm">
    <h2>Create New Category</h2>
    <form @submit.prevent="handleSubmit" class="form">
      <input
        v-model="category.name"
        type="text"
        placeholder="Category name"
        class="categoryName"
        required
      />
      <button type="submit" class="submitBtn" :disabled="loading">
        {{ loading ? "Saving..." : "Create Category" }}
      </button>
    </form>
  </div>
</template>

<script setup>
import { onMounted, ref } from "vue";
import { useRouter, useRoute } from "vue-router";
import { showToast } from "../helpers/toast";
import { createCategory } from "../api/categories";

const category = ref({ name: "" });
const loading = ref(false);
const router = useRouter();
const route = useRoute();

async function handleSubmit() {
  loading.value = true;
  try {
    await createCategory({ name: category.value.name });
    showToast("Category created!", "success");
    // Decide where to redirect based on the 'from' query param
    if (route.query.from === "edit" && route.query.id) {
      router.push({
        path: `/items/${route.query.id}/edit`,
        query: {
          ...route.query,
          category: category.value.name,
        },
      });
    } else {
      router.push({
        path: "/items/new",
        query: {
          ...route.query,
          category: category.value.name,
        },
      });
    }
  } catch (err) {
    showToast("Failed to create category", "error");
  } finally {
    loading.value = false;
  }
}
</script>

<style scoped>
.newCategoryForm {
  max-width: 400px;
  margin: 40px auto;
  padding: 24px;
  background: var(--primary-bg);
  color: var(--primary-text);
  border-radius: 8px;
  border: 1px solid var(--border-color);
}
.form {
  display: flex;
  flex-direction: column;
  gap: 16px;
}
.categoryName {
  padding: 8px;
  font-size: 1.1em;
  border-radius: 4px;
  border: 1px solid var(--border-color);
}
.submitBtn {
  padding: 10px 16px;
  background: none;
  color: var(--primary-text);
  border: 1px solid var(--primary-accent);
  border-radius: 5px;
  font-size: 1em;
  cursor: pointer;
}
.submitBtn:disabled {
  background: #888;
  cursor: not-allowed;
  border:none;
}
.submitBtn:hover:not(:disabled) {
  background-color: var(--primary-accent);
}
</style>