export interface Track {
  id: number;
  title: string;
  artist: string;
  genre: string;
  audio_url: string;
  cover_url: string;
  duration: number;
  is_featured: boolean;
  lyrics?: { time: number; text: string }[]; 
}

const API_URL = "https://script.google.com/macros/s/AKfycbxM0MUTg7H40NkbYl3I7kONa7O6AP0ca8MYzMTLX_hIctKbwTjxAUDJ0vEGCI789hws/exec";

// --- FUNGSI PARSER LRC ---
function parseLRC(lrcText: string): { time: number; text: string }[] {
  const lines = lrcText.split('\n');
  const lyrics: { time: number; text: string }[] = [];
  lines.forEach(line => {
    const match = line.match(/\[(\d+):(\d+\.\d+)\](.*)/);
    if (match) {
      const minutes = parseInt(match[1]);
      const seconds = parseFloat(match[2]);
      const text = match[3].trim();
      if (text) lyrics.push({ time: minutes * 60 + seconds, text });
    }
  });
  return lyrics;
}

// --- DATABASE LIRIK ---
const peachesLRC = `
[00:10.20]I got my peaches out in Georgia (oh yeah, shit)
[00:12.70]I get my weed from California (that's that shit)
[00:15.26]I took my chick up to the North, yeah (badass bitch)
[00:18.10]I get my light right from the source, yeah (yeah, that's it)
[00:21.61]And I see you (oh), the way I breathe you in (in), it's the texture of your skin
[00:28.16]I wanna wrap my arms around you, baby, never let you go, oh
[00:31.89]And I say, "Oh, there's nothing like your touch
[00:36.15]It's the way you lift me up, yeah
[00:39.97]And I'll be right here with you 'til the end"
[00:41.91]I got my peaches out in Georgia (oh yeah, shit)
[00:44.54]I get my weed from California (that's that shit)
[00:47.30]I took my chick up to the North, yeah (badass bitch)
[00:50.01]I get my light right from the source, yeah (yeah, that's it)
[00:54.69]You ain't sure yet, but I'm for ya
[00:59.66]All I could want, all I can wish for
[01:02.41]Nights alone that we miss more
[01:05.04]And days we save as souvenirs
[01:07.91]There's no time, I wanna make more time
[01:11.42]And give you my whole life
[01:14.16]I left my girl, I'm in Mallorca
[01:19.46]Hate to leave her, call it torture
[01:24.79]Remember when I couldn't hold her
[01:30.31]Left her baggage for Rimowa
[01:35.34]I got my peaches out in Georgia (oh yeah, shit)
[01:38.14]I get my weed from California (that's that shit)
[01:40.74]I took my chick up to the North, yeah (badass bitch)
[01:43.39]I get my light right from the source, yeah (yeah, that's it)
[01:46.26]I get the feeling, so I'm sure (sure)
[01:48.36]Hand in my hand because I'm yours
[01:50.85](I can't) I can't pretend, I can't ignore, you're right for me
[01:54.43]Don't think you wanna know just where I've been, oh
[01:58.40]Done being distracted
[02:00.53]The one I need is right in my arms (oh)
[02:03.60]Your kisses taste the sweetest, with mine
[02:05.55]And I'll be right here with you 'til the end of time
[02:07.44]I got my peaches out in Georgia (oh yeah, shit)
[02:10.04]I get my weed from California (that's that shit)
[02:12.73]I took my chick up to the North, yeah (badass bitch)
[02:15.40]I get my light right from the source, yeah (yeah, that's it)
[02:18.22]I got my peaches out in Georgia (oh yeah, shit)
[02:20.78]I get my weed from California (that's that shit)
[02:23.43]I took my chick up to the North, yeah (badass bitch)
[02:26.19](I get my light right from the source, yeah, yeah)
[02:28.79]I got my peaches out in Georgia (oh yeah, shit)
[02:31.52]I get my weed from California (that's that shit)
[02:33.99]I took my chick up to the North, yeah (badass bitch)
[02:36.78]I get my light right from the source, yeah (yeah, that's it)
[02:39.68]I got my peaches out in Georgia (oh yeah, shit)
[02:42.32]I get my weed from California (that's that shit)
[02:44.81]I took my chick up to the North, yeah (badass bitch)
[02:47.38]I get my light right from the source, yeah (yeah, that's it)
`;

