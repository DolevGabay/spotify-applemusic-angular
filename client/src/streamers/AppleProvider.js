import axios from 'axios';

class AppleProvider {
    constructor(accessToken, musicAppBelong) {
        this.accessToken = accessToken;
        this.instance = window.MusicKit;
        this.header = { Authorization: 'Bearer ' + accessToken };
        this.name = '';
        this.playlists = [];
        this.PlaylistSongsToTransfer = [];
        this.musicApp = musicAppBelong;

    }

    async loadName() {
        const response = await axios.get('https://api.music.apple.com/v1/me', { headers: { ...this.header }});

        console.log(response);

    };

    async loadToken() {
        const response = await fetch('http://localhost:8888/apple/apple_access_token');
        const tokenData = await response.json();
        this.accessToken = tokenData.token; 
    }

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

    async getPlaylistSongs (selectedPlaylists){
        for(let i = 0; i < selectedPlaylists.length ; i++)
        {
            let playlistId = this.playlists[selectedPlaylists[i]].id
            const playlist = {
                name:this.playlists[selectedPlaylists[i]].name ,
                songs: [
                ]
            };
            const apiUrl = 'https://api.music.apple.com/v1/me/library/playlists/{playlist_id}/tracks';
            try {
                const response = await axios.get(apiUrl.replace('{playlist_id}', playlistId), {
                    headers: this.header
                });
        
                if (response.status === 200) {
                    const songsRes = response.data.data;
        
                    //console.log(songs);
                    for(let j = 0; j <songsRes.length ; j++)
                        {
                            const song = {
                                trackName: songsRes[j].attributes.name,
                                artist: songsRes[j].attributes.artistName,
                            }
                            playlist.songs.push(song)
                        }
                        this.PlaylistSongsToTransfer.push(playlist)
                } else {
                    console.error('Failed to retrieve playlist songs:', response.status, response.statusText);
                }
            } catch (error) {
                console.error('Error while getting playlist songs:', error);
            }
        }
    };

    async insertPlaylist(playlistToInsert) {
        if (!this.accessToken) {
            throw new Error("Access token is missing. Make sure to authenticate first.");
        }
    
        const playlistName = playlistToInsert[0].name;
        const playlistData = {
            name: playlistName,
        };
    
        try {
            const response = await fetch('https://api.music.apple.com/v1/me/library/playlists', {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${this.accessToken}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(playlistData),
            });
    
            if (response.status === 201) {
                const data = await response.json();
                const newPlaylistId = data.data[0].id;
                console.log('New playlist created with ID:', newPlaylistId);
            } else {
                console.error('Error creating playlist:', response.status, response.statusText);
            }
        } catch (error) {
            console.error('Error creating playlist:', error);
        }
    }
    


    async loadData() {
        if (this.accessToken == null || this.accessToken == ""){
            await this.loadToken();
        }
        await this.configure(this.accessToken);
        await this.LogIn();
        //console.log(this.getMusicInstance().musicUserToken);
        this.header = {
            Authorization: `Bearer ${this.accessToken}`,
            'Music-User-Token': this.getMusicInstance().musicUserToken,
            'Content-Type': 'application/json'
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