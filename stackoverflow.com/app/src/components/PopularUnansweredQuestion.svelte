<script lang="ts">
    import { Icon } from "@stackoverflow/stacks-svelte";
    import { IconFire } from "@stackoverflow/stacks-icons/icons";
    import { decodeHtmlEntities } from "./decodeHtmlEntities";
    import { TagClickedEvent, trackEvent, PopularUnansweredQuestionClickedEvent } from "../clients/analytics";
    import UserCard from "./UserCard.svelte";

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

<div class="s-sidebarwidget--content s-sidebarwidget__items">
    <div class="s-sidebarwidget--item">
        <Icon src={IconFire} title="Popular unanswered question" native={true} />
        <p class="fw-normal m0">Popular unanswered question</p>
    </div>

    <div class="s-sidebarwidget--item">
        <a
            href={`${baseUrl}questions/${question?.postId}`}
            class="s-link fs-body3 break-word"
            onclick={() => trackQuestionClick(question?.postId)}
        >
            {decodeHtmlEntities(question?.postTitle)}
        </a>
    </div>

    <div class="s-sidebarwidget--item d-flex g4 fw-wrap">
        {#each tagList as tag}
            <a class="s-tag" href={`${baseUrl}questions/tagged/${tag}`}
               onmouseup={(e) => handleTagMouseUp(e, tag)}>
                {decodeHtmlEntities(tag)}
            </a>
        {/each}
    </div>

    <UserCard
        userId={question?.userId}
        displayName={question?.displayName}
        profileImage={question?.profileImage}
        reputation={question?.reputation}
        createdDateTime={question?.createdDateTime}
        baseUrl={baseUrl}
    />
</div>
