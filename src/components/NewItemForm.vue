<template>
  <div class="newItemForm">
    <h2 class="newItemtitle">Create New Item</h2>
    <form @submit.prevent="handleSubmit" class="form">
      <input v-model="item.name" type="text" placeholder="Item name" class="itemName" required />
      <input v-model="item.description" type="text" placeholder="Description" class="itemDesc" />
      <div class="formRow">
       <label for="quantity">Quantity:</label>
       <input v-model.number="item.quantity" type="number" placeholder="Quantity" class="itemQuantity" required />
      </div>
      <div class="formRow">
       <label for="price">Price:</label>
       <input v-model.number="item.price" type="number" step="0.5" placeholder="Price" class="itemPrice" required />
      </div>
      <!-- Replace your <select> with this custom dropdown -->
      <div class="categoryDropdown">
        <div class="dropdownSelected" @click="dropdownOpen = !dropdownOpen">
          {{ item.category || 'Select Category' }}
          <span class="dropdownArrow">▼</span>
        </div>
        <div v-if="dropdownOpen" class="dropdownList">
          <div
            v-for="cat in categories"
            :key="cat.id"
            class="dropdownItem"
            :class="{ selected: item.category === cat.name }"
          >
            <div class="dropdownItemContent">
              <span @click="selectCategory(cat.name)">{{ cat.name }}</span>
            </div>
            <div class="dropdownActions">
              <button class="editBtn" @click.stop="openEditModal(cat)">✏️</button>
              <button class="deleteBtn" @click.stop="openDeleteModal(cat)">🗑️</button>
            </div>
          </div>
          <div class="dropdownItem" @click="handleCategoryChange">
            + Add New category
          </div>
        </div>
      </div>
      <button type="submit" 
      class="submitBtn"
      :disabled="!isFormValid || loading"
      >
       {{ loading ? "Saving..." : "Create Item" }}
     </button>
    </form>

    <!-- Edit Modal -->
    <div v-if="showEditModal" class="modalOverlay">
      <div class="modal">
        <h3>Edit Category</h3>
        <input v-model="editCategoryName" type="text" />
        <div class="modalActions">
          <button @click="confirmEditCategory">Save</button>
          <button @click="closeEditModal">Cancel</button>
        </div>
      </div>
    </div>

    <!-- Delete Confirmation Modal -->
    <div v-if="showDeleteModal" class="modalOverlay">
      <div class="modal">
        <p>Are you sure you want to delete <b>{{ deleteCategoryObj?.name }}</b>?</p>
        <div class="modalActions">
          <button @click="confirmDeleteCategory">Yes, Delete</button>
          <button @click="closeDeleteModal">Cancel</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { useRouter, useRoute } from "vue-router";
import { showToast } from "../helpers/toast";
import { fetchCategories, deleteCategory, updateCategory } from "../api/categories";
import { createItem } from "../api/items";

const router = useRouter();
const route = useRoute();
const loading = ref(false);
const item = ref({
  name: route.query.name || "",
  description: route.query.description || "",
  quantity: route.query.quantity ? Number(route.query.quantity) : 0,
  price: route.query.price ? Number(route.query.price) : 0,
  category: route.query.category || "",
});
const categories = ref([]);
const dropdownOpen = ref(false);
const showEditModal = ref(false);
const showDeleteModal = ref(false);
const editCategory = ref(null);
const editCategoryName = ref("");
const deleteCategoryObj = ref(null);

const isFormValid = computed(() =>
  item.value.name.trim() &&
  item.value.price > 0 &&
  item.value.quantity >= 0 &&
  item.value.category.trim()
);

async function loadCategories() {
  try {
    categories.value = await fetchCategories();
  } catch (err) {
    console.error(err);
    showToast("Could not load categories", "error");
  }
}

async function handleSubmit() {
  loading.value = true;
  try {
    await createItem({
      name: item.value.name,
      price: item.value.price,
      description: item.value.description,
      quantity: item.value.quantity,
      category: item.value.category
    });
    showToast("Item created successfully", "success");
    router.push("/items");
  } catch (err) {
    console.error(err);
    showToast("Failed to create item", "error");
  } finally {
    loading.value = false;
  }
}

function handleCategoryChange() {
  router.push({
    path: "/categories/new",
    query: {
      name: item.value.name,
      description: item.value.description,
      quantity: item.value.quantity,
      price: item.value.price,
    },
  });
  item.value.category = "";
}

function selectCategory(name) {
  item.value.category = name;
  dropdownOpen.value = false;
}

function openEditModal(category) {
  editCategory.value = category;
  editCategoryName.value = category.name;
  showEditModal.value = true;
  dropdownOpen.value = false;
}

function closeEditModal() {
  showEditModal.value = false;
  editCategory.value = null;
}

