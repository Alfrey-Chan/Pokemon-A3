const setup = async () => {
  const response = await axios.get("https://pokeapi.co/api/v2/pokemon?limit=810");

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



  const pokemon = response.data.results;
  $('#pokemon').empty();
  for (let pokemonIndex = 0; pokemonIndex < pokemon.length; pokemonIndex++) {
    let innerResponse = await axios.get(`${pokemon[pokemonIndex].url}`);
    let pokemonInfo = innerResponse.data;
    $('#pokemon').append(`
      <div class="pokemonCard" pokeName=${pokemonInfo.name}>
        <h3>${pokemonInfo.name}</h3>
        <img src="${pokemonInfo.sprites.front_default}" alt="${pokemonInfo.name}">
        <button type="button" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#pokeModal">More Info</button>
      </div>
      `)
  }

};


$(document).ready(setup);