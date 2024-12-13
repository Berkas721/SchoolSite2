const app = document.getElementById('app');

const dropZona = document.getElementById('drop-zona');
const tableZona  = document.getElementById('table-kettlebells');
const scalesZona = document.getElementById('bowl-kettlebells');
const trashZona = document.getElementById('trash');

const leftBowlLeg = document.getElementById('left-bowl-leg');
const rightBowlLeg = document.getElementById('right-bowl-leg');

const gameStateButton = document.getElementById('game-state-button');
const animalButton = document.getElementById('animal-button');
const difficultyButton = document.getElementById('difficulty-button');

const gameStates = { Dialog: 0, Nothing: 1, Active: 2};

let game = {
    state: null,
    animal: null,
    difficultySettings: null,
    kettlebells: [],
    remainingTime: null,
    needToClear: false
}

const getUserName = () => localStorage.getItem('username');

// анимация падения

function startDropKettlebell(kettlebell) {
    setTimeout(() => {
        if(!game.kettlebells.some(x => x.id === kettlebell.id))
            return;
        
        const currentKettlebellContainer = document.getElementById(kettlebell.id);
        
        if (kettlebell.zona !== 1 || currentKettlebellContainer)
            return;

        let kettlebellContainer = createKettlebellInDropZona(kettlebell.weight, kettlebell.id);
        dropElement(kettlebell.dropSpeed);

        function dropElement(speed) {
            if(game.state !== gameStates.Active || kettlebell.zona !== 1){
                kettlebellContainer.remove();
                return;
            }

            const currentPositionY = parseFloat(kettlebellContainer.style.top);
            const newPositionY = currentPositionY + speed;

            const dropZonaRect = dropZona.getBoundingClientRect();
            const dropZonaBottomY = dropZonaRect.y + dropZonaRect.height;

            if (newPositionY < dropZonaBottomY) {
                kettlebellContainer.style.top = `${newPositionY}px`;
                requestAnimationFrame(() => dropElement(speed));
            } else {
                kettlebellContainer.remove();

                setTimeout(() => {
                    kettlebellContainer = createKettlebellInDropZona(kettlebell.weight, kettlebell.id);
                    requestAnimationFrame(() => dropElement(speed));
                }, game.difficultySettings.dropKettlebellDelay * 1000);
            }
        }
            
    }, kettlebell.appearDelay * 1000);
}


// создание гирек

function createKettlebellInDropZona(weight, id){
    const kettlebellSizes = getComputedStyle(document.querySelector(':root'));
    const kettlebellHeight = parseInt(kettlebellSizes.getPropertyValue('--kettlebell-height'), 10);
    const kettlebellWidth = parseInt(kettlebellSizes.getPropertyValue('--kettlebell-width'), 10);
    
    let container = createKettlebellContainer(weight, id);
    container.style.top = `${-kettlebellHeight}px`;
    container.style.left = `${Math.floor(Math.random() * (dropZona.offsetWidth - kettlebellWidth))}px`;
    dropZona.appendChild(container);
    return container;
}

function createKettlebellContainer(weight, id) {
    const kettlebell = document.createElement('div');
    kettlebell.id = id;
    kettlebell.className = 'kettlebell';
    kettlebell.style.backgroundColor = 'transparent';

    const handle = document.createElement('div');
    handle.className = 'kettlebell-handle';

    const body = document.createElement('div');
    body.className = 'kettlebell-body';

    const weightElement = document.createElement('span');
    weightElement.className = 'kettlebell-weight';
    weightElement.textContent = weight;

    body.appendChild(weightElement);
    kettlebell.appendChild(handle);
    kettlebell.appendChild(body);

    kettlebell.draggable = true;
    kettlebell.addEventListener('dragstart', (e) => {
        if(game.state === gameStates.Active){
            e.dataTransfer.setData('text/plain', id);
            e.target.style.opacity = '0.5';
        }
    });
    kettlebell.addEventListener('dragend', (e) => {
        e.target.style.opacity = '1';
    });

    return kettlebell;
}

