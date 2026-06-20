/**
 * Decodes common HTML entities (e.g., &quot;, &amp;, &lt;, &gt;, &apos;)
 * into their corresponding characters.
 *
 * @param html The string potentially containing HTML entities.
 * @returns The string with HTML entities decoded.
 */
export const decodeHtmlEntities = (html: string): string => {
    if (html === null || html === undefined) {
        return '';
    }
    const doc = new DOMParser().parseFromString(html, 'text/html');
    return doc.documentElement.textContent || '';
};