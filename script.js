// Referência ao Firebase Firestore
const db = firebase.firestore();
const cardsRef = db.collection("cards");

// Função para atualizar o contador ao vivo
function updateCounter() {
    const now = new Date();
    const timeDiff = now - lastSeen;
    const days = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((timeDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((timeDiff % (1000 * 60)) / 1000);

    document.getElementById('counter').textContent = `${days} dias, ${hours} horas, ${minutes} minutos, ${seconds} segundos`;
}

// Função para atualizar o contador de forma contínua
function initCounter() {
    setInterval(updateCounter, 1000); // Atualiza a cada segundo
    updateCounter(); // Chama de imediato para mostrar o valor ao carregar a página
}

// Função para resetar o contador
function resetCounter() {
    const currentDate = new Date();
    localStorage.setItem('lastSeen', currentDate);
    lastSeen = currentDate;
    updateCounter();
}

// Carregar cards do Firebase
function loadCardsFromFirebase() {
    cardsRef.get().then((querySnapshot) => {
        cardsData = [];
        querySnapshot.forEach((doc) => {
            cardsData.push(doc.data());
        });
        displayCards(); // Exibe os cards após carregar
    });
}

// Exibir cards na tela
function displayCards() {
    const container = document.getElementById('cards-container');
    container.innerHTML = '';
    cardsData.forEach((card, index) => {
        const cardDiv = document.createElement('div');
        cardDiv.classList.add('card');
        cardDiv.innerHTML = `
            <button class="delete-btn" onclick="deleteCard(${index})">&times;</button>
            <h2>${card.title}</h2>
        `;
        cardDiv.onclick = () => openModal(card);
        container.appendChild(cardDiv);
    });
}

// Abrir modal com conteúdo do diário
function openModal(card) {
    document.getElementById('modal-title').textContent = card.title;
    document.getElementById('modal-content').textContent = card.content;
    document.getElementById('modal').style.display = 'flex';
}

// Fechar modal
function closeModal() {
    document.getElementById('modal').style.display = 'none';
}

// Adicionar um novo card
function addNewCard() {
    const title = prompt('Qual é o título do diário?');
    const content = prompt('Escreva o conteúdo do diário:');

    const newCard = { title, content };
    cardsData.push(newCard);

    // Salvar no Firebase
    cardsRef.add(newCard)
        .then(() => {
            displayCards(); // Atualiza os cards na tela após salvar
        })
        .catch((error) => {
            console.error("Erro ao adicionar card: ", error);
        });
}

// Excluir um card
function deleteCard(index) {
    const card = cardsData[index];
    cardsRef.where("title", "==", card.title).where("content", "==", card.content).get()
        .then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
                doc.ref.delete();
            });
        })
        .catch((error) => {
            console.error("Erro ao excluir card: ", error);
        });

    // Remover o card da lista local
    cardsData.splice(index, 1);
    displayCards(); // Atualiza os cards após a exclusão
}

// Inicialização
let lastSeen = localStorage.getItem('lastSeen') ? new Date(localStorage.getItem('lastSeen')) : new Date();
let cardsData = [];

initCounter();
loadCardsFromFirebase(); // Carregar os cards do Firebase
