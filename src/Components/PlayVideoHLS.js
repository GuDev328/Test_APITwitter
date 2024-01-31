import { MediaPlayer, MediaProvider } from "@vidstack/react";
import {
    defaultLayoutIcons,
    DefaultVideoLayout,
} from "@vidstack/react/player/layouts/default";

export default function PlayVideoHLS() {
    return (
        <div>
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
