export interface Track {
  id: number;
  title: string;
  artist: string;
  genre: string;
  audio_url: string;
  cover_url: string;
  duration: number;
  is_featured: boolean;
  // Tambahin ini biar komponen lirik gak protes
  lyrics?: { time: number; text: string }[]; 
}

const API_URL =
  "https://script.google.com/macros/s/AKfycbxM0MUTg7H40NkbYl3I7kONa7O6AP0ca8MYzMTLX_hIctKbwTjxAUDJ0vEGCI789hws/exec";

interface ApiTrack {
  id: number;
  title: string;
  artist: string;
  genre: string;
  audio_url: string;
  cover_url: string;
  duration: string;
  is_featured: boolean;
  // Nanti kalau di Google Sheet lu tambahin kolom lirik, 
  // tinggal aktifin line di bawah ini:
  // lyrics?: string; 
}

function parseDuration(d: string): number {
  const date = new Date(d);
  return date.getMinutes() * 60 + date.getSeconds();
}

// Dummy lyrics generator biar ada isinya pas ngetes
// Karena lirik biasanya gak ada di API standard, kita bikin logic buat nyelipin
function getDummyLyrics(title: string) {
  return [
    { time: 0, text: `♫ Listening to ${title} ♫` },
    { time: 5, text: "Vibe-nya dapet banget ya bro..." },
    { time: 10, text: "Coba dengerin bass-nya yang dalem." },
    { time: 15, text: "Lirik ini cuma dummy buat ngetes fitur scroll." },
    { time: 20, text: "Nanti lu bisa isi lirik aslinya lewat database." },
    { time: 25, text: "Gimana? Keren kan fiturnya?" },
  ];
}

export async function fetchTracks(): Promise<Track[]> {
  const res = await fetch(API_URL);
  const data: ApiTrack[] = await res.json();
  
  return data.map((t) => ({
    id: t.id,
    title: t.title,
    artist: t.artist,
    genre: t.genre,
    audio_url: t.audio_url,
    cover_url: t.cover_url,
    duration: parseDuration(t.duration),
    is_featured: t.is_featured,
    // Kita suntik lirik dummy-nya di sini
    lyrics: getDummyLyrics(t.title), 
  }));
}