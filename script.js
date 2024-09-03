// 1. Declare necessary varibles
// 2

//100 seconds
const QUIZ_TIME = 100;
//Questions Points
const QUIZ_QUESTION_POINTS = 1;
// Pass Percentage
const PASS_PERCENT = 75 ;

//Global Variable

let quiz = [];
let timer = 0;
let setIntervalId = 0;

let timerAudio = document.getElementById("timerAudio");
let cheerAudio = document.getElementById("cheerAudio");
let booAudio = document.getElementById("booAudio");

async function fetchQuizQuestion() {
    const response = await fetch ("quiz.json");
    const data = await response.json();
    quiz = data.questions;
    // allQuestions = data.quiz;
    // randomQuestions = allQuestions.sort(() => Math.random() - 0.5);
    // quiz = randomQuestions.slice(0,5);
    console.log(quiz);  
    // showModule("start-module");
}

// fetching the Quiz Question
fetchQuizQuestion();

function showModule(moduleNmae){
    //get all the module class elements
    const moduleList = document.querySelectorAll(".module");
    for (m of moduleList){
        //check for the id and match it with moduleNmae
        if (m.id == moduleNmae){
            m.style.display = "block";
        }
        else{
            m.style.display = "none";
        }
    }
}
// showModule("start-module");

showModule("start-module");


const startQuiz = () =>{
    console.log("CLICK");
    //show the quiz module
    showModule("quiz-module");
    
    
    const questionUL = document.getElementById("quizList");
    questionUL.innerText = "";
    
    for (quizIndex in quiz){
        console.log(quiz[quizIndex]);
        const questionList = document.createElement("li");
        questionList.classList.add("quiz-question");
        
        const questionSpan = document.createElement("span");
        questionSpan.innerText = quiz[quizIndex].question;
        
        
        const optionUL = document.createElement("ul");
        optionUL.classList.add("quiz-answer");
        
        for (optionIndex in quiz[quizIndex].options){
            // console.log(option);
            const optionList = document.createElement("li");
            
            const inputElement  = document.createElement("input");
            inputElement.id ="q-" +quizIndex + "-a-" + optionIndex;
            inputElement.type = 'radio';
            inputElement.name = "question" + quizIndex;
            
            const inputLabel = document.createElement("label");
            inputLabel.setAttribute("for", "q-" +quizIndex + "-a-" +optionIndex);
            inputLabel.innerText = quiz[quizIndex].options[optionIndex];
            
            optionList.append(inputElement);
            optionList.append(inputLabel);
            optionUL.append(optionList);
        }
        questionList.append(questionSpan);
        questionList.append(optionUL);
        questionUL.append(questionList);
    };
    timer = QUIZ_TIME;
    setIntervalId = setInterval(checkTimer, 1000);
};

const checkTimer = () =>{
    let timerElment = document.getElementById("timer");
    timerElment.innerText = timer;
    timer -= 1;
    console.log(timer);
    timerAudio.play();
    
    if (timer <=0){
        
        stopQuiz();
    }
};

const stopQuiz = () => {
    console.log("stop Quiz");
    clearInterval(setIntervalId);
    showModule("score-module");
    calculateResult();
    const timerElment = document.getElementById("timer");
    timerElment.innerText = "--";
};

const calculateResult = () => {
    const selectedOptionList = document.querySelectorAll('input[type="radio"]:checked');
    let score = 0 ;
    let result = "Failed";
    for (item of selectedOptionList) {
        console.log(item.id);
        questionNo = item.id.split("-")[1];
        answerSelected = item.id.split("-")[3];
        
        // console.log(questionNo,answerSelected);
        
        // console.log("correct:", quiz[questionNo].answer);
        
        // onsole.log("selected:", quiz[questionNo].options[answerSelected]);
        
        if (quiz[questionNo].answer === quiz[questionNo].options[answerSelected])
            {
            score = score + QUIZ_QUESTION_POINTS;
        }
        
    }
    
    const resultPercent =  (score / (QUIZ_QUESTION_POINTS * quiz.length)) * 100;
    if (resultPercent>=PASS_PERCENT){

        result = "PASSED";
        cheerAudio.play();
    }
    else {
        booAudio.play();
    }
    
    console.log("result percent " + resultPercent);
    const scoreElement = document.getElementById("score");
    scoreElement.innerText = score;
    
    const resultElement = document.getElementById("result");
    resultElement.innerText = result;
};

const resetQuiz = () => {
    console.log("reset");
    //reset timer
    // const timerElment = document.getElementById("timer");
    // timerElment.innerText = "--";

    showModule("start-module");
}