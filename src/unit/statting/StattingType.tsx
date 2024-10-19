// export const EquipmentType = {
//     WEAPON: {eng: "weapon", kor: "무기"},
//     ARMOR: {eng: "armor", kor: "방어구"}
// } as const;

export type Equipment = EquipmentType.WEAPON | EquipmentType.ARMOR;
export enum EquipmentType {
    WEAPON = 'w',
    ARMOR = 'a'
}
export const EQUIPMENT_PRICE: Record<EquipmentType, string> = {
    'w': "무기",
    'a': "방어구"
}

export enum Mats {
    Metal = "metal",
    Cloth = "cloth",
    Beast = "beast",
    Wood = "wood",
    Medicine = "medicine",
    Mana = "mana",
}
export const MAT_PRICE: Record<Mats, string> = {
    [Mats.Metal]: "금속",
    [Mats.Cloth]: "천",
    [Mats.Beast]: "짐승",
    [Mats.Wood]: "목재",
    [Mats.Medicine]: "약품",
    [Mats.Mana]: "마소",
}

export enum Cat {
    Stats = "스테이터스",
    HpMp = "HP/MP",
    Attack = "공격",
    Defense = "방어",
    Accuracy = "명중",
    Dodge = "회피",
    Speed = "속도",
    Critical = "크리티컬",
    Elements = "속성 내성",
    Special = "기타",
    AElements = "속성 부여"
}