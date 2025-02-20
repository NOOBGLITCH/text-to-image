const API_TOKEN = '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'; // Replace with your API token
const MODEL = 'kothariyashhh/GenAi-Texttoimage';


// Function to generate the image
async function generateImage() {
    const prompt = document.getElementById('prompt').value.trim();
    const loading = document.getElementById('loading');
    const progress = document.getElementById('progress');
    const errorDiv = document.getElementById('error');
    const imageContainer = document.getElementById('imageContainer');
    const imageSize = document.getElementById('imageSize').value;

    // Clear previous results
    errorDiv.textContent = '';
    imageContainer.innerHTML = '';

    if (!prompt) {
        errorDiv.textContent = 'Please enter a prompt';
        return;
    }

    loading.style.display = 'block';
    progress.textContent = 'Progress: 0%';

    try {
        // Simulate progress updates
        let progressValue = 0;
        const progressInterval = setInterval(() => {
            progressValue += Math.random() * 20;
            if (progressValue > 90) progressValue = 90;
            progress.textContent = `Progress: ${Math.round(progressValue)}%`;
        }, 1000);

        const response = await fetch(`https://api-inference.huggingface.co/models/${MODEL}`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${API_TOKEN}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                inputs: prompt,
                parameters: {
                    num_inference_steps: 50,
                    guidance_scale: 7.5,
                    width: imageSize === '16:9' ? 1280 : 720,
                    height: imageSize === '16:9' ? 720 : 1280,
                }
            }),
        });

        clearInterval(progressInterval);
        progress.textContent = 'Progress: 100%';

        if (!response.ok) {
            throw new Error('Failed to generate image');
        }

        const result = await response.blob();
        const imageUrl = URL.createObjectURL(result);
        
        const img = document.createElement('img');
        img.src = imageUrl;
        img.style.maxWidth = '100%';
        img.style.borderRadius = '5px';
        img.alt = 'Generated image';
        
        imageContainer.appendChild(img);

    } catch (error) {
        errorDiv.textContent = error.message || 'An error occurred while generating the image';
    } finally {
        loading.style.display = 'none';
    }
}

// Add event listener to handle "Enter" key in textarea
document.getElementById('prompt').addEventListener('keypress', function(event) {
    if (event.key === 'Enter' && !event.shiftKey) {
        event.preventDefault();
        generateImage();
    }
});