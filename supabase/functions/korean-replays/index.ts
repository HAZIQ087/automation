import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { filters } = await req.json();
    console.log('Fetching Korean server replays with filters:', filters);

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseKey = Deno.env.get('SUPABASE_ANON_KEY')!
    const supabase = createClient(supabaseUrl, supabaseKey)

    // Get API key from environment (user will need to set this)
    const riotApiKey = Deno.env.get('RIOT_API_KEY');
    
    if (!riotApiKey) {
      console.log('No Riot API key found, returning mock data');
      return new Response(
        JSON.stringify({ 
          error: 'Riot API key not configured. Please add RIOT_API_KEY to your Supabase secrets.',
          replays: generateMockKoreanReplays(filters)
        }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200
        }
      );
    }

    // Fetch challenger players from Korean server
    const challengerResponse = await fetch(
      `https://kr.api.riotgames.com/lol/league/v4/challengerleagues/by-queue/RANKED_SOLO_5x5?api_key=${riotApiKey}`
    );

    if (!challengerResponse.ok) {
      throw new Error(`Failed to fetch challenger data: ${challengerResponse.status}`);
    }

    const challengerData = await challengerResponse.json();
    console.log(`Found ${challengerData.entries.length} challenger players`);

    // Get recent matches for top players
    const replays = [];
    const topPlayers = challengerData.entries.slice(0, 10); // Get top 10 players

    for (const player of topPlayers) {
      try {
        // Get summoner info
        const summonerResponse = await fetch(
          `https://kr.api.riotgames.com/lol/summoner/v4/summoners/${player.summonerId}?api_key=${riotApiKey}`
        );
        
        if (!summonerResponse.ok) continue;
        
        const summoner = await summonerResponse.json();
        
        // Get recent match history
        const matchListResponse = await fetch(
          `https://asia.api.riotgames.com/lol/match/v5/matches/by-puuid/${summoner.puuid}/ids?start=0&count=5&api_key=${riotApiKey}`
        );
        
        if (!matchListResponse.ok) continue;
        
        const matchIds = await matchListResponse.json();
        
        // Get match details for each recent match
        for (const matchId of matchIds.slice(0, 2)) { // Limit to 2 matches per player
          try {
            const matchResponse = await fetch(
              `https://asia.api.riotgames.com/lol/match/v5/matches/${matchId}?api_key=${riotApiKey}`
            );
            
            if (!matchResponse.ok) continue;
            
            const match = await matchResponse.json();
            
            // Find the player's data in the match
            const participant = match.info.participants.find(
              (p: any) => p.puuid === summoner.puuid
            );
            
            if (!participant) continue;
            
            // Apply filters
            if (filters.tier && filters.tier !== 'Challenger') continue;
            if (filters.duration && match.info.gameDuration < filters.duration * 60) continue;
            
            const kda = (participant.kills + participant.assists) / Math.max(participant.deaths, 1);
            if (filters.kda && kda < parseFloat(filters.kda)) continue;
            
            // Create replay entry
            const replay = {
              id: matchId,
              player: summoner.name,
              champion: participant.championName,
              rank: 'Challenger',
              tier: 'Challenger',
              kda: `${participant.kills}/${participant.deaths}/${participant.assists}`,
              kdaRatio: kda.toFixed(2),
              duration: Math.floor(match.info.gameDuration / 60),
              patch: match.info.gameVersion,
              gameMode: match.info.gameMode,
              win: participant.win,
              downloadUrl: `https://replay.leagueoflegends.com/kr/${matchId}`,
              teamId: participant.teamId,
              createdAt: new Date(match.info.gameCreation).toISOString()
            };
            
            replays.push(replay);
          } catch (matchError) {
            console.error('Error fetching match details:', matchError);
          }
        }
        
        // Rate limiting - small delay between requests
        await new Promise(resolve => setTimeout(resolve, 100));
        
      } catch (playerError) {
        console.error('Error fetching player data:', playerError);
      }
    }

    console.log(`Successfully fetched ${replays.length} replays`);

    return new Response(
      JSON.stringify({ replays }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200
      }
    );

  } catch (error) {
    console.error('Error in korean-replays function:', error);
    
    return new Response(
      JSON.stringify({ 
        error: error.message,
        replays: generateMockKoreanReplays(filters || {})
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200
      }
    );
  }
});

function generateMockKoreanReplays(filters: any) {
  const koreanPlayers = [
    'Hide on bush', 'Doran', 'Canyon', 'ShowMaker', 'Keria',
    'Zeus', 'Oner', 'Faker', 'Gumayusi', 'BeryL'
  ];
  
  const champions = [
    'Azir', 'LeBlanc', 'Orianna', 'Syndra', 'Yasuo',
    'Graves', 'Nidalee', 'Lee Sin', 'Elise', 'Kindred',
    'Jinx', 'Kai Sa', 'Ezreal', 'Aphelios', 'Jhin'
  ];
  
  const replays = [];
  
  for (let i = 0; i < 15; i++) {
    const player = koreanPlayers[Math.floor(Math.random() * koreanPlayers.length)];
    const champion = champions[Math.floor(Math.random() * champions.length)];
    const kills = Math.floor(Math.random() * 15) + 1;
    const deaths = Math.floor(Math.random() * 8);
    const assists = Math.floor(Math.random() * 20) + 2;
    const kda = (kills + assists) / Math.max(deaths, 1);
    const duration = Math.floor(Math.random() * 20) + 25;
    const teamId = Math.random() > 0.5 ? 100 : 200;
    
    // Apply filters
    if (filters.tier && filters.tier !== 'Challenger') continue;
    if (filters.duration && duration < filters.duration) continue;
    if (filters.kda && kda < parseFloat(filters.kda)) continue;
    
    replays.push({
      id: `KR_${Date.now()}_${i}`,
      player,
      champion,
      rank: 'Challenger',
      tier: 'Challenger',
      kda: `${kills}/${deaths}/${assists}`,
      kdaRatio: kda.toFixed(2),
      duration,
      patch: '14.1.1',
      gameMode: 'CLASSIC',
      win: Math.random() > 0.5,
      downloadUrl: `https://replay.leagueoflegends.com/kr/mock_${i}`,
      teamId,
      createdAt: new Date(Date.now() - Math.random() * 86400000 * 7).toISOString()
    });
  }
  
  return replays.slice(0, 10);
}