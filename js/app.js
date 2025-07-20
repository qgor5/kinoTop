const TMDB_KEY = '7cb67565ace3a08cd9d099c749787121';
const YT_KEY = 'AIzaSyB-ho2tJ4r_y8K2Z...'; // замените на свой YouTube API ключ

async function fetchMovies(query = 'popular') {
  const url = `https://api.themoviedb.org/3/movie/${query}?api_key=${TMDB_KEY}&language=ru-RU&page=1`;
  const res = await fetch(url);
  const data = await res.json();
  return data.results;
}

async function getTrailer(title) {
  const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${encodeURIComponent(title + ' трейлер')}&type=video&key=${YT_KEY}&maxResults=1`;
  const res = await fetch(url);
  const data = await res.json();
  return data.items?.[0]?.id?.videoId;
}

async function renderMovies(movies) {
  const grid = document.getElementById('movieGrid');
  grid.innerHTML = '';
  for (const m of movies) {
    const trailerId = await getTrailer(m.title);
    const img = `https://image.tmdb.org/t/p/w500${m.poster_path}`;
    const card = document.createElement('div');
    card.className = 'card';
    card.innerHTML = `
      <img src="${img}" alt="${m.title}" />
      <div class="card-content">
        <h3>${m.title}</h3>
        <p>${m.overview.slice(0, 100)}...</p>
        <a href="https://www.youtube.com/watch?v=${trailerId}" target="_blank">▶ Смотреть трейлер</a>
      </div>
    `;
    grid.appendChild(card);
  }
}

async function searchMovies() {
  const q = document.getElementById('searchInput').value;
  const url = `https://api.themoviedb.org/3/search/movie?api_key=${TMDB_KEY}&language=ru-RU&query=${q}`;
  const res = await fetch(url);
  const data = await res.json();
  renderMovies(data.results);
}

window.addEventListener('DOMContentLoaded', async () => {
  const popular = await fetchMovies('popular');
  renderMovies(popular);
});
