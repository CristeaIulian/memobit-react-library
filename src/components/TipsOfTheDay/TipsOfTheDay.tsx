import React, { FC } from 'react';

import { Card } from '../Card';
import { Icon } from '../Icon';

import './TipsOfTheDay.scss';

const randomIntFromInterval = (min: number, max: number): number => Math.floor(Math.random() * (max - min + 1) + min);

interface TipsOfTheDayProps {
    list: string[];
}

export const TipsOfTheDay: FC<TipsOfTheDayProps> = ({ list }: TipsOfTheDayProps): React.ReactElement => {
    const tipIndex = randomIntFromInterval(0, list.length - 1);

    return (
        <Card className="tips-of-the-day">
            <h3><Icon name="sparkle" /> Tip Of The Day <Icon name="sparkle" /></h3> <h4>{list[tipIndex]}</h4>
        </Card>
    );
};
