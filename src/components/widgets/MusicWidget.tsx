'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import YouTube from 'react-youtube';
import SpotifyPlayer from 'react-spotify-web-playback';
import { FaSpotify, FaYoutube } from 'react-icons/fa';
import { SiYoutubemusic } from 'react-icons/si';
import { BsMusicPlayerFill } from 'react-icons/bs';
import { X, ChevronDown } from 'lucide-react';
import { IPlaylist, IRadio, ITrack } from '@/types';
import {
  CgPlayButtonO,
  CgPlayPauseO,
  CgPlayTrackNextO,
  CgPlayTrackPrevO,
} from 'react-icons/cg';

type StreamingService = 'spotify' | 'youtube' | 'youtubeMusic' | 'radio';

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
    radio: true,
  });
  const [playlists, setPlaylists] = useState<IPlaylist[]>([]);
  const [currentTrack, setCurrentTrack] = useState<ITrack | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(50);
  const [progress, setProgress] = useState(0);
  const [suggestedRadios, setSuggestedRadios] = useState<IRadio[]>([]);
  const [filteredRadios, setFilteredRadios] = useState<IRadio[]>([]);
  const [isPlayingRadio, setIsPlayingRadio] = useState(false);
  const [availableTags, setAvailableTags] = useState<string[]>([]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [isTagDropdownOpen, setIsTagDropdownOpen] = useState(false);

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
      icon: <SiYoutubemusic className='w-6 h-6 text-red-700' />,
    },
    radio: {
      name: 'Rádio',
      authUrl: ``,
      icon: <BsMusicPlayerFill className='w-6 h-6 text-blue-500' />,
    },
  };

  useEffect(() => {
    checkAuthentication();
    fetchSuggestedRadios();
  }, [selectedService]);

  useEffect(() => {
    filterRadiosByTags();
  }, [selectedTags, suggestedRadios]);

  function parseDuration(time: string): number {
    const parts = time.split(':').map(Number).reverse();
    let seconds = 0;
    if (parts[0]) seconds += parts[0];
    if (parts[1]) seconds += parts[1] * 60;
    if (parts[2]) seconds += parts[2] * 3600;
    return seconds;
  }

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

  const fetchSuggestedRadios = async () => {
    try {
      const response = await fetch('/api/music/radio');
      const data = await response.json();
      setSuggestedRadios(data.radios);

      const allTags = data.radios.reduce((tags: string[], radio: IRadio) => {
        return [...tags, ...radio.tags];
      }, []);
      const uniqueTags = Array.from(new Set(allTags)).sort();
      setAvailableTags(uniqueTags as string[]);
    } catch (error) {
      console.error('Erro ao buscar rádios sugeridas:', error);
    }
  };

  const filterRadiosByTags = () => {
    if (selectedTags.length === 0) {
      setFilteredRadios(suggestedRadios);
    } else {
      const filtered = suggestedRadios.filter((radio) =>
        selectedTags.some((tag) => radio.tags.includes(tag))
      );
      setFilteredRadios(filtered);
    }
  };

  const handleTagToggle = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const removeTag = (tagToRemove: string) => {
    setSelectedTags((prev) => prev.filter((tag) => tag !== tagToRemove));
  };

  const clearAllTags = () => {
    setSelectedTags([]);
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

  const handleRadioSelect = (radio: IRadio) => {
    let videoId = radio.uri;

    if (radio.uri.includes('youtube.com/watch?v=')) {
      videoId = radio.uri.split('v=')[1];
      const ampersandPosition = videoId.indexOf('&');
      if (ampersandPosition !== -1) {
        videoId = videoId.substring(0, ampersandPosition);
      }
    }

    const radioTrack: ITrack = {
      id: videoId,
      title: radio.name,
      artist: radio.live ? 'Transmissão ao vivo' : '',
      url: radio.uri,
      duration: radio.time ? parseDuration(radio.time) : 0,
      source: 'youtube',
    };

    setCurrentTrack(radioTrack);
    setIsPlaying(true);
    setIsPlayingRadio(true);
    setSelectedService('radio');
  };

  const renderTagFilter = () => (
    <div className='mb-4'>
      <div className='relative'>
        <button
          onClick={() => setIsTagDropdownOpen(!isTagDropdownOpen)}
          className='w-full flex items-center justify-between p-2 bg-gray-700 border border-gray-600 rounded-lg text-white hover:bg-gray-600 transition-colors'
        >
          <span className='text-sm'>
            {selectedTags.length > 0
              ? `${selectedTags.length} tag(s) selecionada(s)`
              : 'Filtrar por tags'}
          </span>
          <ChevronDown
            className={`w-4 h-4 transition-transform ${
              isTagDropdownOpen ? 'rotate-180' : ''
            }`}
          />
        </button>

        {isTagDropdownOpen && (
          <div className='absolute top-full left-0 right-0 z-10 mt-1 bg-gray-700 border border-gray-600 rounded-lg shadow-lg max-h-48 overflow-y-auto'>
            <div className='p-2 border-b border-gray-600'>
              <button
                onClick={clearAllTags}
                className='text-xs text-blue-400 hover:text-blue-300'
                disabled={selectedTags.length === 0}
              >
                Limpar todos
              </button>
            </div>
            {availableTags.map((tag) => (
              <label
                key={tag}
                className='flex items-center p-2 hover:bg-gray-600 cursor-pointer'
              >
                <input
                  type='checkbox'
                  checked={selectedTags.includes(tag)}
                  onChange={() => handleTagToggle(tag)}
                  className='mr-2 w-4 h-4 text-blue-600 bg-gray-700 border-gray-600 rounded focus:ring-blue-500'
                />
                <span className='text-sm text-white'>#{tag}</span>
              </label>
            ))}
          </div>
        )}
      </div>

      {/* Tags selecionadas */}
      {selectedTags.length > 0 && (
        <div className='flex flex-wrap gap-2 mt-2'>
          {selectedTags.map((tag) => (
            <span
              key={tag}
              className='inline-flex items-center px-2 py-1 bg-blue-600 text-white text-xs rounded-full'
            >
              #{tag}
              <button
                type='button'
                aria-label='Remover tag'
                onClick={() => removeTag(tag)}
                className='ml-1 hover:text-gray-300'
              >
                <X className='w-3 h-3' />
              </button>
            </span>
          ))}
        </div>
      )}
    </div>
  );

  const renderPlayer = () => {
    if (!currentTrack) return null;

    if (isPlayingRadio || selectedService === 'radio') {
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
    }

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
            token={currentTrack.url!}
            uris={[currentTrack.url!]}
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

  const radiosToDisplay =
    filteredRadios.length > 0 ? filteredRadios : suggestedRadios;

  return (
    <div className='flex flex-col h-full bg-gray-800 text-white p-4 rounded-lg'>
      {(selectedService && isAuthenticated[selectedService]) ||
      isPlayingRadio ? (
        <div className='flex flex-1 gap-4'>
          <div className='w-1/3 overflow-y-auto'>
            {!isPlayingRadio && selectedService !== 'radio' ? (
              <>
                <h3 className='text-lg font-semibold mb-4'>Suas Playlists</h3>
                <div className='space-y-2'>
                  {playlists.map((playlist) => (
                    <button
                      aria-label='Selecionar playlist'
                      type='button'
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
              </>
            ) : (
              <>
                <h3 className='text-lg font-semibold mb-2'>Rádios Sugeridas</h3>
                {renderTagFilter()}
                <div className='space-y-2 max-h-[calc(100vh-350px)] overflow-y-auto'>
                  {radiosToDisplay.length > 0 ? (
                    radiosToDisplay.map((radio) => (
                      <button
                        aria-label='Selecionar rádio'
                        type='button'
                        key={radio._id}
                        onClick={() => handleRadioSelect(radio)}
                        className={`w-full flex items-center justify-between p-2 hover:bg-gray-700 rounded transition-colors ${
                          currentTrack && radio._id === currentTrack.id
                            ? 'bg-blue-800'
                            : ''
                        }`}
                      >
                        <div className='space-y-2'>
                          <div className='flex items-center'>
                            <BsMusicPlayerFill className='mr-2 text-blue-400' />
                            <span className='font-medium'>{radio.name}</span>
                          </div>
                          <div className='flex items-center'>
                            {radio.live && (
                              <span className='text-xs bg-red-600 text-white px-2 py-0.5 rounded mr-2'>
                                AO VIVO
                              </span>
                            )}
                          </div>
                          <div className='flex items-center'>
                            <span className='text-xs text-gray-400'>
                              {radio.time}
                            </span>
                          </div>
                          <div className='flex items-center'>
                            <span className='text-xs text-gray-400'>
                              {radio.tags.map((tag) => `#${tag} `)}
                            </span>
                          </div>
                        </div>
                      </button>
                    ))
                  ) : (
                    <p className='text-gray-400 text-sm'>
                      {selectedTags.length > 0
                        ? 'Nenhuma rádio encontrada com as tags selecionadas'
                        : 'Nenhuma rádio disponível'}
                    </p>
                  )}
                </div>
              </>
            )}
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

              <div className='mt-4 flex items-center space-x-4'>
                {selectedService !== 'youtube' && !isPlayingRadio && (
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
        <div className='mb-6 text-center'>
          {/* <p className='text-gray-400'>
            {selectedService
              ? 'Faça login para acessar suas playlists'
              : 'Selecione um serviço de streaming ou uma rádio abaixo'}
          </p> */}
        </div>
      )}

      {!isPlayingRadio &&
        !(selectedService && isAuthenticated[selectedService]) && (
          <div className='mt-4 p-4 bg-gray-900 rounded-lg'>
            <h3 className='text-lg font-semibold mb-2'>Rádios Sugeridas</h3>
            {renderTagFilter()}
            <div className='space-y-2 max-h-40 overflow-y-auto'>
              {radiosToDisplay.length > 0 ? (
                radiosToDisplay.map((radio) => (
                  <button
                    aria-label='Selecionar rádio'
                    type='button'
                    key={radio._id}
                    onClick={() => handleRadioSelect(radio)}
                    className='w-full flex items-center justify-between p-2 hover:bg-gray-700 rounded transition-colors'
                  >
                    <div className='space-y-2'>
                      <div className='flex items-center'>
                        <BsMusicPlayerFill className='mr-2 text-blue-400' />
                        <span className='font-medium text-left'>
                          {radio.name}
                        </span>
                      </div>
                      <div className='flex items-center'>
                        {radio.live && (
                          <span className='text-xs bg-red-600 text-white px-2 py-0.5 rounded mr-2'>
                            AO VIVO
                          </span>
                        )}
                      </div>
                      <div className='flex items-center'>
                        <span className='text-xs text-gray-400'>
                          {radio.time}
                        </span>
                      </div>
                      <div className='flex items-center'>
                        <span className='text-xs text-gray-400'>
                          {radio.tags.map((tag) => `#${tag} `)}
                        </span>
                      </div>
                    </div>
                  </button>
                ))
              ) : (
                <p className='text-gray-400 text-sm'>
                  {selectedTags.length > 0
                    ? 'Nenhuma rádio encontrada com as tags selecionadas'
                    : 'Nenhuma rádio disponível'}
                </p>
              )}
            </div>
          </div>
        )}
    </div>
  );
}
