<template>
  <div class="itemEditForm">
    <h2 class="editTitle">Edit Item</h2>
    <form @submit.prevent="handleUpdate" class="form">
      <input v-model="item.name" type="text" placeholder="Item name" class="itemName" required />

      <input v-model="item.description" type="text" placeholder="Description" class="itemDesc" />

      <div class="formRow">
        <label for="quantity">Quantity:</label>
        <input v-model.number="item.quantity" type="number" placeholder="Quantity" class="itemQuantity" min="0" required />
      </div>
      <div class="formRow">
        <label for="price">Price:</label>
        <input v-model.number="item.price" type="number" step="0.5" placeholder="Price" class="itemPrice" min="0" required />
      </div>

      <!-- Custom category dropdown with edit/delete -->
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
          <div class="dropdownItem" @click="handleAddNewCategory">
            + Add New category
          </div>
        </div>
      </div>

      <button
        type="submit"
        :disabled="!isFormValid || loading"
        class="submitBtn"
      >
        {{ loading ? "Updating..." : "Update Item" }}
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
        <p>Are you sure you want to delete <b>{{ deleteCategory?.name }}</b>?</p>
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
import { useRoute, useRouter } from "vue-router";
import { showToast } from "../helpers/toast";
import { fetchCategories } from "../api/categories";
import { fetchItem, updateItem } from "../api/items";
import { updateCategory, deleteCategory as apiDeleteCategory } from "../api/categories";

const route = useRoute();
const router = useRouter();
const itemId = route.params.id;

const loading = ref(false);
const categories = ref([]);

const item = ref({
  name: route.query.name || "",
  description: route.query.description || "",
  quantity: route.query.quantity ? Number(route.query.quantity) : 0,
  price: route.query.price ? Number(route.query.price) : 0,
  category: route.query.category || "",
});

const isFormValid = computed(() =>
  item.value.name.trim() &&
  item.value.price > 0 &&
  item.value.quantity >= 0 &&
  item.value.category.trim()
);

onMounted(() => {
  loadItem();
  loadCategories();
});

async function loadItem() {
  try {
    const fetched = await fetchItem(itemId);
    // Always set all fields to the fetched values
    item.value.name = fetched.name || "";
    item.value.description = fetched.description || "";
    item.value.quantity = fetched.quantity ?? 0;
    item.value.price = fetched.price ?? 0;
    item.value.category = fetched.category || "";
  } catch (err) {
    console.error(err);
    showToast("Failed to load item", "error");
  }
}

async function loadCategories() {
  try {
    categories.value = await fetchCategories();
  } catch (err) {
    console.error(err);
    showToast("Could not load categories", "error");
  }
}

function handleCategoryChange(e) {
    router.push({
      path: "/categories/new",
      query: {
        name: item.value.name,
        description: item.value.description,
        quantity: item.value.quantity,
        price: item.value.price,
        category: "", // clear category for new
        from: "edit",
        id: itemId,
      },
    });
    item.value.category = "";
}

async function handleUpdate() {
  loading.value = true;
  try {
    await updateItem(itemId, item.value);
    showToast("Item updated successfully", "success");
    router.push("/items");
  } catch (err) {
    console.error(err);
    showToast("Error updating item", "error");
  } finally {
    loading.value = false;
  }
}

const dropdownOpen = ref(false);
const showEditModal = ref(false);
const showDeleteModal = ref(false);
const editCategory = ref(null);
const editCategoryName = ref("");
const deleteCategory = ref(null);

function selectCategory(name) {
  item.value.category = name;
  dropdownOpen.value = false;
}
function handleAddNewCategory() {
  dropdownOpen.value = false;
  handleCategoryChange(); // your existing logic for adding new
}
function openEditModal(cat) {
  editCategory.value = cat;
  editCategoryName.value = cat.name;
  showEditModal.value = true;
  dropdownOpen.value = false;
}
function closeEditModal() {
  showEditModal.value = false;
  editCategory.value = null;
}
async function confirmEditCategory() {
  try {
    await updateCategory(editCategory.value.id, { name: editCategoryName.value });
    showToast("Category updated!", "success");
    await loadCategories();
    // If the edited category is currently selected, update its name in the item
    if (item.value.category === editCategory.value.name) {
      item.value.category = editCategoryName.value;
    }
    closeEditModal();
  } catch (err) {
    showToast("Failed to update category", "error");
  }
}
function openDeleteModal(cat) {
  deleteCategory.value = cat;
  showDeleteModal.value = true;
  dropdownOpen.value = false;
}
function closeDeleteModal() {
  showDeleteModal.value = false;
  deleteCategory.value = null;
}
async function confirmDeleteCategory() {
  try {
    await apiDeleteCategory(deleteCategory.value.id);
    showToast("Category deleted!", "success");
    await loadCategories();
    // If the deleted category was selected, clear it
    if (item.value.category === deleteCategory.value.name) {
      item.value.category = "";
    }
    closeDeleteModal();
  } catch (err) {
    showToast("Failed to delete category", "error");
  }
}
</script>

<style scoped>
.itemEditForm {
  max-width: 500px;
  margin: 50px auto;
  padding: 20px; 
  background: var(--primary-bg);
  color: var(--primary-text);
  border: 1px solid var(--border-color);
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}
.editTitle {
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

/* New styles for custom dropdown */
.categoryDropdown {
  position: relative;
  margin-bottom: 15px;
  width: 100%;
}
.dropdownSelected {
  padding: 10px;
  border: 1px solid var(--border-color);
  border-radius: 4px;
  background: var(--primary-bg);
  color: var(--primary-text);
  cursor: pointer;
  user-select: none;
}
.dropdownArrow {
  float: right;
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
  top: 0; left: 0; right: 0; bottom: 0;
  background: rgba(0,0,0,0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}
.modal {
  background: var(--primary-bg-opposite);
  color: var(--primary-text-opposite);
  padding: 24px;
  border-radius: 8px;
  min-width: 300px;
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
  margin-top: 16px;
  display: flex;
  gap: 12px;
  justify-content: flex-end;
}
</style>
