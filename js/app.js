const API_KEY = '7cb67565ace3a08cd9d099c749787121';
const BASE_URL = 'https://api.themoviedb.org/3';
const IMAGE_URL = 'https://image.tmdb.org/t/p/w300';

let currentPage = 1;
let currentGenre = '';
let currentYear = '';

const genreMap = {
  28: 'Боевик', 12: 'Приключения', 16: 'Мультфильм', 35: 'Комедия',
  80: 'Криминал', 99: 'Документальный', 18: 'Драма', 10751: 'Семейный',
  14: 'Фэнтези', 36: 'История', 27: 'Ужасы', 10749: 'Мелодрама',
  878: 'Фантастика', 53: 'Триллер', 10402: 'Музыка', 9648: 'Мистика'
};

async function loadGenres() {
  const res = await fetch(`${BASE_URL}/genre/movie/list?api_key=${API_KEY}&language=ru-RU`);
  const data = await res.json();
  const genreList = document.getElementById('genreList');
  genreList.innerHTML = `<li><button class="active" onclick="setGenre('')">Все</button></li>`;
  data.genres.forEach(g => {
    genreList.innerHTML += `<li><button onclick="setGenre(${g.id})">${g.name}</button></li>`;
  });
}

function renderYears() {
  const yearList = document.getElementById('yearList');
  yearList.innerHTML = `<li><button class="active" onclick="setYear('')">Все</button></li>`;
  for (let y = 2025; y >= 1980; y--) {
    yearList.innerHTML += `<li><button onclick="setYear(${y})">${y}</button></li>`;
  }
}

async function loadMovies(page = 1) {
  let url = `${BASE_URL}/discover/movie?api_key=${API_KEY}&language=ru-RU&page=${page}`;
  if (currentGenre) url += `&with_genres=${currentGenre}`;
  if (currentYear) url += `&primary_release_year=${currentYear}`;
  const res = await fetch(url);
  const data = await res.json();
  displayMovies(data.results);
  renderPagination(data.page, data.total_pages);
}

function displayMovies(movies) {
  const grid = document.getElementById('moviesGrid');
  grid.innerHTML = '';
  movies.forEach(m => {
    const div = document.createElement('div');
    div.className = 'movie-card';
    div.onclick = () => location.href = `film.html?id=${m.id}`;
    div.innerHTML = `
      <img src="${IMAGE_URL}${m.poster_path}" class="movie-poster" alt="${m.title}">
      <div class="movie-title">${m.title}</div>
    `;
    grid.appendChild(div);
  });
}

function setGenre(id) {
  currentGenre = id;
  currentPage = 1;
  loadMovies();
  document.querySelectorAll('#genreList button').forEach(b => b.classList.remove('active'));
  event.target.classList.add('active');
}

function setYear(year) {
  currentYear = year;
  currentPage = 1;
  loadMovies();
  document.querySelectorAll('#yearList button').forEach(b => b.classList.remove('active'));
  event.target.classList.add('active');
}

function renderPagination(page, total) {
  const pag = document.getElementById('pagination');
  pag.innerHTML = '';
  const start = Math.max(1, page - 3);
  const end = Math.min(total, page + 3);
  for (let i = start; i <= end; i++) {
    const btn = document.createElement('button');
    btn.textContent = i;
    btn.classList.toggle('active', i === page);
    btn.onclick = () => { currentPage = i; loadMovies(i); };
    pag.appendChild(btn);
  }
}

document.getElementById('searchInput').addEventListener('input', e => {
  const q = e.target.value.toLowerCase();
  if (q.length < 2) return;
  fetch(`${BASE_URL}/search/movie?api_key=${API_KEY}&language=ru-RU&query=${q}`)
    .then(r => r.json()).then(d => displayMovies(d.results));
});

window.addEventListener('DOMContentLoaded', () => {
  loadGenres();
  renderYears();
  loadMovies();
});
