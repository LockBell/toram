import {Cat, Mats} from "./StattingType.tsx";
import {Search} from "../../components/statting/StattingSearch.tsx";

export const MAX_STEPS: number = 20;
export const BONUS_STEPS: number = 9;
export const SLOTS: number = 8;

export const PENALTY_DATA: Array<number> = [0, 0, 20, 45, 80, 125, 180, 245, 320];

export const DEFAULT_WEAPON_RECIPE_POT: number = 46;
export const DEFAULT_WEAPON_STARTING_POT: number = 89;
export const DEFAULT_ARMOR_RECIPE_POT: number = 44;
export const DEFAULT_ARMOR_STARTING_POT: number = 89;

function getMax(search: Search): number {
    return search.bonusSteps;
}

export const OPTIONS: Option[] = [
    { name: "STR", mat: Mats.Beast, pot: 5, cost: 25, cat: Cat.Stats, type: "u", bonus: 1},
    { name: "STR %", mat: Mats.Beast, pot: 10, cost: 50, cat: Cat.Stats, type: "u" },
    { name: "INT", mat: Mats.Wood, pot: 5, cost: 25, cat: Cat.Stats, type: "u", bonus: 1},
    { name: "INT %", mat: Mats.Wood, pot: 10, cost: 50, cat: Cat.Stats, type: "u" },
    { name: "VIT", mat: Mats.Metal, pot: 5, cost: 25, cat: Cat.Stats, type: "u" , bonus: 1},
    { name: "VIT %", mat: Mats.Metal, pot: 10, cost: 50, cat: Cat.Stats, type: "u" },
    { name: "AGI", mat: Mats.Cloth, pot: 5, cost: 25, cat: Cat.Stats, type: "u", bonus: 1 },
    { name: "AGI %", mat: Mats.Cloth, pot: 10, cost: 50, cat: Cat.Stats, type: "u" },
    { name: "DEX", mat: Mats.Medicine, pot: 5, cost: 25, cat: Cat.Stats, type: "u", bonus: 1},
    { name: "DEX %", mat: Mats.Medicine, pot: 10, cost: 50, cat: Cat.Stats, type: "u" },

    { name: "자연 HP회복", mat: Mats.Metal, pot: 5, cost: 25, cat: Cat.HpMp, type: "a", bonus: 1},
    { name: "자연 HP회복 %", mat: Mats.Metal, pot: 10, cost: 50, cat: Cat.HpMp, type: "a"},
    { name: "자연 MP회복", mat: Mats.Wood, pot: 10, cost: 50, cat: Cat.HpMp, type: "a" , bonus: 1, bonusratio: 0.5 },
    { name: "자연 MP회복 %", mat: Mats.Wood, pot: 20, cost: 100, cat: Cat.HpMp, type: "a" },
    { name: "MaxHP", mat: Mats.Metal, pot: 3, cost: "16.49", cat: Cat.HpMp, type: "u", bonus: 160, step: 10 },
    { name: "MaxHP %", mat: Mats.Metal, pot: 10, cost: 50, cat: Cat.HpMp, type: "u", bonus: 1, bonusratio: 1 / 3},
    { name: "MaxMP", mat: Mats.Wood, pot: 6, cost: "33.49", cat: Cat.HpMp, type: "u", max: 15, max_only: true, step: 10, bonus: 10, bonusratio: 0.5 },

    { name: "ATK", mat: Mats.Beast, pot: 3, cost: "16.49", cat: Cat.Attack, type: "w", bonus: 1 },
    { name: "ATK %", mat: Mats.Beast, pot: 10, cost: 50, cat: Cat.Attack, type: "w", bonus: 1, bonusratio: 0.5 },
    { name: "MATK", mat: Mats.Wood, pot: 3, cost: "16.49", cat: Cat.Attack, type: "w", bonus: 1 },
    { name: "MATK %", mat: Mats.Wood, pot: 10, cost: 50, cat: Cat.Attack, type: "w", bonus: 1, bonusratio: 0.5 },
    { name: "안정률 %", mat: Mats.Medicine, pot: 20, cost: 100, cat: Cat.Attack, type: "u", bonus: 1, bonusratio: 1 / 6 },
    { name: "물리 관통 %", mat: Mats.Beast, pot: 20, cost: 100, cat: Cat.Attack, type: "w", bonus: 1, bonusratio: 2 / 5 },
    { name: "마법 관통 %", mat: Mats.Wood, pot: 20, cost: 100, cat: Cat.Attack, type: "w", bonus: 1, bonusratio: 2 / 5 },

    { name: "DEF", mat: Mats.Metal, pot: 3, cost: "16.49", cat: Cat.Defense, type: "a", bonus: 10 },
    { name: "DEF %", mat: Mats.Metal, pot: 10, cost: 50, cat: Cat.Defense, type: "a", bonus: 1, bonusratio: 1 / 3 },
    { name: "MDEF", mat: Mats.Metal, pot: 3, cost: "16.49", cat: Cat.Defense, type: "a", bonus: 10 },
    { name: "MDEF %", mat: Mats.Metal, pot: 10, cost: 50, cat: Cat.Defense, type: "a", bonus: 1, bonusratio: 1 / 3 },
    { name: "물리내성 %", mat: Mats.Metal, pot: 10, cost: 50, cat: Cat.Defense, type: "a", bonus: 1, bonusratio: 1 / 3 },
    { name: "마법내성 %", mat: Mats.Wood, pot: 10, cost: 50, cat: Cat.Defense, type: "a", bonus: 1, bonusratio: 1 / 3 },

    { name: "주위경감 %", mat: Mats.Metal, pot: 6, cost: 15, cat: Cat.Defense, type: "a", nonega: true, max: getMax },
    { name: "범위경감 %", mat: Mats.Metal, pot: 6, cost: 15, cat: Cat.Defense, type: "a", nonega: true, max: getMax },
    { name: "직선경감 %", mat: Mats.Wood, pot: 6, cost: 15, cat: Cat.Defense, type: "a", nonega: true, max: getMax },
    { name: "돌진경감 %", mat: Mats.Wood, pot: 6, cost: 15, cat: Cat.Defense, type: "a", nonega: true, max: getMax },
    { name: "운석경감 %", mat: Mats.Wood, pot: 4, cost: 15, cat: Cat.Defense, type: "a", nonega: true, max: getMax },
    { name: "탄환경감 %", mat: Mats.Wood, pot: 4, cost: 15, cat: Cat.Defense, type: "a", nonega: true, max: getMax },
    { name: "사인경감 %", mat: Mats.Wood, pot: 4, cost: 15, cat: Cat.Defense, type: "a", nonega: true, max: getMax },
    { name: "장판경감 %", mat: Mats.Wood, pot: 4, cost: 15, cat: Cat.Defense, type: "a", nonega: true, max: getMax },


    { name: "명중률", mat: Mats.Medicine, pot: 10, cost: 50, cat: Cat.Accuracy, type: "w", bonus: 2, bonusratio: 2 / 3 },
    { name: "명중률 %", mat: Mats.Medicine, pot: 20, cost: 100, cat: Cat.Accuracy, type: "w", bonus: 1, bonusratio: 1 / 6 },

    { name: "회피", mat: Mats.Cloth, pot: 10, cost: 50, cat: Cat.Dodge, type: "a", bonus: 2, bonusratio: 2 / 3 },
    { name: "회피 %", mat: Mats.Cloth, pot: 20, cost: 100, cat: Cat.Dodge, type: "a", bonus: 1, bonusratio: 1 / 6 },

    { name: "ASPD", mat: Mats.Cloth, pot: 1, cost: "1.49", cat: Cat.Speed, type: "u", bonus: 16 },
    { name: "ASPD %", mat: Mats.Cloth, pot: 1, cost: 5, cat: Cat.Speed, type: "u", bonus: 1, bonusratio: 1 / 6 },
    { name: "CSPD", mat: Mats.Medicine, pot: 1, cost: "1.49", cat: Cat.Speed, type: "u", bonus: 16 },
    { name: "CSPD %", mat: Mats.Medicine, pot: 1, cost: 5, cat: Cat.Speed, type: "u", bonus: 1, bonusratio: 1 / 6 },

    { name: "크리티컬 확률 +", mat: Mats.Mana, pot: 1, cost: 5, cat: Cat.Critical, type: "u", bonus: 1, max_only: true },
    { name: "크리티컬 확률 %", mat: Mats.Mana, pot: 1, cost: 5, cat: Cat.Critical, type: "u", bonus: 1, max_only: true },
    { name: "크리티컬 데미지 +", mat: Mats.Mana, pot: 3, cost: "16.49", cat: Cat.Critical, type: "u", bonus: 1, bonusratio: 1 / 3 },
    { name: "크리티컬 데미지 %", mat: Mats.Mana, pot: 10, cost: 50, cat: Cat.Critical, type: "u", bonus: 1, bonusratio: 1 / 8 },

    { name: "불 속성에 %유리", mat: Mats.Mana, pot: 5, cost: 25, cat: Cat.Elements, type: "w", bonus: 1, bonusratio: 1 / 3  },
    { name: "물 속성에 %유리", mat: Mats.Mana, pot: 5, cost: 25, cat: Cat.Elements, type: "w", bonus: 1, bonusratio: 1 / 3  },
    { name: "바람 속성에 %유리", mat: Mats.Mana, pot: 5, cost: 25, cat: Cat.Elements, type: "w", bonus: 1, bonusratio: 1 / 3  },
    { name: "땅 속성에 %유리", mat: Mats.Mana, pot: 5, cost: 25, cat: Cat.Elements, type: "w", bonus: 1, bonusratio: 1 / 3  },
    { name: "빛 속성에 %유리", mat: Mats.Mana, pot: 5, cost: 25, cat: Cat.Elements, type: "w", bonus: 1, bonusratio: 1 / 3  },
    { name: "어둠 속성에 %유리", mat: Mats.Mana, pot: 5, cost: 25, cat: Cat.Elements, type: "w", bonus: 1, bonusratio: 1 / 3  },
    { name: "불 내성 %", mat: Mats.Mana, pot: 5, cost: 25, cat: Cat.Elements, type: "a", bonus: 1, bonusratio: 2 / 3 },
    { name: "바람 내성 %", mat: Mats.Mana, pot: 5, cost: 25, cat: Cat.Elements, type: "a", bonus: 1, bonusratio: 2 / 3 },
    { name: "바람 내성 %", mat: Mats.Mana, pot: 5, cost: 25, cat: Cat.Elements, type: "a", bonus: 1, bonusratio: 2 / 3 },
    { name: "땅 내성 %", mat: Mats.Mana, pot: 5, cost: 25, cat: Cat.Elements, type: "a", bonus: 1, bonusratio: 2 / 3 },
    { name: "빛 내성 %", mat: Mats.Mana, pot: 5, cost: 25, cat: Cat.Elements, type: "a", bonus: 1, bonusratio: 2 / 3 },
    { name: "어둠 내성 %", mat: Mats.Mana, pot: 5, cost: 25, cat: Cat.Elements, type: "a", bonus: 1, bonusratio: 2 / 3 },

    { name: "이상 내성 %", mat: Mats.Mana, pot: 20, cost: 100, cat: Cat.Special, type: "u", bonus: 1, bonusratio: 1 / 6 },
    { name: "Guard 회복 %", mat: Mats.Mana, pot: 20, cost: 100, cat: Cat.Special, type: "u", max_only: true, bonus: 1, bonusratio: 1 / 6 },
    { name: "Guard율 %", mat: Mats.Mana, pot: 20, cost: 100, cat: Cat.Special, type: "u", max_only: true, bonus: 1, bonusratio: 1 / 6 },
    { name: "Avoid 회복 %", mat: Mats.Mana, pot: 20, cost: 100, cat: Cat.Special, type: "u", max_only: true, bonus: 1, bonusratio: 1 / 6 },
    { name: "어그로 %", mat: Mats.Mana, pot: 6, cost: "33.49", cat: Cat.Special, type: "u", max: 15, max_only: true, bonus: 1, bonusratio: 1 / 2},

    { name: "불 속성", mat: Mats.Mana, pot: 100, cost: 150, cat: Cat.AElements, type: "e", max: 1, nonega: true },
    { name: "물 속성", mat: Mats.Mana, pot: 100, cost: 150, cat: Cat.AElements, type: "e", max: 1, nonega: true },
    { name: "바람 속성", mat: Mats.Mana, pot: 100, cost: 150, cat: Cat.AElements, type: "e", max: 1, nonega: true },
    { name: "땅 속성", mat: Mats.Mana, pot: 100, cost: 150, cat: Cat.AElements, type: "e", max: 1, nonega: true },
    { name: "빛 속성", mat: Mats.Mana, pot: 100, cost: 150, cat: Cat.AElements, type: "e", max: 1, nonega: true },
    { name: "어둠 속성", mat: Mats.Mana, pot: 100, cost: 150, cat: Cat.AElements, type: "e", max: 1, nonega: true },
    { name: "불 속성 (일치)", mat: Mats.Mana, pot: 10, cost: 150, cat: Cat.AElements, type: "e", max: 1, nonega: true },
    { name: "물 속성 (일치)", mat: Mats.Mana, pot: 10, cost: 150, cat: Cat.AElements, type: "e", max: 1, nonega: true },
    { name: "바람 속성 (일치)", mat: Mats.Mana, pot: 10, cost: 150, cat: Cat.AElements, type: "e", max: 1, nonega: true },
    { name: "땅 속성 (일치)", mat: Mats.Mana, pot: 10, cost: 150, cat: Cat.AElements, type: "e", max: 1, nonega: true },
    { name: "빛 속성 (일치)", mat: Mats.Mana, pot: 10, cost: 150, cat: Cat.AElements, type: "e", max: 1, nonega: true },
    { name: "어둠 속성 (일치)", mat: Mats.Mana, pot: 10, cost: 150, cat: Cat.AElements, type: "e", max: 1, nonega: true },
];

export function toramRound(value: number): number {
    if (value > 0) return Math.floor(value);
    return Math.ceil(value);
}

export function deepClone<T>(obj: T): T {
    const clone = JSON.parse(JSON.stringify(obj));
    if (typeof obj === 'object') {
        Object.keys(obj as object)
            .filter(key => !Object.prototype.hasOwnProperty.call(clone, key))
            .forEach(key => clone[key] = obj![key as keyof T]);
    }
    return clone;
}

export interface Option {
    readonly name: string;
    readonly mat: Mats;
    pot: number;
    cost: number|string;
    readonly cat: Cat;
    readonly type: string;

    readonly bonus?: number | undefined;
    readonly max_only?: boolean | undefined;
    readonly step?: number | undefined;
    readonly nonega?: boolean | undefined;
    readonly bonusratio?: number | undefined;
    max?: ((search: Search) => number) | number | undefined;

    bonusdeduction?: number;
}