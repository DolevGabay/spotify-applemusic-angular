import axios from 'axios';

class SpotifyProvider {
    constructor(accessToken) {
        this.accessToken = accessToken;
        this.header = { Authorization: 'Bearer ' + accessToken };
        this.name = '';
        this.playlists = [];
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

    async loadData() {
        await this.loadName();
        await this.loadPlaylists();
    }
}

export default SpotifyProvider;