const chaveApi = 'bb98557c57a6266e1bbbbd1da6c36785';
let atualPage = 1;
const url = `https://api.themoviedb.org/3/movie/popular?api_key=${chaveApi}&language=pt-BR&page=`;

let favoriteMovies = JSON.parse(localStorage.getItem('favorites')) || [];

async function CallMovies(page) {
  document.getElementById('loading').style.display = 'block';
  const response = await fetch(url + page);
  const data = await response.json();
  ShowMovies(data.results);
  document.getElementById('loading').style.display = 'none';
}

function ShowMovies(movies) {
  const moviesContainer = document.getElementById('movies');
  movies.forEach(movie => {
    const movieDiv = document.createElement('div');
    movieDiv.classList.add('movie');
        
    const Favoritado = favoriteMovies.some(favMovie => favMovie.id === movie.id);

    movieDiv.innerHTML = `
      <img src="https://image.tmdb.org/t/p/w200${movie.poster_path}" alt="">
      <button onclick="OpenModal('${movie.title}', '${movie.overview}')">Ver Detalhes</button>
      <button onclick="Fav(${movie.id}, '${movie.title}', '${movie.poster_path}')">
        ${Favoritado ? 'Remover dos Favoritos' : 'Adicionar aos Favoritos'}
      </button>
    `;
    moviesContainer.appendChild(movieDiv);
  });
}

function  OpenModal(title, overview) {
  const modal = document.getElementById('ModalInfos');
  const modalBody = document.getElementById('modalL');
  modalBody.innerHTML = `<h2>${title}</h2><p>${overview}</p>`;
  modal.style.display = 'flex';
}

window.onclick = event => event.target == document.getElementById('ModalInfos') ? document.getElementById('ModalInfos').style.display = 'none' : null;

window.addEventListener('scroll', () => {
  if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 500) {
    atualPage++;
    CallMovies(atualPage);
  }
});

function Fav(id, title, posterPath) {
  const movieIndex = favoriteMovies.findIndex(movie => movie.id === id);

  if (movieIndex > -1) { 
    favoriteMovies.splice(movieIndex, 1);
  } else {
    favoriteMovies.push({ id, title, posterPath });
  }

  localStorage.setItem('favorites', JSON.stringify(favoriteMovies));

  document.getElementById('movies').innerHTML = '';
  CallMovies(atualPage);
}

document.getElementById('verfavs').onclick = () => {
  const moviesContainer = document.getElementById('movies');
  moviesContainer.innerHTML = '';

  if (favoriteMovies.length === 0) {
    moviesContainer.innerHTML = '<p>Nenhum filme favoritado.</p>';
    return;
  }

  favoriteMovies.forEach(movie => {
    const movieDiv = document.createElement('div');
    movieDiv.classList.add('movie');
    movieDiv.innerHTML = `
      <img src="https://image.tmdb.org/t/p/w200${movie.posterPath}" alt="">
    `;
    moviesContainer.appendChild(movieDiv);
  });

  document.getElementById('voltar').style.display = 'inline-block';
  document.getElementById('verfavs').style.display = 'none';
};

document.getElementById('voltar').onclick = () => {
  atualPage = 1;
  CallMovies(atualPage);

  document.getElementById('verfavs').style.display = 'inline-block';
  document.getElementById('voltar').style.display = 'none';
};

CallMovies(atualPage);