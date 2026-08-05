const codexUsers = {
  unselected:{
    color:'#888',
    glow:'rgba(120,120,120,0.25)',
    name:'???'
  },

  akatsuki:{
    color:'#e53935',
    glow:'rgba(229,57,53,0.45)',
    name:'Akatsuki'
  },

  elios:{
    color:'#9c6cff',
    glow:'rgba(156,108,255,0.45)',
    name:'Elios'
  },

  jojo:{
    color:'#ffd84d',
    glow:'rgba(255,216,77,0.45)',
    name:'JoJo'
  },

  clementine:{
    color:'#6fdcff',
    glow:'rgba(111,220,255,0.45)',
    name:'Clementine'
  },

  quiron:{
    color:'#ff8ad8',
    glow:'rgba(255,138,216,0.45)',
    name:'Quiron'
  },

  zeraiya:{
    color:'#3f8cff',
    glow:'rgba(63,140,255,0.45)',
    name:'Zeraiya'
  },

  chance:{
    color:'#DC143C',
    glow:'rgba(220,20,60,0.45)',
    name:'Chance'
  },

 codex:{
    rgb:true,
    color:"#ffffff",
    glow:"rgba(255,255,255,0.4)",
    name:"???"
}
};
const saved = JSON.parse(localStorage.getItem("ecoCodexState"));
const userKey = saved?.user ?? "unselected";
const user = codexUsers[userKey];

document.documentElement.style.setProperty(
    "--aura",
    user.rgb ? "#ffffff" : user.color
);

const color = user.rgb ? "#ffffff" : user.color;

const svg = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
<polygon points="50,88 12,18 88,18"
fill="none"
stroke="${color}"
stroke-width="4"/>
</svg>
`;

document.getElementById("favicon").href =
    "data:image/svg+xml," + encodeURIComponent(svg);