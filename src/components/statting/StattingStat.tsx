import {StattingSlot} from "./StattingSlot.tsx";
import React, {CSSProperties, useCallback} from "react";
import {Search} from "./StattingSearch.tsx";
import {IconButton} from "@mui/material";
import {Stat} from "../../unit/statting/Stat.tsx";
import {OverridableStringUnion} from "@mui/types";
import {IconButtonPropsSizeOverrides} from "@mui/material/IconButton/IconButton";
import {ConfirmIcon, RedoIcon, RepeatIcon, UndoIcon} from "./StattingInfo.tsx";
import {useMediaQuery} from "react-responsive";
import {SORT_QUERY} from "../../media/Media.tsx";

const iconBtn: React.CSSProperties = {
    outline: "none",
    marginLeft: "auto"
};

export const StattingStat = (props: {
    search: Search,
    stat: Stat,
    onUpdateStat: () => void,
    className?: string,
    style?: CSSProperties | undefined
}) => {
    let size: OverridableStringUnion<'small' | 'medium' | 'large', IconButtonPropsSizeOverrides> = "medium";
    if (useMediaQuery({ query: SORT_QUERY })) size = "small";

    const { search, stat, style } = props;
    const onConfirm = useCallback(() => {
        stat.confirm();
        props.onUpdateStat();
    }, [stat, props]);

    const onRepeat = useCallback(() => {
        stat.repeat();
        props.onUpdateStat();
    }, [props, stat]);

    const onUndo = useCallback(() => {
        stat.undo();
        props.onUpdateStat();
    }, [props, stat]);

    const onRedo = useCallback(() => {
        stat.redo();
        props.onUpdateStat();
    }, [props, stat]);

    return (
        <div className='stat-container' style={style}>
            <div>
                <span>잠재력: {stat.futurePot} / {stat.pot}</span>
            </div>

            <StattingSlot type={search.type} stat={stat} onUpdateSlot={() => props.onUpdateStat()}/>

            <div className='stat-center'>
                <span>성공률: {stat.getSuccessRate()}%</span>
                <br/>

                <div className='common-group'>
                    <IconButton size={size} style={iconBtn} disabled={stat.confirmDisabled} onClick={onConfirm}>
                        {ConfirmIcon}
                    </IconButton>
                    <IconButton size={size} style={iconBtn} disabled={stat.repeatDisabled} onClick={onRepeat}>
                        {RepeatIcon}
                    </IconButton>
                    <IconButton size={size} style={iconBtn} disabled={stat.undoDisabled} onClick={onUndo}>
                        {UndoIcon}
                    </IconButton>
                    <IconButton size={size} style={iconBtn} disabled={stat.redoDisabled} onClick={onRedo}>
                        {RedoIcon}
                    </IconButton>
                </div>
            </div>
        </div>
    );
}