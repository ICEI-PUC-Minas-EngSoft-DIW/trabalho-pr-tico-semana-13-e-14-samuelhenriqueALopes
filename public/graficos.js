// 🔗 API Local (JSON Server)
const apiURL = "http://localhost:3001/atracoes";

// 🔑 Token do Mapbox (crie conta gratuita e substitua pelo seu token)
mapboxgl.accessToken = 'YOUR_MAPBOX_ACCESS_TOKEN';

// 🗺️ Inicializa o mapa
const map = new mapboxgl.Map({
  container: 'map',
  style: 'mapbox://styles/mapbox/streets-v12',
  center: [-47.8825, -15.7942], // Centro aproximado do Brasil
  zoom: 3.5
});

// 📍 Carrega as atrações e adiciona marcadores no mapa
async function carregarMapa() {
  try {
    const response = await fetch(apiURL);
    const atracoes = await response.json();

    atracoes.forEach(a => {
      const popup = new mapboxgl.Popup({ offset: 25 }).setHTML(`
        <strong>${a.titulo}</strong><br>
        ${a.localizacao}<br>
        ⭐ ${a.avaliacao}<br>
      `);

      new mapboxgl.Marker()
        .setLngLat([a.longitude, a.latitude])
        .setPopup(popup)
        .addTo(map);
    });

    montarGraficos(atracoes);
  } catch (erro) {
    console.error("Erro ao carregar dados do mapa:", erro);
  }
}

// 📈 Monta os gráficos Chart.js
function montarGraficos(atracoes) {
  // === Gráfico de Barras: Atrações por Estado ===
  const estados = {};
  atracoes.forEach(a => {
    const local = a.localizacao.split(" - ")[1];
    estados[local] = (estados[local] || 0) + 1;
  });

  const ctxBar = document.getElementById('graficoBarras').getContext('2d');
  new Chart(ctxBar, {
    type: 'bar',
    data: {
      labels: Object.keys(estados),
      datasets: [{
        label: 'Atrações por Estado',
        data: Object.values(estados),
        backgroundColor: 'rgba(75, 192, 192, 0.6)'
      }]
    },
    options: {
      responsive: true,
      plugins: { legend: { display: false } }
    }
  });

  // === Gráfico de Pizza: Avaliação Média ===
  const avaliacoes = {};
  atracoes.forEach(a => {
    const estrelas = a.avaliacao.length; // Conta número de ★
    const categoria = a.categoria;
    if (!avaliacoes[categoria]) avaliacoes[categoria] = [];
    avaliacoes[categoria].push(estrelas);
  });

  const medias = {};
  for (const categoria in avaliacoes) {
    const soma = avaliacoes[categoria].reduce((a, b) => a + b, 0);
    medias[categoria] = (soma / avaliacoes[categoria].length).toFixed(2);
  }

  const ctxPie = document.getElementById('graficoPizza').getContext('2d');
  new Chart(ctxPie, {
    type: 'pie',
    data: {
      labels: Object.keys(medias),
      datasets: [{
        label: 'Média de Avaliação',
        data: Object.values(medias),
        backgroundColor: [
          'rgba(255, 99, 132, 0.6)',
          'rgba(54, 162, 235, 0.6)',
          'rgba(255, 206, 86, 0.6)',
          'rgba(75, 192, 192, 0.6)',
          'rgba(153, 102, 255, 0.6)'
        ]
      }]
    },
    options: { responsive: true }
  });
}

// Inicializa tudo
document.addEventListener('DOMContentLoaded', carregarMapa);
