console.log("Warhammer40K Helper Ver0.6");

let gameState = {
  round: 1,
  phase: "コマンドフェイズ",
  activePlayer: 1,
  player1Faction: "",
  player2Faction: "",
  player1Detachment: "",
  player2Detachment: "",
  p1cp: 0,
  p2cp: 0,
  p1vp: 0,
  p2vp: 0
};

window.onload = function(){
  loadFactionSelects();
};

function loadFactionSelects(){
  const p1Faction = document.getElementById("player1Faction");
  const p2Faction = document.getElementById("player2Faction");

  p1Faction.innerHTML = "";
  p2Faction.innerHTML = "";

  Object.keys(factionData).forEach(faction => {
    p1Faction.innerHTML += `<option value="${faction}">${faction}</option>`;
    p2Faction.innerHTML += `<option value="${faction}">${faction}</option>`;
  });

  p1Faction.value = "Space Marines";
  p2Faction.value = "Orks";

  loadDetachmentSelects();

  p1Faction.onchange = loadDetachmentSelects;
  p2Faction.onchange = loadDetachmentSelects;
}

function loadDetachmentSelects(){
  const p1FactionName = document.getElementById("player1Faction").value;
  const p2FactionName = document.getElementById("player2Faction").value;

  const p1Detachment = document.getElementById("player1Detachment");
  const p2Detachment = document.getElementById("player2Detachment");

  p1Detachment.innerHTML = "";
  p2Detachment.innerHTML = "";

  Object.keys(factionData[p1FactionName].detachments).forEach(detachment => {
    p1Detachment.innerHTML += `<option value="${detachment}">${detachment}</option>`;
  });

  Object.keys(factionData[p2FactionName].detachments).forEach(detachment => {
    p2Detachment.innerHTML += `<option value="${detachment}">${detachment}</option>`;
  });

  p1Detachment.value = factionData[p1FactionName].defaultDetachment;
  p2Detachment.value = factionData[p2FactionName].defaultDetachment;
}

function startGame(){
  gameState.player1Faction = document.getElementById("player1Faction").value;
  gameState.player2Faction = document.getElementById("player2Faction").value;
  gameState.player1Detachment = document.getElementById("player1Detachment").value;
  gameState.player2Detachment = document.getElementById("player2Detachment").value;

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

  document.getElementById("player1DetachmentText").textContent =
    gameState.player1Detachment;

  document.getElementById("player2DetachmentText").textContent =
    gameState.player2Detachment;

  document.getElementById("p1cp").textContent = gameState.p1cp;
  document.getElementById("p2cp").textContent = gameState.p2cp;
  document.getElementById("p1vp").textContent = gameState.p1vp;
  document.getElementById("p2vp").textContent = gameState.p2vp;

  updateArmyRules();
  updateTasks();
}

function updateArmyRules(){
  const p1Data = factionData[gameState.player1Faction];
  const p2Data = factionData[gameState.player2Faction];

  document.getElementById("player1ArmyRules").innerHTML =
    makeArmyRuleList(p1Data);

  document.getElementById("player2ArmyRules").innerHTML =
    makeArmyRuleList(p2Data);
}

function makeArmyRuleList(faction){
  let html = "";

  faction.armyRules.forEach(rule => {
    html += `<li><strong>${rule.name}</strong>：${rule.summary}</li>`;
  });

  return html;
}

function updateTasks(){
  document.getElementById("activeTasks").innerHTML = `
    <li>CPを1増やす</li>
    <li>バトルショックを確認する</li>
    <li>アーミールールを確認する</li>
    <li>デタッチメントルールを確認する</li>
  `;

  document.getElementById("inactiveTasks").innerHTML = `
    <li>相手のコマンドフェイズ処理を確認する</li>
    <li>このタイミングで使える割り込み能力があるか確認する</li>
  `;
}
