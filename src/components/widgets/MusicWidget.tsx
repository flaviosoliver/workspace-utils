'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import YouTube from 'react-youtube';
import SpotifyPlayer from 'react-spotify-web-playback';
import { FaSpotify, FaYoutube, FaMusic } from 'react-icons/fa';

type StreamingService = 'spotify' | 'youtube' | 'youtubeMusic';

interface Track {
  id: string;
  title: string;
  artist: string;
  uri?: string;
  thumbnail?: string;
}

interface Playlist {
  id: string;
  name: string;
  tracks: Track[];
  thumbnail?: string;
}

export default function MusicWidget() {
  const { user } = useAuth();
  const [selectedService, setSelectedService] =
    useState<StreamingService | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<
    Record<StreamingService, boolean>
  >({
    spotify: false,
    youtube: false,
    youtubeMusic: false,
  });
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [currentTrack, setCurrentTrack] = useState<Track | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(50);
  const [progress, setProgress] = useState(0);

  const services: Record<
    StreamingService,
    {
      name: string;
      authUrl: string;
      icon: React.ReactNode;
    }
  > = {
    spotify: {
      name: 'Spotify',
      authUrl: `/api/music/auth/spotify/login`,
      icon: <FaSpotify className='w-6 h-6 text-green-500' />,
    },
    youtube: {
      name: 'YouTube',
      authUrl: `/api/music/auth/youtube/login`,
      icon: <FaYoutube className='w-6 h-6 text-red-500' />,
    },
    youtubeMusic: {
      name: 'YouTube Music',
      authUrl: `/api/music/auth/youtube-music/login`,
      icon: <FaMusic className='w-6 h-6 text-red-700' />,
    },
  };

  useEffect(() => {
    checkAuthentication();
  }, [selectedService]);

  const checkAuthentication = async () => {
    if (!selectedService) return;

    try {
      const response = await fetch(`/api/music/auth/${selectedService}/status`);
      const data = await response.json();
      setIsAuthenticated((prev) => ({
        ...prev,
        [selectedService]: data.isAuthenticated,
      }));

      if (data.isAuthenticated) {
        fetchPlaylists();
      }
    } catch (error) {
      console.error('Erro ao verificar autenticação:', error);
    }
  };

  const fetchPlaylists = async () => {
    if (!selectedService) return;

    try {
      const response = await fetch(`/api/music/${selectedService}/playlists`);
      const data = await response.json();
      setPlaylists(data.playlists);
    } catch (error) {
      console.error('Erro ao buscar playlists:', error);
    }
  };

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const handlePrevious = () => {
    if (!currentTrack || !selectedService || playlists.length === 0) return;

    const currentPlaylist = playlists.find((playlist) =>
      playlist.tracks.some((track) => track.id === currentTrack.id)
    );

    if (!currentPlaylist) return;

    const currentIndex = currentPlaylist.tracks.findIndex(
      (track) => track.id === currentTrack.id
    );

    const previousIndex =
      currentIndex > 0 ? currentIndex - 1 : currentPlaylist.tracks.length - 1;
    setCurrentTrack(currentPlaylist.tracks[previousIndex]);
  };

  const handleNext = () => {
    if (!currentTrack || !selectedService || playlists.length === 0) return;

    const currentPlaylist = playlists.find((playlist) =>
      playlist.tracks.some((track) => track.id === currentTrack.id)
    );

    if (!currentPlaylist) return;

    const currentIndex = currentPlaylist.tracks.findIndex(
      (track) => track.id === currentTrack.id
    );

    const nextIndex =
      currentIndex < currentPlaylist.tracks.length - 1 ? currentIndex + 1 : 0;
    setCurrentTrack(currentPlaylist.tracks[nextIndex]);
  };

  const handleVolumeChange = (newVolume: number) => {
    setVolume(newVolume);
  };

  const handleProgressChange = (newProgress: number) => {
    setProgress(newProgress);
  };

  const renderPlayer = () => {
    if (!selectedService || !currentTrack) return null;

    switch (selectedService) {
      case 'youtube':
        return (
          <div className='aspect-video w-full'>
            <YouTube
              videoId={currentTrack.id}
              opts={{
                height: '100%',
                width: '100%',
                playerVars: {
                  autoplay: isPlaying ? 1 : 0,
                  controls: 1,
                },
              }}
              onStateChange={(e) => setIsPlaying(e.data === 1)}
              onReady={(e) => e.target.setVolume(volume)}
            />
          </div>
        );
      case 'spotify':
        return (
          <SpotifyPlayer
            token={currentTrack.uri!}
            uris={[currentTrack.uri!]}
            play={isPlaying}
            callback={(state) => {
              setIsPlaying(state.isPlaying);
              setProgress(state.progressMs);
            }}
            styles={{
              activeColor: '#1ed760',
              bgColor: '#181818',
              color: '#fff',
              loaderColor: '#fff',
              sliderColor: '#1ed760',
              trackArtistColor: '#ccc',
              trackNameColor: '#fff',
            }}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className='flex flex-col h-full bg-gray-800 text-white p-4 rounded-lg'>
      <div className='flex space-x-4 mb-4'>
        {Object.entries(services).map(([key, service]) => (
          <button
            key={key}
            onClick={() => {
              if (!isAuthenticated[key as StreamingService]) {
                window.location.href = service.authUrl;
              } else {
                setSelectedService(key as StreamingService);
              }
            }}
            className={`flex items-center space-x-2 px-4 py-2 rounded ${
              selectedService === key
                ? 'bg-blue-600'
                : 'bg-gray-700 hover:bg-gray-600'
            }`}
          >
            {service.icon}
            <span>{service.name}</span>
          </button>
        ))}
      </div>

      {selectedService && isAuthenticated[selectedService] ? (
        <div className='flex flex-1 gap-4'>
          <div className='w-1/3 overflow-y-auto'>
            <h3 className='text-lg font-semibold mb-4'>Suas Playlists</h3>
            <div className='space-y-2'>
              {playlists.map((playlist) => (
                <button
                  key={playlist.id}
                  onClick={() => setCurrentTrack(playlist.tracks[0])}
                  className='w-full flex items-center space-x-3 p-3 hover:bg-gray-700 rounded group transition-colors'
                >
                  {playlist.thumbnail && (
                    <img
                      src={playlist.thumbnail}
                      alt={playlist.name}
                      className='w-12 h-12 object-cover rounded'
                    />
                  )}
                  <div className='flex-1 text-left'>
                    <p className='font-medium truncate'>{playlist.name}</p>
                    <p className='text-sm text-gray-400'>
                      {playlist.tracks.length} faixas
                    </p>
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div className='flex-1 flex flex-col'>
            {renderPlayer()}

            <div className='mt-4 p-4 bg-gray-900 rounded-lg'>
              {currentTrack && (
                <div className='mb-4'>
                  <h4 className='font-medium'>{currentTrack.title}</h4>
                  <p className='text-gray-400'>{currentTrack.artist}</p>
                </div>
              )}

              <div className='flex items-center justify-center space-x-6'>
                <button
                  onClick={handlePrevious}
                  className='p-2 rounded-full hover:bg-gray-700 transition-colors'
                  title='Anterior'
                >
                  ⏮️
                </button>
                <button
                  onClick={handlePlayPause}
                  className='p-4 rounded-full bg-blue-600 hover:bg-blue-700 transition-colors'
                  title={isPlaying ? 'Pausar' : 'Reproduzir'}
                >
                  {isPlaying ? '⏸️' : '▶️'}
                </button>
                <button
                  onClick={handleNext}
                  className='p-2 rounded-full hover:bg-gray-700 transition-colors'
                  title='Próxima'
                >
                  ⏭️
                </button>
              </div>

              <div className='mt-4 flex items-center space-x-4'>
                <input
                  type='range'
                  min='0'
                  max='100'
                  value={volume}
                  onChange={(e) => handleVolumeChange(Number(e.target.value))}
                  className='w-24'
                  title='Volume'
                />
                {selectedService !== 'youtube' && (
                  <input
                    type='range'
                    min='0'
                    max='100'
                    value={progress}
                    onChange={(e) =>
                      handleProgressChange(Number(e.target.value))
                    }
                    className='flex-1'
                    title='Progresso'
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className='flex-1 flex items-center justify-center'>
          <p className='text-gray-400'>
            {selectedService
              ? 'Faça login para acessar suas playlists'
              : 'Selecione um serviço de streaming'}
          </p>
        </div>
      )}
    </div>
  );
}
