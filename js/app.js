const API_KEY = '7cb67565ace3a08cd9d099c749787121';
const BASE_URL = 'https://api.themoviedb.org/3';
const IMAGE_URL = 'https://image.tmdb.org/t/p/w300';

let allMovies = [];
let currentPage = 1;
const totalPages = 10; // показываем по 10 страниц

const genreMap = {
  28: 'Боевик', 12: 'Приключения', 16: 'Мультфильм', 35: 'Комедия',
  80: 'Криминал', 99: 'Документальный', 18: 'Драма', 10751: 'Семейный',
  14: 'Фэнтези', 36: 'История', 27: 'Ужасы', 10402: 'Музыка',
  9648: 'Мистика', 10749: 'Романтика', 878: 'Фантастика', 53: 'Триллер'
};

async function loadMovies(page = 1) {
  const res = await fetch(`${BASE_URL}/discover/movie?api_key=${API_KEY}&language=ru-RU&sort_by=popularity.desc&page=${page}`);
  const data = await res.json();
  allMovies = data.results;
  displayMovies(allMovies);
  renderPagination(data.total_pages);
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

function renderPagination(total) {
  const pag = document.getElementById('pagination');
  pag.innerHTML = '';
  for (let i = 1; i <= Math.min(total, 10); i++) {
    const btn = document.createElement('button');
    btn.textContent = i;
    btn.classList.toggle('active', i === currentPage);
    btn.onclick = () => { currentPage = i; loadMovies(i); };
    pag.appendChild(btn);
  }
}

document.getElementById('searchInput').addEventListener('input', e => {
  const q = e.target.value.toLowerCase();
  displayMovies(allMovies.filter(m => m.title.toLowerCase().includes(q)));
});

window.addEventListener('DOMContentLoaded', () => loadMovies());
