import {deepClone, Option, OPTIONS, toramRound} from "./StattingState.tsx";
import {Stat} from "./Stat.tsx";
import {Calc} from "../MathCalculator.tsx";
import {MAT_PRICE, Mats} from "./StattingType.tsx";

export class Slot {
    readonly slotNum: number;
    readonly stat: Stat;

    currentStat: number = 0;
    futureStat: number = 0;

    currentSteps: number = 0;
    futureSteps: number = 0;

    statName: null|string = null;
    statData: null|Option = null;
    statDataId: number = 0;
    newStat: boolean | number = true;
    disabled: boolean = false;
    max?: number;

    slot: { value: number, disabled: boolean } = {
        value: 0,
        disabled: false
    };
    input: { value: number|undefined, disabled: boolean, color?: string } = {
        value: 0,
        disabled: true
    };
    mat: { value: string, hidden: boolean } = {
        value: '',
        hidden: true
    };

    constructor(slotNum: number, stat: Stat) {
        this.slotNum = slotNum;
        this.stat = stat;
    }

    private initData() {
        this.statName = this.statData = null;
        this.currentStat = this.futureStat = 0;
        this.currentSteps = this.futureSteps = 0;
        this.statDataId = 0;
    }

    getOptionMax(): number|undefined {
        const option: Option | null = this.statData;
        if (option && option.max) {
            const max = option.max;
            if (typeof max === 'number') return max;
            else return max(this.stat.general);
        }
        return undefined;
    }

    getOption(): Option|undefined {
        if (this) return OPTIONS[this.slot.value - 1];
    }

    onUpdate() {
        if (this.slot.value === 0) {
            this.initData();

            this.slot = {
                value: this.statDataId,
                disabled: !!this.statName || !!this.stat.finished
            };
            this.input = {
                value: this.futureStat,
                disabled: true
            };
        } else {
            // set up stat data in this slot
            const stat_data = deepClone(OPTIONS[this.slot.value - 1]);
            this.statData = stat_data;
            this.statName = stat_data.name;
            this.statDataId = this.slot.value;

            if (this.newStat) this.newStat = this.slot.value;

            // enable input field
            this.input.disabled = false;

            this.futureStat = this.input.value || 0;
            this.futureSteps = this.statToSteps();

            if (this.currentSteps !== this.futureSteps) {
                this.mat.value = this.getCostDisplay();
                this.mat.hidden = false;
            } else this.mat.hidden = true;
        }

        this.applyColouration();
        this.stat.onUpdate();
    }

    applyColouration() {
        let color: string | undefined = undefined;
        if (this.statName) {
            const allowed_max = this.getMaxStat(this.futureStat < 0);
            if (Math.abs(this.futureStat) > allowed_max || (this.futureSteps < 0 && this.statData!.nonega)) {
                color = 'red';
            }
        }
        this.input.color = color;
    }

    rawOverride(data: [number, number, number|null]) {
        // [slot_num, increase/decrease in value, new stat ID]
        const [_, delta_steps, id] = data;

        if (id !== null) {
            if (id === 0) {
                this.initData();
                this.slot.value = this.statDataId;
                this.input.value = this.futureStat;
                this.syncDisplayWithValues();
                this.applyColouration();
                return;
            } else {
                this.statDataId = id;
                this.statData = deepClone(OPTIONS[id - 1]);
                this.statName = this.statData.name;
                this.newStat = false;
            }
        }

        this.futureSteps += delta_steps;
        this.currentSteps = this.futureSteps;

        this.futureStat = this.stepsToStat(this.futureSteps);
        this.currentStat = this.futureStat;

        this.slot.value = this.statDataId;
        this.input.value = this.futureStat;
        this.applyColouration();
        this.syncDisplayWithValues();
    }

    syncDisplayWithValues() {
        this.slot.disabled = !!this.statName || !!this.stat.finished;
        this.input.disabled = !this.statName || !!this.stat.finished;
    }

    // value changes
    changeValueBySteps(value: number, relative?: boolean) {
        let future_steps = this.futureSteps;
        if (relative) future_steps += value;
        else future_steps = value;
        this.input.value = this.stepsToStat(future_steps);
        this.onUpdate();
    }

    // data processing
    stepsToStat(value: number = this.futureSteps): number {
        if (!this.statData)
            throw Error("statData null Error");
        const maxSteps: number = this.stat.getMaxSteps();

        const is_negative = value < 0;
        value = Math.abs(value);
        const step_max = 100 / this.statData.pot;
        const change_per_step = this.statData.step || 1;
        const max_normal_value = this.max
            ? this.max / change_per_step
            : step_max > maxSteps ? maxSteps : step_max;

        if (value < max_normal_value) {
            value = value * (this.statData.step || 1);
        } else {
            const bonus = this.statData.bonus || this.statData.step || 1;
            value = max_normal_value * (this.statData.step || 1) + (value - max_normal_value) * bonus;
        }

        if (is_negative) value *= -1;
        return value;
    }

    statToSteps(value: number = this.futureStat): number {
        if (!this.statData)
            throw Error("statData null Error");
        const maxSteps: number = this.stat.getMaxSteps();

        const input_is_negative = value < 0 ? -1 : 1;
        const step_max = 100 / this.statData.pot;
        const change_per_step = this.statData.step || 1;
        const max_normal_step = step_max > maxSteps ? maxSteps : step_max;
        const max_normal_value = this.max ? this.max : step_max > maxSteps
            ? maxSteps * change_per_step
            : step_max * change_per_step;
        let future_steps;

        if (Math.abs(value) > max_normal_value) {
            const overstep = this.statData.bonus || change_per_step;
            future_steps = (max_normal_step + ((Math.abs(value) - max_normal_value) / overstep)) * input_is_negative;
        } else {
            future_steps = value / change_per_step;
        }
        return toramRound(future_steps);
    }

