'use client';

import { useState, useRef, useEffect } from 'react';
import { Play, Pause, SkipBack, SkipForward, Volume2, VolumeX, Search, Music, ExternalLink, Heart, Shuffle, Repeat } from 'lucide-react';

interface Track {
  id: string;
  title: string;
  artist: string;
  duration: string;
  thumbnail?: string;
  url?: string;
  platform: 'youtube' | 'spotify' | 'local';
}

interface Playlist {
  id: string;
  name: string;
  tracks: Track[];
}

export default function MusicWidget() {
  const [currentTrack, setCurrentTrack] = useState<Track | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(50);
  const [isMuted, setIsMuted] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Track[]>([]);
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [selectedPlaylist, setSelectedPlaylist] = useState<string | null>(null);
  const [isShuffled, setIsShuffled] = useState(false);
  const [repeatMode, setRepeatMode] = useState<'none' | 'one' | 'all'>('none');
  const [activeTab, setActiveTab] = useState<'search' | 'playlists' | 'favorites'>('search');

  const audioRef = useRef<HTMLAudioElement>(null);

  // Dados de exemplo
  const sampleTracks: Track[] = [
    {
      id: '1',
      title: 'Bohemian Rhapsody',
      artist: 'Queen',
      duration: '5:55',
      platform: 'youtube',
      thumbnail: 'https://via.placeholder.com/60x60?text=Q'
    },
    {
      id: '2',
      title: 'Imagine',
      artist: 'John Lennon',
      duration: '3:07',
      platform: 'spotify',
      thumbnail: 'https://via.placeholder.com/60x60?text=JL'
    },
    {
      id: '3',
      title: 'Hotel California',
      artist: 'Eagles',
      duration: '6:30',
      platform: 'youtube',
      thumbnail: 'https://via.placeholder.com/60x60?text=E'
    },
    {
      id: '4',
      title: 'Stairway to Heaven',
      artist: 'Led Zeppelin',
      duration: '8:02',
      platform: 'spotify',
      thumbnail: 'https://via.placeholder.com/60x60?text=LZ'
    }
  ];

  useEffect(() => {
    // Carregar playlists do localStorage
    const savedPlaylists = localStorage.getItem('music-playlists');
    if (savedPlaylists) {
      try {
        setPlaylists(JSON.parse(savedPlaylists));
      } catch (error) {
        console.error('Erro ao carregar playlists:', error);
      }
    } else {
      // Criar playlist de exemplo
      const defaultPlaylist: Playlist = {
        id: 'default',
        name: 'Minha Playlist',
        tracks: sampleTracks
      };
      setPlaylists([defaultPlaylist]);
    }
  }, []);

  useEffect(() => {
    // Salvar playlists no localStorage
    localStorage.setItem('music-playlists', JSON.stringify(playlists));
  }, [playlists]);

  const handleSearch = () => {
    if (!searchQuery.trim()) return;
    
    // Simular busca (em um app real, isso faria chamadas para APIs)
    const filtered = sampleTracks.filter(track =>
      track.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      track.artist.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setSearchResults(filtered);
  };

  const playTrack = (track: Track) => {
    setCurrentTrack(track);
    setIsPlaying(true);
    // Em um app real, aqui você carregaria o áudio da URL
  };

  const togglePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const nextTrack = () => {
    if (!currentTrack) return;
    
    const currentPlaylist = playlists.find(p => p.id === selectedPlaylist);
    if (!currentPlaylist) return;
    
    const currentIndex = currentPlaylist.tracks.findIndex(t => t.id === currentTrack.id);
    const nextIndex = (currentIndex + 1) % currentPlaylist.tracks.length;
    playTrack(currentPlaylist.tracks[nextIndex]);
  };

  const previousTrack = () => {
    if (!currentTrack) return;
    
    const currentPlaylist = playlists.find(p => p.id === selectedPlaylist);
    if (!currentPlaylist) return;
    
    const currentIndex = currentPlaylist.tracks.findIndex(t => t.id === currentTrack.id);
    const prevIndex = currentIndex === 0 ? currentPlaylist.tracks.length - 1 : currentIndex - 1;
    playTrack(currentPlaylist.tracks[prevIndex]);
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getPlatformIcon = (platform: string) => {
    switch (platform) {
      case 'youtube':
        return <div className="w-4 h-4 bg-red-600 rounded-sm flex items-center justify-center text-white text-xs">Y</div>;
      case 'spotify':
        return <div className="w-4 h-4 bg-green-600 rounded-full flex items-center justify-center text-white text-xs">S</div>;
      default:
        return <Music className="w-4 h-4 text-gray-400" />;
    }
  };

  const openInPlatform = (track: Track) => {
    // Em um app real, isso abriria o link da plataforma
    const urls = {
      youtube: `https://www.youtube.com/results?search_query=${encodeURIComponent(track.title + ' ' + track.artist)}`,
      spotify: `https://open.spotify.com/search/${encodeURIComponent(track.title + ' ' + track.artist)}`
    };
    
    if (track.platform in urls) {
      window.open(urls[track.platform as keyof typeof urls], '_blank');
    }
  };

  const renderTrackList = (tracks: Track[]) => (
    <div className="space-y-2">
      {tracks.map((track) => (
        <div
          key={track.id}
          className={`p-3 rounded-lg border border-gray-700 hover:bg-gray-800/50 transition-colors cursor-pointer ${
            currentTrack?.id === track.id ? 'bg-blue-600/20 border-blue-500' : 'bg-gray-800/30'
          }`}
          onClick={() => playTrack(track)}
        >
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gray-700 rounded-lg flex items-center justify-center overflow-hidden">
              {track.thumbnail ? (
                <img src={track.thumbnail} alt={track.title} className="w-full h-full object-cover" />
              ) : (
                <Music className="w-6 h-6 text-gray-400" />
              )}
            </div>
            
            <div className="flex-1 min-w-0">
              <h4 className="font-medium text-white truncate">{track.title}</h4>
              <p className="text-sm text-gray-400 truncate">{track.artist}</p>
            </div>
            
            <div className="flex items-center gap-2">
              {getPlatformIcon(track.platform)}
              <span className="text-xs text-gray-500">{track.duration}</span>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  openInPlatform(track);
                }}
                className="text-gray-400 hover:text-blue-400 transition-colors"
              >
                <ExternalLink className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <div className="p-4 h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center gap-2 mb-4">
        <Music className="w-5 h-5 text-purple-400" />
        <h2 className="text-lg font-semibold text-white">Player de Música</h2>
      </div>

      {/* Current Track Display */}
      {currentTrack && (
        <div className="mb-4 p-4 bg-gray-800 rounded-lg border border-gray-700">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-16 h-16 bg-gray-700 rounded-lg flex items-center justify-center overflow-hidden">
              {currentTrack.thumbnail ? (
                <img src={currentTrack.thumbnail} alt={currentTrack.title} className="w-full h-full object-cover" />
              ) : (
                <Music className="w-8 h-8 text-gray-400" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-white truncate">{currentTrack.title}</h3>
              <p className="text-gray-400 truncate">{currentTrack.artist}</p>
              <div className="flex items-center gap-2 mt-1">
                {getPlatformIcon(currentTrack.platform)}
                <span className="text-xs text-gray-500">{currentTrack.duration}</span>
              </div>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mb-3">
            <div className="flex items-center gap-2 text-xs text-gray-400 mb-1">
              <span>{formatTime(currentTime)}</span>
              <div className="flex-1 h-1 bg-gray-700 rounded-full">
                <div 
                  className="h-full bg-blue-500 rounded-full transition-all"
                  style={{ width: duration > 0 ? `${(currentTime / duration) * 100}%` : '0%' }}
                />
              </div>
              <span>{currentTrack.duration}</span>
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsShuffled(!isShuffled)}
                className={`p-2 rounded-lg transition-colors ${isShuffled ? 'bg-blue-600 text-white' : 'text-gray-400 hover:text-white'}`}
              >
                <Shuffle className="w-4 h-4" />
              </button>
              <button
                onClick={previousTrack}
                className="p-2 text-gray-400 hover:text-white transition-colors"
              >
                <SkipBack className="w-5 h-5" />
              </button>
              <button
                onClick={togglePlayPause}
                className="p-3 bg-blue-600 hover:bg-blue-700 text-white rounded-full transition-colors"
              >
                {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
              </button>
              <button
                onClick={nextTrack}
                className="p-2 text-gray-400 hover:text-white transition-colors"
              >
                <SkipForward className="w-5 h-5" />
              </button>
              <button
                onClick={() => setRepeatMode(repeatMode === 'none' ? 'all' : repeatMode === 'all' ? 'one' : 'none')}
                className={`p-2 rounded-lg transition-colors ${repeatMode !== 'none' ? 'bg-blue-600 text-white' : 'text-gray-400 hover:text-white'}`}
              >
                <Repeat className="w-4 h-4" />
              </button>
            </div>

            <div className="flex items-center gap-2">
              <button onClick={toggleMute} className="text-gray-400 hover:text-white transition-colors">
                {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
              </button>
              <input
                type="range"
                min="0"
                max="100"
                value={isMuted ? 0 : volume}
                onChange={(e) => setVolume(parseInt(e.target.value))}
                className="w-20 h-1 bg-gray-700 rounded-lg appearance-none slider"
              />
            </div>
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="flex mb-4 border-b border-gray-700">
        {[
          { id: 'search', label: 'Buscar', icon: Search },
          { id: 'playlists', label: 'Playlists', icon: Music },
          { id: 'favorites', label: 'Favoritos', icon: Heart }
        ].map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setActiveTab(id as any)}
            className={`flex items-center gap-2 px-4 py-2 border-b-2 transition-colors ${
              activeTab === id
                ? 'border-blue-500 text-blue-400'
                : 'border-transparent text-gray-400 hover:text-white'
            }`}
          >
            <Icon className="w-4 h-4" />
            {label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        {activeTab === 'search' && (
          <div className="space-y-4">
            <div className="flex gap-2">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Buscar músicas..."
                className="flex-1 px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              />
              <button
                onClick={handleSearch}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
              >
                <Search className="w-4 h-4" />
              </button>
            </div>

            {searchResults.length > 0 ? (
              renderTrackList(searchResults)
            ) : searchQuery ? (
              <div className="text-center py-8 text-gray-400">
                <Search className="w-12 h-12 mx-auto mb-2 opacity-50" />
                <p>Nenhum resultado encontrado</p>
              </div>
            ) : (
              <div className="text-center py-8 text-gray-400">
                <Music className="w-12 h-12 mx-auto mb-2 opacity-50" />
                <p>Digite algo para buscar músicas</p>
                <p className="text-sm mt-1">YouTube, Spotify e mais</p>
              </div>
            )}
          </div>
        )}

        {activeTab === 'playlists' && (
          <div className="space-y-4">
            {playlists.length > 0 ? (
              playlists.map((playlist) => (
                <div key={playlist.id} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-white">{playlist.name}</h3>
                    <span className="text-sm text-gray-400">{playlist.tracks.length} músicas</span>
                  </div>
                  {renderTrackList(playlist.tracks)}
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-gray-400">
                <Music className="w-12 h-12 mx-auto mb-2 opacity-50" />
                <p>Nenhuma playlist ainda</p>
              </div>
            )}
          </div>
        )}

        {activeTab === 'favorites' && (
          <div className="text-center py-8 text-gray-400">
            <Heart className="w-12 h-12 mx-auto mb-2 opacity-50" />
            <p>Nenhuma música favorita ainda</p>
            <p className="text-sm mt-1">Curta suas músicas favoritas</p>
          </div>
        )}
      </div>
    </div>
  );
}

