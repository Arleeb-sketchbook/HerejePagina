
let shakeInterval = null;
let lastExcess = 0;
const progressContainer = document.querySelector('.progress-container');
const checkboxes = document.querySelectorAll('input[type="checkbox"]');
const xInputs = document.querySelectorAll('.x-input');
const totalSpan = document.getElementById('total');
const maxSpan = document.getElementById('max');
const progressBar = document.getElementById('progressBar');
const maxInput = document.getElementById('maxTributos');
let codexUsers = {
  unselected:{ color: '#888'   , glow: 'rgba(120,120,120,0.25)',name:'???'},
  akatsuki:  { color: '#e53935', glow: 'rgba(229,57,53,0.45)'  ,name:'Akatsuki'},
  elios:     { color: '#9c6cff', glow: 'rgba(156,108,255,0.45)',name:'Elios'},
  jojo:      { color: '#ffd84d', glow: 'rgba(255,216,77,0.45)' ,name:'JoJo'},
  clementine:{ color: '#6fdcff', glow: 'rgba(111,220,255,0.45)',name:'Clementine'},
  quiron:    { color: '#ff8ad8', glow: 'rgba(255,138,216,0.45)',name:'Quiron'},
  zeraiya:   { color: '#3f8cff', glow: 'rgba(63,140,255,0.45)' ,name:'Zeraiya'},
  chance:    { color: '#DC143C', glow: 'rgba(220, 20, 60,0.45)',name:'Chance'}
};

