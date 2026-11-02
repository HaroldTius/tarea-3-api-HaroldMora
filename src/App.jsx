import { useState, useEffect } from 'react';
import './index.css';

function App() {
  const [pokemons, setPokemons] = useState([]);
  const [selectedPokemon, setSelectedPokemon] = useState(null);
  const [description, setDescription] = useState("");

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

  const openModal = async (poke) => {
    setSelectedPokemon(poke);
    setDescription("Procesando datos...");
    try {
      const res = await fetch(poke.species.url);
      const data = await res.json();
      // Filtramos para buscar el texto en español
      const textEntry = data.flavor_text_entries.find(entry => entry.language.name === 'es');
      setDescription(textEntry ? textEntry.flavor_text.replace(/\f/g, ' ') : "Sin registro.");
    } catch (error) {
      setDescription("Error de red Porygon.");
    }
  };

  return (
    <div>
      <header className="header">
        <h1 style={{ fontSize: '24px' }}>POKÉDEX NACIONAL</h1>
      </header>

      <main className="grid">
        {pokemons.map((poke) => (
          <div key={poke.id} className="card" onClick={() => openModal(poke)}>
            <img src={poke.sprites.front_default} alt={poke.name} />
            <h3 style={{ textTransform: 'uppercase', fontSize: '12px', margin: '15px 0' }}>{poke.name}</h3>
            <p style={{ fontSize: '10px', color: '#4b5563' }}>Nº {poke.id.toString().padStart(3, '0')}</p>
          </div>
        ))}
      </main>

      {/* Renderizado condicional del Modal */}
      {selectedPokemon && (
        <div className="modal-overlay" onClick={() => setSelectedPokemon(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="close-btn" onClick={() => setSelectedPokemon(null)}>X</button>
            <h2 style={{ textTransform: 'uppercase', color: '#ef4444', fontSize: '20px' }}>{selectedPokemon.name}</h2>
            <img 
              src={selectedPokemon.sprites.other['official-artwork'].front_default || selectedPokemon.sprites.front_default} 
              alt={selectedPokemon.name} 
              style={{ width: '180px', margin: '10px 0' }} 
            />
            <div style={{ fontSize: '11px', lineHeight: '2', textAlign: 'left', marginTop: '15px', color: '#1f2937' }}>
              <p><strong>Tipo:</strong> {selectedPokemon.types.map(t => t.type.name).join(', ')}</p>
              <p><strong>Peso:</strong> {selectedPokemon.weight / 10} kg</p>
              <p><strong>Altura:</strong> {selectedPokemon.height / 10} m</p>
              <p style={{ marginTop: '15px', borderTop: '2px dashed #9ca3af', paddingTop: '15px' }}>
                <strong>INFO:</strong> {description}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;