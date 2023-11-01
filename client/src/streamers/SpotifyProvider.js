import axios from "axios";

class SpotifyProvider {
  static PROFILE_API = "https://api.spotify.com/v1/me";
  static PLAYLIST_API = "https://api.spotify.com/v1/me/playlists";
  static TRACKS_API =
    "https://api.spotify.com/v1/playlists/{playlist_id}/tracks";
  static CREATE_PLAYLIST_API =
    "https://api.spotify.com/v1/users/{user_id}/playlists";
  static ADD_TRACKS_API =
    "https://api.spotify.com/v1/playlists/{playlist_id}/tracks";
  static DEFAULT_IMAGE_URL =
    "https://community.spotify.com/t5/image/serverpage/image-id/25294i2836BD1C1A31BDF2?v=v2";

  constructor(authData) {
    this.accessToken = authData.token;
    this.header = { Authorization: "Bearer " + this.accessToken };
    this.provider = "Spotify";
  }

  async loadName() {
    const response = await axios.get(PROFILE_API, { headers: this.header });

    const data = response.data;
    this.name = data.display_name;

    return this.name;
  }

  async loadPlaylists() {
    const response = await axios.get(PLAYLIST_API, { headers: this.header });
    const data = response.data;
    const rawPlaylists = data.items;

    const playlists = rawPlaylists.map((playlist) => {
      const imageUrl =
        playlist.images.length > 0 ? playlist.images[0].url : DEFAULT_IMAGE_URL;

      return {
        name: playlist.name,
        id: playlist.id,
        tracks: playlist.tracks.total,
        image: imageUrl,
      };
    });

    console.log(playlists);
    return playlists;
  }

  async getSongsFromPlaylist(playlist) {
    let playlistId = playlist.id;

    const response = await axios.get( TRACKS_API.replace("{playlist_id}", playlistId), { headers: this.header }
    );

    if (response.status === 200) {
      const data = response.data;
      const songs = data.items.map((item) => {
        return {
          name: item.track.name,
          artist: item.track.artists[0].name,
        };
      });

      return songs;
    } else {
      console.error(
        "Failed to retrieve playlist tracks:",
        response.status,
        response.statusText
      );
      return null;
    }
  }

  async transferPlaylists(playlistsToTransfer) {
    const newPlaylists = await Promise.all(
      playlistsToTransfer.map(async (playlist) => {
        const newPlaylist = await this.createPlaylist(playlist.name);
        await this.addTracksToPlaylist(newPlaylist.id, playlist.songs);
        return newPlaylist;
      })
    );

    return newPlaylists;
  }

  async createPlaylist(name) {
    const response = await axios.post(
      CREATE_PLAYLIST_API.replace("{user_id}", this.userId),
      { name },
      { headers: this.header }
    );

    if (response.status === 201) {
      const data = response.data;
      const newPlaylist = {
        name: data.name,
        id: data.id,
        tracks: data.tracks.total,
        image: data.images[0].url,
      };

      return newPlaylist;
    } else {
      console.error(
        "Failed to create playlist:",
        response.status,
        response.statusText
      );
      return null;
    }
  }

  async loadProfile() {}

  async loadData() {
    await this.loadName();
    await this.loadPlaylists();
  }
}

export default SpotifyProvider;
