
let video: HTMLVideoElement | undefined = undefined;

export const useVideo = (width: number, height: number) => {
    if (video === undefined) {
        throw new Promise<void>((resolve) => {
            navigator.mediaDevices
              .getUserMedia({
                video: {
                    width: width,
                    height: height,
                },
                audio: false,
                })
                .then((stream) => {
                    const newVideo = document.createElement("video") as HTMLVideoElement;
                    newVideo.width = width;
                    newVideo.height = height;
                    newVideo.srcObject = stream;
                    newVideo.play();
                    newVideo.addEventListener("loadeddata", () => {
                    video = newVideo;
                    resolve();
                });
            });
        })
    }
    return video;
}