    private getMaxStat(isNeGa: boolean|undefined): number {
        if (!this.statData)
            throw Error("statData null Error");

        const bonusSteps: number = this.stat.getBonusSteps();
        const maxSteps: number = this.stat.getMaxSteps();
        const step_max = 100 / this.statData.pot;

        // calc bonus steps
        const reduction = this.statData.bonusdeduction || 0;
        const bonus_steps = Math.floor(bonusSteps * (this.statData.bonusratio || 1)) - reduction;
        const custom_max = (this.getOptionMax() || 0) * (this.statData.step || 1);
        const base_max = step_max > maxSteps ? maxSteps : step_max;
        const max_base_stat = (this.statData.step || 1) * base_max;
        const bonus_max = (this.statData.bonus || 0) * bonus_steps;

        if (this.statData.bonus) {
            const value = (custom_max || max_base_stat) + bonus_max;
            if (isNeGa && this.statData.max_only) return custom_max || max_base_stat;
            return value;
        } else if (custom_max) {
            return custom_max;
        } else {
            return base_max * (this.statData.step || 1);
        }
    }

    getMaxSteps(isNeGa?: boolean|undefined): number {
        const stat = this.getMaxStat(isNeGa);
        return this.statToSteps(stat);
    }

    getCost() {
        if (!this.statData)
            throw Error("statData null Error");

        let base_cost = this.statData.cost;
        if (typeof base_cost === 'string')
            base_cost = parseFloat(base_cost);
        const change = this.currentSteps < this.futureStat ? 1 : -1;

        let cost = 0;
        for (let i = this.currentSteps + change;
             (change > 0 ? i <= this.futureSteps : i >= this.futureSteps);
             i += change) {
            cost += base_cost * Math.pow(i, 2);
        }
        return cost * this.stat.getCostReduction();
    }

    getMatType(): Mats | undefined {
        return this.statData?.mat;
    }

    private getCostDisplay(): string {
        const cost = toramRound(this.getCost());
        const mat: Mats = this.getMatType() as Mats;
        return `(${cost} ${MAT_PRICE[mat]})`;
    }

    getPotentialChange(): number {
        if (this.currentSteps === this.futureSteps) return 0;
        const change = this.currentSteps > this.futureSteps ? -1 : 1;

        if (!this.statData)
            throw Error("statData null Error");
        const maxSteps: number = this.stat.getMaxSteps();

        const step_max = 100 / this.statData.pot;
        const max_normal_steps = this.getOptionMax() || (step_max > maxSteps ? maxSteps : step_max);

        const all = [this.currentSteps, this.futureSteps].sort((a, b) => a - b);
        let diff = all[1] - all[0];
        let bonus_diff = 0;

        // trim anything below the standard minimum
        if (all[0] < -max_normal_steps) {
            const extras = Math.abs(all[0]) - max_normal_steps;
            diff -= extras;
            bonus_diff += extras;
        }

        // trim anything above the standard maximum
        if (all[1] > max_normal_steps) {
            const extras = all[1] - max_normal_steps;

            diff -= extras;
            bonus_diff += extras;
        }

        // trim bonus for cases where both values are in bonus range
        if (diff < 0) {
            bonus_diff += diff;
            diff = 0;
        }
        const double = ![this.stat.type, 'u', 'e'].includes(this.statData.type) ? 2 : 1;
        const basicPot = Calc(diff).multiply(this.statData.pot);
        const bonusPot = Calc(bonus_diff).multiply(this.statData.pot).multiply(2);

        // negatives have an extra multiplier
        if (change === -1) {
            basicPot.multiply(this.stat.potential_return).multiply(0.01);
            bonusPot.multiply(this.stat.bonus_potential_return).multiply(0.01)
        }

        // add the 2 different types of potential return together
        const totalPot = basicPot.add(bonusPot).multiply(double).multiply(-change).result();
        return toramRound(totalPot);
    }

    cleanUpValue() {
        const future_stat = this.futureStat;
        if (this.stepsToStat(this.futureSteps) !== future_stat) {
            const step = this.statData?.step;
            if (!step) throw Error("statData null Error");

            // invalid step... try to match intention first
            // def - 21 => def - 30
            if (future_stat % step === 0) {
                this.futureSteps = future_stat / step;

            // typed the step itself instead of a stat
            } else if (future_stat <= this.getMaxSteps(undefined)) {
                this.futureSteps = future_stat;

            // round down and recreate futurestat
            } else {
                this.futureSteps = toramRound(this.futureSteps);
            }
        }

        this.futureStat = this.stepsToStat(this.futureSteps);
        this.input.value = this.futureStat;
        this.applyColouration();
    }

    // control functions
    confirm() {
        if (this.statName) {
            this.slot.disabled = true;
        }

        this.mat.hidden = true;
        this.currentStat = this.futureStat;
        this.currentSteps = this.futureSteps;
        this.newStat = false;
    }

    lock() {
        this.slot.disabled = true;
        this.input.disabled = true;
    }

    unlock() {
        if (this.disabled) return;

        if (!this.statName) this.slot.disabled = false;
        else this.input.disabled = false;
    }
}