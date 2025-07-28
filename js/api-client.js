export async function sendImageAndKeywords(formData, signal) {
    const response = await fetch('/api/analyze-image', {
        method: 'POST',
        body: formData,
        signal
    });

    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
}
