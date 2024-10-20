import React, {CSSProperties, ReactElement} from "react";
import {Cat, Equipment, MAT_PRICE, Mats} from "./StattingType.tsx";
import {Slot} from "./Slot.tsx";
import {deepClone, PENALTY_DATA, SLOTS, toramRound} from "./StattingState.tsx";
import {Formula, FormulaUnit} from "./Formula.tsx";
import {Search} from "../../components/statting/StattingSearch.tsx";

export type Mat = Record<Mats, number>

class MatImpl implements Mat {
    beast: number = 0;
    cloth: number = 0;
    mana: number = 0;
    medicine: number = 0;
    metal: number = 0;
    wood: number = 0;
}

function saveToStorage() {
    // TODO()
}

export class Stat {
    readonly general: Search;
    readonly slots: Slot[] = new Array<Slot>(SLOTS);

    readonly type: Equipment;
    readonly recipePot: number;
    pot: number;
    futurePot: number;
    startingPot: number;

    readonly tec: number;
    readonly potential_return: number;
    readonly bonus_potential_return: number;
    proficiency: number;
    mat_reduction: boolean;
    readonly element_match: boolean;

    finished: boolean|number = false;

    steps: Formula = new Formula(this);
    mats: Mat = new MatImpl();
    stepMats: Mat = new MatImpl();

    maxMats: number = 0;
    stepMaxMats: number = 0;

    // button disabled
    confirmDisabled: boolean = true;
    repeatDisabled: boolean = false;
    undoDisabled: boolean = false;
    redoDisabled: boolean = false;

    constructor(search: Search) {
        this.general = deepClone(search);
        this.type = search.type;
        this.recipePot = search.recipe;
        this.pot = this.futurePot = search.start;
        this.startingPot = search.start;
        this.tec = search.tec || 0;
        this.potential_return = 5 + (this.tec / 10);
        this.bonus_potential_return = this.potential_return / 4;
        this.proficiency = search.proficiency || 0;
        this.element_match = search.element;
        this.mat_reduction = search.matPassives || false;
        for (let i = 0; i < SLOTS; i++) {
            this.slots[i] = new Slot(i, this);
        }

        this.updateFormulaDisplay();
    }

    getMaxSteps(): number {
        return this.general.maxSteps;
    }

    getBonusSteps(): number {
        return this.general.bonusSteps;
    }

    getFormulaDisplay(): ReactElement {
        const xSmall: CSSProperties = { fontSize: 'x-small' };
        const small: CSSProperties = { fontSize: 'small' }
        return (
            <React.Fragment>
                {typeof this.finished === 'number' && (
                    <React.Fragment>
                        <span>성공률: {this.getSuccessRate()}%</span>
                        {this.tec !== 255 && <span color='red' style={xSmall}>({this.tec} TEC)</span>}
                        <br/>
                        {Object.keys(this.mats).filter(mat => !!this.mats[mat as Mats]).map(mat => (
                            <React.Fragment>
                                <span>{this.mats[mat as Mats]} {MAT_PRICE[mat as Mats]}</span>
                                <br/>
                            </React.Fragment>
                        ))}
                        {/*<span style={small}>소재: {*/}
                        {/*    Object.keys(this.mats)*/}
                        {/*        .filter(mat => !!this.mats[mat as Mats])*/}
                        {/*        .map(mat => `${this.mats[mat as Mats]} ${MAT_PRICE[mat as Mats]}`)*/}
                        {/*        .join(' / ')*/}
                        {/*} (Max: {this.maxMats})</span>*/}

                        <span color='green' style={xSmall}>
                            ({function (proficiency: number, matReduction: boolean) {
                                const message = [];
                                if (proficiency) message.push(`${proficiency} 숙련도`);
                                if (matReduction) message.push('10% 소재 감소 적용');
                                return message && message.join(' + ');
                            }(this.proficiency, this.mat_reduction)})
                        </span>
                    </React.Fragment>
                )}
            </React.Fragment>
        );
    }

