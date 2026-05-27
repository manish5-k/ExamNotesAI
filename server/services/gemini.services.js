
const MODEL_LIST = [
    "gemini-flash-latest",
    "gemini-pro-latest",
    "gemini-2.5-flash",
    "gemini-2.0-flash",
    "gemini-3.5-flash"
];

const BASE_URL = "https://generativelanguage.googleapis.com/v1beta/models/";

export const generateGeminiResponse = async (prompt, retries = 5, delay = 5000) => {
    let modelIndex = 0;

    for (let attempt = 1; attempt <= retries; attempt++) {
        const currentModel = MODEL_LIST[modelIndex];
        const url = `${BASE_URL}${currentModel}:generateContent?key=${process.env.GEMINI_API_KEY}`;
        
        try {
            console.log(`📡 Attempt ${attempt}/${retries}: Trying ${currentModel}...`);
            
            const response = await fetch(url, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    contents: [{ parts: [{ text: prompt }] }]
                })
            });

            if (!response.ok) {
                const errText = await response.text();
                const err = JSON.parse(errText);
                console.error(`❌ ${currentModel} failed:`, err.error?.message || errText);

                // If model not found or unsupported, switch to next model immediately
                if (response.status === 404 || (err.error?.message && err.error.message.includes("not supported"))) {
                    console.log(`⏭️ ${currentModel} not available. Switching to next model...`);
                    modelIndex = (modelIndex + 1) % MODEL_LIST.length;
                    // Don't count 404 as an attempt against retries if we have more models to try
                    if (modelIndex !== 0) attempt--; 
                    continue;
                }

                // If Rate Limited (429) or Service Unavailable (503)
                if (response.status === 429 || response.status === 503) {
                    console.log(`⏳ ${currentModel} is busy. Retrying in ${delay}ms...`);
                    await new Promise(resolve => setTimeout(resolve, delay));
                    delay *= 1.5;
                    continue;
                }

                throw new Error(`Gemini API Error: ${response.status} - ${err.error?.message || errText}`);
            }

            const data = await response.json();
            const text = data.candidates?.[0]?.content?.parts?.[0]?.text;

            if (!text) throw new Error("No text returned from Gemini");

            const jsonMatch = text.match(/\{[\s\S]*\}/);
            if (!jsonMatch) throw new Error("No valid JSON found in Gemini response");
            
            console.log(`✅ Success with model: ${currentModel}`);
            return JSON.parse(jsonMatch[0]);

        } catch (error) {
            console.error(`⚠️ Attempt ${attempt} Error with ${currentModel}:`, error.message);
            if (attempt === retries && modelIndex === MODEL_LIST.length - 1) throw error;
            
            // On generic error, try next model
            modelIndex = (modelIndex + 1) % MODEL_LIST.length;
            await new Promise(resolve => setTimeout(resolve, delay));
            delay *= 1.2;
        }
    }

    throw new Error("AI service exhausted all models and retries without success. Please check your API key or try again later.");
};