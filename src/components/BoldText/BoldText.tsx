import { type FC } from 'react';

interface BoldTextProps {
    text: string;
}

/** Renders the `**bold**` parts of a text, so a translated sentence stays whole even when its emphasis moves. */
export const BoldText: FC<BoldTextProps> = ({ text }) => (
    <>{text.split('**').map((part, index) => (index % 2 === 1 ? <strong key={index}>{part}</strong> : part))}</>
);