function createGuid() {
    return 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx'.replace(
        /[x]/g, 
        c => (Math.random() * 16 | 0).toString(16)
    );
}


// перетаскивание гирек

tableZona.addEventListener('dragover', (e) => defaultKettlebellDragover(e));
scalesZona.addEventListener('dragover', (e) => defaultKettlebellDragover(e));
trashZona.addEventListener('dragover', (e) => defaultKettlebellDragover(e));

function defaultKettlebellDragover(event){
    if(game.state === gameStates.Active)
        event.preventDefault();
}

tableZona.addEventListener('drop', (e) => {
    if(game.state !== gameStates.Active)
        return;

    const id = e.dataTransfer.getData('text/plain');
    let kettlebellContainer = document.getElementById(id);
    const kettlebellData = game.kettlebells.find(x => x.id === id);

    if (tableZona.children.length < 6 && kettlebellData.zona !== 2){
        updateKettlebellZona(kettlebellData, 2);

        kettlebellContainer.remove();
        kettlebellContainer = createKettlebellContainer(kettlebellData.weight, kettlebellData.id);
        tableZona.appendChild(kettlebellContainer)
    }
});

scalesZona.addEventListener('drop', (e) => {
    if(game.state !== gameStates.Active)
        return;

    const id = e.dataTransfer.getData('text/plain');
    let kettlebellContainer = document.getElementById(id);
    const kettlebellData = game.kettlebells.find(x => x.id === id);

    if (scalesZona.children.length < 4 && kettlebellData.zona !== 3){
        kettlebellContainer.remove();
        kettlebellContainer = createKettlebellContainer(kettlebellData.weight, kettlebellData.id);
        scalesZona.appendChild(kettlebellContainer)

        updateKettlebellZona(kettlebellData, 3);
    }
});

trashZona.addEventListener('drop', (e) => {
    if(game.state !== gameStates.Active)
        return;

    const id = e.dataTransfer.getData('text/plain');
    const kettlebellData = game.kettlebells.find(x => x.id === id);
    document.getElementById(id).remove();

    updateKettlebellZona(kettlebellData, 1);
    startDropKettlebell(kettlebellData);
});


// нужно заменить на "Добавить гирю на весы" и "Взять гирю с весов"
function updateKettlebellZona(kettlebell, zona){
    const leftBowlWeightOld = getLeftBowlWeight();
    kettlebell.zona = zona;
    const leftBowlWeightNew = getLeftBowlWeight();

    if (leftBowlWeightOld === leftBowlWeightNew)
        return;
    
    const animalWeight = game.animal.weight;

    const root = getComputedStyle(document.querySelector(':root'));
    const minBowlLegHeight = parseInt(root.getPropertyValue('--bowl-leg-min-height'), 10);
    const maxBowlLegHeight = parseInt(root.getPropertyValue('--bowl-leg-max-height'), 10);
    const mediumBowlLegHeight = Math.round((maxBowlLegHeight + minBowlLegHeight) / 2);

    if (leftBowlWeightNew === animalWeight){
        if(leftBowlWeightNew < leftBowlWeightOld){
            animateBowlLeg(leftBowlLeg, 'increaseFromMinToMedium');
            animateBowlLeg(rightBowlLeg, 'decreaseFromMaxToMedium');
        }else{
            animateBowlLeg(leftBowlLeg, 'decreaseFromMaxToMedium');
            animateBowlLeg(rightBowlLeg, 'increaseFromMinToMedium');
        }

        setTimeout(()=>{
            leftBowlLeg.style.height = `${mediumBowlLegHeight}px`;
            rightBowlLeg.style.height = `${mediumBowlLegHeight}px`;
        }, 1500)

        stopGame();
        saveResult();

        let takenTime = game.difficultySettings.maxGameTime - game.remainingTime;
        showGoodResultDialog(getUserName(), Math.round(takenTime * 10) / 10);
        return;
    }

    if (leftBowlWeightOld > animalWeight && leftBowlWeightNew < animalWeight){
        animateBowlLeg(leftBowlLeg, 'increaseFromMinToMax');
        animateBowlLeg(rightBowlLeg, 'decreaseFromMaxToMin');

        setTimeout(()=>{
            leftBowlLeg.style.height = `${maxBowlLegHeight}px`;
            rightBowlLeg.style.height = `${minBowlLegHeight}px`;
        }, 1500)
        return;
    } 

    if (leftBowlWeightOld < animalWeight && leftBowlWeightNew > animalWeight) {
        animateBowlLeg(leftBowlLeg, 'decreaseFromMaxToMin');
        animateBowlLeg(rightBowlLeg, 'increaseFromMinToMax');

        setTimeout(()=>{
            leftBowlLeg.style.height = `${minBowlLegHeight}px`;
            rightBowlLeg.style.height = `${maxBowlLegHeight}px`;
        }, 1500)
    }
}

