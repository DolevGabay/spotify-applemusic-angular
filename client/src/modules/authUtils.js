import { store } from "../redux/store/Store";
import { login } from "../redux/actions/authActions";
import axios from "axios";

export function startAuth(streamer, redirect = "playlists") {
  window.location.href = `${process.env.REACT_APP_BACKEND_API}/auth?streamer=${streamer}&redirect=${redirect}`;
}

export async function isAuthed(streamer) {
  try {
    const response = await axios.get(
      `${process.env.REACT_APP_BACKEND_API}/${streamer}/token`,
      {
        withCredentials: true,
      }
    );

    const { token } = response.data;
    store.dispatch(login(streamer, token));
  } catch {
    return false;
  }

  return true;
}
