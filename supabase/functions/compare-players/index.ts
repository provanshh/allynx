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
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    const playerList = players.join(", ");
    const systemPrompt = `You are a sports analytics AI. When given player names, provide a detailed statistical comparison. You MUST respond with valid JSON only, no markdown, no code fences. Use this exact structure:
{
  "players": [
    {
      "name": "Player Name",
      "sport": "Cricket/Football/etc",
      "role": "Batsman/Forward/etc",
      "stats": {
        "attack": 0-100,
        "defense": 0-100,
        "consistency": 0-100,
        "pressure": 0-100,
        "fitness": 0-100,
        "leadership": 0-100,
        "experience": 0-100,
        "technique": 0-100
      },
      "strengths": ["strength1", "strength2"],
      "weaknesses": ["weakness1", "weakness2"]
    }
  ],
  "verdict": "Brief comparison verdict (2-3 sentences)",
  "headToHead": "Who wins in a head-to-head and why (1-2 sentences)"
}
Provide realistic stats based on actual player performance. If you don't know a player, make reasonable estimates and note it.`;

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
          { role: "user", content: `Compare these players: ${playerList}` },
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
    
    // Parse the JSON from the AI response
    let parsed;
    try {
      // Try to extract JSON if wrapped in code fences
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
