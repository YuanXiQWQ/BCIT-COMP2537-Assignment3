document.addEventListener('DOMContentLoaded', () => {
    const modal = document.getElementById('pokemon-modal');
    const modalTitle = document.getElementById('modal-title');
    const modalImage = document.getElementById('modal-image');
    const modalHeight = document.getElementById('modal-height');
    const modalWeight = document.getElementById('modal-weight');
    const modalTypes = document.getElementById('modal-types');
    const modalAbilities = document.getElementById('modal-abilities');
    const modalStats = document.getElementById('modal-stats');
    const closeButton = document.querySelector('.close-button');

    document.querySelectorAll('.pokemon-card').forEach(card => {
        card.addEventListener('click', async () => {
            const pokemonName = card.getAttribute('data-name');
            try {
                const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonName}`);
                const pokemon = await response.json();

                modalTitle.textContent = pokemon.name;
                modalImage.src = pokemon.sprites.front_default;
                modalHeight.textContent = pokemon.height;
                modalWeight.textContent = pokemon.weight;
                modalTypes.textContent = pokemon.types.map(typeInfo => typeInfo.type.name).join(', ');
                modalAbilities.textContent = pokemon.abilities.map(abilityInfo => abilityInfo.ability.name).join(', ');

                modalStats.innerHTML = '';
                pokemon.stats.forEach(stat => {
                    const statItem = document.createElement('li');
                    statItem.textContent = `${stat.stat.name}: ${stat.base_stat}`;
                    modalStats.appendChild(statItem);
                });

                modal.style.display = 'flex';
            } catch (error) {
                console.error('Error fetching Pokémon details:', error);
            }
        });
    });

    closeButton.addEventListener('click', () => {
        modal.style.display = 'none';
    });

    window.addEventListener('click', (event) => {
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    });
});
