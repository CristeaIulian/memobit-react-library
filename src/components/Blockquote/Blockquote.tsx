import { FC, ReactElement, ReactNode } from 'react';

import { Icon, IconName } from '../Icon';

import './Blockquote.scss';

export type BlockquoteVariant = 'default' | 'accent' | 'info' | 'success' | 'warning' | 'danger';
export type BlockquoteAppearance = 'bar' | 'card' | 'plain' | 'pull';
export type BlockquoteSize = 'sm' | 'md' | 'lg';

export interface BlockquoteProps {
    /** Centres a `pull` quote; the other appearances read better left-aligned. */
    align?: 'left' | 'center';
    /** How the quote is framed: a left rule, a filled card, bare text, or a large pull quote. */
    appearance?: BlockquoteAppearance;
    /** Who said it. */
    author?: string;
    children: ReactNode;
    className?: string;
    /** Turns the source into a link. */
    href?: string;
    /** Small icon before the quote — handy for flagging a note or a warning. */
    icon?: IconName;
    /** Draws a large decorative quote glyph behind the text. */
    showQuoteMark?: boolean;
    size?: BlockquoteSize;
    /** Where it came from: a book, an article, a ticket. Shown after the author. */
    source?: string;
    variant?: BlockquoteVariant;
}

export const Blockquote: FC<BlockquoteProps> = ({
    align,
    appearance = 'bar',
    author,
    children,
    className = '',
    href,
    icon,
    showQuoteMark = false,
    size = 'md',
    source,
    variant = 'default',
}: BlockquoteProps): ReactElement => {
    const hasAttribution = Boolean(author || source);
    // A pull quote is a display element, so it centres unless the caller says otherwise.
    const resolvedAlign = align ?? (appearance === 'pull' ? 'center' : 'left');

    const classes = [
        'blockquote',
        `blockquote--${appearance}`,
        `blockquote--${variant}`,
        `blockquote--${size}`,
        `blockquote--align-${resolvedAlign}`,
        showQuoteMark ? 'blockquote--marked' : '',
        className,
    ]
        .filter(Boolean)
        .join(' ');

    return (
        <figure className={classes}>
            {showQuoteMark && <span className="blockquote__mark">“</span>}

            <blockquote className="blockquote__quote" cite={href}>
                {icon && <Icon className="blockquote__icon" name={icon} size="sm" />}
                <span className="blockquote__text">{children}</span>
            </blockquote>

            {hasAttribution && (
                <figcaption className="blockquote__attribution">
                    {author && <span className="blockquote__author">{author}</span>}
                    {source &&
                        (href ? (
                            <a className="blockquote__source" href={href} rel="noreferrer" target="_blank">
                                {source}
                            </a>
                        ) : (
                            <cite className="blockquote__source">{source}</cite>
                        ))}
                </figcaption>
            )}
        </figure>
    );
};
