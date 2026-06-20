<svelte:options
    customElement={{
        shadow: "none",
    }}
/>

<script lang="ts">
    import {Icon, Spinner} from "@stackoverflow/stacks-svelte";
    import { SpotEmptyLg } from "@stackoverflow/stacks-icons/spots";
    import heartbeatApi from "../clients/heartbeat-api";
    import PopularUnansweredQuestion from "./Shine_PopularUnansweredQuestion.svelte";
    import PopularTags from "./Shine_PopularTags.svelte";

    const params = new URL(window.location.toString()).searchParams;
    const timeFrame = params.get("timeFrame") || "PT1H";
    const baseUrl = "https://beta.stackoverflow.com/"
</script>

{#await heartbeatApi.getHeartbeat(timeFrame)}
    <div class="s-sidebarwidget s-anchors pb12">
        <div class="s-sidebarwidget--content s-sidebarwidget__items">
            <Spinner/>
        </div>
    </div>
{:then data}
    {#if data.popularTags && data.popularTags.length > 0}
        <PopularTags
            tags={data.popularTags || []}
            baseUrl={baseUrl}
        />
    {/if}
    {#if data.popularUnansweredQuestion !== null}
        <PopularUnansweredQuestion
            question={data.popularUnansweredQuestion}
            baseUrl={baseUrl}
        />
    {/if}
{:catch}
    <div class="s-sidebarwidget s-anchors pb12">
        <div class="s-sidebarwidget--content s-sidebarwidget__items">
            <div class="s-empty-state wmx4 my16 d-flex gx16">
                <div class="flex--item">
                    <Icon src="{SpotEmptyLg}"></Icon>
                </div>
                <div class="flex--item ta-left">
                    <p class="fs-body2">Could not load activity</p>
                    <p>We're unable to load activity right now. Please check back shortly.</p>
                </div>
            </div>
        </div>
    </div>
{/await}
