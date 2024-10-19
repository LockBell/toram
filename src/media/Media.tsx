import React, {ReactElement} from 'react'
import {useMediaQuery} from "react-responsive";
import {ReactNode} from "react";

type ChildrenProps<P = unknown> = P & {
    children?: ReactNode | undefined;
}

export const SORT_QUERY: string = "(max-width:400px)";
export const SMALL_QUERY: string = "(max-width:768px)";
export const LARGE_QUERY: string = "(min-width:769px)";

export const MediaSmall = ({ children }: ChildrenProps) => (
    <React.Fragment>
        { useMediaQuery({ query : SMALL_QUERY }) && children }
    </React.Fragment>
);

export const MediaLarge = ({ children }: ChildrenProps) => (
    <React.Fragment>
        { useMediaQuery({ query : LARGE_QUERY }) && children }
    </React.Fragment>
);

export const Medias = (props: {
    small: ReactElement,
    large: ReactElement
}) => (
    <React.Fragment>
        <MediaSmall>{props.small}</MediaSmall>
        <MediaLarge>{props.large}</MediaLarge>
    </React.Fragment>
);