<script lang="ts">
    let { time, classNames }: { time: string; classNames: string | null; } = $props();
    const rtf = new Intl.RelativeTimeFormat('en', { numeric: 'auto' });

    function getRelativeTime(date: Date): string {
        if (isNaN(date.getTime())) {
            return '';
        }
        const now = new Date();
        const diffMs = now.getTime() - date.getTime();
        const diffSeconds = Math.round(diffMs / 1000);

        if (diffSeconds < 60) return rtf.format(-diffSeconds, 'second');
        const diffMinutes = Math.round(diffSeconds / 60);
        if (diffMinutes < 60) return rtf.format(-diffMinutes, 'minute');
        const diffHours = Math.round(diffMinutes / 60);
        if (diffHours < 24) return rtf.format(-diffHours, 'hour');
        const diffDays = Math.round(diffHours / 24);
        return rtf.format(-diffDays, 'day');
    }

    const eventDate = new Date(time);
    const isValidDate = !isNaN(eventDate.getTime());

    const relative = isValidDate ? getRelativeTime(eventDate) : '';
    const formattedEventDate = isValidDate ? Intl.DateTimeFormat('en', {dateStyle: "full", timeStyle: "long"}).format(eventDate) : '';
</script>

<time datetime="{formattedEventDate}" title="{formattedEventDate}" class="{classNames}">{relative}</time>
