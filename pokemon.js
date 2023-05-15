const setup = async () => {
  const response = await axios.get("https://pokeapi.co/api/v2/pokemon?limit=810");

  const pokemon = response.data.results;
  $('#pokemon').empty();
  for (let pokemonIndex = 0; pokemonIndex < pokemon.length; pokemonIndex++) {
    let innerResponse = await axios.get(`${pokemon[pokemonIndex].url}`);
    let pokemonInfo = innerResponse.data;
    $('#pokemon').append(`
      <div class="pokemonCard card">
        <h3>${pokemonInfo.name}</h3>
        <img src="${pokemonInfo.sprites.front_default}" alt="${pokemonInfo.name}">
        <button type="button" class="btn btn-primary">More Info</button>
      </div>
      `)
  }

};


$(document).ready(setup);