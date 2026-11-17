import { Router } from 'express';

const router = Router();

/**
 * POST /api/v1/diseases/detect
 * Crop leaf disease detection endpoint.
 * Transparently checks for GEMINI_API_KEY in backend environment.
 * Never fabricates or returns fake AI detections.
 */
router.post('/detect', async (req, res) => {
  try {
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return res.status(200).json({
        status: 'api_key_required',
        message: 'Backend requires GEMINI_API_KEY in server/.env to enable live computer vision diagnostics.',
      });
    }

    // When GEMINI_API_KEY is configured, forward image payload to Gemini 1.5 Flash Vision
    const { imageBase64, mimeType, crop } = req.body;

    if (!imageBase64) {
      return res.status(400).json({
        status: 'error',
        message: 'No image data provided for diagnosis.',
      });
    }

    const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;

    const promptText = `You are a plant pathologist and agronomist. Analyze this crop leaf photo. The user indicates this might be ${crop || 'a crop plant'}. 
Identify:
1. Disease or Pest Name (Common and Scientific)
2. Pathogen / Cause
3. Severity Assessment (Low, Medium, High, Severe)
4. Recommended Organic / Biological Control
5. Recommended Chemical Treatment (ICAR/CIBRC approved dosages)
Format response as clear JSON with keys: diseaseName, pathogen, severity, organicTreatment, chemicalTreatment, confidence.`;

    const payload = {
      contents: [
        {
          parts: [
            { text: promptText },
            {
              inline_data: {
                mime_type: mimeType || 'image/jpeg',
                data: imageBase64,
              },
            },
          ],
        },
      ],
      generationConfig: {
        temperature: 0.2,
        response_mime_type: 'application/json',
      },
    };

    const response = await fetch(geminiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errBody = await response.text();
      console.error('[GEMINI API ERROR]', errBody);
      return res.status(200).json({
        status: 'api_key_required',
        message: `Gemini API returned error: ${response.statusText}`,
      });
    }

    const data = await response.json();
    const candidateText = data?.candidates?.[0]?.content?.parts?.[0]?.text;
    const diagnosis = candidateText ? JSON.parse(candidateText) : null;

    return res.status(200).json({
      status: 'success',
      diagnosis,
    });
  } catch (error) {
    console.error('[DISEASE DETECTION ERROR]', error);
    return res.status(500).json({
      status: 'error',
      message: 'Failed to process crop image diagnosis.',
    });
  }
});

export default router;
