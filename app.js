const ingredients = {
  base: [
    { name: "Spark Charge", color: "#00b6a7", vibe: "crisp", price: 3.2, kcal: 35 },
    { name: "Citrus Volt", color: "#b7eb46", vibe: "tart", price: 3.4, kcal: 45 },
    { name: "Berry Pulse", color: "#8e4cff", vibe: "juicy", price: 3.6, kcal: 50 },
    { name: "Cold Brew Kick", color: "#5a3d2b", vibe: "bold", price: 3.8, kcal: 30 }
  ],
  secondary: [
    { name: "Blue Lime", color: "#20a4f3", vibe: "electric", price: 0.9, kcal: 25 },
    { name: "Strawberry Pop", color: "#ff5a5f", vibe: "sweet", price: 1.0, kcal: 35 },
    { name: "Green Apple", color: "#73d13d", vibe: "sharp", price: 0.8, kcal: 30 },
    { name: "Passionfruit", color: "#ffba49", vibe: "tropical", price: 1.1, kcal: 40 }
  ],
  tertiary: [
    { name: "Mint Chill", color: "#6ee7b7", vibe: "cool", price: 0.55, kcal: 5 },
    { name: "Peach Foam", color: "#ffb199", vibe: "soft", price: 0.75, kcal: 45 },
    { name: "Ginger Snap", color: "#d99632", vibe: "spicy", price: 0.65, kcal: 10 },
    { name: "Coconut Cloud", color: "#f7f0df", vibe: "smooth", price: 0.85, kcal: 55 }
  ],
  quaternary: [
    { name: "Taurine Lift", color: "#f7f73f", vibe: "focused", price: 0.7, kcal: 0 },
    { name: "Electrolytes", color: "#78dcca", vibe: "hydrating", price: 0.6, kcal: 0 },
    { name: "B-Complex", color: "#ff8c42", vibe: "bright", price: 0.65, kcal: 0 },
    { name: "Collagen Shot", color: "#f2b5d4", vibe: "silky", price: 0.9, kcal: 20 }
  ]
};

const presets = [
  {
    name: "Neon Sunrise",
    picks: ["Citrus Volt", "Passionfruit", "Peach Foam", "B-Complex"],
    note: "Citrus, tropical, bright finish",
    price: 6.15
  },
  {
    name: "Midnight Volt",
    picks: ["Cold Brew Kick", "Blue Lime", "Mint Chill", "Taurine Lift"],
    note: "Bold caffeine with a cold mint edge",
    price: 5.75
  },
  {
    name: "Berry Static",
    picks: ["Berry Pulse", "Strawberry Pop", "Coconut Cloud", "Electrolytes"],
    note: "Creamy berry with a hydrating finish",
    price: 6.05
  },
  {
    name: "Green Flash",
    picks: ["Spark Charge", "Green Apple", "Ginger Snap", "Taurine Lift"],
    note: "Sharp apple, ginger heat, clean lift",
    price: 5.35
  }
];

const boosts = [
  { name: "Light Ice", price: 0, kcal: 0 },
  { name: "Extra Fizz", price: 0.25, kcal: 0 },
  { name: "Less Sweet", price: 0, kcal: -25 },
  { name: "Double Shot", price: 0.95, kcal: 0 }
];

const labels = {
  base: "Base",
  secondary: "Secondary",
  tertiary: "Tertiary",
  quaternary: "Quaternary"
};

const state = {
  picks: {
    base: ingredients.base[0].name,
    secondary: ingredients.secondary[0].name,
    tertiary: ingredients.tertiary[0].name,
    quaternary: ingredients.quaternary[0].name
  },
  boosts: new Set(["Extra Fizz"])
};

const savedKey = "od-saved-mixes";
const member = {
  code: "OD-2479-86",
  level: 7,
  points: 740,
  next: 1000
};

const byName = name => Object.values(ingredients).flat().find(item => item.name === name);
const money = value => `$${value.toFixed(2)}`;

function renderSelectors() {
  const root = document.querySelector("#selectors");
  root.innerHTML = Object.entries(ingredients).map(([group, options]) => {
    const selected = byName(state.picks[group]);
    return `
      <label class="selector-row">
        <span class="selector-label">
          <span class="swatch" style="background:${selected.color}"></span>
          ${labels[group]}
        </span>
        <select data-group="${group}">
          ${options.map(option => `<option value="${option.name}" ${option.name === state.picks[group] ? "selected" : ""}>${option.name}</option>`).join("")}
        </select>
      </label>
    `;
  }).join("");
}

function renderBoosts() {
  document.querySelector("#boosts").innerHTML = boosts.map(boost => (
    `<button class="boost ${state.boosts.has(boost.name) ? "active" : ""}" type="button" data-boost="${boost.name}">${boost.name}</button>`
  )).join("");
}

function getCurrentItems() {
  return Object.keys(ingredients).map(group => byName(state.picks[group]));
}

function updateMix() {
  const items = getCurrentItems();
  const activeBoosts = boosts.filter(boost => state.boosts.has(boost.name));
  const price = items.reduce((sum, item) => sum + item.price, 0) + activeBoosts.reduce((sum, boost) => sum + boost.price, 0);
  const kcal = Math.max(0, items.reduce((sum, item) => sum + item.kcal, 0) + activeBoosts.reduce((sum, boost) => sum + boost.kcal, 0));
  const vibes = [...new Set(items.map(item => item.vibe))].slice(0, 4);

  document.querySelector("#mixName").textContent = makeMixName(items);
  document.querySelector("#mixMeta").textContent = vibes.join(", ");
  document.querySelector("#priceTotal").textContent = money(price);
  document.querySelector("#calorieEstimate").textContent = `${kcal} kcal`;

  items.forEach((item, index) => {
    document.querySelector(`.layer-${["base", "secondary", "tertiary", "quaternary"][index]}`).style.background = item.color;
  });
}

