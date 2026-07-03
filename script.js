console.log("40K Navigator Ver0.9");

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
  p2vp: 0,
  checkedTasks: {},
  usedRules: {}
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
  gameState.checkedTasks = {};
  gameState.usedRules = {};

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

function stateKey(){
  return `${gameState.round}_${gameState.currentTurn}_${currentPhase().id}`;
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
  const target = document.getElementById("selfTasks");
  const key = stateKey();

  if(!gameState.checkedTasks[key]){
    gameState.checkedTasks[key] = {};
  }

  let tasks;

  if(gameState.currentTurn === "self"){
    tasks = phase.selfTasks;
  }else{
    tasks = [
      { id:"watch_opponent", text:"相手ターンです。相手の行動を確認する" },
      { id:"reactive_rules", text:"自分が割り込める能力・ストラタジェムを確認する" }
    ];
  }

  target.innerHTML = tasks.map(task => {
    const checked = gameState.checkedTasks[key][task.id] ? "checked" : "";
    const doneClass = checked ? "done" : "";
    return `
      <label class="task-row ${doneClass}">
        <input type="checkbox" ${checked} onchange="toggleTask('${task.id}', this.checked)">
        <span>${task.text}</span>
      </label>
    `;
  }).join("");
}

function toggleTask(taskId, checked){
  const key = stateKey();
  if(!gameState.checkedTasks[key]){
    gameState.checkedTasks[key] = {};
  }
  gameState.checkedTasks[key][taskId] = checked;
  updateTasks();
}

function updateAvailableRules(){
  const phase = currentPhase();

  const selfData = factionData[gameState.player1Faction];
  const opponentData = factionData[gameState.player2Faction];

  document.getElementById("selfAvailable").innerHTML =
    makeAvailableList("self", selfData, gameState.player1Detachment, gameState.currentTurn === "self", phase);

  document.getElementById("opponentAvailable").innerHTML =
    makeAvailableList("opponent", opponentData, gameState.player2Detachment, gameState.currentTurn === "opponent", phase, true);
}

function makeAvailableList(owner, faction, detachmentName, isActiveTurn, phase, isOpponentBox=false){
  let rules = [];

  faction.armyRules.forEach(rule => {
    if(rule.phase === phase.id || rule.once === "1ゲーム1回"){
      if(isActiveTurn || rule.once === "1ゲーム1回"){
        rules.push({
          type:"army",
          name:rule.name,
          timing:rule.timing,
          summary:rule.summary,
          cp:null,
          once:rule.once
        });
      }
    }
  });

  const detachment = faction.detachments[detachmentName];
  if(detachment && detachment.detachmentRule){
    rules.push({
      type:"detachment",
      name:detachment.detachmentRule.name,
      timing:detachment.detachmentRule.timing,
      summary:detachment.detachmentRule.summary,
      cp:null,
      once:"常時"
    });
  }

  if(detachment && detachment.stratagems){
    detachment.stratagems.forEach(stratagem => {
      if(stratagem.phases.includes(phase.id)){
        const shouldShow =
          stratagem.owner === "both" ||
          (stratagem.owner === "active" && isActiveTurn) ||
          (stratagem.owner === "reactive" && !isActiveTurn);

        if(shouldShow){
          rules.push({
            type:"stratagem",
            name:stratagem.name,
            timing:stratagem.timing,
            summary:stratagem.summary,
            cp:stratagem.cp,
            once:stratagem.once
          });
        }
      }
    });
  }

  if(rules.length === 0){
    return `<div class="rule-row"><div class="rule-main">今使えるものはありません</div></div>`;
  }

  return rules.map(rule => renderRule(owner, rule)).join("");
}

function renderRule(owner, rule){
  const id = `${owner}_${rule.name}`;
  const used = gameState.usedRules[id] ? "used" : "";
  const cpText = rule.cp ? `CP${rule.cp}` : "CPなし";
  const buttonText = gameState.usedRules[id] ? "使用済" : "使った";

  return `
    <div class="rule-row ${used}">
      <div class="rule-main">
        <div class="rule-name">${rule.name}</div>
        <div class="rule-meta">${rule.type} / ${cpText} / ${rule.timing} / ${rule.once}</div>
        <div class="rule-summary">${rule.summary}</div>
      </div>
      <button class="use-button" onclick="toggleRuleUsed('${id}')">${buttonText}</button>
    </div>
  `;
}

function toggleRuleUsed(id){
  gameState.usedRules[id] = !gameState.usedRules[id];
  updateScreen();
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
}
