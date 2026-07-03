const APP_VERSION = "Ver.0.8";

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
            timing: "必要なロール時",
            owner: "both",
            summary: "特定のロールを振り直す。"
          }
        ]
      }
    },
    armyRules: [
      {
        name: "Oath of Moment",
        timing: "自軍コマンドフェイズ",
        summary: "敵ユニット1つを選び、そのターンの重要目標にする。",
        once: "ターンごと"
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
            timing: "必要なロール時",
            owner: "both",
            summary: "特定のロールを振り直す。"
          }
        ]
      }
    },
    armyRules: [
      {
        name: "Waaagh!",
        timing: "自軍コマンドフェイズ",
        summary: "1ゲームに1回、オルク全軍を強化する。",
        once: "1ゲーム1回"
      }
    ]
  }
};

const phaseData = [
  {
    id: "command",
    name: "コマンドフェイズ",
    selfTasks: [
      "CPを1増やす",
      "バトルショックを確認する",
      "アーミールールを確認する",
      "デタッチメントルールを確認する"
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
      "通常移動するユニットを選ぶ",
      "全力移動するユニットを選ぶ",
      "退却するユニットを確認する",
      "増援・戦略的予備戦力を確認する"
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
      "射撃するユニットを選ぶ",
      "射撃対象を選ぶ",
      "命中→負傷→セーヴ→ダメージを解決する",
      "射撃後に使える能力を確認する"
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
      "突撃するユニットを選ぶ",
      "突撃対象を宣言する",
      "2D6で突撃距離を判定する",
      "突撃成功後の配置を確認する"
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
      "戦うユニットを選ぶ",
      "パイルインを行う",
      "近接攻撃を解決する",
      "コンソリデートを確認する"
    ],
    opponentTasks: [
      "防御系能力を確認する",
      "割り込み・反撃に関係する能力を確認する"
    ]
  }
];
