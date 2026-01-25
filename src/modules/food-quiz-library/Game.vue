<script setup>
import {
  ref,
  defineProps,
  toRefs,
  defineEmits,
  computed,
  onBeforeMount,
  onBeforeUnmount,
} from "vue";
import cloneDeep from "lodash/cloneDeep";
import Question from "./Question.vue";
import { formatDuration } from "@/common/format-duration";

const emit = defineEmits(["onReturn", "onCompleted"]);

const props = defineProps({
  questions: Array,
  showAfterGameActions: Boolean,
});

const { questions } = toRefs(props); // I do not listen on parent changes. Changes do not have an effect on here.
const QUESTIONS = cloneDeep(questions.value);
const currentQuestion = ref(-1);

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
  // Scoring + timing fields
  scorePoints: 0, // final score I will submit
  startedAtIso: null,
  endedAtIso: null,
  durationText: "00:00:00",
  durationMs: 0,
});

// Duration tracking helpers.
const gameStartMsRef = ref(null);
let durationIntervalId = null;

function stopTimer() {
  if (durationIntervalId) {
    clearInterval(durationIntervalId);
    durationIntervalId = null;
  }
}
function startTimer() {
  stopTimer();
  gameStartMsRef.value = Date.now();
  gameData.value.startedAtIso = new Date().toISOString();
  gameData.value.endedAtIso = null;
  gameData.value.durationMs = 0;
  gameData.value.durationText = "00:00:00";

  durationIntervalId = setInterval(() => {
    if (!gameStartMsRef.value) return;
    const ms = Date.now() - gameStartMsRef.value;
    gameData.value.durationMs = ms;
    gameData.value.durationText = formatDuration(ms);
  }, 250);
}

// Simple scoring formula.
function calculateScore(gameData, penaltyPerHelp = 2) {
  const { numberOfQuestions, correctAnswerCount, helpsUsedCount } = gameData;

  if (numberOfQuestions === 0) {
    return 0;
  }

  // 1. Percentage of correct answers
  const percentageCorrect = (correctAnswerCount / numberOfQuestions) * 100;

  // 2. Help penalty
  const helpPenalty = helpsUsedCount * penaltyPerHelp;

  // 3. Final score (never below 0 or above 100)
  const finalScore = Math.max(0, Math.min(100, Math.round(percentageCorrect - helpPenalty)));

  return finalScore;
}
function recomputeScore() {
  gameData.value.scorePoints = calculateScore(gameData.value);
}

// Scoring formula 1.
/*
const POINTS_PER_CORRECT = 100;
const PENALTY_PER_WRONG = 50;
const PENALTY_PER_HELP = 25;
function recomputeScore() {
  const raw =
    gameData.value.correctAnswerCount * POINTS_PER_CORRECT -
    gameData.value.wrongAnswerCount * PENALTY_PER_WRONG -
    gameData.value.helpsUsedCount * PENALTY_PER_HELP;

  gameData.value.scorePoints = Math.max(0, raw);
}
*/

const resetGameData = async () => {
  gameData.value.status = "INIT";
  gameData.value.numberOfQuestions = QUESTIONS.length;
  gameData.value.answersCount = 0;
  gameData.value.correctAnswerCount = 0;
  gameData.value.wrongAnswerCount = 0;
  gameData.value.helpsTotalCount = HELPS.length;
  gameData.value.helpsUsed = [];
  gameData.value.helpsUsedCount = 0;
  gameData.value.helpsRemainingCount = HELPS.length;

  // Reset score + start timer.
  gameData.value.scorePoints = 0;
  startTimer(); // ⏱️🆕

  currentQuestion.value = 0;

  updateReactivityBaseKey();

  gameData.value.status = "IN_PROGRESS";
};

onBeforeMount(async () => {
  await resetGameData();
});

onBeforeUnmount(() => {
  stopTimer();
});

