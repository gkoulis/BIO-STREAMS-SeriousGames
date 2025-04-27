<script setup>
import { ref, defineProps, toRefs, defineEmits, computed, onBeforeMount } from "vue";
import { loadJson } from "@/common/load-json.js";
import { selectRandomQuestions } from "./questions";
import Question from "@/modules/food-quiz-free-mode/views/Question.vue";

const emit = defineEmits(["onReturn"]);

const props = defineProps({
  gameConfig: Object,
});

const { gameConfig } = toRefs(props);

const gameData = ref({
  status: "INIT", // INIT, IN_PROGRESS, COMPLETED
  numberOfQuestions: 10,
  answersCount: 0,
  correctAnswerCount: 0,
  wrongAnswerCount: 0,
  helpsTotalCount: 0,
  helpsUsed: [], // The IDs of the helps used
  helpsUsedCount: 0,
  helpsRemainingCount: 0,
});

// todo add to game data????
const questions = ref([]);
const currentQuestion = ref(-1);

const resetGameData = async () => {
  const languageCode = localStorage.getItem("languageCode");
  const responseJson = await loadJson(`/sr-foodquiz/${languageCode}/content.json`);
  const loadedQuestions = responseJson.questions;

  gameData.value.status = "INIT";
  gameData.value.numberOfQuestions = gameConfig.value.numberOfQuestions;
  gameData.value.answersCount = 0;
  gameData.value.correctAnswerCount = 0;
  gameData.value.wrongAnswerCount = 0;
  gameData.value.helpsTotalCount = HELPS.length;
  gameData.value.helpsUsed = [];
  gameData.value.helpsUsedCount = 0;
  gameData.value.helpsRemainingCount = HELPS.length;

  // +1 for the skip help.
  const temp1 = selectRandomQuestions(loadedQuestions, gameData.value.numberOfQuestions + 1);
  const temp2 = temp1.map((question) => {
    question.answers = question.answers.sort(() => Math.random() - 0.5);
    return question;
  });
  questions.value = temp2;
  currentQuestion.value = 0;

  updateReactivityBaseKey();

  gameData.value.status = "IN_PROGRESS";
};

onBeforeMount(async () => {
  await resetGameData();
});

const checkStatusAndIncrement = (correct) => {
  gameData.value.answersCount++;
  if (correct) {
    gameData.value.correctAnswerCount++;
  } else {
    gameData.value.wrongAnswerCount++;
  }
  if (gameData.value.answersCount === gameData.value.numberOfQuestions) {
    gameData.value.status = "COMPLETED";
    currentQuestion.value = -1;
    return;
  }
  currentQuestion.value++;
};

const handleOnCorrectAnswer = () => {
  checkStatusAndIncrement(true);
};

const handleOnWrongAnswer = () => {
  checkStatusAndIncrement(false);
};

const handleOnHelp = ($event) => {
  if ($event.id === 1) {
    // skip
    // We have always one more so it's safe to increase by one.
    // We also allow only one use for each help.
    currentQuestion.value++;
  } else if ($event.id === 2) {
    // hint
    questions.value[currentQuestion.value].hintToDisplay =
      questions.value[currentQuestion.value].hint;
    alert("NOT YET IMPLEMENTED!");
  } else if ($event.id === 3) {
    // 50-50
    const temp = questions.value[currentQuestion.value];
    const correctAnswer = temp.answers.filter((answer) => answer.correct);
    const incorrectAnswers = temp.answers.filter((answer) => !answer.correct);
    const randomIncorrect = incorrectAnswers[Math.floor(Math.random() * incorrectAnswers.length)];
    temp.answers = [...correctAnswer, randomIncorrect];
    questions.value[currentQuestion.value] = temp;
  } else {
    console.warn($event);
  }
  gameData.value.helpsUsedCount++;
  gameData.value.helpsUsed.push($event.id);
  updateReactivityBaseKey();
};

const reactivityBaseKey = ref(0);
const updateReactivityBaseKey = () => {
  reactivityBaseKey.value++;
};
const reactivityKey = computed(() => {
  return reactivityBaseKey.value + "-" + currentQuestion.value;
});

const HELPS = [
  {
    id: 1,
    text: "Skip",
  },
  {
    id: 2,
    text: "Hint",
  },
  {
    id: 3,
    text: "50-50",
  },
];
const availableHelps = computed(() => {
  return HELPS.filter((help) => !gameData.value.helpsUsed.includes(help.id));
});

const onReturn = () => {
  emit("onReturn");
};
</script>

