export type LogicalOperator = 'and' | 'or';

export const matchStringsByLogicalOperator = (searchItems: string[], targetString: string, operator: LogicalOperator): boolean => {
    if (searchItems.length === 0) {
        return true; // Empty array edge case
    }

    const lowerTargetString = targetString.toLowerCase();
    const lowerSearchItems = searchItems.map(item => item.toLowerCase());

    switch (operator) {
        case 'and':
            return lowerSearchItems.every(item => lowerTargetString.includes(item));

        case 'or':
            return lowerSearchItems.some(item => lowerTargetString.includes(item));

        default:
            throw new Error(`Invalid operator: ${operator}. Use 'and' or 'or'.`);
    }
};
