
const Gemini_URL = 
"https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent"

export const generateGeminiResponse = async (prompt) => {

    try {
         const response = await fetch(`${Gemini_URL}?key=${process.env.GEMINI_API_KEY}`,{
        method:"POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: prompt
                }
              ]
            }
          ]
        })

    })

    if (!response.ok) {
      const err = await response.text();
      console.error("Gemini API Error Response:", err);
      throw new Error(`Gemini API Error: ${response.status} - ${err}`);
    }

    const data = await response.json()

    const text =
      data.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!text) {
      throw new Error("No text returned from Gemini");
    }

    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error("No valid JSON found in Gemini response");
    }
    const cleanText = jsonMatch[0];

      return JSON.parse(cleanText);



    } catch (error) {
        console.error("Gemini Fetch Error:", error.message);
        throw error;
    }
   
}