import { useState, useRef, useCallback, useEffect } from "react";
import { Track } from "../data/tracks";

export function useAudioPlayer(tracks: Track[]) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [currentTrack, setCurrentTrack] = useState<Track | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [volume, setVolumeState] = useState(0.7);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);

  useEffect(() => {
    const audio = new Audio();
    audio.crossOrigin = "anonymous";
    audio.volume = 0.7;
    audioRef.current = audio;

    const onTimeUpdate = () => {
      if (audio.duration) {
        setProgress((audio.currentTime / audio.duration) * 100);
        setCurrentTime(audio.currentTime);
      }
    };

    const onLoadedMetadata = () => {
      setDuration(audio.duration);
    };

    const onEnded = () => {
      playNext();
    };

    audio.addEventListener("timeupdate", onTimeUpdate);
    audio.addEventListener("loadedmetadata", onLoadedMetadata);
    audio.addEventListener("ended", onEnded);

    return () => {
      audio.removeEventListener("timeupdate", onTimeUpdate);
      audio.removeEventListener("loadedmetadata", onLoadedMetadata);
      audio.removeEventListener("ended", onEnded);
      audio.pause();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Keep tracks ref current for the onEnded callback
  const tracksRef = useRef(tracks);
  tracksRef.current = tracks;

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  const playTrack = useCallback((track: Track) => {
    if (!audioRef.current) return;
    const audio = audioRef.current;
    audio.src = track.audio_url;
    audio.play().then(() => {
      setIsPlaying(true);
      setCurrentTrack(track);
    }).catch(() => {
      setIsPlaying(false);
    });
  }, []);

  const togglePlay = useCallback(() => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play().then(() => setIsPlaying(true)).catch(() => {});
    }
  }, [isPlaying]);

  const playNext = useCallback(() => {
    const list = tracksRef.current;
    if (!list.length) return;
    if (!currentTrack) {
      playTrack(list[0]);
      return;
    }
    const idx = list.findIndex((t) => t.id === currentTrack.id);
    const next = list[(idx + 1) % list.length];
    playTrack(next);
  }, [currentTrack, playTrack]);

  const playPrev = useCallback(() => {
    const list = tracksRef.current;
    if (!list.length) return;
    if (!currentTrack) {
      playTrack(list[0]);
      return;
    }
    const idx = list.findIndex((t) => t.id === currentTrack.id);
    const prev = list[(idx - 1 + list.length) % list.length];
    playTrack(prev);
  }, [currentTrack, playTrack]);

  const seekTo = useCallback((percent: number) => {
    if (!audioRef.current || !audioRef.current.duration) return;
    audioRef.current.currentTime = (percent / 100) * audioRef.current.duration;
  }, []);

  const setVolume = useCallback((v: number) => {
    setVolumeState(v);
  }, []);

  const playRandom = useCallback(() => {
    const list = tracksRef.current;
    if (!list.length) return;
    const idx = Math.floor(Math.random() * list.length);
    playTrack(list[idx]);
  }, [playTrack]);

  return {
    currentTrack,
    isPlaying,
    progress,
    volume,
    duration,
    currentTime,
    playTrack,
    togglePlay,
    playNext,
    playPrev,
    seekTo,
    setVolume,
    playRandom,
  };
}
