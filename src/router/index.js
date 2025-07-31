import { createRouter, createWebHashHistory } from "vue-router";
import HomeView from "../views/HomeView.vue";

const router = createRouter({
  // createWebHistory
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "home",
      component: HomeView,
    },
    {
      path: "/home-legacy",
      name: "home-legacy",
      component: () => import("../views/HomeLegacyView.vue"),
    },
    {
      path: "/marketplace",
      name: "marketplace",
      component: () => import("../modules/marketplace/views/MarketplaceHomeView.vue"),
    },
    {
      path: "/food-ninja-free-mode",
      name: "food-ninja-free-mode",
      component: () =>
        import("../modules/food-ninja-free-mode/views/FoodNinjaFreeModeSeriousGameView.vue"),
    },
    {
      path: "/food-ninja-story-mode-index",
      name: "food-ninja-story-mode-index",
      component: () =>
        import("../modules/food-ninja-story-mode/views/FoodNinjaStoryModeSeriousGameIndexView.vue"),
    },
    {
      path: "/food-ninja-story-mode-gameplay/:themeId",
      name: "food-ninja-story-mode-gameplay",
      component: () =>
        import(
          "../modules/food-ninja-story-mode/views/FoodNinjaStoryModeSeriousGameGameplayView.vue"
        ),
    },
    {
      path: "/food-quiz-free-mode",
      name: "food-quiz-free-mode",
      component: () =>
        import("@/modules/food-quiz-free-mode/views/FoodQuizFreeModeSeriousGameView.vue"),
    },
    {
      path: "/food-quiz-story-mode-index",
      name: "food-quiz-story-mode-index",
      component: () =>
        import("../modules/food-quiz-story-mode/views/FoodQuizStoryModeSeriousGameIndexView.vue"),
    },
    {
      path: "/food-quiz-story-mode-gameplay/:themeId",
      name: "food-quiz-story-mode-gameplay",
      component: () =>
        import(
          "../modules/food-quiz-story-mode/views/FoodQuizStoryModeSeriousGameGameplayView.vue"
        ),
    },
    {
      path: "/lets-move",
      name: "lets-move",
      component: () => import("../modules/lets-move/views/LetsMoveView.vue"),
    },
    {
      path: "/food-treasure-index",
      name: "food-treasure-index",
      component: () =>
        import("../modules/food-treasure/views/FoodTreasureSeriousGameIndexView.vue"),
    },
    {
      path: "/food-treasure-gameplay/:themeId",
      name: "food-treasure-gameplay",
      component: () =>
        import("../modules/food-treasure/views/FoodTreasureSeriousGameGameplayView.vue"),
    },
    {
      path: "/food-treasure-qr-listing",
      name: "food-treasure-qr-listing",
      component: () =>
        import("../modules/food-treasure/views/FoodTreasureSeriousGameQrListingView.vue"),
    },
  ],
});

export default router;
