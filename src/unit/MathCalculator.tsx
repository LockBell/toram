class MathCalculator {
    num: number = 0;
    exp: number = 0;

    constructor(num: number) {
        this.load(num);
    }

    result(): number {
        return this.num / Math.pow(10, this.exp);
    }

    parse(num) {
        if (num.constructor === MathCalculator) {
            num = num.result();
        }
        const decimals = num.toString().split('.')[1] || '';

        return {
            number: num * Math.pow(10, decimals.length),
            exponent: decimals.length
        };
    }

    normalize(num) {
        const diff = this.exp - num.exponent;
        const absDiff = Math.abs(diff);
        if (diff > 0) {
            num.exponent += absDiff;
            num.number *= Math.pow(10, absDiff);
        } else if (diff < 0) {
            this.exp += absDiff;
            this.num *= Math.pow(10, absDiff);
        }

        return num;
    }

    load(num: number|MathCalculator) {
        if (num.constructor === MathCalculator) {
            num = num.result();
        }
        const _num = this.parse(num);
        this.num = _num.number;
        this.exp = _num.exponent;
    }

    add(num) {
        let _num = this.parse(num);
        _num = this.normalize(_num);

        this.num += _num.number;
        return this;
    }

    subtract(num) {
        let _num = this.parse(num);
        _num = this.normalize(_num);

        this.num -= _num.number;
        return this;
    }

    multiply(num) {
        const _num = this.parse(num);

        this.num *= _num.number;
        this.exp += _num.exponent;
        return this;
    }

    divide(num) {
        let _num = this.parse(num);
        _num = this.normalize(_num);

        this.num /= _num.number;
        return this;
    }
}

export function Calc(num: number) {
    return new MathCalculator(num);
}