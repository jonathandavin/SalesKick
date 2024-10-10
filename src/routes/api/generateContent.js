export async function generateAIContent(userInput, tone, length) {
	const apiKey = import.meta.env.VITE_OPENAI_API_KEY; // Load API key from environment

	const prompt = `Generate a ${tone} marketing content draft of ${length} length for the following topic: ${userInput}`;

	try {
		const response = await fetch('https://api.openai.com/v1/chat/completions', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${apiKey}` // Authorization header with API key
			},
			body: JSON.stringify({
				model: 'gpt-3.5-turbo', // Use GPT-3.5-turbo
				messages: [
					{
						role: 'system', // System message to guide the assistant's behavior
						content: 'You are a helpful assistant that generates marketing content.'
					},
					{
						role: 'user', // User input message
						content: prompt
					}
				],
				max_tokens: 200, // Number of tokens (adjust according to your needs)
				temperature: 0.7 // Adjust the temperature for creativity (range: 0 to 1)
			})
		});

		const data = await response.json();
		return data.choices[0].message.content; // Return the generated content
	} catch (error) {
		console.error('Error generating content:', error);
		return '';
	}
}
