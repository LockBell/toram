import React, {ChangeEvent, SyntheticEvent} from "react";

export type SelectEvent = ChangeEvent<HTMLSelectElement>;
export type InputEvent = ChangeEvent<HTMLInputElement>;
export type ClickEvent = React.MouseEvent<HTMLElement, MouseEvent>;
export type KeyEvent = React.KeyboardEvent<HTMLInputElement>;

export type PointEvent = React.PointerEvent<HTMLButtonElement>;
export type ResizeEvent = SyntheticEvent<HTMLSelectElement, Event>;
export type TabEvent = SyntheticEvent<Element, Event>;