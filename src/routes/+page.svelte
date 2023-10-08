<script lang="ts">
	import { TRASHCAN_DIALOGUES, VOICE_LINE_DIALOGUES, ENDING_DIALOGUES } from '$lib/dialogue';
	import type { AudioLine } from '$lib/dialogue';
	import { fade } from 'svelte/transition';
	import { base } from '$app/paths';

	function playClick() {
		if (backgroundAudio != null && !backgroundPlaying) {
			backgroundAudio.volume = 0.15;
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
		const delay = node.id == 'bintext' ? 0 : dialogueDelay * 1000;

		return {
			delay,
			duration,
			tick: (t: number) => {
				const i = Math.trunc(text.length * t);
				node.textContent = text.slice(0, i);
			}
		};
	}

	function showText() {
		let index = Math.floor(Math.random() * TRASHCAN_DIALOGUES.length);
		while (index == lastTextChoice) {
			index = Math.floor(Math.random() * TRASHCAN_DIALOGUES.length);
		}
		lastTextChoice = index;
		index = 0;
		const entry = TRASHCAN_DIALOGUES[index];
		if (typeof entry === 'string') {
			totalVoiceDialogue = [entry];
			currentTextIndex = 0;
		} else {
			// trigger special case
			totalVoiceDialogue = entry;
			currentTextIndex = 0;
		}
		textDuration = Math.min(totalVoiceDialogue[0].length / textSpeed, textDurationLimit);
		showVideo = false;
	}

	const forceUpdate = async (_: boolean) => {};

	function handleTextClick() {
		// Let dialogue finish playing
		if (introRunning || showAchievement) {
			return;
		}
		if (totalVoiceDialogue.length && currentTextIndex < totalVoiceDialogue.length - 1) {
			// Continue dialogue
			currentTextIndex += 1;
			textDuration = Math.min(
				totalVoiceDialogue[currentTextIndex].length / textSpeed,
				textDurationLimit
			);

			ready = !ready;
		} else {
			backToVideo();
		}
	}

	function backToVideo() {
		if (voicelinePlaying) {
			// Wait for voice line to finish
			return;
		}
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
				lastEndingChoice = index;
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
			dialogueDelay = dialogueObj.delay ?? 0;
			textDuration = voiceNode.duration - dialogueDelay;

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
	let introRunning = false;
	let showAchievement = false;

	let voiceDialogue = '';
	let dialogueIcon = '';

	let totalVoiceDialogue: string[] = ['Placeholder'];

	let currentTextIndex = 0;
	let lastTextChoice = -1;
	let lastEndingChoice = -1;
	let lastVoicelineChoice = -1;
	let textDuration = 0;
	let voiceChance = 0.4; // 40%
	let textSpeed = 70; // Duration = Length of text divided by this number, limited to textDurationLimit (seconds)
	let textDurationLimit = 2;
	let dialogueDelay = 3; // If voiceline starts with e.g. laughing

	let backgroundAudio: HTMLAudioElement;
	let clickAudio: HTMLAudioElement;
	let achieveAudio: HTMLAudioElement;

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
			on:click={() => {
				playClick();
				showText();
			}}
			autoplay
			muted
			controls={false}
			loop
			src="Background_2.mp4"
		/>
	{:else}
		<!-- svelte-ignore a11y-no-static-element-interactions -->
		<!-- svelte-ignore a11y-click-events-have-key-events -->
		<div
			in:fade
			out:fade
			on:click={() => {
				playClick();
				handleTextClick();
			}}
			id="textblock"
		>
			{#await forceUpdate(ready) then _}
				<div
					in:typeWrite
					on:introstart={() => (introRunning = true)}
					on:introend={() => {
						introRunning = false;
						if (currentTextIndex == totalVoiceDialogue.length - 2) {
							showAchievement = true;
						}
						playVoiceline();
					}}
					id="bintext"
				>
					{totalVoiceDialogue.length > 0 && currentTextIndex < totalVoiceDialogue.length
						? totalVoiceDialogue[currentTextIndex]
						: ''}
				</div>
			{/await}
			<div id="dialogueContainer">
				{#if showDialogue}
					<div id="dialogueBox">
						<img id="character" src={dialogueIcon} alt="Character icon" />
						<div id="dialogue" in:typeWrite>{voiceDialogue}</div>
					</div>
				{/if}
				{#if showAchievement}
					<div
						in:fade={{ duration: 500 }}
						out:fade={{ delay: 1000, duration: 1000 }}
						class="show"
						id="dialogueBox"
					>
						<img
							on:introstart={() => achieveAudio.play()}
							in:fade={{ duration: 500 }}
							out:fade={{ delay: 1000, duration: 1000 }}
							on:introend={() => {
								showAchievement = false;
							}}
							id="praise"
							src={base + '/images/praise.webp'}
							alt="Praise of High morals"
						/>
						<div
							id="dialogue"
							in:fade={{ duration: 500 }}
							out:fade={{ delay: 1000, duration: 1000 }}
						>
							Obtained 1x Praise of High morals
						</div>
					</div>
				{/if}
			</div>
		</div>
	{/if}
	<audio bind:this={backgroundAudio} id="ember" src="Embers.mp3" loop />
	<audio bind:this={achieveAudio} id="achieve" src="achieve.mp3" />
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
		/* display: flex; */
		/* justify-content: center; */
	}
	#textblock {
		display: flex;
		height: 100%;
		width: 100%;
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
		font-size: 4.5vmin;
		font-family: din_bold;
	}
	#dialogueContainer {
		display: flex;
		width: 50%;
		height: 15%;
		justify-content: flex-start;
		transform: translate(0%, 100%);
		padding: 10px;
	}
	#dialogueBox {
		display: flex;
		justify-content: flex-start;
		width: 100%;
		border-style: solid;
		border-color: aliceblue;
	}
	#dialogue {
		display: flex;
		flex-wrap: wrap;
		align-content: center;
		justify-content: center;
		color: white;
		font-size: 3vmin;
		font-family: din_bold;
	}
	#character {
		display: flex;
		align-content: center;
		justify-content: center;
		scale: 80%;
	}
	video {
		height: 120%;
		width: 140%;
		overflow: hidden;
		transform: translate(-15%);
	}
</style>
