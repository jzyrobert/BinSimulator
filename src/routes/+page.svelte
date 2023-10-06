<script lang="ts">
	import {
		TRASHCAN_DIALOGUES,
		VOICE_LINES,
		VOICE_LINE_DIAGLOGUES as VOICE_LINE_DIALOGUES
	} from '$lib/dialogue';
	import { fade } from 'svelte/transition';
	import { base } from '$app/paths';

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
		const duration = textDuration * 1000;

		console.log(`duration is ${duration}`)
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
		let index = Math.floor(Math.random() * TRASHCAN_DIALOGUES.length);
		while (index == lastTextIndex) {
			index = Math.floor(Math.random() * TRASHCAN_DIALOGUES.length);
		}
		lastTextIndex = index;
		const entry = TRASHCAN_DIALOGUES[index];
		if (typeof entry === 'string') {
			textEntry = entry;
		} else {
			textEntry = '\n'.concat(...entry);
		}
		textDuration = Math.min(textEntry.length / 50, 3);
		showVideo = false;
	}

	function backToVideo() {
		if (voicelinePaused.some((b) => !b)) {
			// Wait for voice line to finish
			return;
		}
		playClick();
		showDialogue = false;
		showVideo = true;
	}

	function playVoiceline() {
		const play = Math.random() <= 0.3; // 30% chance
		if (play) {
			let index = Math.floor(Math.random() * VOICE_LINES.length);
			while (index == lastVoicelineIndex) {
				index = Math.floor(Math.random() * VOICE_LINES.length);
			}
			lastVoicelineIndex = index;
			const voiceNode = document.getElementById('voicelines')!!.children[index] as HTMLAudioElement;
			const dialogueObj = VOICE_LINE_DIALOGUES[index];
			console.log(voiceNode.duration)
			textDuration = voiceNode.duration

			dialogueIcon = base + '/images/' + dialogueObj.icon;
			voiceDialogue = dialogueObj.line;
			showDialogue = true;

			voiceNode.play();
		}
	}

	let showVideo = true;
	let audioPlaying = false;
	let showDialogue = false;

	let textEntry = '';
	let voiceDialogue = '';
	let dialogueIcon = '';

	let textDuration = 0;
	let lastTextIndex = -1;
	let lastVoicelineIndex = -1;

	let voicelinePaused: boolean[] = Array(VOICE_LINES.length).fill(true);
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
			src="Background_2.mp4"
		/>
	{:else}
		<!-- svelte-ignore a11y-no-static-element-interactions -->
		<!-- svelte-ignore a11y-click-events-have-key-events -->
		<div out:fade on:click={() => backToVideo()} id="textblock">
			<div in:typeWrite on:introend={() => playVoiceline()} id="bintext">{textEntry}</div>
			<div class:show={showDialogue} id="dialogueBox">
				{#if showDialogue}
				<img id="character" src={dialogueIcon} alt="Character icon" />
				<div id="dialogue" in:typeWrite>{voiceDialogue}</div>
				{/if}
			</div>
		</div>
	{/if}
	<audio id="ember" src="Embers.mp3" loop />
	<audio id="click" src="click_fast.mp3" />
	<div id="voicelines">
		{#each VOICE_LINES as voiceLine, index (voiceLine)}
			<audio bind:paused={voicelinePaused[index]} src={base + '/voices/' + voiceLine + '.mp3'} />
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
		display: flex;
		height: 100%;
		flex-wrap: wrap;
		align-content: center;
		justify-content: center;
		flex-direction: row;
		margin-bottom: auto;
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
	#dialogueBox {
		display: flex;
		width: 50%;
		height: 15%;
		justify-content: flex-start;
		transform: translate(0%, 100%);
		padding: 10px;
	}
	#dialogueBox.show {
		border-style: solid;
		border-color: aliceblue;
	}
	#dialogue {
		display: flex;
		flex-wrap: wrap;
		align-content: center;
		justify-content: center;
		color: white;
		font-size: 20pt;
		font-family: din_bold;
	}
	#character {
		display: flex;
		align-content: center;
		justify-content: center;
		scale: 80%;
	}
	video {
		width: 100%;
		display: flex;
		align-content: center;
		justify-content: center;
	}
</style>
