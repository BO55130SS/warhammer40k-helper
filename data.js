const APP_VERSION = "Ver.0.9";

const factionData = {
  "Space Marines": {
    name: "Space Marines",
    defaultDetachment: "Gladius Task Force",
    detachments: {
      "Gladius Task Force": {
        name: "Gladius Task Force",
        detachmentRule: {
          name: "Combat Doctrines",
          timing: "状況に応じて",
          summary: "戦術ドクトリンを使用して部隊の行動を強化する。"
        },
        stratagems: [
          {
            name: "Command Re-roll",
            cp: 1,
            timing: "ロール時",
            phases: ["command","movement","shooting","charge","fight"],
            owner: "both",
            once: "必要時",
            summary: "特定のロールを振り直す。"
          },
          {
            name: "Armour of Contempt",
            cp: 1,
            timing: "相手の射撃/白兵戦で対象にされた時",
            phases: ["shooting","fight"],
            owner: "reactive",
            once: "フェイズごと",
            summary: "攻撃のAPを軽減する防御系ストラタジェム。"
          }
        ]
      }
    },
    armyRules: [
      {
        name: "Oath of Moment",
        timing: "自軍コマンドフェイズ",
        phase: "command",
        summary: "敵ユニット1つを選び、そのターンの重要目標にする。",
        once: "ターンごと",
        checklist: true
      }
    ]
  },

  "Orks": {
    name: "Orks",
    defaultDetachment: "War Horde",
    detachments: {
      "War Horde": {
        name: "War Horde",
        detachmentRule: {
          name: "Get Stuck In",
          timing: "常時",
          summary: "接近戦での攻撃を強化する。"
        },
        stratagems: [
          {
            name: "Command Re-roll",
            cp: 1,
            timing: "ロール時",
            phases: ["command","movement","shooting","charge","fight"],
            owner: "both",
            once: "必要時",
            summary: "特定のロールを振り直す。"
          },
          {
            name: "Unbridled Carnage",
            cp: 1,
            timing: "白兵戦で攻撃する時",
            phases: ["fight"],
            owner: "active",
            once: "フェイズごと",
            summary: "接近戦攻撃を強化する。"
          }
        ]
      }
    },
    armyRules: [
      {
        name: "Waaagh!",
        timing: "自軍コマンドフェイズ",
        phase: "command",
        summary: "1ゲームに1回、オルク全軍を強化する。",
        once: "1ゲーム1回",
        checklist: true
      }
    ]
  }
};

const phaseData = [
  {
    id: "command",
    name: "コマンドフェイズ",
    selfTasks: [
      { id:"gain_cp", text:"CPを1増やす" },
      { id:"battle_shock", text:"バトルショックを確認する" },
      { id:"army_rule", text:"アーミールールを確認する" },
      { id:"mission", text:"ミッション・得点条件を確認する" }
    ],
    opponentTasks: [
      "相手のコマンドフェイズ処理を確認する",
      "このタイミングで使える割り込み能力があるか確認する"
    ]
  },
  {
    id: "movement",
    name: "移動フェイズ",
    selfTasks: [
      { id:"normal_move", text:"通常移動するユニットを選ぶ" },
      { id:"advance", text:"全力移動するユニットを選ぶ" },
      { id:"fall_back", text:"退却するユニットを確認する" },
      { id:"reserves", text:"増援・戦略的予備戦力を確認する" }
    ],
    opponentTasks: [
      "相手の移動終了時に使える能力を確認する",
      "警戒射撃などの割り込みが可能か確認する"
    ]
  },
  {
    id: "shooting",
    name: "射撃フェイズ",
    selfTasks: [
      { id:"select_shooter", text:"射撃するユニットを選ぶ" },
      { id:"select_target", text:"射撃対象を選ぶ" },
      { id:"resolve_attack", text:"命中→負傷→セーヴ→ダメージを解決する" },
      { id:"after_shooting", text:"射撃後に使える能力を確認する" }
    ],
    opponentTasks: [
      "対象にされた時に使える防御系能力を確認する",
      "セーヴ・Feel No Painなどを確認する"
    ]
  },
  {
    id: "charge",
    name: "突撃フェイズ",
    selfTasks: [
      { id:"select_charger", text:"突撃するユニットを選ぶ" },
      { id:"declare_target", text:"突撃対象を宣言する" },
      { id:"charge_roll", text:"2D6で突撃距離を判定する" },
      { id:"charge_move", text:"突撃成功後の配置を確認する" }
    ],
    opponentTasks: [
      "突撃宣言時に使える能力を確認する",
      "警戒射撃などが可能か確認する"
    ]
  },
  {
    id: "fight",
    name: "白兵戦フェイズ",
    selfTasks: [
      { id:"select_fighter", text:"戦うユニットを選ぶ" },
      { id:"pile_in", text:"パイルインを行う" },
      { id:"melee_attack", text:"近接攻撃を解決する" },
      { id:"consolidate", text:"コンソリデートを確認する" }
    ],
    opponentTasks: [
      "防御系能力を確認する",
      "割り込み・反撃に関係する能力を確認する"
    ]
  }
];
