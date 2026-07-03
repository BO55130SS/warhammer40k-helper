console.log("40K Navigator Ver0.8");

let gameState = {
  round: 1,
  phaseIndex: 0,
  currentTurn: "self",
  firstTurn: "self",
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
  gameState.firstTurn = document.getElementById("firstTurn").value;
  gameState.currentTurn = gameState.firstTurn;
  gameState.round = 1;
  gameState.phaseIndex = 0;

  document.getElementById("setupScreen").classList.remove("active");
  document.getElementById("gameScreen").classList.add("active");

  updateScreen();
}

function backToSetup(){
  document.getElementById("gameScreen").classList.remove("active");
  document.getElementById("setupScreen").classList.add("active");
}

function currentPhase(){
  return phaseData[gameState.phaseIndex];
}

function nextStep(){
  if(gameState.phaseIndex < phaseData.length - 1){
    gameState.phaseIndex++;
  }else{
    gameState.phaseIndex = 0;
    if(gameState.currentTurn === gameState.firstTurn){
      gameState.currentTurn = otherPlayer(gameState.firstTurn);
    }else{
      gameState.currentTurn = gameState.firstTurn;
      gameState.round++;
    }
  }
  updateScreen();
}

function previousStep(){
  if(gameState.phaseIndex > 0){
    gameState.phaseIndex--;
  }else{
    if(gameState.currentTurn === gameState.firstTurn){
      if(gameState.round > 1){
        gameState.round--;
        gameState.currentTurn = otherPlayer(gameState.firstTurn);
        gameState.phaseIndex = phaseData.length - 1;
      }
    }else{
      gameState.currentTurn = gameState.firstTurn;
      gameState.phaseIndex = phaseData.length - 1;
    }
  }
  updateScreen();
}

function otherPlayer(player){
  return player === "self" ? "opponent" : "self";
}

function updateScreen(){
  const phase = currentPhase();

  document.getElementById("roundText").textContent =
    "第" + gameState.round + "バトルラウンド";

  document.getElementById("turnText").textContent =
    gameState.currentTurn === "self" ? "現在：自分ターン" : "現在：相手ターン";

  document.getElementById("phaseText").textContent = phase.name;

  document.getElementById("selfFactionText").textContent =
    "勢力：" + gameState.player1Faction;

  document.getElementById("selfDetachmentText").textContent =
    "デタッチメント：" + gameState.player1Detachment;

  document.getElementById("opponentFactionText").textContent =
    "勢力：" + gameState.player2Faction;

  document.getElementById("opponentDetachmentText").textContent =
    "デタッチメント：" + gameState.player2Detachment;

  document.getElementById("p1cp").textContent = gameState.p1cp;
  document.getElementById("p2cp").textContent = gameState.p2cp;
  document.getElementById("p1vp").textContent = gameState.p1vp;
  document.getElementById("p2vp").textContent = gameState.p2vp;

  updateTasks();
  updateAvailableRules();
}

function updateTasks(){
  const phase = currentPhase();
  const selfTasks = document.getElementById("selfTasks");

  if(gameState.currentTurn === "self"){
    selfTasks.innerHTML = phase.selfTasks.map(t => `<li>${t}</li>`).join("");
  }else{
    selfTasks.innerHTML = [
      "相手ターンです",
      "相手の行動を確認する",
      "自分が割り込める能力・ストラタジェムを確認する"
    ].map(t => `<li>${t}</li>`).join("");
  }
}

function updateAvailableRules(){
  const phase = currentPhase();

  const selfData = factionData[gameState.player1Faction];
  const opponentData = factionData[gameState.player2Faction];

  document.getElementById("selfAvailable").innerHTML =
    makeAvailableList(selfData, gameState.currentTurn === "self", phase);

  document.getElementById("opponentAvailable").innerHTML =
    makeAvailableList(opponentData, gameState.currentTurn === "opponent", phase, true);
}

function makeAvailableList(faction, isActiveTurn, phase, isOpponentBox=false){
  let list = [];

  faction.armyRules.forEach(rule => {
    if(isActiveTurn || rule.once === "1ゲーム1回"){
      list.push(`<strong>${rule.name}</strong>：${rule.summary}`);
    }
  });

  if(phase.id === "movement"){
    list.push("警戒射撃など、このタイミングで使える割り込みを確認");
  }

  if(phase.id === "shooting"){
    list.push("対象にされた時の防御系能力を確認");
  }

  list.push("Command Re-roll：必要なロール時に使用可能");

  if(!isActiveTurn && isOpponentBox){
    list.unshift("相手ターンで使用可能な能力のみ要確認");
  }

  if(list.length === 0){
    return "<li>今使えるものはありません</li>";
  }

  return list.map(item => `<li>${item}</li>`).join("");
}

function changeCP(player, amount){
  if(player === "self"){
    gameState.p1cp = Math.max(0, gameState.p1cp + amount);
  }else{
    gameState.p2cp = Math.max(0, gameState.p2cp + amount);
  }
  updateScreen();
}

function changeVP(player, amount){
  if(player === "self"){
    gameState.p1vp = Math.max(0, gameState.p1vp + amount);
  }else{
    gameState.p2vp = Math.max(0, gameState.p2vp + amount);
  }
  updateScreen();
