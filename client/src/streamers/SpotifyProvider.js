import axios from 'axios';

class SpotifyProvider {
    constructor(accessToken, musicAppBelong) {
        this.accessToken = accessToken;
        this.header = { Authorization: 'Bearer ' + accessToken };
        this.name = '';
        this.playlists = [];
        this.PlaylistSongsToTransfer = [];
        this.musicApp = musicAppBelong;
    }

    async loadName() {
        const response = await axios.get('https://api.spotify.com/v1/me', {
            headers: this.header
        });

        const data = response.data;
        this.name = data.display_name;

        return this.name;
    };

    async loadToken() {
        const response = await fetch('http://localhost:8888/apple/apple_access_token');
        const tokenData = await response.json();
        this.accessToken = tokenData.token; 
    }

    async loadPlaylists() {
        const response = await axios.get('https://api.spotify.com/v1/me/playlists', {
            headers: this.header
        });
        const data = response.data;
        const rawPlaylists = data.items;

        this.playlists = rawPlaylists.map((playlist) => {
            const imageUrl = playlist.images.length > 0 ? playlist.images[0].url : 'https://community.spotify.com/t5/image/serverpage/image-id/25294i2836BD1C1A31BDF2?v=v2'
            return {
                name: playlist.name,
                id: playlist.id,
                tracks: playlist.tracks.total,
                image: imageUrl
            };
        });

        return this.playlists;
    }

    async getPlaylistSongs(selectedPlaylists) {
        for(let i = 0; i <selectedPlaylists.length ; i++)
        {
            let playlistId = this.playlists[selectedPlaylists[i]].id
            const playlist = {
                name:this.playlists[selectedPlaylists[i]].name ,
                songs: [
                ]
            };

            const response = await fetch(`https://api.spotify.com/v1/playlists/${playlistId}/tracks`, {
                    headers: {
                        'Authorization': 'Bearer ' + this.accessToken
                    }
                });

                if (response.ok) {
                    const data = await response.json();
                    for(let j = 0; j <data.items.length ; j++)
                    {
                        const song = {
                            trackName: data.items[j].track.name,
                            artist: data.items[j].track.artists[0].name,
                        }
                        playlist.songs.push(song)
                    }
                    
                    this.PlaylistSongsToTransfer.push(playlist) 
                } else {
                    console.error('Failed to retrieve playlist tracks1111:', response.status, response.statusText);
                    return [];
                } 
        }
    };

    async loadData() {
        await this.loadName();
        await this.loadPlaylists();
    }
}

export default SpotifyProvider;