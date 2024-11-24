// Armazena a data do último encontro
let lastSeen = localStorage.getItem('lastSeen') ? new Date(localStorage.getItem('lastSeen')) : new Date();
let cardsData = JSON.parse(localStorage.getItem('cardsData')) || [];

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

// Função para resetar o contador e adicionar o encontro
function resetCounter() {
    const currentDate = new Date();
    localStorage.setItem('lastSeen', currentDate);
    lastSeen = currentDate;
    updateCounter();
}

// Exibe os cards de diário
function displayCards() {
    const container = document.getElementById('cards-container');
    container.innerHTML = '';
    cardsData.forEach((card, index) => {
        const cardDiv = document.createElement('div');
        cardDiv.classList.add('card');
        cardDiv.innerHTML = `
            <h2>${card.title}</h2>
        `;
        cardDiv.onclick = () => openModal(card);
        container.appendChild(cardDiv);
    });
}

// Função para adicionar um novo card ao diário
function addNewCard() {
    const title = prompt("Qual o título da sua entrada?");
    const content = prompt("Escreva o conteúdo do diário:");

    if (title && content) {
        const newCard = { title, content };
        cardsData.push(newCard);
        localStorage.setItem('cardsData', JSON.stringify(cardsData));
        displayCards();
    }
}

// Função para abrir o modal
function openModal(card) {
    document.getElementById('modal-title').textContent = card.title;
    document.getElementById('modal-content').textContent = card.content;
    document.getElementById('modal').style.display = 'flex';
}

// Função para fechar o modal
function closeModal() {
    document.getElementById('modal').style.display = 'none';
}

// Inicializa as visualizações
setInterval(updateCounter, 1000);
updateCounter();
displayCards();
