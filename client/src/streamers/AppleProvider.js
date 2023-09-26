import axios from 'axios';

class AppleProvider {
    constructor(accessToken) {
        this.accessToken = accessToken;
        this.instance = window.MusicKit;
        this.header = { Authorization: 'Bearer ' + accessToken };
        this.name = '';
        this.playlists = [];
    }

    async loadName() {
        const response = await axios.get('https://api.music.apple.com/v1/me', { headers: { ...this.header }});

        console.log(response);

    };

    async loadPlaylists() {
        const apiEndpoint = 'https://api.music.apple.com/v1/me/library/playlists';

        const response = await axios.get(apiEndpoint, { headers: { ...this.header } });

        const playlistsData = response.data.data

        this.playlists = playlistsData.map((playlist) => {
            const imageUrl = playlist.attributes.artwork ? playlist.attributes.artwork.url : 'https://community.spotify.com/t5/image/serverpage/image-id/25294i2836BD1C1A31BDF2?v=v2'
            return {
                name: playlist.attributes.name,
                id: playlist.id,
                image: imageUrl.replace('{w}', 300).replace('{h}', 300)
            }
        });

    }

    async loadData() {
        await this.configure(this.accessToken);
        await this.LogIn();
        console.log(this.getMusicInstance().musicUserToken);
        this.header = {
            Authorization: `Bearer ${this.accessToken}`,
            'Music-User-Token': this.getMusicInstance().musicUserToken
        };

        await this.loadPlaylists();
    }

    async configure() {
       this.instance.configure({
            developerToken: this.accessToken,
            app: {
                name: 'MDsolutions',
                build: '1978.4.1'
            }
        });
    }

    getMusicInstance() {
        return this.instance.getInstance();
    }

    isLoggedIn() {
        try {
            return this.getMusicInstance().isAuthorized
        }
        catch (error) {
            return false;
        }
    }

    LogIn() {
        return this.getMusicInstance().authorize();
    }
}

export default AppleProvider;