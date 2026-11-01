import { useState, useEffect } from 'react';

function App() {
  const [pokemons, setPokemons] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch('https://pokeapi.co/api/v2/pokemon?limit=12');
      const data = await response.json();

      const detailedData = await Promise.all(
        data.results.map(async (poke) => {
          const res = await fetch(poke.url);
          return res.json();
        })
      );
      setPokemons(detailedData);
    };
    fetchData();
  }, []);

  return (
    <div style={{ padding: '20px', fontFamily: 'sans-serif', backgroundColor: '#1a1a1a', color: 'white', minHeight: '100vh' }}>
      <h1 style={{ textAlign: 'center' }}>Pokedex - Tarea 3</h1>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px', justifyContent: 'center' }}>
        {pokemons.map((poke) => (
          <div key={poke.id} style={{ border: '1px solid #444', padding: '15px', borderRadius: '10px', textAlign: 'center', backgroundColor: '#2a2a2a', width: '200px' }}>
            <img src={poke.sprites.front_default} alt={poke.name} width="120" />
            <h3 style={{ textTransform: 'capitalize', margin: '10px 0' }}>{poke.name}</h3>
            <p style={{ margin: '5px 0' }}><strong>Peso:</strong> {poke.weight} hg</p>
            <p style={{ margin: '5px 0' }}><strong>Tipo:</strong> {poke.types[0].type.name}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;