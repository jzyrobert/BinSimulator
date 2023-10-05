<div id="outer">
    <div id="inner">
    <!-- svelte-ignore a11y-media-has-caption -->
    <video autoplay={true} muted={true} controls={false} loop={true} src="star_brown.mp4"></video>
</div>
<div id="inner">
    <!-- svelte-ignore a11y-media-has-caption -->
    <video autoplay={true} muted={true} controls={false} loop={true} src="prompt.mp4"></video>
</div>
</div>

<style>
    #outer {
        display: flex;
        justify-content: center;
        flex-direction: column;
    }
    #inner {
        display: flex;
        justify-content: center;
    }
</style>