    calculatePenalty() {
        const categories: Map<Cat, number> = new Map();
        for (const slot of this.slots) {
            if (!slot.statName || (slot.newStat && !slot.futureSteps)) continue;
            if (!categories[slot.statData.cat]) categories[slot.statData.cat] = 0;
            categories[slot.statData.cat]++;
        }
        const penalty_values = Array.from(categories.keys())
            .map(c => categories.get(c))
            .map(repeats => PENALTY_DATA[repeats as number]);
        if (!penalty_values.length) return 1;

        const penalty = penalty_values.reduce((a, b) => a + b);
        return 1 + 0.01 * penalty;
    }

    getCostReduction(): number {
        let percent = 100 - (Math.floor(this.proficiency / 10) + Math.floor(this.proficiency / 50));
        if (this.mat_reduction) percent *= 0.9;
        return 0.01 * percent;
    }

    getSuccessRate(): number {
        if (typeof this.finished === 'number') return this.finished;
        const prev_pot: number = this.pot > this.recipePot ? this.pot : this.recipePot;

        let success_rate: number = 160 + (this.futurePot * 230) / prev_pot;
        if (success_rate > 100) success_rate = 100;
        if (success_rate < 0) success_rate = 0;
        return toramRound(success_rate);
    }

    onUpdate() {
        let delta_pot = 0;
        for (const slot of this.slots) {
            if (!slot.statName) continue;
            delta_pot += slot.getPotentialChange();
        }

        const penalty = this.calculatePenalty();
        this.futurePot = this.pot + toramRound(penalty * delta_pot);
        this.confirmDisabled = this.pot === this.futurePot;
    }

    updateMaterialCosts() {
        // this.confirmDisabled = this.pot === this.futurePot;
    }

    updateFormulaDisplay() {
        this.redoDisabled = !this.steps.redo_queue.length;
        this.undoDisabled = !this.steps.formula.length;
        this.repeatDisabled = !this.steps.formula.length;
    }

    confirm() {
        // remove empty slots
        for (const slot of this.slots) {
            if (slot.newStat && !slot.futureSteps) {
                slot.rawOverride([slot.slotNum, 0, 0]);
            }
        }

        this.stepMats = new MatImpl();
        for (const slot of this.slots) {
            if (!slot.statName) continue;

            // fix any bogus values and interpret what they want.
            slot.cleanUpValue();
            if (slot.currentSteps === slot.futureSteps) continue;

            const used_mat: Mats = slot.getMatType() as Mats;
            const used_mat_amount = slot.getCost();

            this.stepMats[used_mat] += used_mat_amount;

            // log down in formula what steps were
            this.steps.gatherChanges(
                slot.slotNum, slot.statName,
                slot.futureSteps - slot.currentSteps,
                slot.futureStat - slot.currentStat,
                slot.newStat
            );
            slot.confirm();
        }

        for (const mat in this.stepMats) {
            const type: keyof Mat = mat as keyof Mat;
            this.stepMats[type] = toramRound(this.stepMats[type] as number)
            this.mats[type] += this.stepMats[type];
        }

        this.stepMaxMats = Object.keys(this.stepMats)
            .map(m => this.stepMats[m as keyof Mat])
            .sort((a, b) => b - a)[0];
        if (this.stepMaxMats <= this.maxMats)
            this.stepMaxMats = 0;

        this.steps.commitChanges();

        // update max mats
        if (this.stepMaxMats) {
            this.maxMats = this.stepMaxMats;
            this.stepMaxMats = 0;
        }

        if (this.slots.every(slot => slot.statName) || this.futurePot <= 0) {
            this.finished = this.getSuccessRate();
            this.lockAllSlots();
            saveToStorage();
        } else {
            saveToStorage();
            this.pot = this.futurePot;
        }

        this.updateMaterialCosts();
        this.updateFormulaDisplay();
    }

    resetToBase() {
        for (const slot of this.slots) {
            if (slot.newStat) {
                slot.rawOverride([slot.slotNum, 0, 0]);
            } else {
                slot.futureSteps = slot.currentSteps;
                slot.futureStat = slot.currentStat;
            }
        }
    }

