const questionsData = [
    {
        question: "Если человека назвали мордофиля, то это…",
        answers: [
            {
                text: "Значит, что он тщеславный.",
                correct: true,
                explanation: "Ну зачем же вы так... В Этимологическом словаре русского языка Макса Фасмера поясняется, что мордофилей называют чванливого человека."
            },
            {
                text: "Значит, что у него лицо как у хряка.",
                correct: false
            },
            {
                text: "Значит, что чумазый.",
                correct: false
            }
        ]
    },
    {
        question: "«Да этот Ярополк — фуфлыга!» Что не так с Ярополком?",
        answers: [
            {
                text: "Он маленький и невзрачный.",
                correct: true,
                explanation: "Словарь Даля говорит, что фуфлыгой называют невзрачного малорослого человека."
            },
            {
                text: "Он тот еще алкоголик.",
                correct: false
            },
            {
                text: "Он не держит свое слово.",
                correct: false
            }
        ]
    },
    {
        question: "Если человека прозвали пятигузом, значит, он…",
        answers: [
            {
                text: "Не держит слово.",
                correct: true,
                explanation: "Согласно Этимологическому словарю Макса Фасмера, пятигуз — это ненадежный человек."
            },
            {
                text: "Изменяет жене",
                correct: false
            },
            {
                text: "Без гроша в кармане.",
                correct: false
            }
        ]
    },
    {
        question: "Кто такой шлындра?",
        answers: [
            {
                text: "Обманщик.",
                correct: false
            },
            {
                text: "Нытик.",
                correct: false
            },
            {
                text: "Бродяга.",
                correct: true,
                explanation: "В Словаре русского арго «шлындрать» означает бездельничать, шляться."
            }
        ]
    }
];

let shuffledQuestions = shuffleArray([...questionsData]);
let currentQuestionIndex = 0;
let correctAnswers = 0;

const startButtonContainer = document.getElementById("start-quiz-container")
const startButton = document.getElementById('start-quiz-button');
const header = document.getElementById('header');
const getAnswerStatus = answerData => answerData.correct ? 'correct' : 'wrong';

startButton.addEventListener('click', () => {
    header.innerHTML = 'Вопросы:';
    startButtonContainer.remove();
    showNextQuestion();
});

function showNextQuestion() {
    const questionData = shuffledQuestions[currentQuestionIndex];

    const questionRow = document.createElement('div');
    questionRow.className = 'question-row';

    const question = document.createElement('div');
    question.className = 'question';
    question.innerText = `${currentQuestionIndex + 1}. ${questionData.question}`;
    questionRow.appendChild(question);

    const shuffledAnswersData = shuffleArray(questionData.answers)

    shuffledAnswersData.forEach(answerData => {
        const answer = document.createElement('div');
        answer.classList.add('answer');
        answer.innerText = answerData.text;

        answer.addEventListener('click', () => selectAnswer(questionRow, answerData, answer));

        questionRow.appendChild(answer);
    });

    question.onclick = () => {
        if (currentQuestionIndex < shuffledQuestions.length)
            return;

        questionRow
            .querySelectorAll('.answer')
            .forEach((answer, index) => {
                // скрытие всех ответов
                if (answer.style.display !== 'none') {
                    answer.style.display = 'none';
                    return;
                }

                // раскрытие всех ответов
                let answerData = shuffledAnswersData[index];

                answer.className = 'answer';
                answer.classList.add(getAnswerStatus(answerData));
                answer.style.display = 'block';

                if (answerData.correct) {
                    showExplanation(answerData.explanation, answer);
                }
            });
    };

    const questionsContainer = document.getElementById('questions-container');
    questionsContainer.appendChild(questionRow);
}

function selectAnswer(questionRow, answerData, answerContainer) {
    const question = questionRow.querySelector('.question');

    const rowAnswers = questionRow.querySelectorAll('.answer');
    rowAnswers.forEach(answer => answer.style.pointerEvents = 'none');

    let resulStatus = getAnswerStatus(answerData);
    question.classList.add(resulStatus);
    answerContainer.classList.add(resulStatus);

    if (answerData.correct) {
        showExplanation(answerData.explanation, answerContainer);
        correctAnswers++;
    }

    answerContainer.classList.add('shake');

    setTimeout(() => {
        rowAnswers.forEach(answerEl => {
            answerEl.classList.add('slide-down');
        });

        setTimeout(() => {
            rowAnswers.forEach(answerEl => {
                answerEl.style.display = 'none';
            });
        }, 2000);
    }, 2000);

    setTimeout(() => {
        currentQuestionIndex++;

        currentQuestionIndex >= shuffledQuestions.length
            ? showResults()
            : showNextQuestion();
    }, 5000);
}

function showResults() {
    header.innerHTML = 'Викторина закончилась';

    let resultContainer = document.getElementById('result');
    resultContainer.innerHTML = `Вы ответили правильно на ${correctAnswers} из ${shuffledQuestions.length} вопросов.`;
}

function showExplanation(explanation, AnswerContainer) {
    const isExplanationShowed = AnswerContainer.querySelectorAll('p').length === 0

    if (isExplanationShowed) {
        const explanationElement = document.createElement('p');
        explanationElement.innerText = explanation;
        AnswerContainer.appendChild(explanationElement);
    }
}

function shuffleArray(array) {
    return array.sort(() => Math.random() - 0.5);
}
