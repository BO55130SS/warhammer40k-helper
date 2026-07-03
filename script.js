console.log("Warhammer40K Helper Start");

let gameState = {
  round: 1,
  phase: "コマンドフェイズ",
  activePlayer: 1,
  player1Faction: "Space Marines",
  player2Faction: "Orks",
  p1cp: 0,
  p2cp: 0,
  p1vp: 0,
  p2vp: 0
};

window.onload = function(){
  loadFactionSelects();
};

function loadFactionSelects(){
  const p1 = document.getElementById("player1Faction");
  const p2 = document.getElementById("player2Faction");

  p1.innerHTML = "";
  p2.innerHTML = "";

  Object.keys(factionData).forEach(faction => {
    p1.innerHTML += `<option value="${faction}">${faction}</option>`;
    p2.innerHTML += `<option value="${faction}">${faction}</option>`;
  });

  p1.value = "Space Marines";
  p2.value = "Orks";
}

function startGame(){
  gameState.player1Faction = document.getElementById("player1Faction").value;
  gameState.player2Faction = document.getElementById("player2Faction").value;

  document.getElementById("setupScreen").classList.remove("active");
  document.getElementById("gameScreen").classList.add("active");

  updateScreen();
}

function backToSetup(){
  document.getElementById("gameScreen").classList.remove("active");
  document.getElementById("setupScreen").classList.add("active");
}

function updateScreen(){
  document.getElementById("roundText").textContent =
    "第" + gameState.round + "バトルラウンド";

  document.getElementById("phaseText").textContent =
    "現在：" + gameState.player1Faction + "の" + gameState.phase;

  document.getElementById("player1Title").textContent =
    "先攻：" + gameState.player1Faction;

  document.getElementById("player2Title").textContent =
    "後攻：" + gameState.player2Faction;

  document.getElementById("p1cp").textContent = gameState.p1cp;
  document.getElementById("p2cp").textContent = gameState.p2cp;
  document.getElementById("p1vp").textContent = gameState.p1vp;
  document.getElementById("p2vp").textContent = gameState.p2vp;

  updateTasks();
  updateFactionRules();
}

function updateTasks(){
  document.getElementById("activeTasks").innerHTML = `
    <li>CPを1増やす</li>
    <li>バトルショックを確認する</li>
    <li>このフェイズで使える能力を確認する</li>
    <li>ミッションを確認する</li>
  `;

  document.getElementById("inactiveTasks").innerHTML = `
    <li>相手の処理を確認する</li>
    <li>このタイミングで使える能力があれば確認する</li>
  `;
}

function updateFactionRules(){
  const p1Data = factionData[gameState.player1Faction];
  const p2Data = factionData[gameState.player2Faction];

  document.getElementById("activeAvailable").innerHTML =
    makeRuleList(p1Data, true);

  document.getElementById("inactiveAvailable").innerHTML =
    makeRuleList(p2Data, false);
}

function makeRuleList(faction, isActive){
  let html = "";

  faction.armyRules.forEach(rule => {
    html += `<li>${rule.name}：${rule.summary}</li>`;
  });

  html += `<li>コマンドリロール：使用可能</li>`;

  if(!isActive){
    html += `<li>相手ターン中の能力：条件確認</li>`;
  }

  return html;
}
