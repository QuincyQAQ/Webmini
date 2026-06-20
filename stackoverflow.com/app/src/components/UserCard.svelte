<script>
    import { Icon } from "@stackoverflow/stacks-svelte";
    import { IconPerson } from "@stackoverflow/stacks-icons/icons";
    import { formatReputation } from "./formatter";
    import EventTime from "./EventTime.svelte";

    const { userId, displayName, profileImage, reputation, createdDateTime, baseUrl } = $props();
</script>

<div class="s-user-card s-user-card__minimal">
    {#if userId}
        <a href={`${baseUrl}users/${userId}`} class="s-avatar s-user-card--avatar">
            {#if profileImage}
                <img class="s-avatar--image" src={profileImage} alt="User avatar" />
            {:else}
                <Icon src={IconPerson} class="s-avatar--image" />
            {/if}
        </a>
    {:else}
        <div class="s-avatar s-user-card--avatar">
            <Icon src={IconPerson} class="s-avatar--image" />
        </div>
    {/if}

    <div class="s-user-card--info">
        {#if userId}
            <a href={`${baseUrl}users/${userId}`} class="s-user-card--link">
                {displayName || 'Unknown'}
            </a>
        {:else}
            <span class="s-user-card--link">{displayName || 'Unknown'}</span>
        {/if}

        <ul class="s-user-card--awards">
            <li class="s-user-card--rep">{formatReputation(reputation || 0)}</li>
        </ul>
    </div>
    {#if createdDateTime}
        <EventTime time={createdDateTime} classNames="s-user-card--time" />
    {/if}
</div>
