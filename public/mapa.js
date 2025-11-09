// === Configuração inicial do Mapbox ===
mapboxgl.accessToken = 'SUA_CHAVE_DO_MAPBOX_AQUI'; // substitua pela sua chave válida

// === Criação do mapa ===
const map = new mapboxgl.Map({
  container: 'map',
  style: 'mapbox://styles/mapbox/outdoors-v12', // Tema inicial (verde)
  center: [-47.8825, -15.7942], // Centraliza no Brasil
  zoom: 4
});

// === Adiciona controles ===
map.addControl(new mapboxgl.NavigationControl()); // Zoom e rotação
map.addControl(new mapboxgl.FullscreenControl()); // Tela cheia

// === Função para trocar o tema do mapa ===
function alterarTema(tema) {
  const estilos = {
    verde: 'mapbox://styles/mapbox/outdoors-v12',
    escuro: 'mapbox://styles/mapbox/dark-v11',
    satelite: 'mapbox://styles/mapbox/satellite-v9'
  };

  map.setStyle(estilos[tema]);
}

// === Elementos de controle de tema ===
const seletorTema = document.createElement('div');
seletorTema.style.position = 'absolute';
seletorTema.style.top = '10px';
seletorTema.style.right = '10px';
seletorTema.style.background = '#fff';
seletorTema.style.padding = '6px 10px';
seletorTema.style.borderRadius = '6px';
seletorTema.style.boxShadow = '0 2px 6px rgba(0,0,0,0.3)';
seletorTema.style.fontFamily = 'Arial, sans-serif';
seletorTema.innerHTML = `
  <label for="tema">🌍 Tema:</label>
  <select id="tema">
    <option value="verde">Verde</option>
    <option value="escuro">Escuro</option>
    <option value="satelite">Satélite</option>
  </select>
`;
document.body.appendChild(seletorTema);

document.getElementById('tema').addEventListener('change', (e) => {
  alterarTema(e.target.value);
});

// === Carregar dados do JSON Server ===
// Exemplo: npx json-server --watch db/db.json --port 3001
fetch('http://localhost:3001/lugares')
  .then(response => response.json())
  .then(dados => {
    dados.forEach(lugar => {
      // Cria marcador
      const marker = new mapboxgl.Marker({ color: '#009688' })
        .setLngLat([lugar.longitude, lugar.latitude])
        .setPopup(
          new mapboxgl.Popup({ offset: 25 })
            .setHTML(`
              <h3>${lugar.titulo}</h3>
              <p>${lugar.descricao}</p>
              <img src="${lugar.imagem}" alt="${lugar.titulo}" style="width:100%;border-radius:8px;margin-top:5px;">
            `)
        )
        .addTo(map);
    });
  })
  .catch(error => console.error('Erro ao carregar os lugares:', error));

// === Ajuste visual ===
// Espera o mapa carregar antes de adicionar marcadores corretamente
map.on('style.load', () => {
  console.log('Mapa carregado e pronto!');
});
