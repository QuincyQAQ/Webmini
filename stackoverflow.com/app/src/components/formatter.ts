export const formatReputation = (reputation: number): string => {
    if (reputation >= 999_500) {
        return (reputation / 1_000_000).toFixed(1) + 'm';
    }
    else if (reputation >= 100_000) {
        return Math.round(reputation / 1_000).toLocaleString('en-US') + 'k';
    }
    else if (reputation >= 999.5) {
        const value = (reputation / 1_000).toFixed(1);
        return parseFloat(value).toString() + 'k';
    }
    else if (reputation >= 0) {
        return reputation.toLocaleString('en-US'); // 'en-US' ensures comma separator
    }
    return reputation.toString();
};
