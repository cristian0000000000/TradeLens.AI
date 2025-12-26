
import { GoogleGenAI, Type } from "@google/genai";
import { TradePlan, Bias } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

// Função utilitária para comprimir imagens base64 no cliente
export async function compressImage(base64: string, quality = 0.7, maxWidth = 1200): Promise<string> {
  return new Promise((resolve) => {
    const img = new Image();
    img.src = base64;
    img.onload = () => {
      const canvas = document.createElement('canvas');
      let width = img.width;
      let height = img.height;

      if (width > maxWidth) {
        height = (maxWidth / width) * height;
        width = maxWidth;
      }

      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      ctx?.drawImage(img, 0, 0, width, height);
      resolve(canvas.toDataURL('image/jpeg', quality).split(',')[1]);
    };
  });
}

const RESPONSE_SCHEMA = {
  type: Type.OBJECT,
  properties: {
    pair: { type: Type.STRING },
    bias: { type: Type.STRING },
    entry: { type: Type.NUMBER },
    stopLoss: { type: Type.NUMBER },
    takeProfit: { type: Type.NUMBER },
    riskReward: { type: Type.NUMBER },
    confidenceScore: { type: Type.NUMBER },
    marketStructure: { type: Type.STRING },
    confluenceVerdict: { type: Type.STRING },
    keyZones: { type: Type.ARRAY, items: { type: Type.STRING } },
    reasoning: { type: Type.ARRAY, items: { type: Type.STRING } },
    patterns: { type: Type.ARRAY, items: { type: Type.STRING } },
    nearbyNews: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          event: { type: Type.STRING },
          timeRelative: { type: Type.STRING },
          impact: { type: Type.STRING }
        },
        required: ["event", "timeRelative", "impact"]
      }
    }
  },
  required: ["pair", "bias", "entry", "stopLoss", "takeProfit", "riskReward", "confidenceScore", "marketStructure", "confluenceVerdict", "keyZones", "reasoning", "patterns", "nearbyNews"]
};

export async function analyzeMultiTimeframe(
  primaryBase64: string, 
  secondaryBase64: string | null,
  strategy: string
): Promise<{ data: Partial<TradePlan>; sources: any[] }> {
  // Otimização: Usar flash para velocidade em análises de rotina se necessário, 
  // mas manter Pro para precisão institucional conforme solicitado.
  const model = "gemini-3-pro-preview";
  
  // Otimização: Prompt mais direto e focado
  const systemInstruction = `Analista Institucional Senior. 
  1. Identifique par e use Google Search para PREÇO SPOT ATUAL (Forex Real-time).
  2. Defina Entry/SL/TP usando ${strategy} sobre o preço live. 
  3. Retorne JSON estrito. Precisão máxima em pips.`;

  // Comprimir imagens antes de enviar para reduzir o tempo de upload/processamento
  const compressedPrimary = await compressImage(primaryBase64);
  const compressedSecondary = secondaryBase64 ? await compressImage(secondaryBase64) : null;

  const contents = {
    parts: [
      { inlineData: { mimeType: "image/jpeg", data: compressedPrimary } },
      ...(compressedSecondary ? [{ inlineData: { mimeType: "image/jpeg", data: compressedSecondary } }] : []),
      { text: "Busque preço Forex real e analise conforme estratégia." }
    ]
  };

  try {
    const startTime = Date.now();
    const response = await ai.models.generateContent({
      model,
      contents,
      config: {
        systemInstruction,
        tools: [{ googleSearch: {} }],
        responseMimeType: "application/json",
        responseSchema: RESPONSE_SCHEMA,
      }
    });

    console.debug(`Análise concluída em: ${(Date.now() - startTime) / 1000}s`);

    const rawText = response.text || '{}';
    const data = JSON.parse(rawText);
    const sources = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];

    return {
      data: {
        ...data,
        id: crypto.randomUUID(),
        timestamp: Date.now()
      },
      sources
    };
  } catch (error) {
    console.error("AI Service Failure:", error);
    throw new Error("Erro na análise. Tente reduzir o zoom do gráfico e tente novamente.");
  }
}
