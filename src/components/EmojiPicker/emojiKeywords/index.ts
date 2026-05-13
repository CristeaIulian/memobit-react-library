import { activitiesKeywords } from './activities';
import { animalsKeywords } from './animals';
import { foodKeywords } from './food';
import { objectsKeywords } from './objects';
import { peopleKeywords } from './people';
import { smileysKeywords } from './smileys';
import { symbolsKeywords } from './symbols';
import { travelKeywords } from './travel';

export const EMOJI_KEYWORDS: Record<string, string[]> = {
    ...smileysKeywords,
    ...peopleKeywords,
    ...animalsKeywords,
    ...foodKeywords,
    ...travelKeywords,
    ...activitiesKeywords,
    ...objectsKeywords,
    ...symbolsKeywords,
};
