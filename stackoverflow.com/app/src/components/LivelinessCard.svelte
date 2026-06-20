<svelte:options
    customElement={{
        shadow: "none",
    }}
/>

<script lang="ts">
    import {Icon, Spinner} from "@stackoverflow/stacks-svelte";
    import {
        IconAnswer,
        IconArrowUp,
        IconMessage,
        IconQuestion,
    } from "@stackoverflow/stacks-icons/icons";
    import { SpotEmptyLg } from "@stackoverflow/stacks-icons/spots";
    import heartbeatApi from "../clients/heartbeat-api";
    import PopularUnansweredQuestion from "./PopularUnansweredQuestion.svelte";
    import PopularTags from "./PopularTags.svelte";

    const pluralize = (count: number, singular: string, plural?: string) => {
        const word = count === 1 ? singular : (plural ?? `${singular}s`);
        return `${count} ${word}`;
    };
    const params = new URL(window.location.toString()).searchParams;
    const timeFrame = params.get("timeFrame") || "PT1H";
    const baseUrl = "https://stackoverflow.com/"
</script>

<div class="s-sidebarwidget s-anchors pb12">
    <div class="d-flex jc-space-between ai-end">
        <div class="s-sidebarwidget--header">Community activity</div>
        <div class="fc-orange-400 fs-caption mr16">Last 1 hr</div>
    </div>
    {#await heartbeatApi.getHeartbeat(timeFrame)}
        <div class="s-sidebarwidget--content s-sidebarwidget__items">
            <Spinner/>
        </div>
    {:then data}
        <ul id="heartbeat-items" class="s-sidebarwidget--content s-sidebarwidget__items">
            <li class="s-sidebarwidget--item g6 ai-center">
                <div class="s-activity-indicator s-activity-indicator__success">
                    <div class="v-visible-sr">Users online activity</div>
                </div>
                <div class="wmn0 ow-break-word">
                    {pluralize(data.numberOfUsersActive, "user online", "users online")}
                </div>
            </li>
            <li class="s-sidebarwidget--item g6 ai-center">
                <div class="wmn0 ow-break-word">
                    <Icon src="{IconQuestion}"
                          title="Number of questions asked"/> {pluralize(data.numberOfQuestionsAsked, "question")}
                </div>
            </li>
            <li class="s-sidebarwidget--item g6 ai-center">
                <div class="wmn0 ow-break-word">
                    <Icon src="{IconAnswer}"
                        title="Number of questions that received an answer"/> {pluralize(data.numberOfQuestionsAnswered, "answer")}
                </div>
            </li>
            <li class="s-sidebarwidget--item g6 ai-center">
                <div class="wmn0 ow-break-word">
                    <Icon src="{IconMessage}"
                        title="Number of comments posted"/> {pluralize(data.numberOfCommentsPosted, "comment")}
                </div>
            </li>
            <li class="s-sidebarwidget--item g6 ai-center">
                <div class="wmn0 ow-break-word">
                    <Icon src="{IconArrowUp}"
                        title="Number of upvotes on posts"/> {pluralize(data.numberOfSuccessfulUpvotes, "upvote")}
                </div>
            </li>
        </ul>
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
    {/await}
</div>