function makeMixName(items) {
  const first = items[1].name.split(" ")[0];
  const last = items[3].name.split(" ")[0];
  return `${first} ${last}`;
}

function renderPresets() {
  document.querySelector("#presetList").innerHTML = presets.map((preset, index) => `
    <button class="preset" type="button" data-preset="${index}">
      <span>
        <h2>${preset.name}</h2>
        <p>${preset.note}</p>
      </span>
      <span class="preset-price">${money(preset.price)}</span>
    </button>
  `).join("");
}

function applyPreset(index) {
  const preset = presets[index];
  Object.keys(state.picks).forEach((group, groupIndex) => {
    state.picks[group] = preset.picks[groupIndex];
  });
  state.boosts = new Set(index % 2 === 0 ? ["Extra Fizz"] : ["Light Ice"]);
  renderAll();
  showScreen("build");
}

function saveCurrentMix() {
  const saved = getSaved();
  const items = getCurrentItems();
  saved.unshift({
    id: Date.now(),
    name: document.querySelector("#mixName").textContent,
    items: items.map(item => item.name),
    boosts: [...state.boosts]
  });
  localStorage.setItem(savedKey, JSON.stringify(saved.slice(0, 8)));
  renderSaved();
  showScreen("card");
}

function getSaved() {
  try {
    return JSON.parse(localStorage.getItem(savedKey)) || [];
  } catch {
    return [];
  }
}

function renderSaved() {
  const saved = getSaved();
  document.querySelector("#savedList").innerHTML = saved.length ? saved.map(item => `
    <article class="saved-item">
      <h2>${item.name}</h2>
      <p>${item.items.join(" + ")}</p>
    </article>
  `).join("") : `<article class="saved-item"><h2>No saved mixes yet</h2><p>Your custom OD drinks land here.</p></article>`;
}

function drawQr() {
  const canvas = document.querySelector("#qrCanvas");
  const ctx = canvas.getContext("2d");
  const cells = 29;
  const size = canvas.width / cells;
  ctx.fillStyle = "#fff";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "#111214";

  function square(x, y, w) {
    ctx.fillRect(x * size, y * size, w * size, w * size);
  }

  function finder(x, y) {
    square(x, y, 7);
    ctx.fillStyle = "#fff";
    square(x + 1, y + 1, 5);
    ctx.fillStyle = "#111214";
    square(x + 2, y + 2, 3);
  }

  finder(1, 1);
  finder(21, 1);
  finder(1, 21);

  let seed = member.code.split("").reduce((sum, char) => sum + char.charCodeAt(0), 0);
  for (let y = 0; y < cells; y += 1) {
    for (let x = 0; x < cells; x += 1) {
      const inFinder = (x < 9 && y < 9) || (x > 19 && y < 9) || (x < 9 && y > 19);
      seed = (seed * 9301 + 49297) % 233280;
      if (!inFinder && (seed + x * 7 + y * 13) % 5 < 2) square(x, y, 1);
    }
  }
}

function renderMember() {
  const progress = Math.round((member.points / member.next) * 100);
  document.querySelector("#memberLevel").textContent = member.level;
  document.querySelector("#memberTier").textContent = "Neon Regular";
  document.querySelector("#memberCode").textContent = member.code;
  document.querySelector("#pointsLabel").textContent = `${member.points} points`;
  document.querySelector("#nextReward").textContent = `${member.next - member.points} to Level ${member.level + 1}`;
  document.querySelector("#progressFill").style.width = `${progress}%`;
  drawQr();
}

function showScreen(target) {
  document.querySelectorAll(".screen").forEach(screen => {
    screen.classList.toggle("active", screen.dataset.screen === target);
  });
  document.querySelectorAll(".tab").forEach(tab => {
    tab.classList.toggle("active", tab.dataset.target === target);
  });
}

function randomize() {
  Object.entries(ingredients).forEach(([group, options]) => {
    state.picks[group] = options[Math.floor(Math.random() * options.length)].name;
  });
  renderAll();
}

function bindEvents() {
  document.addEventListener("change", event => {
    if (event.target.matches("select[data-group]")) {
      state.picks[event.target.dataset.group] = event.target.value;
      renderAll();
    }
  });

  document.addEventListener("click", event => {
    const tab = event.target.closest("[data-target]");
    const preset = event.target.closest("[data-preset]");
    const boost = event.target.closest("[data-boost]");
    if (tab) showScreen(tab.dataset.target);
    if (preset) applyPreset(Number(preset.dataset.preset));
    if (boost) {
      const value = boost.dataset.boost;
      state.boosts.has(value) ? state.boosts.delete(value) : state.boosts.add(value);
      renderAll();
    }
  });

  document.querySelector("#randomizeMix").addEventListener("click", randomize);
  document.querySelector("#saveMix").addEventListener("click", saveCurrentMix);
  document.querySelector("#clearSaved").addEventListener("click", () => {
    localStorage.removeItem(savedKey);
    renderSaved();
  });
  document.querySelector("[data-open-card]").addEventListener("click", () => showScreen("card"));
}

function renderAll() {
  renderSelectors();
  renderBoosts();
  updateMix();
}

renderSelectors();
renderBoosts();
renderPresets();
renderSaved();
renderMember();
updateMix();
bindEvents();