const ghostLRC = `
[00:46.73]Youngblood thinks there's always tomorrow
[00:52.99]I miss your touch on nights when I'm hollow
[00:59.19]I know you crossed a bridge that I can't follow
[01:05.09]Since the love that you left is all that I get
[01:08.67]I want you to know
[01:10.62]That if I can't be close to you
[01:15.19]I'll settle for the ghost of you
[01:18.48]I miss you more than life (more than life)
[01:22.98]And if you can't be next to me
[01:27.70]Your memory is ecstasy
[01:30.90]I miss you more than life
[01:33.92]I miss you more than life
[01:36.65]Youngblood thinks there's always tomorrow
[01:42.86]I need more time but time can't be borrowed
[01:49.08]I'd leave it all behind if I could follow
[01:54.97]Since the love that you left is all that I get
[01:58.47]I want you to know
[02:00.51]That if I can't be close to you
[02:05.07]I'll settle for the ghost of you
[02:08.51]I miss you more than life (yeah)
[02:12.92]And if you can't be next to me
[02:17.54]Your memory is ecstasy (oh)
[02:20.72]I miss you more than life
[02:23.82]I miss you more than life
[02:29.21]Whoa
[02:31.40]Na, na-na
[02:34.54]More than life
[02:37.37](Oh)
[02:38.10]So if I can't get close to you
[02:42.45]I'll settle for the ghost of you
[02:45.68]But I miss you more than life
[02:51.21]And if you can't be next to me
[02:54.96]Your memory is ecstasy
[02:58.12]I miss you more than life
[03:01.30]I miss you more than life
`;

const LIRIK_DATABASE: Record<number, { time: number; text: string }[]> = {
  1: parseLRC(ghostLRC),
  2: parseLRC(peachesLRC),
  3: [{ time: 4.5, text: "What you doin'?" }],
  9: [{ time: 12.3, text: "I, I just woke up from a dream" }],
  16: [{ time: 8.2, text: "Now he's thinkin' 'bout me every night" }],
  17: [{ time: 10.5, text: "I want you to stay" }]
};

function parseDuration(d: any): number {
  if (!d) return 0;
  
  const s = String(d);

  // 1. Kasus ISO String: "1899-12-30T02:33:00.000Z"
  if (s.includes('T')) {
    // Kita ambil bagian setelah 'T' yaitu "02:33:00"
    const timePart = s.split('T')[1].split('.')[0]; 
    const p = timePart.split(':').map(Number);
    
    // Di Sheets lu 2:33:00, kita ambil p[0] sebagai menit, p[1] sebagai detik
    // Kita abaikan p[2] karena itu cuma detik nol bawaan format jam Sheets
    return (p[0] * 60) + p[1];
  }

  // 2. Kasus String Biasa: "02:33:00" atau "2:33"
  if (s.includes(':')) {
    const p = s.split(':').map(Number);
    if (p.length === 3) {
      // Sama kayak atas, ambil dua angka pertama
      return (p[0] * 60) + p[1];
    }
    if (p.length === 2) {
      return (p[0] * 60) + p[1];
    }
  }

  const num = Number(d);
  return isNaN(num) ? 0 : num;
}

export const formatTime = (seconds: number) => {
  if (!seconds || isNaN(seconds)) return "0:00";
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
};

export async function fetchTracks(): Promise<Track[]> {
  try {
    const res = await fetch(API_URL);
    const data = await res.json();
    
    return data.map((t: any) => {
      const trackId = Number(t.id);
      return {
        id: trackId,
        title: t.title,
        artist: t.artist,
        genre: t.genre,
        audio_url: t.audio_url,
        cover_url: t.cover_url,
        duration: parseDuration(t.duration),
        is_featured: t.is_featured,
        lyrics: LIRIK_DATABASE[trackId] || [{ time: 0, text: "♫ Music ♫" }]
      };
    });
  } catch (error) {
    console.error("Fetch error:", error);
    return [];
  }
}