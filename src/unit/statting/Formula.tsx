import {Mat, Stat} from "./Stat.tsx";
import {deepClone} from "./StattingState.tsx";
import React from "react";

type Pair = {
    text: string,
    value: string
}

export interface FormulaUnit {
    repeat: number;
    code: Array<[number, number, boolean|number|null]>;

    text: Array<Pair>;
    pot_before: number;
    pot_after: number;
    step_mats: Mat;
    max_mats_before: number;
    max_mats_after: number;
    finished: boolean|number;
}

function equals(a: Array<Pair>, b: Array<Pair>): boolean {
    if (a === b) return true;
    if (a.length != b.length) return false;
    for (let i = 0; i < a.length; i++) {
        const { text: at, value: av } = a[i];
        const { text: bt, value: bv } = b[i];
        if (at != bt || av != bv) return false;
    }
    return true;
}

export class Formula {
    stat: Stat;
    formula: Array<FormulaUnit> = [];
    condensed_formula: Array<FormulaUnit> = [];
    step_changes: Array<Pair> = [];
    step_code_changes: Array<[number, number, boolean|number|null]> = [];
    redo_queue: Array<FormulaUnit> = [];

    constructor(stat: Stat) {
        this.stat = stat;
    }

    gatherChanges(slot: number, stat: null | string,
                  delta_step: number, delta_stat: number,
                  new_stat: boolean|number|null) {
        const positive = delta_step > 0 ? '+' : '';
        this.step_changes.push({
            text: stat!.toString(),
            value: `${positive}${delta_stat}`
        });
        this.step_code_changes.push([slot, delta_step, (new_stat || null)]);
    }

    commitChanges() {
        if (!this.step_code_changes.length) return;
        const finished: number|boolean = this.stat.slots.every(slot => slot.statName) || this.stat.futurePot <= 0
            ? this.stat.getSuccessRate()
            : false;
        this.formula.push({
            repeat: 1,
            code: this.step_code_changes,
            text: this.step_changes,
            pot_before: this.stat.pot,
            pot_after: this.stat.futurePot,
            step_mats: this.stat.stepMats,

            max_mats_before: this.stat.maxMats,
            max_mats_after: this.stat.stepMaxMats || this.stat.maxMats,

            finished
        });

        this.redo_queue = [];
        this.step_changes = [];
        this.step_code_changes = [];
        this.buildCondensedFormula();
    }

    buildCondensedFormula() {
        this.condensed_formula = [];
        let last_change: {
            text?: Array<Pair>
        } = {};

        for (const step of this.formula) {
            if (last_change.text && equals(last_change.text, step.text)) {
                const target_step = this.condensed_formula[this.condensed_formula.length - 1];
                target_step.repeat++;
                target_step.pot_after = step.pot_after;
            } else {
                this.condensed_formula.push(deepClone(step));
                last_change = step;
            }
        }
    }

    getDisplay(): React.JSX.Element[] {
        return this.condensed_formula.map((step, index) => (
            <React.Fragment>
                <strong>#{index + 1}</strong>
                &nbsp;
                {step.text.toString()}{step.repeat > 1 && ` (x${step.repeat})`}
                <span>({step.pot_after}pot)</span>
                <br/>
            </React.Fragment>
        ));
    }

    undo() {
        const step = this.formula.pop() as FormulaUnit;
        this.redo_queue.push(deepClone(step));
        return step;
    }
    
    redo() {
        const step = this.redo_queue.pop() as FormulaUnit;
        this.formula.push(deepClone(step));
        return step;
    }
}