<script>
	import '../app.css';
	import { onMount } from 'svelte';
	import InputField from '../components/InputField.svelte';
	import SubmitButton from '../components/SubmitButton.svelte';
	import Dropdown from '../components/Dropdown.svelte';
	import { saveGeneratedContent, fetchUserGeneratedContent } from '../lib/firestore';
	import { generateAIContent } from '../routes/api/generateContent'; // Import the AI content generation function

	let userInput = ''; // Initial input from the user
	let currentUser = 1; // Placeholder for user ID (replace with actual user authentication if needed)
	let generatedContent = ''; // Will hold the generated content dynamically
	let tone = ''; // User-selected tone
	let length = ''; // User-selected content length
	let contentList = []; // To store previously generated content

	const toneOptions = [
		{ value: 'casual', text: 'Casual' },
		{ value: 'formal', text: 'Formal' },
		{ value: 'professional', text: 'Professional' }
	];

	const lengthOptions = [
		{ value: 'short', text: 'Short' },
		{ value: 'medium', text: 'Medium' },
		{ value: 'long', text: 'Long' }
	];

	// Function to generate content using AI and save it to Firebase
	async function generateContent() {
		// Debugging the values of userInput, tone, and length
		console.log('userInput:', userInput);
		console.log('tone:', tone);
		console.log('length:', length);

		// Check if userInput, tone, and length are selected
		if (!userInput || !tone || !length) {
			console.error('Tone, length, and user input must be provided.');
			return;
		}

		// Call the AI API to generate content based on user input
		generatedContent = await generateAIContent(userInput, tone, length);

		// Save generated content to Firebase
		await saveGeneratedContent(userInput, generatedContent, currentUser, tone, length);

		// Fetch the updated content list after saving
		await loadUserContent();
	}

	// Function to fetch content for the current user when the component mounts
	async function loadUserContent() {
		contentList = await fetchUserGeneratedContent(currentUser);
	}

	// Call loadUserContent when the component loads
	onMount(() => {
		loadUserContent();
	});
</script>

<main class="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
	<h1 class="text-3xl font-bold mb-6 text-gray-900">AI-Powered Marketing Content Generator</h1>

	<!-- Form with consistent sizes for input and dropdowns -->
	<form
		class="mt-6 w-full max-w-lg bg-white rounded-lg shadow-md p-6"
		on:submit|preventDefault={generateContent}
	>
		<div class="space-y-4 mb-6">
			<InputField placeholder="Enter keywords or topic" bind:value={userInput} />

			<!-- Dropdown for Tone -->
			<Dropdown label="Select Tone" options={toneOptions} bind:bindValue={tone} />

			<!-- Dropdown for Length -->
			<Dropdown label="Select Length" options={lengthOptions} bind:bindValue={length} />
		</div>

		<SubmitButton buttonText="Generate Content" class="mt-6" />
	</form>

	<!-- Section to display the generated content -->
	<section class="w-full max-w-lg mt-8 bg-white rounded-lg shadow-md p-6">
		<h2 class="text-2xl font-semibold mb-4 text-gray-800">Generated Content:</h2>
		<p class="text-gray-700 whitespace-pre-wrap">{generatedContent}</p>
	</section>

	<!-- Section to display content history -->
	<section class="w-full max-w-lg mt-8 bg-white rounded-lg shadow-md p-6">
		<h2 class="text-2xl font-semibold mb-4 text-gray-800">Previous Content:</h2>
		{#if contentList.length > 0}
			<ul>
				{#each contentList as content (content.id)}
					<li class="mb-4 p-4 border-b border-gray-200">
						<p><strong>User Input:</strong> {content.userInput}</p>
						<p><strong>Generated Content:</strong> {content.generatedContent}</p>
						<p><strong>Tone:</strong> {content.tone}</p>
						<p><strong>Length:</strong> {content.length}</p>
						<p><em>{new Date(content.timestamp.seconds * 1000).toLocaleString()}</em></p>
					</li>
				{/each}
			</ul>
		{:else}
			<p>No previous content found.</p>
		{/if}
	</section>
</main>
