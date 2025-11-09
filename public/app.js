// URL base da API JSON Server (CORRIGIDA PARA A PORTA 3001)
const apiURL = "http://localhost:3001/atracoes";

// Função para carregar os cards dinamicamente da API
async function carregarCards() {
    const grid = document.querySelector('.grid');
    if (!grid) return;
    grid.innerHTML = '';

    try {
        const response = await fetch(apiURL);
        
        // Verifica se a resposta foi bem-sucedida (status 200)
        if (!response.ok) {
            throw new Error(`Erro de rede: ${response.status}`);
        }

        const dados = await response.json();

        dados.forEach(item => {
            const card = document.createElement('div');
            card.classList.add('card');
            
            // Adiciona fallback para campos opcionais (como preco_medio)
            const precoMedio = item.preco_medio || 'N/A';
            
            card.innerHTML = `
                <img src="${item.imagem}" alt="${item.titulo}">
                <h3>${item.titulo}</h3>
                <p><strong>Localização:</strong> ${item.localizacao}</p>
                <p><strong>Avaliação:</strong> ${item.avaliacao}</p>
                <p><strong>Preço médio:</strong> ${precoMedio}</p>
                <a href="detalhes.html?id=${item.id}" class="btn-detalhes">Ver detalhes</a>
            `;
            grid.appendChild(card);
        });
    } catch (erro) {
        console.error("Erro ao carregar atrações:", erro);
        grid.innerHTML = `<p>Não foi possível carregar as atrações. Verifique o console para detalhes.</p>`;
    }
}

// Função para carregar os detalhes de uma atração
async function carregarDetalhes() {
    const params = new URLSearchParams(window.location.search);
    const id = params.get('id');
    const container = document.querySelector('.detalhes-container');
    if (!container || !id) return; // Garante que o ID exista

    try {
        const response = await fetch(`${apiURL}/${id}`);
        
        if (!response.ok) {
            throw new Error(`Erro de rede: ${response.status}`);
        }
        
        const item = await response.json();
        
        // Trata campos que podem estar faltando no JSON (adiciona N/A ou array vazio)
        const fotosSecundarias = item.fotos_associadas || []; 
        const precoMedio = item.preco_medio || 'N/A';
        const horario = item.horario || 'Não informado';
        const conteudo = item.conteudo || '';

        const fotosSecundariasHTML = fotosSecundarias.map(foto => 
            `<img src="${foto}" alt="Foto de ${item.titulo}">`
        ).join('');

        container.innerHTML = `
            <h1>${item.titulo}</h1>
            <img src="${item.imagem}" alt="${item.titulo}" class="imagem-detalhe">
            <hr>
            <p><strong>Categoria:</strong> ${item.categoria}</p>
            <p><strong>Localização:</strong> ${item.localizacao}</p>
            <p><strong>Avaliação:</strong> ${item.avaliacao}</p>
            <p><strong>Horário:</strong> ${horario}</p>
            <p><strong>Preço médio:</strong> ${precoMedio}</p>
            <p><strong>Descrição:</strong> ${item.descricao}</p>
            <p>${conteudo}</p>
            <hr>
            <h2>Fotos Adicionais</h2>
            <div class="galeria-secundaria">${fotosSecundariasHTML}</div>
            <a href="index.html" class="voltar">← Voltar</a>
        `;
    } catch (erro) {
        console.error("Erro ao carregar detalhes da atração:", erro);
        container.innerHTML = `<p>Erro ao carregar detalhes da atração. Verifique o console e o ID da atração.</p>`;
    }
}

// Inicialização
document.addEventListener('DOMContentLoaded', () => {
    if (document.querySelector('.grid')) carregarCards();
    if (document.querySelector('.detalhes-container')) carregarDetalhes();
});