const API_KEY = '7cb67565ace3a08cd9d099c749787121';
const BASE_URL = 'https://api.themoviedb.org/3';
const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/w500';

async function loadFilm() {
    const urlParams = new URLSearchParams(window.location.search);
    const filmId = urlParams.get('id');
    
    const [filmRes, creditsRes] = await Promise.all([
        fetch(`${BASE_URL}/movie/${filmId}?api_key=${API_KEY}&language=ru-RU`),
        fetch(`${BASE_URL}/movie/${filmId}/credits?api_key=${API_KEY}`)
    ]);
    
    const film = await filmRes.json();
    const credits = await creditsRes.json();
    
    document.title = `${film.title} - FilmNow`;
    
    const container = document.getElementById('filmContainer');
    container.innerHTML = `
        <div class="film-header">
            <img src="${IMAGE_BASE_URL}${film.poster_path}" alt="${film.title}" class="film-poster">
            <div class="film-details">
                <h1>${film.title}</h1>
                <div class="film-meta">
                    <span>⭐ ${film.vote_average}/10</span>
                    <span>📅 ${film.release_date}</span>
                    <span>⏱️ ${film.runtime} мин</span>
                </div>
                <div class="film-genres">
                    ${film.genres.map(g => g.name).join(', ')}
                </div>
                <p class="film-overview">${film.overview}</p>
            </div>
        </div>
        
        <div class="trailer-container">
            <h2>Трейлер</h2>
            <iframe src="https://www.youtube.com/embed?listType=search&list=${encodeURIComponent(film.title + ' трейлер')}" 
                    frameborder="0" allowfullscreen></iframe>
        </div>
        
        <div class="film-cast">
            <h2>Актёры</h2>
            <div class="cast-grid">
                ${credits.cast.slice(0, 8).map(actor => `
                    <div class="cast-item">
                        <img src="${actor.profile_path ? IMAGE_BASE_URL + actor.profile_path : 'https://via.placeholder.com/100'}" 
                             alt="${actor.name}">
                        <p>${actor.name}</p>
                    </div>
                `).join('')}
            </div>
        </div>
    `;
}

window.addEventListener('DOMContentLoaded', loadFilm);