document.getElementById("DarkForce").addEventListener("change", function() {

  if (this.checked) {
    codexUsers = {
      unselected:{ color: '#888888', glow: 'rgba(120,120,120,0.25)', name:'???'},
      akatsuki:  { color: '#35e0e4', glow: 'rgba(53,224,228,0.45)',  name:'Akatsuki'},
      elios:     { color: '#cfff6c', glow: 'rgba(207,255,108,0.45)', name:'Elios'},
      jojo:      { color: '#4d73fe', glow: 'rgba(77,115,254,0.45)',  name:'JoJo'},
      clementine:{ color: '#ff916f', glow: 'rgba(255,145,111,0.45)', name:'Clementine'},
      quiron:    { color: '#89ffb0', glow: 'rgba(137,255,176,0.45)', name:'Quiron'},
      zeraiya:   { color: '#ffb13f', glow: 'rgba(255,177,63,0.45)',  name:'Zeraiya'},
      chance:    { color: '#13dcb4', glow: 'rgba(19,220,180,0.45)',  name:'Chance'}
    };
  } else {
    codexUsers = {
      unselected:{ color: '#888'   , glow: 'rgba(120,120,120,0.25)',name:'???'},
      akatsuki:  { color: '#e53935', glow: 'rgba(229,57,53,0.45)'  ,name:'Akatsuki'},
      elios:     { color: '#9c6cff', glow: 'rgba(156,108,255,0.45)',name:'Elios'},
      jojo:      { color: '#ffd84d', glow: 'rgba(255,216,77,0.45)' ,name:'JoJo'},
      clementine:{ color: '#6fdcff', glow: 'rgba(111,220,255,0.45)',name:'Clementine'},
      quiron:    { color: '#ff8ad8', glow: 'rgba(255,138,216,0.45)',name:'Quiron'},
      zeraiya:   { color: '#3f8cff', glow: 'rgba(63,140,255,0.45)' ,name:'Zeraiya'},
      chance:    { color: '#DC143C', glow: 'rgba(220, 20, 60,0.45)',name:'Chance'}
    };
  }

const select = document.getElementById('userSelect');

function saveState() {
  const state = {
    user: select.value,
    max: maxInput.value,
    checks: [...checkboxes].map(cb => cb.checked),
    xs: [...xInputs].map(x => x.value),
    activeTab: document.querySelector('.tab.active')?.dataset.section
  };

  localStorage.setItem("ecoCodexState", JSON.stringify(state));
}

function loadState() {
  const saved = localStorage.getItem("ecoCodexState");
  if (!saved) return;

  const state = JSON.parse(saved);

  // Restaurar usuario
  select.value = state.user ?? "unselected";
  applyCodexUser(select.value);

  // Restaurar máximo
  //maxInput.value = state.max ?? 30;

  // Restaurar checkboxes
  checkboxes.forEach((cb, i) => {
    if (state.checks && state.checks[i] !== undefined) {
      cb.checked = state.checks[i];
    }
  });
if (state.activeTab) {
  tabs.forEach(t => t.classList.remove('active'));
  sections.forEach(sec => sec.classList.remove('active'));

  document.querySelector(`.tab[data-section="${state.activeTab}"]`)
    ?.classList.add('active');

  document.getElementById(state.activeTab)
    ?.classList.add('active');
}
  // Restaurar valores X
  xInputs.forEach((x, i) => {
    if (state.xs && state.xs[i] !== undefined) {
      x.value = state.xs[i];
    }
  });
  updateFaviconFromAura();
  updateCursorFromAura();
  updateTotal();
}
function applyCodexUser(userKey) {
  const user = codexUsers[userKey];
  if (!user) return;
  	document.documentElement.style.setProperty('--aura-color', user.color);
  	document.documentElement.style.setProperty('--aura-glow', user.glow);
	document.title = "ECO-CODICE — " + user.name;
}

function generateCursorSVG(strokeColor, glowColor = null) {
  let glowFilter = '';

  if (glowColor) {
    glowFilter = `
      <defs>
        <filter id="glow">
          <feGaussianBlur stdDeviation="3" result="blur"/>
          <feMerge>
            <feMergeNode in="blur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
      </defs>
    `;
  }

  return `
    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32">
      ${glowFilter}
      <circle cx="16" cy="16" r="5"
              fill="none"
              stroke="${strokeColor}"
              stroke-width="2"
              ${glowColor ? 'filter="url(#glow)"' : ''}/>
    </svg>
  `;
}
function updateCursorFromAura() {
  const auraColor = getComputedStyle(document.documentElement)
    .getPropertyValue('--aura-color')
    .trim();

 function makeCursor(strokeWidth = 2, scale = 1) {
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32">
      <g transform="translate(2,2) rotate(-25 14 10) scale(${scale})">
        <polyline 
          points="4,20 14,4 24,20"
          fill="none"
          stroke="${auraColor}"
          stroke-width="${strokeWidth}"
          stroke-linecap="round"
          stroke-linejoin="round"/>
      </g>
    </svg>
  `;

  return `url("data:image/svg+xml,${encodeURIComponent(svg)}") 14 6, auto`;
}

  // Cursor normal
  const normalCursor = makeCursor(2, 1);

  // Cursor pointer (más intenso)
  const pointerCursor = makeCursor(3.5, 0.95);

  document.body.style.cursor = normalCursor;

  // Aplicar pointer a elementos interactivos
  const interactive = document.querySelectorAll(
    'a, button, input, select, textarea, .tab'
  );

  interactive.forEach(el => {
    el.style.cursor = pointerCursor;
  });
}
function updateFaviconFromAura() {
  const auraColor = getComputedStyle(document.documentElement)
    .getPropertyValue('--aura-color')
    .trim();

  const svg = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
  <rect width="100%" height="100%" fill="none"/>

  <polygon
    points="50,88 12,18 88,18"
    fill="none"
    stroke="${auraColor}"
    stroke-width="4"
  />

</svg>`.trim();

  const encoded = encodeURIComponent(svg);
  const favicon = document.getElementById('favicon');

  favicon.setAttribute(
    'href',
    `data:image/svg+xml,${encoded}`
  );
}

// inicial
applyCodexUser(select.value);
updateFaviconFromAura();
updateCursorFromAura();

select.addEventListener('change', e => {
  applyCodexUser(e.target.value);
  updateFaviconFromAura();
  updateCursorFromAura();
});
function updateSelectedSkills() {
  const container = document.getElementById("selectedSkills");
  const selected = [];

  checkboxes.forEach(cb => {
    if (!cb.checked) return;

    const row = cb.closest("tr");
    if (!row) return;

    const name = row.children[1]?.textContent.trim();
    if (!name) return;

    const xInput = row.querySelector(".x-input");
    let label = name;

    if (xInput) {
      const xVal = parseInt(xInput.value) || 0;
      if (xVal > 0) {
        label += ` (${xVal})`;
      }
    }

    selected.push(label);
  });

  container.innerHTML = selected.length
    ? selected.map(s => `<span>${s}</span>`).join("")
    : "<span>Ninguna habilidad seleccionada</span>";
}
function updateTotal() {
  let total = 0;
  const max = parseInt(maxInput.value);
  maxSpan.textContent = max;

  checkboxes.forEach(cb => {
    if (!cb.checked) return;
    const row = cb.closest('tr');
    const costText = row.children[2].textContent;

    let base = 0, x = 0;
    const match = costText.match(/^(\d+)?(?:\(\+?(\d+)X\))?$|^(\d+)X$/);

    if (match) {
      if (match[1]) base = parseInt(match[1]);
      if (match[2] || match[3]) {
        const mult = parseInt(match[2] || match[3]);
        const xi = row.querySelector('.x-input');
        x = mult * parseInt(xi?.value || 0);
      }
    }
    total += base + x;
  });

  totalSpan.textContent = total;

  const percent = Math.min((total / max) * 100, 100);
  progressBar.style.width = percent + "%";
const excess = Math.max(0, total - max);

// si cambió el exceso, reiniciamos el temblor
if (excess !== lastExcess) {
  clearInterval(shakeInterval);
  shakeInterval = null;
  lastExcess = excess;
}

if (excess > 0) {
  progressBar.classList.add('over');
  progressContainer.classList.add('over');

  const intensity = Math.min(excess, 20);

  const maxOffset = 2 + intensity * 1.2;   // 🔥 MUCHO más desplazamiento
  const minSpeed = 25;
  const speed = Math.max(
    minSpeed,
    160 - intensity * 12
  );

  if (!shakeInterval) {
    shakeInterval = setInterval(() => {
const x = (Math.random() * 2 - 1) * maxOffset;
const y = (Math.random() * 2 - 1) * maxOffset * 0.4;
let rot = 0;
if (Math.random() < 0.7) {
  rot = (Math.random() - 0.5) *
    Math.min(intensity * 0.35, 4); // 🔥 antes 0.12 / 1.2
}
      progressContainer.style.transform =
  `translate(${x}px, ${y}px) rotate(${rot}deg)`;
    }, speed);
  }

} else {
  progressBar.classList.remove('over');
  progressContainer.classList.remove('over');

  clearInterval(shakeInterval);
  shakeInterval = null;
  lastExcess = 0;

  progressContainer.style.transform = 'translate(0,0)';
}
updateSelectedSkills();
  // 🔥 ALERTA HERÉTICA
if (total > max) {
  progressBar.classList.add('over');
  progressContainer.classList.add('over');
} else {
  progressBar.classList.remove('over');
  progressContainer.classList.remove('over');
}
}

const mutExclusives = document.querySelectorAll('.mut-exclusive');

mutExclusives.forEach(cb => {
  cb.addEventListener('change', () => {
    if (cb.checked) {
      mutExclusives.forEach(other => {
        if (other !== cb) other.checked = false;
      });
    }
    updateTotal(); // actualiza total si lo necesitas
  });
});
const aspectos = document.querySelectorAll('.aspecto-exclusive');

aspectos.forEach(cb => {
  cb.addEventListener('change', () => {
    if (cb.checked) {
      // desmarca los demás
      aspectos.forEach(other => {
        if (other !== cb) other.checked = false;
      });
    }
    updateTotal(); // para recalcular tributos
  });
});
checkboxes.forEach(cb => cb.addEventListener('change', updateTotal));
xInputs.forEach(x => x.addEventListener('input', updateTotal));
maxInput.addEventListener('input', updateTotal);
updateTotal();
const tabs = document.querySelectorAll('.tab');
const sections = document.querySelectorAll('.codex-section');
loadState();
tabs.forEach(tab => {
  tab.addEventListener('click', () => {
    const target = tab.dataset.section;

    tabs.forEach(t => t.classList.remove('active'));
    sections.forEach(sec => sec.classList.remove('active'));

    tab.classList.add('active');
    document.getElementById(target).classList.add('active');
      
    saveState();
  });
});

checkboxes.forEach(cb => cb.addEventListener('change', saveState));
xInputs.forEach(x => x.addEventListener('input', saveState));
select.addEventListener('change', saveState);
maxInput.addEventListener('input', saveState);
const bearerInput = document.getElementById("userSelect");
const logText = document.getElementById("log-content");
function getBearerName() {
  const value = bearerInput.value.trim();
  return value !== "unselected" ? value : "unselected";
}

function generateLog() {
  const name = getBearerName();

  if (bearerInput.value === "unselected") {
    logText.innerHTML = `<h3>Registro Inaccesible</h3>
    <p class="warning">Quien eres?</p>`;
  } else {
    logText.innerHTML = `
    <h3>Hola, <strong>${name}</strong>.</h3>
<p>
Si estás leyendo esto, significa que encontraste un pequeño secreto que guardé.

Esta es la verdad, <strong>${name}</strong>, Yo no cree el Eco-Codice. <br>
Quiero decir, lo "programe", si, pero solo le di una parte de su funcionamiento...<br>
No estoy segura de su origen, mierda, puede ser incluso anterior a todos nosotros, <strong>${name}</strong>.<br>
Ese sigilo en la esquina izquierda es una prueba de que no es completamente controlabe; Creo que las runas significan algo, pero todavía no tengo ni idea.<br>
<br>
Puede que suene loco, pero… creo que lo que les hablo en el Eclipse esperaba que les diera esto. <br>
Cuidense entre ustedes, si, <strong>${name}</strong>? Quien sabe que planea esa Voz.<br>
<br>
Tu Amiga inventora incomprendida,<br>
—Nico
</p>
`;
  }
}


const sigilNote = document.getElementById("sigil-log");
const hiddenLog = document.getElementById("hiddenLog");
const closeLog = document.getElementById("closeLog");

sigilNote.addEventListener("click", () => {
  generateLog();
  hiddenLog.classList.add("active");
});

closeLog.addEventListener("click", () => {
  hiddenLog.classList.remove("active");
});

// cerrar haciendo click fuera del panel
hiddenLog.addEventListener("click", e => {
  if (e.target === hiddenLog) {
    hiddenLog.classList.remove("active");
  }
});

document.querySelectorAll(".toggle-btn").forEach(btn => {
  btn.addEventListener("click", () => {

    const id = btn.dataset.target;
    const box = document.getElementById(id);

    box.classList.toggle("open");

    btn.textContent = box.classList.contains("open")
      ? "Ocultar"
      : "Mostrar";

  });
});

