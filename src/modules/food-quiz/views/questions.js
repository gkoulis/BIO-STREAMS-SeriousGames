import cloneDeep from "lodash/cloneDeep";

const selectRandomQuestions = (questions, max) => {
  if (max > questions.length) {
    console.error("X cannot be greater than the number of available questions.");
    return [];
  }

  const selectedQuestions = [];
  const usedIndices = new Set();

  while (selectedQuestions.length < max) {
    const randomIndex = Math.floor(Math.random() * questions.length);
    if (!usedIndices.has(randomIndex)) {
      selectedQuestions.push(questions[randomIndex]);
      usedIndices.add(randomIndex);
    }
  }

  return cloneDeep(selectedQuestions);
};

export { selectRandomQuestions };
