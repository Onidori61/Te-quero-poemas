// Armazena a data do último encontro
let lastSeen = localStorage.getItem('lastSeen') ? new Date(localStorage.getItem('lastSeen')) : new Date();
let diaryEntries = JSON.parse(localStorage.getItem('diaryEntries')) || [];
let encounterHistory = JSON.parse(localStorage.getItem('encounterHistory')) || [];

// Função para atualizar o contador
function updateCounter() {
    const now = new Date();
    const timeDiff = now - lastSeen;
    const days = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((timeDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((timeDiff % (1000 * 60)) / 1000);

    document.getElementById('counter').textContent = `${days} dias, ${hours} horas, ${minutes} minutos, ${seconds} segundos`;
}

// Função para resetar o contador e atualizar o histórico
function resetCounter() {
    const currentDate = new Date();
    localStorage.setItem('lastSeen', currentDate);
    lastSeen = currentDate;
    encounterHistory.push(currentDate.toLocaleString());
    localStorage.setItem('encounterHistory', JSON.stringify(encounterHistory));
    updateCounter();
    displayHistory();
}

// Exibe o histórico de encontros
function displayHistory() {
    const historyList = document.getElementById('history');
    historyList.innerHTML = '';
    encounterHistory.forEach((encounter) => {
        const listItem = document.createElement('li');
        listItem.textContent = `Encontro em: ${encounter}`;
        historyList.appendChild(listItem);
    });
}

// Função para adicionar entradas ao diário
function addEntry() {
    const entryText = document.getElementById('diary-entry').value;
    if (entryText) {
        const entry = {
            text: entryText,
            date: new Date().toLocaleString()
        };
        diaryEntries.push(entry);
        localStorage.setItem('diaryEntries', JSON.stringify(diaryEntries));
        displayEntries();
        document.getElementById('diary-entry').value = ''; // Limpa o campo de texto
    }
}

// Exibe as entradas do diário
function displayEntries() {
    const entriesDiv = document.getElementById('entries');
    entriesDiv.innerHTML = '';
    diaryEntries.forEach((entry) => {
        const entryDiv = document.createElement('div');
        entryDiv.classList.add('entry');
        entryDiv.innerHTML = `<strong>${entry.date}</strong><p>${entry.text}</p>`;
        entriesDiv.appendChild(entryDiv);
    });
}

// Inicializa as visualizações
setInterval(updateCounter, 1000);
updateCounter();
displayEntries();
displayHistory();