function animateBowlLeg(element, animationName) {
    element.style.animation = 'none';
    requestAnimationFrame(() => {
        element.style.animation = `${animationName} 1.5s ease-in-out forwards`;
    });
}

function saveResult(){
    let key = `${game.animal.name}:${game.difficultySettings.name}`
    let takenTime = game.difficultySettings.maxGameTime - game.remainingTime;
    takenTime = Math.round(takenTime * 10) / 10;

    let result = {username: getUserName(), time: takenTime};
    let results = JSON.parse(localStorage.getItem(key)) || [];
    results.push(result);
    localStorage.setItem(key, JSON.stringify(results));
}

function getLeftBowlWeight() {
    return game.kettlebells.length > 0
        ? roundWeight(game.kettlebells
            .filter(kettlebell => kettlebell.zona === 3)
            .reduce((acc, kettlebell) => acc + kettlebell.weight, 0))
        : 0;
}


// кнопка по смене диапозона веса

animalButton.addEventListener('click', () => {
    if (game.state === gameStates.Nothing)
        updateAnimal();
});

function updateAnimal() {
    fetch(`../../data/animals.json`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Ой, ошибка в fetch: ' + response.statusText);
            }
            return response.json();
        })
        .then(animals => {
            const newAnimal = game.animal
                ? animals[(animals.findIndex(animal => animal.name === game.animal.name) + 1) % animals.length]
                : animals[0];

            game.animal = {
                name: newAnimal.name,
                minWeight: newAnimal.minWeight,
                maxWeight: newAnimal.maxWeight,
                weight: null
            }

            const animalPicture = document.createElement('object');
            animalPicture.setAttribute('data', `../../content/${newAnimal.pictureName}`);
            animalPicture.setAttribute('type', 'image/svg+xml');

            const animalPictureContainer = document.getElementById('animal-picture-container');
            animalPictureContainer.innerHTML = '';
            animalPictureContainer.appendChild(animalPicture);

            animalButton.innerHTML = `Животное:<br>${newAnimal.name}`;
        })
        .catch(error => console.error('Ошибка при исполнении запроса: ', error));
}


// кнопка по смене уровня сложности

difficultyButton.addEventListener('click', () => {
    if (game.state === gameStates.Nothing)
        updateDifficulty();
});

function updateDifficulty() {
    fetch(`../../data/difficulties.json`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Ой, ошибка в fetch: ' + response.statusText);
            }
            return response.json();
        })
        .then(difficulties => {
            game.difficultySettings = game.difficultySettings
                ? difficulties[(difficulties.findIndex(difficulty => difficulty.name === game.difficultySettings.name) + 1) % difficulties.length]
                : difficulties[0];

            difficultyButton.innerHTML = `Сложность:<br>${game.difficultySettings.name}`;

            game.remainingTime = game.difficultySettings.maxGameTime;
            updateTimerContent();
        })
        .catch(error => console.error('Ошибка при исполнении запроса: ', error));
}


