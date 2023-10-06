<script lang="ts">
	import { TRASHCAN_DIALOGUES, VOICE_LINES } from '$lib/dialogue';
	import { fade } from 'svelte/transition';

	function playClick() {
		if (!audioPlaying) {
			const audioElement = document.getElementById('ember');
			if (audioElement instanceof HTMLAudioElement) {
				audioElement.volume = 0.2;
				audioElement.play();
				audioPlaying = true;
			}
		}
		const audioElement = document.getElementById('click');
		if (audioElement instanceof HTMLAudioElement) {
			audioElement.play();
		}
	}

	function typeWrite(node: HTMLElement) {
		const valid = node.childNodes.length === 1 && node.childNodes[0].nodeType === Node.TEXT_NODE;

		if (!valid) {
			throw new Error(`This transition only works on elements with a single text node child`);
		}

		const text = node.textContent!!;
		const speed = text.length / 10;
		const duration = text.length / (speed * 0.01);

		return {
			duration,
			tick: (t: number) => {
				const i = Math.trunc(text.length * t);
				node.textContent = text.slice(0, i);
			}
		};
	}

	function showText() {
		playClick();
		const entry = TRASHCAN_DIALOGUES[Math.floor(Math.random() * TRASHCAN_DIALOGUES.length)];
		if (typeof entry === 'string') {
			textEntry = entry;
			showVideo = false;
		} else {
			// Special
		}
	}

	function backToVideo() {
		if (voicelinePaused.some(b => !b)) {
			// Wait for voice line to finish
			return
		}
		playClick();
		showVideo = true;
	}

	function playVoiceline() {
		const play = Math.random() <= 1 // 30% chance
		if (play) {
			const index = Math.floor(Math.random() * VOICE_LINES.length);
			const voiceNode = document.getElementById('voicelines')!!.children[index] as HTMLAudioElement
			voiceNode.play()
		}
	}

	let showVideo = true;
	let textEntry = '';
	let audioPlaying = false;
	let voicelinePaused: boolean[] = Array(VOICE_LINES.length).fill(true)
</script>

<div id="outer">
	<!-- svelte-ignore a11y-media-has-caption -->
	{#if showVideo}
		<video
			in:fade
			out:fade
			on:click={() => showText()}
			autoplay
			muted
			controls={false}
			loop
			src="Background_1.mp4"
		/>
	{:else}
		<!-- svelte-ignore a11y-no-static-element-interactions -->
		<!-- svelte-ignore a11y-click-events-have-key-events -->
		<div out:fade on:click={() => backToVideo()} id="textblock">
			<div in:typeWrite on:introend={() => playVoiceline()} id="bintext">{textEntry}</div>
		</div>
	{/if}
	<audio id="ember" src="Embers.mp3" loop />
	<audio id="click" src="click_fast.mp3" />
	<div id="voicelines">
		{#each VOICE_LINES as voiceLine, index (voiceLine)}
		<audio bind:paused={voicelinePaused[index]} src={'/voices/' + voiceLine + '.mp3'}></audio>
		{/each}
	</div>
</div>

<style>
	@font-face {
		font-family: din_bold;
		src: url('/fonts/din_bold.otf');
	}
	#outer {
		height: 100%;
		flex-direction: column;
	}
	#textblock {
		height: 100%;
		display: flex;
		flex-wrap: wrap;
		align-content: center;
		justify-content: center;
		flex-direction: column;
		background-color: black;
	}
	#bintext {
		display: flex;
		width: 80%;
		flex-wrap: wrap;
		align-content: center;
		justify-content: center;
		color: white;
		font-size: 30pt;
		font-family: din_bold;
	}
	video {
		width: 100%;
		display: flex;
		align-content: center;
		justify-content: center;
	}
</style>
