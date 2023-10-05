<div id="outer">
    <div id="inner">
    <!-- svelte-ignore a11y-media-has-caption -->
    <video on:click={() => showText()} autoplay={true} muted={true} controls={false} loop={true} src="Background_1.mp4"></video>
</div>
</div>

<script lang="ts">
    function showText() {

    }

</script>

<style>
    #outer {
        height: 100%;
        display: flex;
        justify-content: center;
        flex-direction: column;
    }
    #inner {
        display: flex;
        align-content: center;
        justify-content: center;
    }

    video {
        width: 100%;
    }
</style>
