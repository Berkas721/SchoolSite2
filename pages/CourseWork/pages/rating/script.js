const animalButton = document.getElementById('animalButton');
const animalList = document.getElementById('animalList');
const difficultyButton = document.getElementById('difficultyButton');
const difficultyList = document.getElementById('difficultyList');
const resultsDiv = document.getElementById('results');

let animalName = null;
let difficultyName = null;

animalButton.addEventListener('click', () => {
    animalList.classList.toggle('hidden');
});

difficultyButton.addEventListener('click', () => {
    difficultyList.classList.toggle('hidden');
});

animalList.addEventListener('click', (event) => {
    if (event.target.tagName === 'LI') {
        animalName = event.target.dataset.animal;
        animalButton.textContent = `Животное: ${animalName}`;
        animalList.classList.add('hidden');
        updateResults();
    }
});

difficultyList.addEventListener('click', (event) => {
    if (event.target.tagName === 'LI') {
        difficultyName = event.target.dataset.difficulty;
        difficultyButton.textContent = `Сложность: ${difficultyName}`;
        difficultyList.classList.add('hidden');
        updateResults();
    }
});

function updateResults() {
    if (!animalName || !difficultyName) {
        resultsDiv.innerHTML = '<p>Выберите параметры, чтобы увидеть результаты.</p>';
        return;
    }

    const key = `${animalName}:${difficultyName}`;
    const data = JSON.parse(localStorage.getItem(key)) || [];

    if (data.length === 0) {
        resultsDiv.innerHTML = `<p>Пока что никто не прошел этот уровень 💀</p>`;
        return;
    }

    data.sort((a, b) => a.time - b.time);

    const resultsHTML = `
    <table>
      <thead>
        <tr>
          <th>Место</th>
          <th>Имя</th>
          <th>Результат (сек)</th>
        </tr>
      </thead>
      <tbody>
        ${data.slice(0, 10).map((item, index) => `
          <tr>
            <td>${index + 1}</td>
            <td>${item.username}</td>
            <td>${item.time}</td>
          </tr>
        `).join('')}
      </tbody>
    </table>
  `;

    resultsDiv.innerHTML = resultsHTML;
}