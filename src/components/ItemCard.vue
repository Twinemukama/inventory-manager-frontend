<template>
  <div class="card">
    <div>
      <h2 class="cardTitle">{{ item.name || 'Unnamed Item' }}</h2>
      <span class="quantity">Qty: {{ item.quantity ?? 'N/A' }} | Price: ${{ item.price ?? 'N/A' }}</span>
    </div>
    <div class="cardActions">
      <span class="cardDesc">{{ item.description || 'No description provided.' }}</span>
      <div class="cardButtons">
        <button @click="goToEdit" class="editBtn">✏️</button>
        <button @click="goToDelete" class="deleteBtn">🗑️</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from "vue-router";

const props = defineProps({ item: Object });
const router = useRouter();

function goToEdit() {
  router.push(`/items/${props.item.id}/edit`);
}

function goToDelete() {
  router.push(`/items/${props.item.id}/delete-confirm`);
}
</script>

<style scoped>
.card {
  width:auto;
  height: 120px;
  border: 1px solid var(--border-color);
  border-radius: 10px;
  background: var(--primary-bg);
  padding: 5px;

}
.card:hover {
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  cursor: pointer;
}
.cardTitle {
  font-size: 1.2em;
  margin-bottom: 5px;
  color: var(--primary-accent);
  width: 50%;
}
.cardTitle:hover {
  color: var(--primary-text);
  text-decoration: underline;
}
.cardTitle:visited {
  color: var(--primary-text);
}
.quantity {
  font-weight: bold;
  margin-bottom: 10px;
}
.cardDesc {
  color: var(--primary-text);
}
.cardActions {
  display: flex;
  justify-content: space-between;
  height: 30px;
  align-items: center;
  padding: 10px 0;
  
}
.editBtn, .deleteBtn {
  background-color: var(--primary-accent);
  color: white;
  border: none;
  padding: 5px 10px;
  border-radius: 3px;
  cursor: pointer;
}
.editBtn:hover{
  background-color: #0056b3;
}
.deleteBtn {
  background-color: #e74c3c;
}
.deleteBtn:hover {
  background-color: #c0392b;
}
</style>