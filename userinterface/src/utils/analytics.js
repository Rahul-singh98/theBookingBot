export const get_pct = (current, previous) => {
    return previous !== 0
        ? (((current - previous) / previous) * 100).toFixed(2)
        : 0;
}