<template>
  <template v-if="gameData.status === 'INIT'"> </template>
  <template v-else-if="gameData.status === 'IN_PROGRESS'">
    <div class="CommonContainerForSeriousGames--White">
      <div class="mx-auto">
        <div class="grid grid-cols-3 gap-px bg-red/5">
          <div class="bg-white p-2">
            <p class="text-sm/6 font-medium">{{ $t("foodquiz.Questions") }}</p>
            <p class="mt-2 flex items-baseline gap-x-2">
              <span class="text-4xl font-semibold tracking-tight text-blue-500 NumFont1"
                >{{ gameData.answersCount }} / {{ gameData.numberOfQuestions }}</span
              >
            </p>
          </div>
          <div class="bg-white p-2">
            <p class="text-sm/6 font-medium">{{ $t("foodquiz.Score") }} ✅</p>
            <p class="mt-2 flex items-baseline gap-x-2">
              <span class="text-4xl font-semibold tracking-tight text-green-500 NumFont1">{{
                gameData.correctAnswerCount
              }}</span>
              <!--
              <span class="text-sm text-gray-400">mins</span>
              -->
            </p>
          </div>
          <div class="bg-white p-2">
            <p class="text-sm/6 font-medium">{{ $t("foodquiz.Helps Used") }}</p>
            <p class="mt-2 flex items-baseline gap-x-2">
              <span class="text-4xl font-semibold tracking-tight text-orange-500 NumFont1"
                >{{ gameData.helpsUsedCount }} / {{ gameData.helpsTotalCount }}</span
              >
            </p>
          </div>
        </div>
      </div>
    </div>
    <!-- QUESTION -->
    <Question
      :question="questions[currentQuestion]"
      :key="reactivityKey"
      :available-helps="availableHelps"
      v-on:on-correct-answer="handleOnCorrectAnswer"
      v-on:on-wrong-answer="handleOnWrongAnswer"
      v-on:on-help="handleOnHelp"
    />
  </template>
  <template v-else-if="gameData.status === 'COMPLETED'">
    <div>
      <div class="CommonContainerForSeriousGames--White space-y-4">
        <p class="text-3xl text-center">{{ $t("foodquiz.congrats_title") }} 🎉</p>
        <p class="text-xl text-center">{{ $t("foodquiz.congrats_text") }} 🌟</p>
        <div class="mx-auto">
          <div class="grid grid-cols-2 gap-px bg-red/5">
            <div class="bg-white p-2">
              <p class="text-sm/6 font-medium">{{ $t("foodquiz.Questions") }}</p>
              <p class="mt-2 flex items-baseline gap-x-2">
                <span class="text-4xl font-semibold tracking-tight text-blue-500 NumFont1"
                  >{{ gameData.answersCount }} / {{ gameData.numberOfQuestions }}</span
                >
              </p>
            </div>
            <div class="bg-white p-2">
              <p class="text-sm/6 font-medium">{{ $t("foodquiz.Helps Used") }}</p>
              <p class="mt-2 flex items-baseline gap-x-2">
                <span class="text-4xl font-semibold tracking-tight text-orange-500 NumFont1"
                  >{{ gameData.helpsUsedCount }} / {{ gameData.helpsTotalCount }}</span
                >
              </p>
            </div>

            <div class="bg-white p-2">
              <p class="text-sm/6 font-medium">{{ $t("foodquiz.Correct") }} ✅</p>
              <p class="mt-2 flex items-baseline gap-x-2">
                <span class="text-4xl font-semibold tracking-tight text-green-500 NumFont1">{{
                  gameData.correctAnswerCount
                }}</span>
                <!--
                <span class="text-sm text-gray-400">mins</span>
                -->
              </p>
            </div>
            <div class="bg-white p-2">
              <p class="text-sm/6 font-medium">{{ $t("foodquiz.Wrong") }} ❌</p>
              <p class="mt-2 flex items-baseline gap-x-2">
                <span class="text-4xl font-semibold tracking-tight text-red-500 NumFont1">{{
                  gameData.wrongAnswerCount
                }}</span>
                <!--
                <span class="text-sm text-gray-400">mins</span>
                -->
              </p>
            </div>
          </div>
        </div>
        <div class="space-y-4">
          <button @click="resetGameData" class="ActionButton">
            {{ $t("foodquiz.Play again") }} 🌟
          </button>
          <button @click="onReturn" class="ActionButton">{{ $t("foodquiz.Return") }} ⚙️</button>
        </div>
      </div>
    </div>
  </template>
  <template v-else>
    <p>{{ $t("common.Something went wrong") }}</p>
  </template>
</template>

<style scoped>
.ActionButton {
  width: 100%;
  padding: 1em;
  background: #dddddd;
  border: 4px dashed black;
  color: black;
  font-weight: bold;
  font-size: 1.6em;
  border-radius: 12px;
}
</style>
