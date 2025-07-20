const API_KEY = '7cb67565ace3a08cd9d099c749787121';
const IMAGE_URL = 'https://image.tmdb.org/t/p/w300';

async function loadFilm() {
  const id = new URLSearchParams(location.search).get('id');
  const [film, credits, similar, videos] = await Promise.all([
    fetch(`https://api.themoviedb.org/3/movie/${id}?api_key=${API_KEY}&language=ru-RU`).then(r => r.json()),
    fetch(`https://api.themoviedb.org/3/movie/${id}/credits?api_key=${API_KEY}`).then(r => r.json()),
    fetch(`https://api.themoviedb.org/3/movie/${id}/similar?api_key=${API_KEY}&language=ru-RU`).then(r => r.json()),
    fetch(`https://api.themoviedb.org/3/movie/${id}/videos?api_key=${API_KEY}&language=ru-RU`).then(r => r.json())
  ]);

  const trailer = videos.results.find(v => v.site === 'YouTube' && v.type === 'Trailer');
  const trailerId = trailer ? trailer.key : '';

  document.getElementById('filmContainer').innerHTML = `
    <div class="film-card">
      <img src="${IMAGE_URL}${film.poster_path}" class="film-poster" alt="${film.title}">
      <div class="film-info">
        <h1>${film.title}</h1>
        <div class="film-meta">
          <span>⭐ ${film.vote_average}</span>
          <span>📅 ${film.release_date}</span>
          <span>⏱️ ${film.runtime} мин</span>
          <span>💰 ${(film.budget || 0).toLocaleString('ru-RU')} $</span>
        </div>
        <p class="film-overview">${film.overview}</p>

        ${trailerId ? `
          <h3>Официальный русский трейлер</h3>
          <iframe class="trailer-frame" src="https://www.youtube.com/embed/${trailerId}" allowfullscreen></iframe>
        ` : ''}

        <h3>Актёры</h3>
        <div class="cast-row">
          ${credits.cast.slice(0, 10).map(c => `
            <div class="cast-item">
              <img src="${IMAGE_URL}${c.profile_path}" alt="${c.name}">
              <p>${c.name}</p>
            </div>
          `).join('')}
        </div>

        <h3>Похожие фильмы</h3>
        <div class="similar-row">
          ${similar.results.slice(0, 8).map(m => `
            <div class="similar-item" onclick="location.href='film.html?id=${m.id}'">
              <img src="${IMAGE_URL}${m.poster_path}" alt="${m.title}">
              <p>${m.title}</p>
            </div>
          `).join('')}
        </div>
      </div>
    </div>
  `;
}

loadFilm();
