<script setup>
import { ref, defineProps, toRefs, defineEmits, computed } from "vue";

const emit = defineEmits(["onCorrectAnswer", "onWrongAnswer", "onHelp"]);

const props = defineProps({
  question: Object,
  availableHelps: Object,
});

const { question, availableHelps } = toRefs(props);

const selectedAnswer = ref(null);

const selectAnswer = (answer) => {
  selectedAnswer.value = answer;
};

const confirmAnswer = () => {
  if (selectedAnswer.value === null || selectedAnswer.value === undefined) {
    return;
  }
  if (selectedAnswer.value.correct === true) {
    // alert("correct");
    emit("onCorrectAnswer");
  } else {
    // alert("wrong");
    emit("onWrongAnswer");
  }
};

const onSelectAndConfirmHelp = (help) => {
  // alert("help");
  emit("onHelp", help);
};

const isHelpAvailable = computed(() => availableHelps.value.length > 0);
const displayAvailableHelp = ref(false);
</script>

<template>
  <div class="Question CommonContainerForSeriousGames--White" v-if="question">
    <div class="px-2 py-4 text-center">
      <p class="text-4xl font-bold">{{ question.question }}</p>
    </div>
    <div class="flex flex-col space-y-4">
      <template v-for="(answer, index) in question.answers" :key="answer.id">
        <button class="QuestionButton QuestionButton--Answer" @click="selectAnswer(answer)">
          <small>{{ index + 1 }}.</small> {{ answer.text }}
        </button>
      </template>

      <template v-if="selectedAnswer">
        <button class="QuestionButton QuestionButton--Confirm" @click="confirmAnswer()">
          {{ $t("foodquiz.Confirm Answer") }}
          <small class="italic">{{ selectedAnswer.text }}</small>
        </button>
      </template>

      <div v-if="isHelpAvailable" class="text-center space-y-2">
        <template v-if="displayAvailableHelp">
          <template v-for="help in availableHelps" :key="help.id">
            <button
              class="QuestionButton QuestionButton--Help"
              @click="onSelectAndConfirmHelp(help)"
            >
              <small>{{ $t("foodquiz.Help (noun)") }} {{ help.id }}.</small>
              {{ $t(`foodquiz.${help.text}`) }}
            </button>
          </template>
          <p class="text-2xl underline cursor-pointer" @click="displayAvailableHelp = false">
            {{ $t("foodquiz.hide_available_helps") }}
          </p>
        </template>
        <template v-else>
          <p class="text-2xl underline cursor-pointer" @click="displayAvailableHelp = true">
            {{ $t("foodquiz.need_help_question") }}
          </p>
        </template>
      </div>
      <div v-else class="text-center">
        <p class="text-xl text-slate-400">
          {{ $t("foodquiz.no_available_helps") }}
        </p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.Question {
}

.QuestionButton {
  width: 100%;
  padding: 1em;
  background: pink;
  border: 4px dashed black;
  color: black;
  font-weight: bold;
  font-size: 1.6em;
  border-radius: 12px;
}
.QuestionButton--Answer {
  background-color: #f3ffff;
}
.QuestionButton--Confirm {
  background: linear-gradient(-45deg, #983aa0, #00a6ac, #f7b618);
  background-size: 600%;
  -webkit-animation: anime 16s linear infinite;
  animation: anime 16s linear infinite;
}
.QuestionButton--Help {
  background-color: #ffe8d7;
}

@-webkit-keyframes anime {
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
}
@keyframes anime {
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
}
</style>
