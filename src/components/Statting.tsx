import './Statting.css'
// import uuid from 'react-uuid';
import React, {ReactElement, useCallback, useEffect, useState} from "react";
import {
    Box, Button,
    Dialog,
    DialogActions,
    DialogContent, DialogTitle,
    IconButton,
    Tab, Tabs,
    TextField
} from "@mui/material";
import {Search, StattingSearch} from "./statting/StattingSearch.tsx";
import {StattingStat} from "./statting/StattingStat.tsx";
import {Stat} from "../unit/statting/Stat.tsx";
import {EQUIPMENT_PRICE} from "../unit/statting/StattingType.tsx";
import {StattingMaterial} from "./statting/StattingMaterial.tsx";
import {LARGE_QUERY, MediaLarge, SMALL_QUERY} from "../media/Media.tsx";
import styled from "styled-components";
import {ClickEvent, InputEvent, TabEvent} from "../unit/Common.tsx";
import {deepClone} from "../unit/statting/StattingState.tsx";
import {AddIcon, CloseIcon, CopyIcon, ResetIcon} from "./statting/StattingInfo.tsx";
import {StattingStep} from "./statting/StattingStep.tsx";

type TabStat = {
    id: string;
    label: string;
    search: Search;
    stat: Stat;
}

const StattingContainer = styled.div`
    display: grid;
    @media (${SMALL_QUERY}) {
        grid-template-columns: repeat(2, 1fr);
    }
    @media (${LARGE_QUERY}) {
        grid-template-columns: repeat(3, 1fr);
    }
`;


export const Statting = () => {
    const [select, setSelect] = useState<string|null>();
    const [search, setSearch] = useState<Search>();
    const [stats, setStats] = useState<TabStat[]>([]);

    // dialog use state
    const [open, setOpen] = useState<boolean>(false);
    const [renameStat, setRenameStat] = useState<TabStat|null>();

    useEffect(() => {
        if (renameStat) setOpen(true);
    }, [renameStat]);

    useEffect(() => {
        if (!open) setRenameStat(null);
    }, [open]);

    const isSelect = useCallback(() => (
        !select || !stats.some((tab: TabStat) => tab.id === select)
    ), [select, stats]);

    const addStat = useCallback((stat?: Stat, label?: string) => {
        const id: string = Math.random().toString();
        stat = stat || new Stat(deepClone(search!));
        label = label || EQUIPMENT_PRICE[search!.type];
        setStats([...stats, {
            id, stat, label,
            search: stat.general
        }]);
        setSelect(id);
    }, [search, stats]);

    const onCopy = useCallback(() => {
        const tabStat = stats.find((stat: TabStat) => stat.id === select);
        if (!tabStat) return;
        const { label, stat } = tabStat;
        const { formula, settings } = stat.grabSnapshot();
        const newStat: Stat = new Stat(deepClone(stat.general));
        newStat.steps.formula = formula;
        newStat.steps.buildCondensedFormula();
        Object.assign(newStat, settings);
        for (const step of formula) {
            newStat.runStepInstruction(step);
        }
        addStat(newStat, label);
    }, [addStat, select, stats]);

    const handleClose = useCallback((event: ClickEvent, tabId: string) => {
        event.stopPropagation();
        if (tabId === select) {
            const deleteIndex: number = stats.findIndex((tab: TabStat) => tab.id === select);
            const previousTab = stats[deleteIndex - 1] || stats[deleteIndex + 1];
            setSelect(previousTab?.id);
        }
        setStats(stats.filter((stat: TabStat) => stat.id !== tabId));
    }, [select, stats]);

    const createTab = (stat: TabStat): ReactElement => (
        <Tab className='tab-style' value={stat.id} label={
            <Box>
                {stat.label}&nbsp;
                <IconButton size="small" component="div" className='tab-icon-style'
                            onClick={(event: ClickEvent) => handleClose(event, stat.id)}>
                    {CloseIcon}
                </IconButton>
            </Box>
        } onDoubleClick={() => setRenameStat(stat)}/>
    )

    // add button event
    const onUpdateStat = () => setStats([...stats]);
    const onChangeTabs = (_: TabEvent, value: string) => setSelect(value);

    const onReset: () => void = useCallback(() => {
        setSelect(null);
        setStats([]);
    }, []);

    const Reset: ReactElement = (
        <IconButton size="small" className='icon-style' color="error" onClick={onReset}>
            {ResetIcon}
        </IconButton>
    );

    return (
        <React.Fragment>
            <header>
                <Box className='header'>
                    <h3>옵션 부여 시뮬레이션</h3>
                    <MediaLarge>
                        <div>{Reset}</div>
                    </MediaLarge>
                </Box>
            </header>

            <StattingSearch onUpdate={setSearch} reset={Reset}/>

            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Tabs variant="scrollable" value={select} onChange={onChangeTabs} style={{
                    minHeight: 0
                }}>{stats.map((stat: TabStat) => createTab(stat))}</Tabs>

                <div className='tab-icon'>
                    <IconButton size="small" className='icon-style'
                                disabled={isSelect()} onClick={onCopy}>
                        {CopyIcon}
                    </IconButton>
                    <IconButton size="small" className='icon-style'
                                disabled={!search} onClick={() => addStat()}>
                        {AddIcon}
                    </IconButton>
                </div>
            </Box>

            {select && function () {
                const stat: TabStat | undefined = stats.find((stat: TabStat) => stat.id == select);
                return stat && (
                    <StattingContainer className='statting-container'>
                        <StattingStat {...stat} onUpdateStat={onUpdateStat}/>
                        <StattingStep {...stat}/>
                        <StattingMaterial {...stat}/>
                    </StattingContainer>
                )
            }()}

            { renameStat && <RenameDialog open={open} setOpen={setOpen} stat={renameStat} onUpdateStat={onUpdateStat}/> }
        </React.Fragment>
    )
}

const RenameDialog = (props: {
    open: boolean,
    setOpen: (open: boolean) => void,
    stat: TabStat,
    onUpdateStat: () => void
}) => {
    const { stat, setOpen, onUpdateStat } = props;
    const [error, setError] = useState<string>('');
    const [rename, setRename] = useState<string>(stat.label);

    const isError = useCallback(() => error.length !== 0, [error]);

    useEffect(() => {
        let errorMessage: string = '';
        if (rename.trim().length === 0)
            errorMessage = '공백을 이름으로 사용할 수 없습니다.';
        setError(errorMessage);
    }, [rename]);

    function onOk() {
        if (isError()) return;
        stat.label = rename;
        onUpdateStat();
        setOpen(false);
    }

    return (
        <Dialog open={props.open} onClose={() => setOpen(true)}>
            <DialogTitle fontSize="medium">이름 변경</DialogTitle>
            <DialogContent>
                <TextField error={isError()} helperText={error} value={rename}
                           onChange={(event: InputEvent) => setRename(event.currentTarget.value)}/>
            </DialogContent>
            <DialogActions>
                <Button onClick={() => setOpen(false)}>취소</Button>
                <Button onClick={onOk} disabled={isError()}>확인</Button>
            </DialogActions>
        </Dialog>
    );
}