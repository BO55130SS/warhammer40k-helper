const factionData = {
  "Space Marines": {
    name: "Space Marines",
    defaultDetachment: "Gladius Task Force",
    detachments: {
      "Gladius Task Force": {
        name: "Gladius Task Force",
        detachmentRule: {
          name: "Combat Doctrines",
          timing: "自軍コマンドフェイズなど",
          summary: "状況に応じて戦術ドクトリンを使用する。"
        },
        stratagems: []
      }
    },
    armyRules: [
      {
        name: "Oath of Moment",
        timing: "Command Phase",
        summary: "自軍コマンドフェイズで敵ユニット1つを選ぶ。",
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
          summary: "接近戦での攻撃を強化するデタッチメントルール。"
        },
        stratagems: []
      }
    },
    armyRules: [
      {
        name: "Waaagh!",
        timing: "Command Phase",
        summary: "1ゲームに1回、オルク全軍を強化する。",
        once: "1ゲーム1回"
      }
    ]
  }
};
