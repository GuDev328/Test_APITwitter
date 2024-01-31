import logo from "./logo.svg";
import "./App.css";
import "@vidstack/react/player/styles/default/theme.css";
import "@vidstack/react/player/styles/default/layouts/video.css";
import { MediaPlayer, MediaProvider } from "@vidstack/react";
import {
    defaultLayoutIcons,
    DefaultVideoLayout,
} from "@vidstack/react/player/layouts/default";

function App() {
    return (
        <div className="App">
            <MediaPlayer
                title="Sprite Fight"
                src="http://localhost:3030/medias/video-hls/VBOmdBWKJgU_hFhhbuisl/master.m3u8"
            >
                <MediaProvider />
                <DefaultVideoLayout
                    thumbnails="https://image.mux.com/VZtzUzGRv02OhRnZCxcNg49OilvolTqdnFLEqBsTwaxU/storyboard.vtt"
                    icons={defaultLayoutIcons}
                />
            </MediaPlayer>
        </div>
    );
}

export default App;
