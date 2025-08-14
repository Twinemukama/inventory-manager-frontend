<template>
  <div class="itemlist-container">
    <div class="titlearea">
      <h1 class="title">Inventory Items</h1>
      <div style="display: flex; align-items: center; gap: 0.5rem;">
        <!-- Search Bar -->
        <input
          v-model="searchTerm"
          type="text"
          placeholder="Search items..."
          class="searchInput"
        />

        <!-- View toggle buttons -->
        <button
          class="toggleViewBtn"
          :class="{ active: isFullWidth }"
          @click="isFullWidth = true"
          title="Full Width"
          aria-label="Full Width"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <rect x="3" y="5" width="18" height="14" rx="2" fill="#fff" stroke="#222" stroke-width="2" />
          </svg>
        </button>
        <button
          class="toggleViewBtn"
          :class="{ active: !isFullWidth }"
          @click="isFullWidth = false"
          title="Multi-Column"
          aria-label="Multi-Column"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <rect x="3" y="5" width="7" height="7" rx="1" fill="#fff" stroke="#222" stroke-width="2" />
            <rect x="14" y="5" width="7" height="7" rx="1" fill="#fff" stroke="#222" stroke-width="2" />
            <rect x="3" y="14" width="7" height="7" rx="1" fill="#fff" stroke="#222" stroke-width="2" />
            <rect x="14" y="14" width="7" height="7" rx="1" fill="#fff" stroke="#222" stroke-width="2" />
          </svg>
        </button>
        <button
          v-if="items.length > 0"
          class="addItem"
          @click="$router.push('/items/new')"
        >
          Add item
        </button>
      </div>
    </div>

    <div v-if="loading">Loading...</div>
    <div v-else-if="items.length === 0" class="noItems">
      No items found.
      <button class="addItem" @click="$router.push('/items/new')">Add item</button>
    </div>
    <div v-else :class="['itemsGrid', { fullWidthGrid: isFullWidth }]">
      <ItemCard
        v-for="item in items"
        :key="item.id"
        :item="item"
        @edit="editItem"
        @delete="removeItem"
      />
    </div>

    <div v-if="!searchTerm && total > limit" class="pagination">
      <button :disabled="page === 1" @click="prevPage"><<</button>
      <span>Page {{ page }} of {{ Math.ceil(total / limit) }}</span>
      <button :disabled="page === Math.ceil(total / limit)" @click="nextPage">>></button>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref, watch } from "vue";
import { fetchItems, deleteItem } from "../api/items";
import ItemCard from "../components/ItemCard.vue";
import { showToast } from "../helpers/toast";
import { useRouter, useRoute } from "vue-router";

const allItems = ref([]); // For full list when searching
const items = ref([]);
const searchTerm = ref("");
const loading = ref(false);
const isFullWidth = ref(false);
const total = ref(0);
const page = ref(1);
const limit = ref(6);

const router = useRouter();
const route = useRoute();

// Fetch paginated items (default mode)
async function loadItems() {
  loading.value = true;
  try {
    const data = await fetchItems(page.value, limit.value);
    items.value = data.items;
    total.value = data.total;
  } catch (err) {
    showToast("Failed to load items", "error");
  } finally {
    loading.value = false;
  }
}

// Fetch ALL items once for searching
async function loadAllItems() {
  try {
    const data = await fetchItems(); // Make this return all without pagination
    allItems.value = data.items || data; // Adjust depending on API response
  } catch (err) {
    console.error("Failed to load full items list", err);
  }
}

async function removeItem(id) {
  if (!confirm("Are you sure you want to delete this item?")) return;
  try {
    await deleteItem(id);
    showToast("Item deleted", "success");
    if (searchTerm.value) {
      filterItems();
    } else {
      await loadItems();
      await loadAllItems();
    }
  } catch (err) {
    showToast("Failed to delete item", "error");
  }
}

function editItem(item) {
  router.push({ name: "EditItem", params: { id: item.id } });
}

// Debounce helper
function debounce(fn, delay) {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
}

// Filter items with debounce
const filterItems = debounce(() => {
  const term = searchTerm.value.trim().toLowerCase();

  if (term === "") {
    // Search cleared → show paginated list
    loadItems();
    return;
  }

  // Search active → show full filtered list, no pagination
  items.value = allItems.value.filter(
    (item) =>
      item.name.toLowerCase().includes(term) ||
      (item.description && item.description.toLowerCase().includes(term))
  );
}, 300);

watch(searchTerm, filterItems);

onMounted(async () => {
  await loadItems();
  await loadAllItems();
});

watch(
  () => route.fullPath,
  () => {
    loadItems();
  }
);

// Pagination
function nextPage() {
  if (page.value * limit.value < total.value) {
    page.value++;
    loadItems();
  }
}
function prevPage() {
  if (page.value > 1) {
    page.value--;
    loadItems();
  }
}
</script>


<style scoped>
.titlearea {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}
.title {
  font-size: 2rem;
  margin-right: 30px;
}
.searchInput {
  padding: 0.5rem;
  border: 1px solid var(--primary-accent);
  border-radius: 20px;
  flex: 1;
}
.toggleViewBtn.active,
.toggleViewBtn:hover {
  background: var(--primary-bg-opposite);
}
.toggleViewBtn {
  background: none;
  border: none;
  cursor: pointer;
  padding: 8px;
  font-size: 1.5em;
  transition: color 0.3s;
  border-radius: 5px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}
.addItem {
  padding: 10px 20px;
  background: none;
  color: var(--primary-text);
  border: 1px solid var(--primary-accent);
  border-radius: 5px;
  cursor: pointer;
}
.addItem:hover {
  background-color: var(--primary-accent);
}
.noItems {
  text-align: center;
  color: var(--primary-text);
  font-size: 1.2em;
  margin-top: 50px;
}
.itemsGrid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1rem;
  width: 90vw;
  box-sizing: border-box;
}
.fullWidthGrid {
  grid-template-columns: 1fr !important;
  width: 90vw;
}
.pagination {
  margin-top: 1.5rem;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1rem;
}
.pagination button {
  padding: 0.5rem 0.8rem;
  background: var(--primary-bg);
  color: var(--primary-text);
  border: 1px solid var(--primary-text);
  border-radius: 5px;
  cursor: pointer;
  /* margin-bottom: 10px; */
}
</style>
