const inputNode = document.getElementById('input');
const searchBtnNode = document.getElementById('search-btn');
const moviesListNode = document.getElementById('movies-list')
const moviePopupNode = document.getElementById('movie-popup');
const backBtnNode = document.getElementById('back-btn');
const clearInputBtnNode = document.getElementById('clear-btn')

const API_KEY = '185210bd';
const POPUP_OPENED_CLASSNAME = 'movie-popup_open';
const NEGATIVE_RESULT = 'negative-result';

//Получаем название фильма для поиска
const getNameMovie = () => {
    const nameMovie = inputNode.value;
    return nameMovie;
}

//Создание списка найденных фильмов с кратким описанием 
const renderMoviesList = (moviesList) => {
    moviesListNode.innerHTML = '';
    for (let i = 0; i < moviesList.length; i++) {
        const movieItem = document.createElement('li');
        movieItem.className = 'movie-item';
        movieItem.setAttribute('data-imdbid', moviesList[i].imdbID)
        movieItem.innerHTML = `
        <img class="movie-item__image"src="${moviesList[i].Poster}" alt="">
        <div class="movie-item__description">
            <h2 class="description__title">${moviesList[i].Title}</h2>
            <p class="description__year">${moviesList[i].Year}</p>
            <p class="description__type">${moviesList[i].Type}</p>
        </div>`
        moviesListNode.appendChild(movieItem);
    }
}
//Отправка запроса посика списка по названию фильма
const searchListMovies = () => {
    const getingMovie = getNameMovie ();
    fetch(`https://www.omdbapi.com/?s=${getingMovie}&apikey=${API_KEY}`)
        .then((response) => {
            if (response.ok) {
                return response.json();
            }
            else {
                console.log ('error');
            }
        })
        .then((res) => {
            if (res.Response === 'True') {
                let findedMovies = res.Search;
                renderMoviesList(findedMovies);
            }
            else {
                moviesListNode.innerHTML = 'movies not found';
                moviesListNode.classList.add(NEGATIVE_RESULT);
            }
        })
}

//Отрисовка карточки фильма с расширенным описанием (поп-ап)
const renderMovieCard = (InfoMovie) => {
    const title = document.getElementById('title')
    document.getElementById('poster').src = InfoMovie.Poster;
    const year = document.getElementById('year');
    const rated = document.getElementById('rated');
    const relased = document.getElementById('relased');
    const runtime = document.getElementById('runtime');
    const genre = document.getElementById('genre');
    const director = document.getElementById('director');
    const writter = document.getElementById('writter');
    const actors = document.getElementById('actors');
    const plot = document.getElementById('plot');
    
    title.innerText = InfoMovie.Title;
    year.innerText = InfoMovie.Year;
    rated.innerText = InfoMovie.Rated;
    relased.innerText = InfoMovie.Relased;
    runtime.innerText = InfoMovie.Runtime;
    genre.innerText = InfoMovie.Genre;
    director.innerText = InfoMovie.Director;
    writter.innerText = InfoMovie.Writter;
    actors.innerText = InfoMovie.Actors;
    plot.innerText = InfoMovie.Plot;
}

//отправка запроса на поиск подробной информации о фильме по ID
const searchMovieInfo = (movieID) => {
    fetch(`https://www.omdbapi.com/?i=${movieID}&apikey=${API_KEY}`)
        .then((response) => {
            if (response.ok) {
                return response.json();
            }
            alert ('error');
        })
        .then((res) => {
            let InfoMovie = res;
            renderMovieCard(InfoMovie);
        })
}
//функция открытия поп-апа (подробной карточки фильма)
const openPopup = () => {
    moviePopupNode.classList.add(POPUP_OPENED_CLASSNAME);
}
//функция закрытия поп-апа (подробной карточки фильма)
const closePopup = () => {
    moviePopupNode.classList.remove(POPUP_OPENED_CLASSNAME);
}
//Открытие поп-апа при нажатии на конкретный фильм
const openMovieCard = (event) => {
    const currentMovieItem = event.target.closest(".movie-item");
    const movieImdbId = currentMovieItem.dataset.imdbid;
    openPopup();
    searchMovieInfo(movieImdbId);
}

const searchButtonHandler = () => {
    searchListMovies();
}
//Кнопка очистки инпута
const clearInput = () => {
    inputNode.value = '';
}
moviesListNode.addEventListener('click', openMovieCard)
backBtnNode.addEventListener('click', closePopup);
searchBtnNode.addEventListener('click', searchButtonHandler);
clearInputBtnNode.addEventListener('click', clearInput);
