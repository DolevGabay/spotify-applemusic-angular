import { store } from "../redux/store/Store";
import { login } from "../redux/actions/authActions";
import axios from "axios";

export function startAuth(streamer, redirect = "playlists") {
  window.location.href = `https://spotify-applemusic.vercel.app/api/auth?streamer=${streamer}&redirect=${redirect}`;
}

export async function isAuthed(streamer) {
  console.log("entering isAuthed");
  try {
    console.log("entering try");
    const response = await axios.get(`https://spotify-applemusic.vercel.app/api/${streamer}/token`, {
      withCredentials: true,
    });
    console.log(response);
    const { token } = response.data;
    store.dispatch(login(streamer, token));
  } catch (error) {
    console.log(error);
    return false;
  }

  return true;
}
