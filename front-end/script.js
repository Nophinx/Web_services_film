
const API_URL_DEV = 'http://localhost:5000/';
const IMG_URL = 'https://image.tmdb.org/t/p/w500';
const searchURL = API_URL_DEV + 'discover/1';

/* Les genres sont stocker dans un tableau */
const genres = [
    {
      "id": 28,
      "name": "Action"
    },
    {
      "id": 12,
      "name": "Adventure"
    },
    {
      "id": 16,
      "name": "Animation"
    },
    {
      "id": 35,
      "name": "Comedy"
    },
    {
      "id": 80,
      "name": "Crime"
    },
    {
      "id": 99,
      "name": "Documentary"
    },
    {
      "id": 18,
      "name": "Drama"
    },
    {
      "id": 10751,
      "name": "Family"
    },
    {
      "id": 14,
      "name": "Fantasy"
    },
    {
      "id": 36,
      "name": "History"
    },
    {
      "id": 27,
      "name": "Horror"
    },
    {
      "id": 10402,
      "name": "Music"
    },
    {
      "id": 9648,
      "name": "Mystery"
    },
    {
      "id": 10749,
      "name": "Romance"
    },
    {
      "id": 878,
      "name": "Science Fiction"
    },
    {
      "id": 10770,
      "name": "TV Movie"
    },
    {
      "id": 53,
      "name": "Thriller"
    },
    {
      "id": 10752,
      "name": "War"
    },
    {
      "id": 37,
      "name": "Western"
    }
  ]

const main = document.getElementById('main');
const form = document.getElementById('form');
const search = document.getElementById('search');
const tagsEL = document.getElementById('tags');

/* Selection des genres */
var selectedGenre = []
setGenre();
function setGenre(){
    tagsEL.innerHTML='';
    genres.forEach(genre=> {
        const t = document.createElement('div');
        t.classList.add('tag');
        t.id=genre.id;
        t.innerText = genre.name;
        t.addEventListener('click', () =>{
            if(selectedGenre.length == 0){
                selectedGenre.push(genre.id);
            }else{
                if(selectedGenre.includes(genre.id)){
                    selectedGenre.forEach((id, idx)=>{
                        if(id == genre.id){
                            selectedGenre.splice(idx, 1);
                        }
                    })  
                }else{
                    selectedGenre.push(genre.id);
                }
            }
            console.log(selectedGenre)
            getMovies(API_URL_DEV + "category/" + encodeURI(selectedGenre.join(',')));
            highlightSelection()
        })
        tagsEL.append(t);
    })
}
/*permet de supprimer les tag selectionn?? */
function highlightSelection(){
   const tags = document.querySelectorAll('.tag');
   tags.forEach(tag=>{
       tag.classList.remove('highlight')
   })
   
   clearBtn()
    if(selectedGenre.length !=0){
        selectedGenre.forEach(id =>{
            const highlighedTag = document.getElementById(id);
            highlighedTag.classList.add('highlight')
        })
    }
}
/*permet de supprimer les tagt selectionn?? */
function clearBtn(){
    let clearBtn = document.getElementById('clear');
    if(clearBtn){
        clearBtn.classList.add('highlight')
    }else{
        let clear = document.createElement('div');
        clear.classList.add('tag', 'highlight');
        clear.id = 'clear';
        clear.innerText = 'Supprimer les filtres';
        clear.addEventListener('click', ()=>{
            selectedGenre = [];
            setGenre(); 
            getMovies(API_URL_DEV);
        })
        tagsEL.append(clear);
    }
}

getMovies(searchURL);
/*Message d'erreur si pas resultat */
function getMovies(url) {
    fetch(url).then(res => res.json()).then(data => {
        console.log(data.results)
        if(data.results.length !==0){
            showMovies(data.results);
        }else{
            main.innerHTML= `<h1 class="no-results">No results found<h1>`
        }
    })
}
 
function showMovies(data) {
     
    main.innerHTML='';
  /* inserer du code HTML en JS via le inner html */
    data.forEach(movie => {
        const {title, poster_path, vote_average, overview} = movie;
        const movieEl = document.createElement('div');
        movieEl.classList.add('movie')
        movieEl.innerHTML = `
        <div class = "likes">
        <button>Ajouter au favoris</button>
        </div>
        <img src="${poster_path? IMG_URL+poster_path:"http://via.placeholder.com/1080x1580" }" alt="${title}">
        
    <div class="movie-info">
      <h3>${title}</h3>
      <span class="${getColor(vote_average)}">${vote_average}</span>
    </div>
    <div class="overview">
      <h3>Overview</h3>
      ${overview}
      
    </div>    
    `
        main.appendChild(movieEl);
    });
}
/* fonction qui permet de colorer les notes en fonction de leur chiffre */
function getColor(vote){
    if(vote>= 8){
        return 'green'
    }else if(vote>= 5){
        return "orange"
    }else{
        return 'red'
    }
}
/*fonction de recherche des filmes */
form.addEventListener('submit', (e) => {
  e.preventDefault();

  const searchTerm = search.value ;

  if(searchTerm){
      getMovies(API_URL_DEV+'movie/'+searchTerm)
  }else{
      getMovies(searchURL);
  }
})