async function confirmEditCategory() {
  loading.value = true;
  try {
    await updateCategory(editCategory.value.id, { name: editCategoryName.value });
    showToast("Category updated successfully", "success");
    await loadCategories();
    // If the edited category is currently selected, update its name in the item
    if (item.value.category === editCategory.value.name) {
      item.value.category = editCategoryName.value;
    }
    closeEditModal();
  } catch (err) {
    console.error(err);
    showToast("Failed to update category", "error");
  } finally {
    loading.value = false;
  }
}

function openDeleteModal(category) {
  deleteCategoryObj.value = category;
  showDeleteModal.value = true;
  dropdownOpen.value = false;
}

function closeDeleteModal() {
  showDeleteModal.value = false;
  deleteCategoryObj.value = null;
}

async function confirmDeleteCategory() {
  loading.value = true;
  try {
    await deleteCategory(deleteCategoryObj.value.id);
    showToast("Category deleted successfully", "success");
    await loadCategories();
    // If the deleted category was selected, clear it
    if (item.value.category === deleteCategoryObj.value.name) {
      item.value.category = "";
    }
    closeDeleteModal();
  } catch (err) {
    console.error(err);
    showToast("Failed to delete category", "error");
  } finally {
    loading.value = false;
  }
}

onMounted(() =>{
  loadCategories();
});
</script>

<style scoped>
.newItemForm {
  max-width: 500px;
  margin: 50px auto;
  padding: 20px; 
  background: var(--primary-bg);
  color: var(--primary-text);
  border: 1px solid var(--border-color);
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}
.newItemtitle {
  text-align: center;
  margin-bottom: 20px;
  color: var(--primary-text);
}
.form {
  display: flex;
  flex-direction: column;
}
.formRow {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
}
.formRow label {
  flex: 1;
  margin-right: 10px;
  font-weight: bold;
}
.formRow input {
  flex: 2;
}
.itemName,
.itemDesc,
.itemQuantity,
.itemPrice,
.itemCategory {
  margin-bottom: 15px;
  padding: 10px;
  border: 1px solid var(--border-color);
  border-radius: 4px;
  font-size: 16px;
}
.itemCategory {
  background: var(--primary-bg);
  color: var(--primary-text);
  cursor: pointer;
}
.submitBtn {
  padding: 10px;
  background: none;
  color: var(--primary-text);
  border: 1px solid var(--primary-accent);
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;
}
.submitBtn:disabled {
  background-color: #ccc;
  cursor: not-allowed;
  border:none;
}
.submitBtn:hover:not(:disabled) {
  background-color: var(--primary-accent);
}
.categoryDropdown {
  position: relative;
  margin-bottom: 15px;
}
.dropdownSelected {
  padding: 10px;
  border: 1px solid var(--border-color);
  border-radius: 4px;
  background: var(--primary-bg);
  color: var(--primary-text);
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.dropdownArrow {
  margin-left: 10px;
}
.dropdownList {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background: var(--primary-bg);
  border: 1px solid var(--border-color);
  border-radius: 4px;
  z-index: 10;
  max-height: 200px;
  overflow-y: auto;
}

.dropdownItem {
  padding: 6px 10px;
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.dropdownItemContent span {
  font-size: 14px;
}

.dropdownItem.selected {
  background: var(--primary-accent);
  color: var(--primary-bg);
}
.dropdownActions {
  display: flex;
  gap: 2px;
  align-items: center;
}

.dropdownActions button {
  font-size: 12px;
  padding: 0;
  background: none;
  border: none;
  cursor: pointer;
}

.editBtn,
.deleteBtn {
  background: none;
  border: none;
  cursor: pointer;
  color: var(--primary-accent);
  width: 20px;
}
.modalOverlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 20;
}
.modal {
  background: var(--primary-bg-opposite);
  color: var(--primary-text-opposite);
  padding: 20px;
  border-radius: 8px;
  width: 300px;
  max-width: 80%;
}
.modal button {
  padding: 8px 12px;
  background: var(--primary-bg-opposite);
  color: var(--primary-text-opposite);
  border: 1px solid var(--border-color);
  border-radius: 5px;
  cursor: pointer;
}
.modal h3 {
  margin-top: 0;
  text-align: center;
}
.modal input {
  width: 100%;
  padding: 8px;
  margin-top: 10px;
  border: 1px solid var(--border-color);
  border-radius: 4px;
  font-size: 16px;
  box-sizing: border-box;
}
.modal input:focus {
  outline: none;
  border-color: var(--primary-accent);
}
.modalActions {
  display: flex;
  justify-content: flex-end;
  margin-top: 10px;
}
.modalActions button {
  margin-left: 10px;
}
</style>