// кнопка для начала / окончания игры

gameStateButton.addEventListener('click', (event) => {
    if (game.state === gameStates.Active){
        stopGame();
        event.stopPropagation();
    }
    else if (game.state === gameStates.Nothing){
        startGame();
        event.stopPropagation();
    }
});

function startGame(){
    game.state = gameStates.Active;

    gameStateButton.innerHTML = 'Сдаться';
    gameStateButton.className = 'game-is-active can-end-game';

    manageSettingsButtons(false);

    if (game.needToClear){
        clearWindow();
        game.needToClear = false;
    }

    game.animal.weight = roundWeight(game.animal.minWeight + Math.random() * (game.animal.maxWeight - game.animal.minWeight));
    console.log(game.animal.weight);

    let weights = generateWeights();
    let delayInterval = 20 / weights.length;
    weights.forEach((weight, index) => game.kettlebells.push(createKettlebell(weight, delayInterval*(index + Math.random()*2))));
    console.log(weights);

    game.kettlebells.forEach((kettlebell, index) => startDropKettlebell(kettlebell));

    game.remainingTime = game.difficultySettings.maxGameTime;
    startTimer();
}


function getRandomElement(arr) {
    const randomIndex = Math.floor(Math.random() * arr.length);
    return arr[randomIndex].slice();
}

function stopGame(){
    game.state = gameStates.Nothing;

    gameStateButton.innerHTML = 'Начать';
    gameStateButton.className = 'game-is-not-active can-start-game';

    manageSettingsButtons(true);

    removeKettlebells(dropZona);

    document
        .querySelectorAll('.kettlebell')
        .forEach(element => {
            element.draggable = false;
        });

    game.kettlebells = [];
    game.needToClear = true;
}

function removeKettlebells(container){
    const elementsToRemove = container.querySelectorAll('.kettlebell');

    elementsToRemove.forEach(element => {
        element.remove();
    });
}

// генерация гирек

function shuffleArray(array) {
    const shuffledArray = [...array];
    for (let i = shuffledArray.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffledArray[i], shuffledArray[j]] = [shuffledArray[j], shuffledArray[i]];
    }
    return shuffledArray;
}

function createKettlebell(weight, appearDelay){
    return {
        weight: weight,
        appearDelay: appearDelay,
        dropSpeed: 0.5 + Math.random() * 1.5 + game.difficultySettings.additionalKettlebellSpeed,
        id: createGuid(),
        zona: 1
    }
}

function roundWeight(weight){
    return weight > 50
        ? Math.round(weight)
        : Math.round(weight * 10) / 10;
}

function generateWeights(){
    let result = [];

    let twoList = [];
    for (let i = 1; i <= 2; i++) {
        let pair = splitWeight(game.animal.weight);
        twoList.push(pair);
        result.push(pair[0], pair[1]);
    }

    console.log(twoList);

    let threeList = [];
    for (let i = 1; i <= 3; i++) {
        let two = getRandomElement(twoList);
        let splitElementIndex = Math.round(Math.random()*(two.length-1));
        let pair = splitWeight(two[splitElementIndex]);

        two.splice(splitElementIndex, 1);
        threeList.push(two.concat(pair));
        result.push(pair[0], pair[1]);
    }

    let fourList = [];
    for (let i = 1; i <= 3; i++) {
        let three = getRandomElement(threeList);
        let splitElementIndex = Math.round(Math.random()*(three.length-1));
        let pair = splitWeight(three[splitElementIndex]);

        three.splice(splitElementIndex, 1);
        fourList.push(three.concat(pair));
        result.push(pair[0], pair[1]);
    }

    let randomWeightsCount = Math.round(result.length * game.difficultySettings.randomKettlebellProportion);
    for (let i = 1; i <= randomWeightsCount; i++)
        result.push(roundWeight((0.2 + Math.random() * 0.6) * (game.animal.maxWeight - game.animal.minWeight)));

    return shuffleArray(result);
}

