const API_KEY = '7cb67565ace3a08cd9d099c749787121';
const BASE_URL = 'https://api.themoviedb.org/3';
const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/w500';

let allMovies = [];

async function loadMovies() {
    const res = await fetch(`${BASE_URL}/movie/popular?api_key=${API_KEY}&language=ru-RU&page=1`);
    const data = await res.json();
    allMovies = data.results;
    displayMovies(allMovies);
    updateSitemap(allMovies);
}

function displayMovies(movies) {
    const container = document.getElementById('moviesGrid');
    container.innerHTML = '';
    
    movies.forEach(movie => {
        const card = document.createElement('div');
        card.className = 'movie-card';
        card.onclick = () => goToFilm(movie.id);
        
        const genres = movie.genre_ids.map(id => getGenreName(id)).join(', ');
        
        card.innerHTML = `
            <img src="${IMAGE_BASE_URL}${movie.poster_path}" alt="${movie.title}" class="movie-poster">
            <div class="movie-info">
                <h3 class="movie-title">${movie.title}</h3>
                <p class="movie-genre">${genres}</p>
            </div>
        `;
        container.appendChild(card);
    });
}

function goToFilm(id) {
    window.location.href = `film.html?id=${id}`;
}

function filterByGenre(genre) {
    document.querySelectorAll('.tab').forEach(tab => tab.classList.remove('active'));
    event.target.classList.add('active');
    
    if (genre === 'all') {
        displayMovies(allMovies);
    } else {
        const filtered = allMovies.filter(movie => movie.genre_ids.includes(getGenreId(genre)));
        displayMovies(filtered);
    }
}

function searchMovies() {
    const query = document.getElementById('searchInput').value;
    if (query.length > 2) {
        fetch(`${BASE_URL}/search/movie?api_key=${API_KEY}&language=ru-RU&query=${query}`)
            .then(res => res.json())
            .then(data => displayMovies(data.results));
    }
}

function getGenreName(id) {
    const genres = {
        28: 'Боевик', 12: 'Приключения', 16: 'Анимация', 35: 'Комедия',
        80: 'Криминал', 99: 'Документальный', 18: 'Драма', 10751: 'Семейный',
        14: 'Фэнтези', 36: 'История', 27: 'Ужасы', 10402: 'Музыка',
        9648: 'Мистика', 10749: 'Романтика', 878: 'Фантастика', 53: 'Триллер'
    };
    return genres[id] || '';
}

function getGenreId(name) {
    const genres = {
        'action': 28, 'adventure': 12, 'comedy': 35, 'drama': 18,
        'horror': 27, 'fantasy': 14
    };
    return genres[name] || 0;
}

function updateSitemap(movies) {
    const urls = movies.map(movie => 
        `<url><loc>https://yourdomain.com/film.html?id=${movie.id}</loc></url>`
    ).join('');
    
    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
    <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
        <url><loc>https://yourdomain.com/</loc></url>
        ${urls}
    </urlset>`;
    
    // Здесь можно сохранить sitemap.xml на сервере
    console.log('Sitemap updated');
}

window.addEventListener('DOMContentLoaded', loadMovies);
