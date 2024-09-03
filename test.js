// 1. Declare necessary variables

//- constants
//-global variables
// 2. Fetch Quiz Questions
// 3. Audio Elements
// 4. Show module Functions
// 5. Start Quiz Functions
// 6. Check Time Functions
// 7. Stop Quiz Function
// 8. Calculate Score Function
// 9. Reset Function

// 100 seconds
const QUIZ_TIME = 5;
// Question Points
const QUIZ_QUESTION_POINTS = 1;
// Pass percentage
const PASS_PERCENTAGE = 50;

// Global variables
let quiz = [];
let timer = 0;
let setInterValId = 0;

const timerAudio = document.getElementById("timerAudio");
const cheerAudio = document.getElementById("cheerAudio");
const booAudio = document.getElementById("booAudio");

async function fetchQuizQuestion() {
  try {
    const response = await fetch("quiz.json");
    const data = await response.json();
    quiz = data.questions; // Update to match your JSON structure
  } catch (error) {
    console.error("Error fetching quiz data:", error);
  }
}

// Fetching the quiz questions
fetchQuizQuestion();

function showModule(moduleName) {
  // Get all the module class elements
  const moduleList = document.querySelectorAll(".module");
  for (const m of moduleList) {
    // Check for the id and match it with moduleName
    if (m.id === moduleName) {
      m.style.display = "block";
    } else {
      m.style.display = "none";
    }
  }
}

showModule("start-module");

const startQuiz = () => {
  showModule("quiz-module");

  // Shuffle and select 10 random questions
  const randomQuiz = shuffleArray(quiz).slice(0, 5);

  const questionUL = document.getElementById("quizList");
  questionUL.innerHTML = ""; // Clear previous questions

  randomQuiz.forEach((quizItem, quizIndex) => {
    const questionList = document.createElement("li");
    questionList.classList.add("quiz-question");

    const questionSpan = document.createElement("span");
    questionSpan.innerText = quizItem.question;

    const optionsUL = document.createElement("ul");
    optionsUL.classList.add("quiz-answer");

    quizItem.options.forEach((option, optionIndex) => {
      const optionList = document.createElement("li");

      const inputElement = document.createElement("input");
      inputElement.id = `q-${quizIndex}-a-${optionIndex}`;
      inputElement.type = "radio";
      inputElement.name = `question-${quizIndex}`;

      const inputLabel = document.createElement("label");
      inputLabel.setAttribute("for", `q-${quizIndex}-a-${optionIndex}`);
      inputLabel.innerText = option;

      optionList.append(inputElement);
      optionList.append(inputLabel);
      optionsUL.append(optionList);
    });

    questionList.append(questionSpan);
    questionList.append(optionsUL);
    questionUL.append(questionList);
  });

  timer = QUIZ_TIME;
  setInterValId = setInterval(checkTimer, 1000);
};

function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]]; // Swap elements
  }
  return array;
}

const checkTimer = () => {
  const timerElement = document.getElementById("timer");
  timerElement.innerText = timer;
  timer -= 1;
  timerAudio.play();

  if (timer < 0) {
    stopQuiz();
  }
};

const stopQuiz = () => {
  clearInterval(setInterValId);
  showModule("score-module");
  calculateResult();
  const timerElement = document.getElementById("timer");
  timerElement.innerText = "--";
};

const calculateResult = () => {
  const selectedOptionList = document.querySelectorAll(
    'input[type="radio"]:checked'
  );
  let score = 0;
  let result = "Failed";

  selectedOptionList.forEach((item) => {
    const questionNo = item.id.split("-")[1];
    const answerSelected = item.id.split("-")[3];

    if (quiz[questionNo].answer === quiz[questionNo].options[answerSelected]) {
      score += QUIZ_QUESTION_POINTS;
    }
  });

  const resultPercent = (score / (QUIZ_QUESTION_POINTS * 10)) * 100; // 10 questions

  if (resultPercent >= PASS_PERCENTAGE) {
    result = "Passed";
    cheerAudio.play();
  } else {
    booAudio.play();
  }

  const scoreElement = document.getElementById("score");
  scoreElement.innerText = score;

  const resultElement = document.getElementById("result");
  resultElement.innerText = result;
};

const resetQuiz = () => {
  // const timerElement = document.getElementById("timer");
  // timerElement.innerText = "--";
  showModule("quiz-module");
};
