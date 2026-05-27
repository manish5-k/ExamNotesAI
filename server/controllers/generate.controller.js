import Notes from "../models/notes.model.js"
import UserModel from "../models/user.model.js"
import { generateGeminiResponse } from "../services/gemini.services.js"
import { buildPrompt } from "../utils/promptBuilder.js"

export const generateNotes = async (req, res) => {
    try {
        const {
            topic,
            classLevel,
            examType,
            revisionMode = false,
            includeDiagram = false,
            includeChart = false
        } = req.body;
        if (!topic) {
            return res.status(400).json({ message: "Topic is required" })
        }
        const user = await UserModel.findById(req.userId)
        if (!user) {
            return res.status(400).json({ message: "user is not found" })
        }

        if (user.credits <= 0) {
            return res.status(403).json({ 
                message: "Insufficient credits. Please top up to continue.",
                credits: user.credits
            })
        }
        
        const prompt = buildPrompt({
            topic,
            classLevel,
            examType,
            revisionMode,
            includeDiagram,
            includeChart
        })


        const aiResponse = await generateGeminiResponse(prompt)
   

        const notes = await Notes.create({
            user: user._id,
            topic,
            classLevel,
            examType,
            revisionMode,
            includeDiagram,
            includeChart,
            content: aiResponse


        })


        user.credits -= 1;
        if (user.credits <= 0) user.isCreditAvailable = false;

        if (!Array.isArray(user.notes)) {
            user.notes = [];
        }

        user.notes.push(notes._id);

        await user.save();

        return res.status(200).json({
            data: aiResponse,
      noteId: notes._id,
      creditsLeft: user.credits
        })




    } catch (error) {
        console.error("Generation Error:", error);
        
        let errorMessage = error.message || "AI generation failed. Please try again later.";
        
        if (error.message && (error.message.includes("503") || error.message.includes("UNAVAILABLE"))) {
            errorMessage = "The AI model is currently overloaded. We tried retrying, but it's still busy. Please wait a moment and try again.";
        } else if (error.message && error.message.includes("429")) {
            errorMessage = "Too many requests to the AI service. Please wait a bit.";
        } else if (error.message && error.message.includes("No valid JSON found")) {
            errorMessage = "The AI generated content but it was in an invalid format. Please try again.";
        }

        res.status(500).json({
            error: "AI generation failed",
            message: errorMessage
        });
    }
}
