import './StattingMaterial.css'
import {MAT_PRICE, Mats} from "../../unit/statting/StattingType.tsx";
import {Stat} from "../../unit/statting/Stat.tsx";

export const StattingMaterial = (props: { stat: Stat }) => {
    const { mats, maxMats, proficiency, mat_reduction } = props.stat;

    return (
        <div>
            {!!proficiency && <span className='material-option'>숙련도: {proficiency}</span>}
            {mat_reduction && <span className='material-option'>(10% 소재 감소 적용)</span>}

            <table className='material'>
                <tbody>
                {Object.values(Mats).map((mat: Mats) => (
                    <tr>
                        <td className='material-kind'>{MAT_PRICE[mat]}</td>
                        <td className='material-content'>{mats[mat].toLocaleString()}</td>
                    </tr>
                ))}
                </tbody>
            </table>
            <div className='common-group'>
                단계당 최대 사용량 {maxMats.toLocaleString()}
            </div>
        </div>
);
}