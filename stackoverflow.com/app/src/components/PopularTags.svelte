<script lang="ts">
    import {Icon} from "@stackoverflow/stacks-svelte";
    import {IconFire} from "@stackoverflow/stacks-icons/icons";
    import {decodeHtmlEntities} from "./decodeHtmlEntities";
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

<div class="s-sidebarwidget--content s-sidebarwidget__items">
    <div class="s-sidebarwidget--item">
        <Icon native={true} src={IconFire} title="Popular tags"/>
        <p class="fw-normal m0 ml4">Popular tags</p>
    </div>

    <div class="s-sidebarwidget--item d-flex g4 fw-wrap">
        {#each tags as tag}
            <a class="s-tag" href={`${baseUrl}questions/tagged/${tag}`}
               onmouseup={(e) => handleTagMouseUp(e, tag)}>
                {decodeHtmlEntities(tag)}
            </a>
        {/each}
    </div>
</div>
