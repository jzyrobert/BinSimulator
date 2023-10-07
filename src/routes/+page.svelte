<script lang="ts">
	import { TRASHCAN_DIALOGUES, VOICE_LINE_DIALOGUES, ENDING_DIALOGUES } from '$lib/dialogue';
	import type { AudioLine } from '$lib/dialogue';
	import { fade } from 'svelte/transition';
	import { base } from '$app/paths';

	function playClick() {
		if (backgroundAudio != null && !backgroundPlaying) {
			backgroundAudio.volume = 0.2;
			backgroundAudio.play();
			backgroundPlaying = true;
		}
		if (clickAudio != null) {
			clickAudio.play();
		}
	}

	function typeWrite(node: HTMLElement) {
		console.log('Triggering typing...');
		const valid = node.childNodes.length === 1 && node.childNodes[0].nodeType === Node.TEXT_NODE;

		if (!valid) {
			throw new Error(`This transition only works on elements with a single text node child`);
		}

		const text = node.textContent!!;
		const duration = textDuration * 1000;

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
		while (index == lastTextChoice) {
			index = Math.floor(Math.random() * TRASHCAN_DIALOGUES.length);
		}
		lastTextChoice = index;
		const entry = TRASHCAN_DIALOGUES[index];
		if (typeof entry === 'string') {
			totalVoiceDialogue = [entry];
			currentTextIndex = 0;
		} else {
			// trigger special case
			totalVoiceDialogue = entry;
			currentTextIndex = 0;
		}
		textDuration = Math.min(totalVoiceDialogue[0].length / 50, 3);
		showVideo = false;
	}

	const forceUpdate = async (_: boolean) => {};

	function handleTextClick() {
		console.log("Handling click...")
		ready = !ready
		if (totalVoiceDialogue.length && currentTextIndex < totalVoiceDialogue.length - 1) {
			// Continue dialogue
			currentTextIndex += 1;
			textDuration = Math.min(totalVoiceDialogue[currentTextIndex].length / 50, 3);
		} else {
			backToVideo();
		}
	}

	function backToVideo() {
		if (voicelinePlaying) {
			// Wait for voice line to finish
			return;
		}
		playClick();
		showDialogue = false;
		showVideo = true;
	}

	function playVoiceline() {
		// In multiline text, only play during last box
		if (isMultiLine && !isLastEntry) {
			return;
		}
		// Always play the multiline ending dialogue
		const play = isMultiLine ? true : Math.random() <= voiceChance;
		if (play) {
			let index: number;
			let dialogueObj: AudioLine;
			if (isMultiLine) {
				// Alternate here
				index = Math.floor(Math.random() * ENDING_DIALOGUES.length);
				while (index == lastEndingChoice) {
					index = Math.floor(Math.random() * ENDING_DIALOGUES.length);
				}
				lastEndingChoice = index
				dialogueObj = ENDING_DIALOGUES[index];
				// Append the remaining length to get the actual index
				index += VOICE_LINE_DIALOGUES.length;
			} else {
				index = Math.floor(Math.random() * VOICE_LINE_DIALOGUES.length);
				while (index == lastVoicelineChoice) {
					index = Math.floor(Math.random() * VOICE_LINE_DIALOGUES.length);
				}
				lastVoicelineChoice = index;
				dialogueObj = VOICE_LINE_DIALOGUES[index];
			}
			const voiceNode = document.getElementById('voicelines')!!.children[index] as HTMLAudioElement;
			textDuration = voiceNode.duration;

			dialogueIcon = base + '/images/' + dialogueObj.icon;
			voiceDialogue = dialogueObj.line;
			showDialogue = true;

			voiceNode.play();
		}
	}

	let showVideo = true;
	let backgroundPlaying = false;
	let voicelinePlaying = false;
	let showDialogue = false;
	let ready = false;

	let voiceDialogue = '';
	let dialogueIcon = '';

	let totalVoiceDialogue: string[] = ['Placeholder'];

	let currentTextIndex = 0;
	let lastTextChoice = -1;
	let lastEndingChoice = -1;
	let lastVoicelineChoice = -1;
	let textDuration = 0;
	let voiceChance = 0.4; // 40%

	let backgroundAudio: HTMLAudioElement;
	let clickAudio: HTMLAudioElement;

	$: combinedVoiceLines = [
		...VOICE_LINE_DIALOGUES.map((d) => d.audio),
		...ENDING_DIALOGUES.map((d) => d.audio)
	];
	$: isMultiLine = totalVoiceDialogue.length > 1;
	$: isLastEntry = currentTextIndex == totalVoiceDialogue.length - 1;
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
		<div in:fade out:fade on:click={() => {handleTextClick()}} id="textblock">
			{#await forceUpdate(ready) then _}
			<div in:typeWrite on:introend={() => playVoiceline()} id="bintext">
				{totalVoiceDialogue.length > 0 && currentTextIndex < totalVoiceDialogue.length
					? totalVoiceDialogue[currentTextIndex]
					: ''}
			</div>
			{/await}
			<div class:show={showDialogue} id="dialogueBox">
				{#if showDialogue}
					<img id="character" src={dialogueIcon} alt="Character icon" />
					<div id="dialogue" in:typeWrite>{voiceDialogue}</div>
				{/if}
			</div>
		</div>
	{/if}
	<audio bind:this={backgroundAudio} id="ember" src="Embers.mp3" loop />
	<audio bind:this={clickAudio} id="click" src="click_fast.mp3" />
	<div id="voicelines">
		{#each combinedVoiceLines as voiceLine}
			<audio
				on:play={() => (voicelinePlaying = true)}
				on:ended={() => (voicelinePlaying = false)}
				src={base + '/voices/' + voiceLine + '.mp3'}
			/>
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
