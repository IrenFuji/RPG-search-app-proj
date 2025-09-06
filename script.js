const API = 'https://rpg-creature-api.freecodecamp.rocks/api/creature/';
const input = document.getElementById('search-input');
const btn = document.getElementById('search-button');
const nameEl = document.getElementById('creature-name');
const idEl = document.getElementById('creature-id');
const weightEl = document.getElementById('weight');
const heightEl = document.getElementById('height');
const typesEl = document.getElementById('types');
const imgEl = document.getElementById('creature-image');
const statEls = {
  'hp': document.getElementById('hp'),
  'attack': document.getElementById('attack'),
  'defense': document.getElementById('defense'),
  'special-attack': document.getElementById('special-attack'),
  'special-defense': document.getElementById('special-defense'),
  'speed': document.getElementById('speed')
};
function clearUI() {
  nameEl.textContent = '';
  idEl.textContent = '';
  weightEl.textContent = '';
  heightEl.textContent = '';
  typesEl.innerHTML = '';
  imgEl.removeAttribute('src');
  Object.values(statEls).forEach(e => e.textContent = '');
}
function fillStats(stats) {
  if (Array.isArray(stats)) {
    stats.forEach(s => {
      const key = (s?.stat?.name || s?.name || '').toLowerCase();
      const val = s?.base_stat ?? s?.baseStat ?? s?.value ?? '';
      if (statEls[key]) statEls[key].textContent = String(val);
    });
  } else if (stats && typeof stats === 'object') {
    Object.keys(statEls).forEach(k => {
      if (k in stats) statEls[k].textContent = String(stats[k]);
    });
  }
}
async function search() {
  const raw = input.value.trim();
  if (!raw) return;
  const isId = /^[0-9]+$/.test(raw);
  const q = isId ? raw : raw.toLowerCase();
  try {
    const res = await fetch(API + encodeURIComponent(q));
    if (!res.ok) throw new Error('Creature not found');
    const data = await res.json();
    clearUI();
    nameEl.textContent = String(data.name || '').toUpperCase();
    idEl.textContent = data.id ? `#${data.id}` : '';
    weightEl.textContent = data.weight != null ? `Weight: ${data.weight}` : '';
    heightEl.textContent = data.height != null ? `Height: ${data.height}` : '';
    typesEl.innerHTML = '';
    const types = Array.isArray(data.types) ? data.types : [];
    types.forEach(t => {
      const n = t?.type?.name || t?.name;
      if (!n) return;
      const s = document.createElement('span');
      s.textContent = String(n).toUpperCase();
      typesEl.appendChild(s);
    });
    const sprite = data?.sprites?.front_default || data?.image || '';
    if (sprite) {
      imgEl.src = sprite;
      imgEl.alt = nameEl.textContent;
    }
    fillStats(data.stats);
  } catch {
    alert('Creature not found');
  }
}
btn.addEventListener('click', search);
input.addEventListener('keydown', e => { if (e.key === 'Enter') search(); });
