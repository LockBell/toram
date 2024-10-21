import './StattingSlot.css'
import React, {useCallback, useRef, useState} from 'react';
import {Option, OPTIONS} from "../../unit/statting/StattingState.tsx";
import {Cat, EquipmentType} from "../../unit/statting/StattingType.tsx";
import {Slot} from "../../unit/statting/Slot.tsx";
import {Stat} from "../../unit/statting/Stat.tsx";
import {MediaSmall} from "../../media/Media.tsx";
import {InputEvent, KeyEvent, PointEvent, SelectEvent} from "../../unit/Common.tsx";

const TIME: number = 500;
export const StattingSlot = (props: {
    type: EquipmentType,
    stat: Stat,
    onUpdateSlot: () => void
}) => {
    const {type, stat} = props;

    const isUseSlotOption = useCallback((slot: Slot, select: number) => {
        for (const { slotNum, slot: { value } } of stat.slots) {
            if (value === 0 || slotNum === slot.slotNum) continue;
            if (value === select) return true;
        }
        return false;
    }, [stat.slots]);

    const getOptions = useCallback((slot: Slot) => {
        const options = new Map<Cat, { name: string, value: number }[]>();
        let id: number = 0;
        for (const { cat, name, pot } of OPTIONS) {
            const opt = { name, value: ++id };
            if (cat === Cat.AElements && (
                type !== EquipmentType.WEAPON
                || (stat.element_match && pot !== 10)
                || (!stat.element_match && pot !== 100)
            )) continue;

            if (options.has(cat)) options.get(cat)?.push(opt);
            else options.set(cat, [opt]);
        }

        const searchElement: boolean = stat.slots.some((slot: Slot) => slot.getOption()?.cat === Cat.AElements);
        return Array.from(options.keys()).map((cat: Cat) => {
            const option: Option|undefined = slot.getOption();
            if (searchElement && cat === Cat.AElements && (!option || option.cat !== Cat.AElements)) {
                return null;
            }

            return (
                <optgroup label={cat}>
                    {options.get(cat)?.map(({name, value}) => {
                        const disabled: boolean = isUseSlotOption(slot, value);
                        return <option value={value} disabled={disabled} hidden={disabled}>{name}</option>;
                    })}
                </optgroup>
            )
        });
    }, [isUseSlotOption, stat.element_match, stat.slots, type]);

    // events
    const onSlotChange = useCallback((event: SelectEvent, slot: Slot) => {
        slot.slot.value = parseInt(event.currentTarget.value);
        slot.onUpdate();
        props.onUpdateSlot();
    }, [props]);

    const onShotCut = useCallback((slot: Slot, { code }: KeyEvent) => {
        if (code === 'Enter' && !stat.confirmDisabled) stat.confirm();
        else if (code === 'KeyR' && !stat.repeatDisabled) stat.repeat();
        else if (code === 'KeyZ' && !stat.undoDisabled) stat.undo();
        else if (code === 'KeyY' && !stat.redoDisabled) stat.redo();
        // Minimum
        else if (code === 'KeyM') slot.setMinimum();
        // Maximum
        else if (code === 'KeyX') slot.setMaximum();
        else return;
        props.onUpdateSlot();
    }, [props, stat]);

    const onInputChange = useCallback((event: InputEvent, slot: Slot) => {
        const value: number = event.currentTarget.valueAsNumber;
        if (isNaN(value)) slot.input.value = undefined;
        else if (Math.abs(value).toString().length <= 4) {
            slot.input.value = value;
        } else return;
        slot.onUpdate();
        props.onUpdateSlot();
    }, [props]);

    const onMinusClick = useCallback((slot: Slot, long: boolean = false) => {
        const input = slot.input;
        input.value = (input.value || 0) - (slot.statData?.step || 1);
        slot.onUpdate();
        props.onUpdateSlot();
    }, [props]);
    const onLeftClick = useCallback((slot: Slot, long: boolean = false) => {
        slot.setMinimum();
        props.onUpdateSlot();
    }, [props]);

    const onPlusClick = useCallback((slot: Slot, long: boolean = false) => {
        const input = slot.input;
        input.value = (input.value || 0) + (slot.statData?.step || 1);
        slot.onUpdate();
        props.onUpdateSlot();
    }, [props]);
    const onRightClick = useCallback((slot: Slot, long: boolean = false) => {
        slot.setMaximum();
        props.onUpdateSlot();
    }, [props]);

    return (
        <React.Fragment>
            {stat.slots.map((slot: Slot) => (
                <React.Fragment>
                    <div className='wrapper'>
                        <div className='mat-style'>
                            <span hidden={slot.mat.hidden}>{slot.mat.value}</span>
                            <br/>
                        </div>
                        <select className='slot-style'
                                value={slot.slot.value}
                                disabled={slot.slot.disabled}
                                onChange={(event: SelectEvent) => onSlotChange(event, slot)}>
                            <option value={0}>옵션 선택</option>
                            {getOptions(slot)}
                        </select>
                    </div>
                    <div className='common-group'>
                        <MediaSmall>
                            <LongButton disabled={slot.input.disabled}
                                        onClick={() => onLeftClick(slot)}
                                        onLongClick={() => onLeftClick(slot, true)}>
                                &#171;
                            </LongButton>
                            <LongButton disabled={slot.input.disabled}
                                        onClick={() => onMinusClick(slot)}
                                        onLongClick={() => onMinusClick(slot, true)}>
                                &#45;
                            </LongButton>
                        </MediaSmall>

                        <input type="number" className='slot-style'
                               maxLength={4} size={4}
                               style={{ color: slot.input.color }}
                               step={slot.statData?.step}
                               disabled={slot.input.disabled}
                               value={slot.input.value}
                               onKeyDown={(event: KeyEvent) => onShotCut(slot, event)}
                               onChange={(event: InputEvent) => onInputChange(event, slot)}/>

                        <MediaSmall>
                            <LongButton disabled={slot.input.disabled}
                                        onClick={() => onPlusClick(slot)}
                                        onLongClick={() => onPlusClick(slot, true)}>
                                &#43;
                            </LongButton>
                            <LongButton disabled={slot.input.disabled}
                                        onClick={() => onRightClick(slot)}
                                        onLongClick={() => onRightClick(slot, true)}>
                                &#187;
                            </LongButton>
                        </MediaSmall>
                    </div>
                    <br/>
                </React.Fragment>
            ))}
        </React.Fragment>
    );
}

const LongButton = (props: {
    children: string;
    disabled: boolean;
    onClick: (event: PointEvent) => void,
    onLongClick: (event: PointEvent) => void,
}) => {
    const [pressStartTime, setPressStartTime] = useState<number|null>(null);
    const timerRef = useRef<ReturnType<typeof setTimeout>|null>(null);

    const handleMouseDown = (event: PointEvent) => {
        if (event.currentTarget.disabled) return;
        setPressStartTime(Date.now());
        timerRef.current = setTimeout(() => props.onLongClick(event), TIME);
    };

    const handleMouseUp = (event: PointEvent) => {
        if (event.currentTarget.disabled) return;
        handleMouseLeave();
        if (pressStartTime && Date.now() - pressStartTime < TIME)
            props.onClick(event);
    };

    const handleMouseLeave = () => {
        if (timerRef.current) clearTimeout(timerRef.current);
    };

    return (
        <button className='long-button-style'
                disabled={props.disabled}
                onContextMenu={(event) => event.preventDefault()}
                onPointerDown={handleMouseDown}
                onPointerUp={handleMouseUp}
                onPointerLeave={handleMouseLeave}>
            {props.children}
        </button>
    );
}
