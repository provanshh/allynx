import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { players } = await req.json();
    if (!players || !Array.isArray(players) || players.length < 2) {
      return new Response(JSON.stringify({ error: "Provide at least 2 player names" }), {
        status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    const playerList = players.join(", ");
    const systemPrompt = `You are an elite sports analytics AI with deep knowledge of all sports globally. When given player names, provide an extremely detailed statistical comparison. You MUST respond with valid JSON only, no markdown, no code fences. Use this exact structure:
{
  "players": [
    {
      "name": "Player Name",
      "sport": "Cricket/Football/Basketball/Tennis/etc",
      "role": "Batsman/Forward/Point Guard/etc",
      "nationality": "Country",
      "age": 30,
      "careerYears": "2010-present",
      "coreStats": {
        "attack": 0-100,
        "defense": 0-100,
        "consistency": 0-100,
        "pressure": 0-100,
        "fitness": 0-100,
        "leadership": 0-100,
        "experience": 0-100,
        "technique": 0-100
      },
      "skillBreakdown": {
        "speed": 0-100,
        "agility": 0-100,
        "power": 0-100,
        "accuracy": 0-100,
        "vision": 0-100,
        "stamina": 0-100,
        "mentalToughness": 0-100,
        "clutchFactor": 0-100,
        "adaptability": 0-100,
        "teamwork": 0-100
      },
      "careerHighlights": {
        "totalMatches": 500,
        "wins": 350,
        "winRate": 70,
        "trophies": 15,
        "personalAwards": 8,
        "peakRating": 95,
        "currentForm": 82
      },
      "seasonPerformance": [
        { "year": "2020", "rating": 85 },
        { "year": "2021", "rating": 88 },
        { "year": "2022", "rating": 91 },
        { "year": "2023", "rating": 87 },
        { "year": "2024", "rating": 83 }
      ],
      "strengths": ["strength1", "strength2", "strength3"],
      "weaknesses": ["weakness1", "weakness2"],
      "overallScore": 0-100,
      "sportSpecificStats": {
        "stat1Label": "stat1Value",
        "stat2Label": "stat2Value",
        "stat3Label": "stat3Value",
        "stat4Label": "stat4Value"
      }
    }
  ],
  "categoryWinners": {
    "attack": "PlayerName",
    "defense": "PlayerName",
    "consistency": "PlayerName",
    "speed": "PlayerName",
    "mentalToughness": "PlayerName",
    "leadership": "PlayerName",
    "experience": "PlayerName",
    "clutchFactor": "PlayerName",
    "overallBest": "PlayerName"
  },
  "verdict": "Detailed comparison verdict (3-4 sentences covering who is better overall and in what specific areas)",
  "headToHead": "Direct head-to-head analysis (2-3 sentences)",
  "funFact": "An interesting comparison fun fact"
}
Provide realistic stats based on actual player performance data. For sport-specific stats, use the most relevant metrics for that sport (e.g., batting avg for cricket, goals for football, points for basketball). If comparing cross-sport players, normalize stats fairly. If you don't recognize a player, estimate reasonably and note it.`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: `Compare these players with full detailed analysis: ${playerList}` },
        ],
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limit exceeded. Please try again in a moment." }), {
          status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "AI credits exhausted. Please add credits." }), {
          status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const t = await response.text();
      console.error("AI gateway error:", response.status, t);
      return new Response(JSON.stringify({ error: "AI service error" }), {
        status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const aiData = await response.json();
    const content = aiData.choices?.[0]?.message?.content || "";

    let parsed;
    try {
      const jsonMatch = content.match(/```(?:json)?\s*([\s\S]*?)```/) || [null, content];
      parsed = JSON.parse(jsonMatch[1].trim());
    } catch {
      console.error("Failed to parse AI response:", content);
      return new Response(JSON.stringify({ error: "Failed to parse AI response", raw: content }), {
        status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify(parsed), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("compare-players error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
