import './StattingSearch.css'
import React, {ReactElement, useCallback, useEffect, useState} from "react";
import {
    Button,
    Checkbox,
    Dialog,
    DialogActions,
    DialogContent,
    FormControlLabel,
    IconButton,
    Input,
    Radio,
    RadioGroup,
} from "@mui/material";
import {
    BONUS_STEPS,
    DEFAULT_ARMOR_RECIPE_POT,
    DEFAULT_ARMOR_STARTING_POT,
    DEFAULT_WEAPON_RECIPE_POT,
    DEFAULT_WEAPON_STARTING_POT, MAX_STEPS,
} from "../../unit/statting/StattingState.tsx";
import {Equipment, EQUIPMENT_PRICE, EquipmentType} from "../../unit/statting/StattingType.tsx";
import {Medias} from "../../media/Media.tsx";
import {InputEvent} from "../../unit/Common.tsx";
import {SettingIcon} from "./StattingInfo.tsx";

export type Search = {
    type: Equipment;
    start: number;
    recipe: number;
    tec: number;
    proficiency: number;
    matPassives: boolean;
    element: boolean;

    maxSteps: number;
    bonusSteps: number;
}

export const StattingSearch = (props: {
    onUpdate: (search: Search) => void,
    reset: ReactElement
}) => {
    const [open, setOpen] = useState<boolean>(false);
    const [type, setType] = useState<Equipment>(EquipmentType.WEAPON);

    const [recipe, setRecipe] = useState<number>(0);
    const [start, setStart] = useState<number>(0);

    const [proficiency, setProficiency] = useState<number>(0);
    const [tec, setTec] = useState<number>(255);
    const [matPassives, setMatPassives] = useState<boolean>(true);
    const [element, setElement] = useState<boolean>(false);
    const [level, setLevel] = useState<number>((MAX_STEPS + BONUS_STEPS) * 10);

    useEffect(() => {
        props.onUpdate({type, recipe, start, proficiency, tec, matPassives, element});
    }, [type, recipe, start, proficiency, tec, matPassives, element, level, props.onUpdate]);

    useEffect(() => {
        // init element
        setElement(false);

        // init default value
        if (type === EquipmentType.WEAPON) {
            setRecipe(DEFAULT_WEAPON_RECIPE_POT);
            setStart(DEFAULT_WEAPON_STARTING_POT);
        } else if (type === EquipmentType.ARMOR) {
            setRecipe(DEFAULT_ARMOR_RECIPE_POT);
            setStart(DEFAULT_ARMOR_STARTING_POT);
        }
    }, [type]);

    const clickMatPassives = useCallback(() => setMatPassives(!matPassives), [matPassives]);
    const clickElement = useCallback(() => setElement(!element), [element]);

    const onProficiency = (event: InputEvent) =>
        setProficiency(event.target.valueAsNumber);
    const onEquipment = (event: InputEvent) =>
        setType(event.currentTarget.value as EquipmentType);

    const Equipment = () => (
        <RadioGroup value={type} row={true} onChange={onEquipment}>
            {Object.keys(EQUIPMENT_PRICE).map((type, i: number) => (
                {name: EQUIPMENT_PRICE[type as EquipmentType], type: type, default: i === 0}
            )).map(({ name, type }) => (
                <FormControlLabel key={name} control={<Radio/>} label={name} value={type}/>
            ))}
        </RadioGroup>
    );

    const setting: ReactElement = (
        <table>
            <tbody>
            <tr>
                <td className='name-field'>
                    <label htmlFor="proficiency">대장장이 숙련도</label>
                </td>
                <td className='value-field'>
                    <Input disableUnderline type="number" id="proficiency" value={proficiency}
                           onChange={onProficiency}/>
                </td>
            </tr>
            <tr>
                <td className='name-field'>
                    <label htmlFor="tec">TEC</label>
                </td>
                <td className='value-field'>
                    <Input disableUnderline type="number" id="tec" value={tec}
                           onChange={(event: InputEvent) => setTec(event.target.valueAsNumber)}/>
                </td>
            </tr>
            <tr>
                <td className='name-field'>
                    <label htmlFor="mat-passives">소재 사용량 감소</label>
                </td>
                <td className='value-field'>
                    <Checkbox id="mat-passives" checked={matPassives} onChange={clickMatPassives}/>
                </td>
            </tr>
            </tbody>
        </table>
    );

    return (
        <div className='between'>
            <table>
                <tbody>
                <tr>
                    <td className='name-field'>종류</td>
                    <td className='value-field'>
                        <Equipment/>
                    </td>
                </tr>
                <tr>
                    <td className='name-field'>
                        <label htmlFor="recipe">기본 잠재력</label>
                    </td>
                    <td className='value-field'>
                        <Input disableUnderline type="number" id="recipe" value={recipe}
                               onChange={(event: InputEvent) => setRecipe(event.target.valueAsNumber)}/>
                    </td>
                </tr>
                <tr>
                    <td className='name-field'>
                        <label htmlFor="start">시작 잠재력</label>
                    </td>
                    <td className='value-field'>
                        <Input disableUnderline type="number" id="start" value={start}
                               onChange={(event: InputEvent) => setStart(event.target.valueAsNumber)}/>
                    </td>
                </tr>
                <tr hidden={type !== EquipmentType.WEAPON}>
                    <td className='name-field'>
                        <label htmlFor='element-match'>속성 매칭</label>
                    </td>
                    <td className='value-field'>
                        <Checkbox id='element-match' checked={element} onChange={clickElement}/>
                    </td>
                </tr>
                </tbody>
            </table>

            <Medias small={
                <React.Fragment>
                    <div>
                        <IconButton className='icon-style' onClick={() => setOpen(true)}>
                            {SettingIcon}
                        </IconButton>
                        {props.reset}
                    </div>
                    <Dialog open={open} onClose={() => setOpen(true)}>
                        <DialogContent>{setting}</DialogContent>
                        <DialogActions>
                            <Button onClick={() => setOpen(false)}>확인</Button>
                        </DialogActions>
                    </Dialog>
                </React.Fragment>
            } large={setting}/>
        </div>
    )
}