    undo() {
        if (!this.steps.formula.length) return;
        this.resetToBase();
        const last_step = this.steps.undo();
        if (this.finished) {
            this.finished = false;
            this.unlockAllSlots();
        }

        // deal with potential
        this.futurePot = this.pot = last_step.pot_before;

        // deal with mat costs
        for (const mat in last_step.step_mats) {
            const key: keyof Mat = mat as keyof Mat;
            this.mats[key] -= last_step.step_mats[key];
        }
        this.maxMats = last_step.max_mats_before;

        // deal with stats
        for (const instruction of last_step.code) {
            const slot_num = instruction[0];

            if (instruction[2]) instruction[2] = 0;
            instruction[1] *= -1;

            this.slots[slot_num].rawOverride(instruction as [number, number, number]);
        }

        // rebuild formula
        this.steps.buildCondensedFormula();
        this.updateFormulaDisplay();
        this.updateMaterialCosts();
        saveToStorage();
    }

    redo() {
        const last_step = this.steps.redo();
        this.resetToBase();

        // deal with potential
        this.futurePot = this.pot = last_step.pot_after;

        // deal with mat costs
        for (const mat in last_step.step_mats) {
            const key: keyof Mat = mat as keyof Mat;
            this.mats[key] += last_step.step_mats[key];
        }
        this.maxMats = last_step.max_mats_after;

        // deal with stats
        const step_data = last_step.code;
        for (const instruction of step_data) {
            const slot_num = instruction[0];
            this.slots[slot_num].rawOverride(instruction as [number, number, number|null]);
        }

        if (last_step.finished) {
            this.finished = last_step.finished;
            this.lockAllSlots();
        }

        // rebuild formula
        this.steps.buildCondensedFormula();
        this.updateFormulaDisplay();
        this.updateMaterialCosts();
        saveToStorage();
    }

    repeat() {
        if (this.finished) return;
        const last_step = this.steps.formula[this.steps.formula.length - 1];

        for (const code of last_step.code) {
            const [slot_num, delta] = code;
            this.slots[slot_num].changeValueBySteps(delta, true);
        }

        this.confirm();
    }

    // saving
    grabSnapshot() {
        return {
            formula: deepClone(this.steps.formula),
            settings: {
                tec: this.tec,
                proficiency: this.proficiency,
                mat_reduction: this.mat_reduction,
                type: this.type,
                recipe_pot: this.recipePot,
                future_pot: this.futurePot,
                starting_pot: this.startingPot,
                potential_return: this.potential_return,
                bonus_potential_return: this.bonus_potential_return,
                finished: this.finished,
                max_mats: this.maxMats,
            },
        }
    }

    // override - auto updating data.
    autoLoad(data) {
        const formula = data.formula;

        this.steps.formula = formula;
        this.steps.buildCondensedFormula();

        Object.assign(this, data.settings);

        for (const step of formula) {
            this.runStepInstruction(step);
        }
    }

    runStepInstruction(instruction: FormulaUnit) {
        this.futurePot = instruction.pot_after;
        this.pot = this.finished ? instruction.pot_before : instruction.pot_after;

        for (const mat in instruction.step_mats) {
            const key: keyof Mat = mat as keyof Mat;
            this.mats[key] += instruction.step_mats[mat as Mats];
        }

        const step_data = instruction.code;
        for (const instr of step_data) {
            const slot_num = instr[0];
            this.slots[slot_num].rawOverride(instr as [number, number, number|null]);
        }

        if (instruction.finished) {
            this.finished = instruction.finished;
            this.lockAllSlots();
        }

        // rebuild formula
        this.steps.buildCondensedFormula();
        this.updateFormulaDisplay();
        this.updateMaterialCosts();
    }

    lockAllSlots() {
        for (const slot of this.slots) slot.lock();
        this.confirmDisabled = true;
        this.repeatDisabled = true;
    }

    unlockAllSlots() {
        for (const slot of this.slots) slot.unlock();
        this.confirmDisabled = false;
        this.repeatDisabled = false;
    }
}
