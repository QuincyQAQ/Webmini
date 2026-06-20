<script lang="ts">
    import { Icon, } from "@stackoverflow/stacks-svelte-beta";
    // @ts-expect-error - beta package has incorrect TypeScript module declarations - resolves correctly at runtime
    import { IconTag } from "@stackoverflow/stacks-icons-beta/icons";
    import { decodeHtmlEntities } from "./decodeHtmlEntities";
    import { TagClickedEvent, trackEvent } from "../clients/analytics";

    const {tags, baseUrl} = $props();

    function trackTagClick(tag: string) {
        trackEvent(new TagClickedEvent("popular-tags", tag));
    }

    function handleTagMouseUp(e: MouseEvent, tag: string) {
        // Track on both left and middle mouse button release
        if (e.button === 0 || e.button === 1) {
            trackTagClick(decodeHtmlEntities(tag));
        }
    }
</script>

<div class="s-sidebarwidget mt32">
    <div class="s-sidebarwidget--header">
        <h2>
            <Icon src={IconTag} title="Popular tags"/>
            <span class="ml4">Popular tags</span>
        </h2>
    </div>

    <div class="s-sidebarwidget--content d-flex g8 fw-wrap">
        {#each tags as tag}
            <a class="s-tag" href={`${baseUrl}questions/tagged/${tag}`}
               onmouseup={(e) => handleTagMouseUp(e, tag)}>
                {decodeHtmlEntities(tag)}
            </a>
        {/each}
    </div>
</div>
