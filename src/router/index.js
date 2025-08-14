import { createRouter, createWebHistory } from "vue-router";
import Home from "../views/Home.vue";
import Login from "../views/Login.vue";
import Signup from "../views/Signup.vue";
import ItemList from "../views/ItemList.vue";
import ItemForm from "../views/ItemForm.vue";
import NewItemForm from "../components/NewItemForm.vue";
import DeleteItemConfrim from "../components/DeleteConfirm.vue"
import NewCategory from "../components/NewCategory.vue";


const routes = [
    {
        path: "/",
        name: "Home",
        component: Home,
    },
    {
        path: "/login",
        name: "Login",
        component: Login,
    },
    {
        path: "/signup",
        name: "Signup",
        component: Signup,
    },
    {
        path: "/items",
        name: "ItemList",
        component: ItemList,
        meta: { requiresAuth: true },
    },
    {
        path: "/items/:id/edit",
        name: "ItemEdit",
        component: ItemForm,
        meta: { requiresAuth: true },
    },
    {
        path: "/items/new",
        name: "NewItem",
        component: NewItemForm,
        meta: { requiresAuth: true },
    },
    {
        path:"/items/:id/delete-confirm",
        name: "DeleteConfirm",
        component: DeleteItemConfrim,
        meta: { requiresAuth: true },
    },
    {
        path: "/categories/new",
        name: "NewCategory",
        component: NewCategory,
        meta: { requiresAuth: true },
    }
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

router.beforeEach((to, from, next) => {
  const token = localStorage.getItem("token");
  const isProtected = to.meta.requiresAuth;

  if (isProtected && !token) {
    return next("/login");
  }

  next();
});

export default router;