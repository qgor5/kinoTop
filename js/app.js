const API_KEY = '7cb67565ace3a08cd9d099c749787121';
const BASE_URL = 'https://api.themoviedb.org/3';
const IMAGE_URL = 'https://image.tmdb.org/t/p/w300';

let allMovies = [];

const genreMap = {
  28: 'Боевик', 12: 'Приключения', 16: 'Мультфильм', 35: 'Комедия',
  80: 'Криминал', 99: 'Документальный', 18: 'Драма', 10751: 'Семейный',
  14: 'Фэнтези', 36: 'История', 27: 'Ужасы', 10749: 'Мелодрама',
  878: 'Фантастика', 53: 'Триллер'
};

async function loadMovies() {
  const res = await fetch(`${BASE_URL}/discover/movie?api_key=${API_KEY}&language=ru-RU&page=1`);
  const data = await res.json();
  allMovies = data.results;
  renderGenres();
  displayMovies(allMovies);
}

function renderGenres() {
  const list = document.getElementById('genreList');
  const genres = [...new Set(allMovies.flatMap(m => m.genre_ids))];
  list.innerHTML = '';
  ['Все', ...genres.map(id => genreMap[id])].forEach(g => {
    const li = document.createElement('li');
    const btn = document.createElement('button');
    btn.textContent = g;
    btn.onclick = () => filterByGenre(g);
    li.appendChild(btn);
    list.appendChild(li);
  });
}

function displayMovies(movies) {
  const grid = document.getElementById('moviesGrid');
  grid.innerHTML = '';
  movies.forEach(m => {
    const card = document.createElement('div');
    card.className = 'movie-card';
    card.onclick = () => location.href = `film.html?id=${m.id}`;
    card.innerHTML = `
      <img src="${IMAGE_URL}${m.poster_path}" class="movie-poster" alt="${m.title}">
      <div class="movie-title">${m.title}</div>
    `;
    grid.appendChild(card);
  });
}

function filterByGenre(genre) {
  document.querySelectorAll('.sidebar button').forEach(b => b.classList.remove('active'));
  event.target.classList.add('active');
  if (genre === 'Все') return displayMovies(allMovies);
  const id = Object.keys(genreMap).find(k => genreMap[k] === genre);
  displayMovies(allMovies.filter(m => m.genre_ids.includes(+id)));
}

document.getElementById('searchInput').addEventListener('input', e => {
  const q = e.target.value.toLowerCase();
  displayMovies(allMovies.filter(m => m.title.toLowerCase().includes(q)));
});

window.addEventListener('DOMContentLoaded', loadMovies);
