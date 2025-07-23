<script setup>
import { ref } from "vue";
import { defineComponent, h } from "vue";
import { Dialog, DialogPanel } from "@headlessui/vue";
import { Bars3Icon, XMarkIcon } from "@heroicons/vue/24/outline";

const PUBLIC_PATH = import.meta.env.BASE_URL;

// TODO Get from JSON! (public directory!)
const SERIOUS_GAMES = [
  {
    name: "Food Ninja",
    description:
      "Slice and dice your way to healthy habits! Recognize everyday foods and learn to spot the difference between nutritious and unhealthy choices in a fast-paced, fun-filled adventure.",
    href: "/#/food-ninja-story-mode-index",
    imageSrc: "sr-banner-mock-0001.webp",
  },
  {
    name: "Food Quiz",
    description:
      "Challenge your knowledge about nutrition! Play solo or take on family and friends in a 1 vs. 1 quiz mode that’s as engaging as it is educational.",
    href: "/#/food-quiz-story-mode-index",
    imageSrc: "sr-banner-mock-0002.webp",
  },
  {
    name: "Let’s Move",
    description:
      "Get up and get moving with simple daily exercises! Build your strength and stamina with activities that grow with you, making staying active fun and achievable every day.",
    href: "/#/lets-move",
    imageSrc: "sr-banner-mock-0003.webp",
  },
  {
    name: "Food Treasure",
    description:
      "Enjoy a seamless journey across all games with your personalized avatar! Stay connected and track your progress through every challenge.",
    href: "/#/food-treasure-index",
    imageSrc: "sr-banner-mock-0004.webp",
  },
];

const navigation = {
  main: [
    { name: "About", href: "https://bio-streams.eu/" },
    { name: "Privacy Policy", href: "https://bio-streams.eu/privacy-policy/" },
    { name: "Cookie Policy", href: "https://bio-streams.eu/cookie-policy/" },
  ],
  social: [
    {
      name: "X",
      href: "https://x.com/BioStreams_EU",
      icon: defineComponent({
        render: () =>
          h("svg", { fill: "currentColor", viewBox: "0 0 24 24" }, [
            h("path", {
              d: "M13.6823 10.6218L20.2391 3H18.6854L12.9921 9.61788L8.44486 3H3.2002L10.0765 13.0074L3.2002 21H4.75404L10.7663 14.0113L15.5685 21H20.8131L13.6819 10.6218H13.6823ZM11.5541 13.0956L10.8574 12.0991L5.31391 4.16971H7.70053L12.1742 10.5689L12.8709 11.5655L18.6861 19.8835H16.2995L11.5541 13.096V13.0956Z",
            }),
          ]),
      }),
    },
    {
      name: "LinkedIn",
      href: "https://www.linkedin.com/company/bio-streams",
      icon: defineComponent({
        render: () =>
          h("svg", { fill: "currentColor", viewBox: "0 0 72 72" }, [
            h("g", { fill: "none", "fill-rule": "evenodd" }, [
              h("path", {
                d: "M8,72 L64,72 C68.418278,72 72,68.418278 72,64 L72,8 C72,3.581722 68.418278,-8.11624501e-16 64,0 L8,0 C3.581722,8.11624501e-16 -5.41083001e-16,3.581722 0,8 L0,64 C5.41083001e-16,68.418278 3.581722,72 8,72 Z",
                fill: "currentColor",
                // fill: '#007EBB',
              }),
              h("path", {
                d: "M62,62 L51.315625,62 L51.315625,43.8021149 C51.315625,38.8127542 49.4197917,36.0245323 45.4707031,36.0245323 C41.1746094,36.0245323 38.9300781,38.9261103 38.9300781,43.8021149 L38.9300781,62 L28.6333333,62 L28.6333333,27.3333333 L38.9300781,27.3333333 L38.9300781,32.0029283 C38.9300781,32.0029283 42.0260417,26.2742151 49.3825521,26.2742151 C56.7356771,26.2742151 62,30.7644705 62,40.051212 L62,62 Z M16.349349,22.7940133 C12.8420573,22.7940133 10,19.9296567 10,16.3970067 C10,12.8643566 12.8420573,10 16.349349,10 C19.8566406,10 22.6970052,12.8643566 22.6970052,16.3970067 C22.6970052,19.9296567 19.8566406,22.7940133 16.349349,22.7940133 Z M11.0325521,62 L21.769401,62 L21.769401,27.3333333 L11.0325521,27.3333333 L11.0325521,62 Z",
                fill: "#FFF",
              }),
            ]),
          ]),
      }),
    },
  ],
};

const topNav = [
  // { name: "Link 1", href: "#" },
  // { name: "Link 2", href: "#" },
  // { name: "Link 3", href: "#" },
  // { name: "Link 4", href: "#" },
];

const mobileMenuOpen = ref(false);

import { Disclosure, DisclosureButton, DisclosurePanel } from "@headlessui/vue";
import { MinusSmallIcon, PlusSmallIcon } from "@heroicons/vue/24/outline";

const faqs = [
  {
    question: "What are serious games?",
    answer:
      "Serious games combine fun and learning, helping players develop new skills or knowledge while enjoying themselves.",
  },

  {
    question: "Who are these games for?",
    answer:
      "These games are designed for children and young people, with a focus on promoting healthy eating, exercise, and a balanced lifestyle.",
  },
  {
    question: "Can I play with my family?",
    answer:
      "Absolutely! Our multiplayer quiz mode allows you to challenge friends and family for a fun and interactive learning experience.",
  },
  {
    question: "Do I need special equipment for the Let’s Move game?",
    answer:
      "Not at all! The exercises are simple and can be done anywhere with no equipment required.",
  },
  {
    question: "How do I track my progress across games?",
    answer:
      "Your personalized avatar travels with you across all games, making it easy to stay connected and see your improvement.",
  },
  {
    question: "Are there instructions for beginners?",
    answer:
      "Yes! Every game includes both written and audio instructions to ensure everyone can jump in and start playing right away.",
  },
];
</script>

