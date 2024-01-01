export function getDecimalCount(value) {
    return (String(value).split('.')[1] || '').length;
}
export function roundValue(value, decimalCount) {
    const rounder = Math.pow(10, decimalCount);
    return Math.round(value * rounder) / rounder;
}
export function snapValueToStep(value, min, max, step) {
    const remainder = (value - (isNaN(min) ? 0 : min)) % step;
    let snappedValue = Math.abs(remainder) * 2 >= step
        ? value + Math.sign(remainder) * (step - Math.abs(remainder))
        : value - remainder;
    if (!isNaN(min)) {
        if (snappedValue < min) {
            snappedValue = min;
        }
        else if (!isNaN(max) && snappedValue > max) {
            snappedValue = min + Math.floor((max - min) / step) * step;
        }
    }
    else if (!isNaN(max) && snappedValue > max) {
        snappedValue = Math.floor(max / step) * step;
    }
    const string = step.toString();
    const index = string.indexOf('.');
    const precision = index >= 0 ? string.length - index : 0;
    if (precision > 0) {
        const pow = Math.pow(10, precision);
        snappedValue = Math.round(snappedValue * pow) / pow;
    }
    return snappedValue;
}
export function clamp(min, value, max) {
    return Math.max(min, Math.min(value, max));
}
