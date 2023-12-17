import { store } from "../redux/store/Store";
import { login } from "../redux/actions/authActions";
import axios from "axios";

export function startAuth(streamer, redirect = "playlists") {
  console.log(process.env.REACT_APP_BACKEND_API);
  window.location.href = `${process.env.REACT_APP_BACKEND_API}/auth?streamer=${streamer}&redirect=${redirect}`;
}

export async function isAuthed(streamer) {
  console.log("entering isAuthed");
  try {
    console.log("entering try");
    const response = await axios.get(`${process.env.REACT_APP_BACKEND_API}/${streamer}/token`, {
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