<template>
  <header class="bg-white">
    <nav
      class="mx-auto flex max-w-7xl items-center justify-between p-6 lg:px-8"
      aria-label="Global"
    >
      <div class="flex flex-1">
        <div class="hidden lg:flex lg:gap-x-12">
          <a
            v-for="item in topNav"
            :key="item.name"
            :href="item.href"
            class="text-sm/6 font-semibold text-gray-900"
            >{{ item.name }}</a
          >
        </div>
        <div class="flex lg:hidden">
          <button
            type="button"
            class="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-700"
            @click="mobileMenuOpen = true"
          >
            <span class="sr-only">Open main menu</span>
            <Bars3Icon class="size-6" aria-hidden="true" />
          </button>
        </div>
      </div>
      <a href="#" class="-m-1.5 p-1.5">
        <span class="sr-only">BIO-STREAMS</span>
        <img
          class="h-14 w-auto"
          :src="`${PUBLIC_PATH}logo/BIO-STREAMS-logo-RGB_BIOSTREAMS-Full-logo-colour-NOSPACE.png`"
          alt=""
        />
      </a>
      <div class="flex flex-1 justify-end">
        <!--
        <a href="#" class="text-sm/6 font-semibold text-gray-900"
          >CTA <span aria-hidden="true">&rarr;</span></a
        >
        -->
      </div>
    </nav>
    <Dialog class="lg:hidden" @close="mobileMenuOpen = false" :open="mobileMenuOpen">
      <div class="fixed inset-0 z-10" />
      <DialogPanel class="fixed inset-y-0 left-0 z-10 w-full overflow-y-auto bg-white px-6 py-6">
        <div class="flex items-center justify-between">
          <div class="flex flex-1">
            <button
              type="button"
              class="-m-2.5 rounded-md p-2.5 text-gray-700"
              @click="mobileMenuOpen = false"
            >
              <span class="sr-only">Close menu</span>
              <XMarkIcon class="size-6" aria-hidden="true" />
            </button>
          </div>
          <a href="#" class="-m-1.5 p-1.5">
            <span class="sr-only">Your Company</span>
            <img
              class="h-8 w-auto"
              src="https://tailwindui.com/plus/img/logos/mark.svg?color=indigo&shade=600"
              alt=""
            />
          </a>
          <div class="flex flex-1 justify-end">
            <a href="#" class="text-sm/6 font-semibold text-gray-900"
              >CTA <span aria-hidden="true">&rarr;</span></a
            >
          </div>
        </div>
        <div class="mt-6 space-y-2">
          <a
            v-for="item in topNav"
            :key="item.name"
            :href="item.href"
            class="-mx-3 block rounded-lg px-3 py-2 text-base/7 font-semibold text-gray-900 hover:bg-gray-50"
            >{{ item.name }}</a
          >
        </div>
      </DialogPanel>
    </Dialog>
  </header>

  <main>
    <div class="bg-white">
      <div class="mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-24 lg:max-w-7xl lg:px-8">
        <div class="text-center mb-12">
          <!--          <h2 class="text-2xl font-bold tracking-tight text-gray-900">Explore Games</h2>-->
          <h3 class="text-4xl font-semibold tracking-tight text-gray-900 sm:text-5xl mb-2">
            Explore Games
          </h3>
          <p>
            Dive into exciting games that teach the importance of good nutrition, exercise, and
            making smart choices every day!
          </p>
        </div>

        <div
          class="mt-6 grid grid-cols-2 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8"
        >
          <div v-for="seriousGame in SERIOUS_GAMES" :key="seriousGame.name" class="group relative">
            <img
              :src="`${PUBLIC_PATH}serious-games/${seriousGame.imageSrc}`"
              :alt="seriousGame.name"
              class="aspect-square w-full rounded-md bg-gray-200 object-cover group-hover:opacity-75 lg:aspect-auto lg:h-80"
            />
            <div class="mt-4 flex justify-between">
              <div>
                <h3 class="font-semibold text-gray-700">
                  <a :href="seriousGame.href">
                    <span aria-hidden="true" class="absolute inset-0" />
                    {{ seriousGame.name }}
                  </a>
                </h3>
                <p class="mt-1 text-sm text-gray-500">{{ seriousGame.description }}</p>
              </div>
              <!--              <p class="text-sm font-medium text-gray-900">{{ product.price }}</p>-->
            </div>
          </div>
        </div>
      </div>
    </div>

  </main>

  <footer class="bg-white">
    <div class="mx-auto max-w-7xl overflow-hidden px-6 py-20 sm:py-24 lg:px-8">
      <nav
        class="-mb-6 flex flex-wrap justify-center gap-x-12 gap-y-3 text-sm/6"
        aria-label="Footer"
      >
        <a
          v-for="item in navigation.main"
          :key="item.name"
          :href="item.href"
          class="text-gray-600 hover:text-gray-900"
          >{{ item.name }}</a
        >
      </nav>
      <div class="mt-16 flex justify-center gap-x-10">
        <a
          v-for="item in navigation.social"
          :key="item.name"
          :href="item.href"
          class="text-gray-600 hover:text-gray-800"
        >
          <span class="sr-only">{{ item.name }}</span>
          <component :is="item.icon" class="size-6" aria-hidden="true" />
        </a>
      </div>
      <p class="mt-10 text-center text-sm/6 text-gray-600">
        &copy; 2024 BIO-STREAMS. All rights reserved.
      </p>
    </div>
  </footer>
</template>
