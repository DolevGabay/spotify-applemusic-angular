import axios from 'axios';

class SpotifyProvider {

    constructor(authData) {
        this.accessToken = authData.token;
        this.header = { Authorization: 'Bearer ' + this.accessToken };
        this.provider = 'Spotify';
    }

    async loadName() {
        const response = await axios.get('https://api.spotify.com/v1/me', {
            headers: this.header
        });

        const data = response.data;
        this.name = data.display_name;

        return this.name;
    };

    async loadPlaylists() {
        const response = await axios.get('https://api.spotify.com/v1/me/playlists', {
            headers: this.header
        });
        const data = response.data;
        const rawPlaylists = data.items;

        const playlists = rawPlaylists.map((playlist) => {
            const imageUrl = playlist.images.length > 0 ? playlist.images[0].url : 'https://community.spotify.com/t5/image/serverpage/image-id/25294i2836BD1C1A31BDF2?v=v2'
            return {
                name: playlist.name,
                id: playlist.id,
                tracks: playlist.tracks.total,
                image: imageUrl
            };
        });

        //console.log(playlists);
        return playlists;
    }

    async getSongsFromPlaylist(playlist) {

        let playlistId = playlist.id;

        const playlistToReturn = {
            playlistName: playlist.name,
            songs: [],
        }

        const response = await fetch(`https://api.spotify.com/v1/playlists/${playlistId}/tracks`, {
            headers: this.header
        });

            if (response.ok) {
                const data = await response.json();
                for(let j = 0; j < data.items.length ; j++)
                {
                    const song = {
                        trackName: data.items[j].track.name,
                        artist: data.items[j].track.artists[0].name,
                    }
                    playlistToReturn.songs.push(song)
                }
                
                return playlistToReturn; 
            } else {
                console.error('Failed to retrieve playlist tracks1111:', response.status, response.statusText);
                return [];
            } 
    }

    async loadProfile() {
        
    }

    async loadData() {
        await this.loadName();
        await this.loadPlaylists();
    }
}

export default SpotifyProvider;