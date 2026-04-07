/**
 * Normalizes a value into HTML suitable for rendering via dangerouslySetInnerHTML
 * or feeding to the RichTextEditor. If the value already contains HTML tags, it
 * is returned as-is; otherwise, plain text is escaped and converted into
 * paragraph/line-break markup.
 */
export const ensureHtml = (value: string | undefined | null): string => {
    if (!value) return '';

    // Already HTML
    if (/<[a-z][\s\S]*>/i.test(value)) return value;

    const escaped = value
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;');

    return escaped
        .split(/\n{2,}/)
        .map(paragraph => `<p>${paragraph.replace(/\n/g, '<br>')}</p>`)
        .join('');
};

/**
 * Converts an HTML string into plain text by leveraging the browser DOM parser.
 * Used for search matching and helpers that expect plain text input.
 */
export const htmlToPlainText = (html: string | undefined | null): string => {
    if (!html) return '';

    const container = document.createElement('div');
    container.innerHTML = html;

    container.querySelectorAll('br').forEach(br => br.replaceWith('\n'));

    return (container.textContent || '').trim();
};

/**
 * Splits a piece of content (HTML or plain text) into discrete steps using
 * block-level HTML elements when available, falling back to a single step
 * otherwise.
 */
export const splitHtmlIntoSteps = (content: string | undefined | null): string[] => {
    if (!content) return [];

    const html = ensureHtml(content);
    const container = document.createElement('div');
    container.innerHTML = html;

    const blockSelectors = 'p, li, h1, h2, h3, h4, h5, h6';
    const blocks = Array.from(container.querySelectorAll(blockSelectors));

    if (blocks.length > 0) {
        const steps = blocks
            .map(block => block.innerHTML.trim())
            .filter(step => step.length > 0 && htmlToPlainText(step).length > 0);

        if (steps.length > 0) return steps;
    }

    const fallback = container.innerHTML.trim();
    return fallback ? [fallback] : [];
};

/**
 * Converts an HTML fragment into its Markdown equivalent. Used by components
 * such as the RichTextEditor to optionally emit Markdown output instead of
 * HTML.
 */
export const htmlToMarkdown = (html: string): string => {
    const div = document.createElement('div');
    div.innerHTML = html;

    const processNode = (node: Node): string => {
        if (node.nodeType === Node.TEXT_NODE) return (node.textContent ?? '').replace(/\u00a0/g, ' ');

        if (node.nodeType !== Node.ELEMENT_NODE) return '';

        const el = node as HTMLElement;
        const tag = el.tagName.toLowerCase();
        const children = Array.from(el.childNodes).map(processNode).join('');

        switch (tag) {
            case 'b':
            case 'strong':
                return `**${children}**`;
            case 'i':
            case 'em':
                return `*${children}*`;
            case 'u':
                return `<u>${children}</u>`;
            case 'h1':
                return `# ${children}\n\n`;
            case 'h2':
                return `## ${children}\n\n`;
            case 'h3':
                return `### ${children}\n\n`;
            case 'h4':
                return `#### ${children}\n\n`;
            case 'h5':
                return `##### ${children}\n\n`;
            case 'h6':
                return `###### ${children}\n\n`;
            case 'p':
                return `${children}\n\n`;
            case 'br':
                return '\n';
            case 'a':
                return `[${children}](${el.getAttribute('href') ?? ''})`;
            case 'ul': {
                const items = Array.from(el.children).map(li => {
                    const checkbox = li.querySelector('input[type="checkbox"]');
                    if (checkbox) {
                        const checked = (checkbox as HTMLInputElement).checked;
                        const text = (li.textContent ?? '').trim();
                        return `- [${checked ? 'x' : ' '}] ${text}`;
                    }
                    return `- ${processNode(li)}`;
                });
                return items.join('\n') + '\n\n';
            }
            case 'ol': {
                const items = Array.from(el.children).map((li, i) => `${i + 1}. ${processNode(li)}`);
                return items.join('\n') + '\n\n';
            }
            case 'li':
                return children;
            case 'code':
                return `\`${children}\``;
            case 'pre':
                return `\`\`\`\n${el.textContent ?? ''}\n\`\`\`\n\n`;
            case 'table': {
                const rows = Array.from(el.querySelectorAll('tr'));
                if (!rows.length) return '';
                const header = Array.from(rows[0].querySelectorAll('th,td'))
                    .map(cell => cell.textContent ?? '')
                    .join(' | ');
                const divider = Array.from(rows[0].querySelectorAll('th,td'))
                    .map(() => '---')
                    .join(' | ');
                const body = rows.slice(1).map(row =>
                    Array.from(row.querySelectorAll('td'))
                        .map(cell => cell.textContent ?? '')
                        .join(' | ')
                );
                return [header, divider, ...body].join('\n') + '\n\n';
            }
            case 'div':
                return `${children}\n`;
            default:
                return children;
        }
    };

    return Array.from(div.childNodes).map(processNode).join('').trim();
};
