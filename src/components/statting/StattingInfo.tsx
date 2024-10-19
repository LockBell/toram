import React, {ReactElement, useState} from "react";
import {Button, Dialog, DialogActions, DialogContent, IconButton} from "@mui/material";
import {MdInfoOutline, MdOutlineContentCopy} from "react-icons/md";
import {OverridableStringUnion} from "@mui/types";
import {IconButtonPropsSizeOverrides} from "@mui/material/IconButton/IconButton";
import {GrAdd, GrClose, GrPowerReset} from "react-icons/gr";
import {IoArrowRedo, IoArrowUndo, IoCheckmark, IoRepeat} from "react-icons/io5";
import {IoMdSettings} from "react-icons/io";

export const ResetIcon: ReactElement = <GrPowerReset/>;
export const CopyIcon: ReactElement = <MdOutlineContentCopy/>;
export const AddIcon: ReactElement = <GrAdd/>;
export const ConfirmIcon: ReactElement = <IoCheckmark/>;
export const RepeatIcon: ReactElement = <IoRepeat/>;
export const UndoIcon: ReactElement = <IoArrowUndo/>;
export const RedoIcon: ReactElement = <IoArrowRedo/>;
export const CloseIcon: ReactElement = <GrClose/>;
export const SettingIcon: ReactElement = <IoMdSettings/>;

const infos: { icon: ReactElement, content: string }[] = [
    { icon: ResetIcon, content: '초기화' },
    { icon: CopyIcon, content: '복사' },
    { icon: AddIcon, content: '생성' },
    { icon: ConfirmIcon, content: '확정' },
    { icon: RepeatIcon, content: '반복' },
    { icon: UndoIcon, content: '취소' },
    { icon: RedoIcon, content: '복구' }
];

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
                    <table>
                        <tbody>
                        {infos.map(({ icon, content }) => (
                            <tr>
                                <td>{icon}</td>
                                <td>{content}</td>
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