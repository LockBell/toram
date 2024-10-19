import React from "react";
import {EQUIPMENT_PRICE} from "../../unit/statting/StattingType.tsx";
import {FormulaUnit} from "../../unit/statting/Formula.tsx";
import {Stat} from "../../unit/statting/Stat.tsx";

export const StattingStep = (props: { stat: Stat }) => {
    const { stat } = props;
    return (
        <div>
            <b>순서</b><br/>
            {EQUIPMENT_PRICE[stat.type]} - 잠재력: {stat.startingPot}<br/>
            <table>
                <tbody>
                {stat.steps.condensed_formula.map((formula: FormulaUnit, index: number) => {
                    const { text: pairs } = formula;
                    return (
                        <React.Fragment>
                            <tr>
                                <td className='step-row' rowSpan={pairs.length}>{index + 1}</td>
                                <td>{pairs[0].text}</td>
                                <td>{pairs[0].value}</td>
                                <td className='step-repeat' rowSpan={pairs.length}>
                                    (x{formula.repeat})
                                </td>
                                <td className='step-pot' rowSpan={pairs.length}>
                                    ({formula.pot_after}pot)
                                </td>
                            </tr>
                            {pairs.slice(1).map(pair => (
                                <tr>
                                    <td>{pair.text}</td>
                                    <td>{pair.value}</td>
                                </tr>
                            ))}
                        </React.Fragment>
                    )
                })}
                </tbody>
            </table>
            {typeof stat.finished === 'number' && <span>성공률: {stat.getSuccessRate()}%</span>}
        </div>
    );
}