const finalizeGameTiming = () => {
  stopTimer(); // freeze final duration + end time

  const finalMs = gameStartMsRef.value
    ? Date.now() - gameStartMsRef.value
    : gameData.value.durationMs;
  gameData.value.durationMs = finalMs;
  gameData.value.durationText = formatDuration(finalMs);
  gameData.value.endedAtIso = new Date().toISOString();
};

const checkStatusAndIncrement = (correct) => {
  gameData.value.answersCount++;
  if (correct) {
    gameData.value.correctAnswerCount++;
  } else {
    gameData.value.wrongAnswerCount++;
  }
  recomputeScore();
  if (gameData.value.answersCount === gameData.value.numberOfQuestions) {
    gameData.value.status = "COMPLETED";
    currentQuestion.value = -1;
    finalizeGameTiming();
    onCompleted();
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
    gameData.value.numberOfQuestions = gameData.value.numberOfQuestions - 1;
  } else if ($event.id === 2) {
    // hint
    QUESTIONS[currentQuestion.value].hintToDisplay = QUESTIONS[currentQuestion.value].hint;
    alert("NOT YET IMPLEMENTED!");
  } else if ($event.id === 3) {
    // 50-50
    const temp = QUESTIONS[currentQuestion.value];
    const correctAnswer = temp.answers.filter((answer) => answer.correct);
    const incorrectAnswers = temp.answers.filter((answer) => !answer.correct);
    const randomIncorrect = incorrectAnswers[Math.floor(Math.random() * incorrectAnswers.length)];
    temp.answers = [...correctAnswer, randomIncorrect];
    QUESTIONS[currentQuestion.value] = temp;
  } else {
    console.warn($event);
  }
  gameData.value.helpsUsedCount++;
  gameData.value.helpsUsed.push($event.id);
  recomputeScore();
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

const onCompleted = () => {
  emit("onCompleted", {
    gameData: cloneDeep(gameData.value),
  });
};

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
            <p class="text-sm/6 font-medium">{{ $t("foodquiz.Score") }} 🎯</p>
            <p class="mt-2 flex items-baseline gap-x-2">
              <span class="text-4xl font-semibold tracking-tight text-green-500 NumFont1">
                {{ gameData.scorePoints }}
              </span>
              <!--
              <span class="text-sm text-gray-400"> {{ gameData.durationText }} ⏱️ </span>
              -->
            </p>
            <!--
            <p class="text-sm/6 font-medium">{{ $t("foodquiz.Score") }} ✅</p>
            <p class="mt-2 flex items-baseline gap-x-2">
              <span class="text-4xl font-semibold tracking-tight text-green-500 NumFont1">{{
                gameData.correctAnswerCount
              }}</span>
              <span class="text-sm text-gray-400">mins</span>
            </p>
            -->
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
        <div class="grid grid-cols-3 gap-px bg-red/5">
          <div class="bg-white p-2">
            <p class="text-sm/6 font-medium">⏱️</p>
            <p class="mt-2 flex items-baseline gap-x-2">
              <span class="text-4xl font-medium tracking-tight text-blue-400 NumFont1">{{
                gameData.durationText
              }}</span>
            </p>
          </div>
          <div class="bg-white p-2">
            <p class="text-sm/6 font-medium">{{ $t("foodquiz.Correct") }} ✅</p>
            <p class="mt-2 flex items-baseline gap-x-2">
              <span class="text-4xl font-semibold tracking-tight text-green-500 NumFont1">{{
                gameData.correctAnswerCount
              }}</span>
            </p>
          </div>
          <div class="bg-white p-2">
            <p class="text-sm/6 font-medium">{{ $t("foodquiz.Wrong") }} ❌</p>
            <p class="mt-2 flex items-baseline gap-x-2">
              <span class="text-4xl font-semibold tracking-tight text-red-500 NumFont1">
                {{ gameData.wrongAnswerCount }}
              </span>
            </p>
          </div>
        </div>
      </div>
    </div>
    <!-- QUESTION -->
    <Question
      :question="QUESTIONS[currentQuestion]"
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
        <div class="space-y-4" v-if="showAfterGameActions">
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