function splitWeight(weight){
    let part1 = roundWeight((0.2 + Math.random() * 0.6) * weight);
    let part2 = Math.round((weight - part1) * 10) / 10;
    return [part1, part2];
}


// таймер

const timerContainer = document.getElementById('timer');

function startTimer() {
    const startTime = Date.now();

    const timer = setInterval(() => {
        if (game.state !== gameStates.Active){
            clearInterval(timer);
            return;
        }

        game.remainingTime = game.difficultySettings.maxGameTime - ((Date.now() - startTime) / 1000);

        if (game.remainingTime <= 0) {
            clearInterval(timer);
            timerContainer.innerHTML = "00:00";
            stopGame();
            showDialog('dialog-loss');
            return;
        }

        updateTimerContent();
    }, 10);
}

function formatTime(totalSeconds) {
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = Math.floor(totalSeconds % 60);
    return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}м`;
}

function formatMillis(seconds) {
    const sec = Math.floor(seconds);
    const ms = Math.floor((seconds - sec) * 100);
    return `${String(sec).padStart(2, '0')}:${String(ms).padStart(2, '0')}с`;
}

function updateTimerContent() {
    timerContainer.innerHTML = game.remainingTime >= 60
        ? formatTime(game.remainingTime)
        : formatMillis(game.remainingTime)
}


// Диалоговые окна

function showDialog(modalId) {
    const modal = document.getElementById(modalId);
    modal.style.display = 'flex';
    game.state = gameStates.Dialog;
    
    manageSettingsButtons(false);
    gameStateButton.className = gameStateButton.innerHTML === 'Начать' 
        ? 'game-is-not-active'
        : 'game-is-active';
}

function hideDialogs() {
    const dialogs = document.querySelectorAll(".dialog");
    dialogs.forEach((modal) => modal.style.display = 'none');
    manageSettingsButtons(true);
    gameStateButton.className = gameStateButton.innerHTML === 'Начать'
        ? 'game-is-not-active can-start-game'
        : 'game-is-active can-end-game';
}

function showGoodResultDialog(username, timeTaken) {
    document.getElementById("dialog-win-username").textContent = username;
    document.getElementById("dialog-win-time").textContent = timeTaken + ' секунд';
    showDialog("dialog-win");
}

function showRulesDialog(username){
    document.getElementById('dialog-rules-username').textContent = username;
    showDialog('dialog-rules');
}

app.addEventListener('click', () => {
    if (game.state === gameStates.Dialog && getUserName()) {
        hideDialogs();
        game.state = gameStates.Nothing;
    }

    if (game.needToClear){
        clearWindow();
        game.needToClear = false;
    }
});

function manageSettingsButtons(switchOn) {
    const chooseButtons = document.querySelectorAll(".choose-button");
    
    chooseButtons.forEach((button) => switchOn 
        ? button.className = 'choose-button increased-font'
        : button.className = 'choose-button');
}

function clearWindow(){
    removeKettlebells(tableZona);
    removeKettlebells(scalesZona);

    game.remainingTime = game.difficultySettings.maxGameTime;
    updateTimerContent();

    leftBowlLeg.style.animation = 'none';
    rightBowlLeg.style.animation = 'none';

    const root = getComputedStyle(document.querySelector(':root'));
    const minBowlLegHeight = parseInt(root.getPropertyValue('--bowl-leg-min-height'), 10);
    const maxBowlLegHeight = parseInt(root.getPropertyValue('--bowl-leg-max-height'), 10);

    leftBowlLeg.style.height = `${maxBowlLegHeight}px`;
    rightBowlLeg.style.height = `${minBowlLegHeight}px`;
}


// действия при открытии страницы

updateAnimal();
updateDifficulty();
manageSettingsButtons();

let username = getUserName();
username 
    ? showRulesDialog(username) 
    : showDialog('dialog-authorization')
