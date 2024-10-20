import './StattingInfo.css'
import React, {ReactElement, useState} from "react";
import {Button, Dialog, DialogActions, DialogContent, IconButton} from "@mui/material";
import {MdInfoOutline, MdOutlineContentCopy} from "react-icons/md";
import {OverridableStringUnion} from "@mui/types";
import {IconButtonPropsSizeOverrides} from "@mui/material/IconButton/IconButton";
import {GrAdd, GrClose, GrPowerReset} from "react-icons/gr";
import {IoArrowRedo, IoArrowUndo, IoCheckmark, IoRepeat} from "react-icons/io5";
import {IoMdSettings} from "react-icons/io";
import {Medias} from "../../media/Media.tsx";

export const ResetIcon: ReactElement = <GrPowerReset/>;
export const CopyIcon: ReactElement = <MdOutlineContentCopy/>;
export const AddIcon: ReactElement = <GrAdd/>;
export const ConfirmIcon: ReactElement = <IoCheckmark/>;
export const RepeatIcon: ReactElement = <IoRepeat/>;
export const UndoIcon: ReactElement = <IoArrowUndo/>;
export const RedoIcon: ReactElement = <IoArrowRedo/>;
export const CloseIcon: ReactElement = <GrClose/>;
export const SettingIcon: ReactElement = <IoMdSettings/>;

type Info = {
    icon?: ReactElement;
    key?: string|ReactElement;
    content: string;
}

const rawInfo: Info[] = [
    { icon: ConfirmIcon, key: 'Enter', content: '확정' },
    { icon: RepeatIcon, key: 'R', content: '반복' },
    { icon: UndoIcon, key: 'Z', content: '취소' },
    { icon: RedoIcon, key: 'Y', content: '복구' }
];

const infos: Info[][] = [];
for (let i = 0; i < rawInfo.length; i += 2) {
    infos.push(rawInfo.slice(i, i + 2));
}

export const StattingInfo = (props: {
    size?: OverridableStringUnion<'small' | 'medium' | 'large', IconButtonPropsSizeOverrides>,
    className?: string
}) => {
    const [open, setOpen] = useState<boolean>(false);

    return (
        <React.Fragment>
            <IconButton size={props.size} className={props.className || 'icon-style'}
                        onClick={() => setOpen(true)}>
                <MdInfoOutline/>
            </IconButton>

            <Dialog open={open} onClose={() => setOpen(true)}>
                <DialogContent>
                    <table className='info-table'>
                        <tbody>
                        <tr>
                            <td colSpan={2}><Medias small='&#171;' large='M'/></td>
                            <td>최소값</td>
                            <td colSpan={2}><Medias small='&#187;' large='X'/></td>
                            <td>최대값</td>
                        </tr>
                        <tr>
                            <td colSpan={2}><Medias small='&#45;' large='&darr;'/></td>
                            <td>스탭 1 감소</td>
                            <td colSpan={2}><Medias small='&#43;' large='&uarr;'/></td>
                            <td>스탭 1 증가</td>
                        </tr>

                        {infos.map((is: Info[]) => (
                            <tr>
                                {is.map(({icon, key, content}) => (
                                    <React.Fragment>
                                        <Medias small={<td colSpan={2}>{icon}</td>}
                                                large={(
                                                    <React.Fragment>
                                                        <td className='info-name' colSpan={!key && 2}>{icon}</td>
                                                        {key && <td className='info-name'>{key}</td>}
                                                    </React.Fragment>
                                                )}/>
                                        <td>{content}</td>
                                    </React.Fragment>
                                ))}
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpen(false)}>확인</Button>
                </DialogActions>
            </Dialog>
        </React.Fragment>
    );
}