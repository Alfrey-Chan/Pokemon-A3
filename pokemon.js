const setup = async () => {
  const response = await axios.get("https://pokeapi.co/api/v2/pokemon?limit=810");
  console.log(response.data.results);
};


$(document).ready(setup);