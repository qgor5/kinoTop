const API_KEY = '7cb67565ace3a08cd9d099c749787121';
const IMAGE_URL = 'https://image.tmdb.org/t/p/w300';
const BASE_URL = 'https://api.themoviedb.org/3';

async function loadFilm() {
  const id = new URLSearchParams(location.search).get('id');
  const [film, credits, similar] = await Promise.all([
    fetch(`${BASE_URL}/movie/${id}?api_key=${API_KEY}&language=ru-RU`).then(r => r.json()),
    fetch(`${BASE_URL}/movie/${id}/credits?api_key=${API_KEY}`).then(r => r.json()),
    fetch(`${BASE_URL}/movie/${id}/similar?api_key=${API_KEY}&language=ru-RU`).then(r => r.json())
  ]);

  document.title = `${film.title} — трейлер и информация`;

  // YouTube ID по названию
  const trailerId = await fetch(
    `https://api.themoviedb.org/3/movie/${id}/videos?api_key=${API_KEY}&language=en-US`
  ).then(r => r.json()).then(d => d.results.find(v => v.site === 'YouTube')?.key || '');

  document.getElementById('filmContainer').innerHTML = `
    <div class="film-layout">
      <img src="${IMAGE_URL}${film.poster_path}" class="film-poster-big" alt="${film.title}">
      <div class="film-info">
        <h1>${film.title}</h1>
        <div class="film-meta">
          <span>⭐ ${film.vote_average}/10</span>
          <span>📅 ${film.release_date}</span>
          <span>⏱️ ${film.runtime} мин</span>
          <span>🌍 ${film.original_language?.toUpperCase()}</span>
        </div>
        <div>${film.genres.map(g => g.name).join(', ')}</div>
        <p class="film-overview">${film.overview}</p>
        <h3>Трейлер</h3>
        <iframe class="trailer-frame" src="https://www.youtube.com/embed/${trailerId}" allowfullscreen></iframe>

        <h3>Актёры</h3>
        <div class="cast-grid">
          ${credits.cast.slice(0, 12).map(c => `
            <div class="cast-item">
              <img src="${IMAGE_URL}${c.profile_path}" alt="${c.name}">
              <p>${c.name}</p>
            </div>
          `).join('')}
        </div>

        <h3>Похожие фильмы</h3>
        <div class="movies-grid">
          ${similar.results.slice(0, 6).map(m => `
            <div class="movie-card" onclick="location.href='film.html?id=${m.id}'">
              <img src="${IMAGE_URL}${m.poster_path}" class="movie-poster">
              <div class="movie-title">${m.title}</div>
            </div>
          `).join('')}
        </div>
      </div>
    </div>
  `;
}

loadFilm();
