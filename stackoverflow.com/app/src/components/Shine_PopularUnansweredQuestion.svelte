<script lang="ts">
    import { Icon } from "@stackoverflow/stacks-svelte";
    // @ts-expect-error - beta package has incorrect TypeScript module declarations - resolves correctly at runtime
    import { IconQuestion } from "@stackoverflow/stacks-icons-beta/icons";
    import { decodeHtmlEntities } from "./decodeHtmlEntities";
    import { TagClickedEvent, trackEvent, PopularUnansweredQuestionClickedEvent } from "../clients/analytics";
    import UserCard from "./Shine_UserCard.svelte";

    const { question, baseUrl } = $props();

    const tagList: string[] = (question?.tags || "")
        .split(";")
        .filter((t: string) => t.trim() !== "");

    function trackTagClick(tag: string) {
        trackEvent(new TagClickedEvent("popular-unanswered-question", tag));
    }
    function trackQuestionClick(questionId: number) {
        trackEvent(new PopularUnansweredQuestionClickedEvent(questionId));
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
        <Icon src={IconQuestion} title="Popular unanswered question"/>
        <p class="fw-normal m0 ml4">Popular unanswered question</p>
    </div>

    <div class="s-sidebarwidget--content d-block">
        <UserCard
            userId={question?.userId}
            displayName={question?.displayName}
            profileImage={question?.profileImage}
            createdDateTime={question?.createdDateTime}
            baseUrl={baseUrl}
        />

        <div class="d-block mt8">
            <a
                href={`${baseUrl}questions/${question?.postId}`}
                class="s-link fs-body3 break-word"
                onclick={() => trackQuestionClick(question?.postId)}
            >
                {decodeHtmlEntities(question?.postTitle)}
            </a>
        </div>

        <div class="d-flex g8 fw-wrap mt12">
            {#each tagList as tag}
                <a class="s-tag" href={`${baseUrl}questions/tagged/${tag}`}
                onmouseup={(e) => handleTagMouseUp(e, tag)}>
                    {decodeHtmlEntities(tag)}
                </a>
            {/each}
        </div>
    </div>
</div>
