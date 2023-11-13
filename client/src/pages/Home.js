import React from 'react';
import PostMalone from '../assets/postmalone.jpeg';
import TheWeeknd from '../assets/theweeknd.jpeg';
import { startAuth } from '../modules/authUtils';
import {useDispatch} from 'react-redux';
import { setSource } from '../redux/actions/transferActions';

const Home = () => {
    const dispatch = useDispatch();

    const startTransfer = async (streamer) => {
        dispatch(setSource(streamer));
        startAuth(streamer);
    }
    return(
        <div>
           <header className="bg-dark">
                <div className="container pt-4 pt-xl-5">
                    <div className="row pt-5">
                        <div className="col-md-8 col-xl-6 text-center text-md-start mx-auto">
                            <div className="text-center">
                                <h1 className="fw-bold">Migrate your music libraries Easily.</h1>
                            </div>
                        </div>
                        <div className="col-12 col-lg-10 mx-auto">
                            <div className="position-relative" style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'flex-end' }}>
                                <div style={{ position: 'relative', flex: '0 0 45%', transform: 'translate3d(-15%, 35%, 0)', }}>
                                        <img className="img-fluid" data-bss-parallax="" data-bss-parallax-speed="0.8" src={ TheWeeknd } style={{ marginTop: '-69px'}}/>
                                </div>
                                <div style={{ position: 'relative', flex: '0 0 45%', transform: 'translate3d(-5%, 20%, 0)' }}>
                                    <img className="img-fluid" data-bss-parallax="" data-bss-parallax-speed="0.4" src={ PostMalone }/>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            <section>
                <div className="container py-5" style={{ marginTop: 89 }}>
                    <div className="mx-auto" style={{ maxWidth: 900 }}>
                        <div className="row row-cols-1 row-cols-md-2 d-flex justify-content-center">
                            <div className="col mb-4">
                                <div className="card bg-primary-light">
                                    <div className="card-body text-center px-4 py-5 px-md-5">
                                    <p className="fw-bold text-primary card-text mb-2">Spotify</p>
                                    <h5 className="fw-bold card-title mb-3">
                                        Login to your Spotify account to begin
                                    </h5>
                                    <button className="btn btn-primary btn-sm" type="button" onClick={() => startTransfer('Spotify') }>
                                        Connect Spotify
                                    </button>
                                    </div>
                                </div>
                            </div>
                            <div className="col mb-4">
                                <div className="card bg-secondary-light">
                                    <div className="card-body text-center px-4 py-5 px-md-5">
                                    <p className="fw-bold text-secondary card-text mb-2">
                                        Apple Music
                                    </p>
                                    <h5 className="fw-bold card-title mb-3">
                                        Login to your Apple music account to begin
                                    </h5>
                                    <button className="btn btn-secondary btn-sm" type="button" onClick={() => startTransfer('Apple') }>
                                        Connect Apple Music
                                    </button>
                                    </div>
                                </div>
                            </div>
                            <div className="col mb-4">
                                <div className="card bg-info-light" />
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Home;