<script>
    import { Icon } from "@stackoverflow/stacks-svelte";
    import { IconPerson } from "@stackoverflow/stacks-icons/icons";
    import EventTime from "./EventTime.svelte";

    const { userId, displayName, profileImage, createdDateTime, baseUrl } = $props();
</script>

<div class="s-user-card d-flex gs8">
    {#if userId}
        <a href={`${baseUrl}users/${userId}`} class="s-user-card--group">
            {#if profileImage}
                <span class="s-avatar s-avatar__16">
                    <img class="s-avatar--image" alt="User avatar" src={profileImage} />
                </span>
            {:else}
                <span class="s-avatar s-avatar__16">
                    <Icon src={IconPerson} class="s-avatar--image" />
                </span>
            {/if}
            <span class="s-user-card--username">{displayName || 'Unknown'}</span>
        </a>
    {:else}
        <div class="s-user-card--group">
            <Icon src={IconPerson} class="s-avatar--image" />
        </div>
        <span class="s-user-card--username">{displayName || 'Unknown'}</span>
    {/if}

    {#if createdDateTime}
        <span class="s-user-card--time" data-controller="s-tooltip">
            <EventTime time={createdDateTime} classNames="s-user-card--time" />
        </span>
    {/if}
</div>
