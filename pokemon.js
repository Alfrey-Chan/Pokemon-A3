const pokemonPerPage = 10;
var numPages = 0;
const numPageBtn = 5;


const setup = async () => {
  const response = await axios.get("https://pokeapi.co/api/v2/pokemon?limit=810");
  pokemon = response.data.results;
  numPages = Math.ceil(pokemon.length / pokemonPerPage);

  $('#filterButtons').on('change', '.filterCheckbox', filterPokemon)

  showPage(1);

  $('body').on('click', '.pokemonCard', async function (e) {
    console.log(this);
    const pokemonName = $(this).attr('pokeName')
    console.log("pokemon name: ", pokemonName);
    const res = await axios.get(`https://pokeapi.co/api/v2/pokemon/${pokemonName}`);
    console.log("res.data: ", res.data); 
    const types = res.data.types.map(type => type.type.name);
    console.log("types: ", types);
    $('.modal-body').html(`
      <div style="width: 200px">
        <img src="${res.data.sprites.other['official-artwork'].front_default}" alt="${res.data.name}"/>
      <div>
        <h3>Abilities</h3>
        <ul> ${res.data.abilities.map(ability => `<li>${ability.ability.name}</li>`).join('')}</ul>
      </div>
      <div>
        <h3>Stats</h3>
        <ul> ${res.data.stats.map(stat => `<li>${stat.stat.name}: ${stat.base_stat}</li>`).join('')}</ul>
      </div>
      <div>
        <h3>Types</h3>
        <ul> ${types.map(type => `<li>${type}</li>`).join('')}</ul>
      </div>
      `)
    $('.modal-title').html(`<h2>${res.data.name}</h2>`)

    $('#pokeModal').modal('show');
  });



  $('body').on('click', '.pageBtn', async function (e) {
    const pageNum = parseInt($(this).attr('pageNum'));
    showPage(pageNum);
  });


};

async function showPage(currentPage) {
  const start = (currentPage - 1) * pokemonPerPage;
  const end = start + pokemonPerPage;
  const currentPagePokemon = pokemon.slice(start, end);

  $('#pokemon').empty();
  for (const pokemonData of currentPagePokemon) {
    const res = await axios.get(pokemonData.url);
    const pokemonInfo = res.data;
    $('#pokemon').append(`
    <div class="pokemonCard" pokeName="${pokemonInfo.name}">
      <h3>${pokemonInfo.name}</h3>
      <img src="${pokemonInfo.sprites.front_default}" alt="${pokemonInfo.name}">
      <button type="button" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#pokeModal">More Info</button>
    </div>
    `);
  };


  $('#pagination').empty();
  const startPage = Math.max(1, currentPage - Math.floor(numPageBtn / 2));
  const endPage = Math.min(numPages, startPage + numPageBtn - 1);

  if (currentPage > 1) {
    $('#pagination').append(`
      <button type="button" class="btn btn-primary pageBtn" id="page1" pageNum="1">First</button>
      <button type="button" class="btn btn-primary pageBtn" id="page${currentPage - 1}" pageNum="${currentPage - 1}">Previous</button>
      `)
  }

  for (let i = startPage; i <= endPage; i++) {
    const buttonClass = i === currentPage ? 'btn btn-primary current-page' : 'btn btn-primary pageBtn';
    $('#pagination').append(`
      <button type="button" class="${buttonClass}" id="page${i}" pageNum="${i}">${i}</button>
      `)
  }

  if (currentPage < numPages) {
    $('#pagination').append(`
      <button type="button" class="btn btn-primary pageBtn" id="page${currentPage + 1}" pageNum="${currentPage + 1}">Next</button>
      <button type="button" class="btn btn-primary pageBtn" id="page${numPages}" pageNum="${numPages}">Last</button>
      `)
  }
}

async function filterPokemon() {
  const selectedTypes = $('.filterCheckbox:checked').map(function () {
    return $(this).val();
  }).get();
  console.log("selectedTypes: ", selectedTypes);
}

$(document).ready(setup);