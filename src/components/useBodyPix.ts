import * as bodyPix from "@tensorflow-models/body-pix";

let net: bodyPix.BodyPix | undefined = undefined;

export const useBodyPix = () => {
    if (net === undefined) {
        throw new Promise<void>((resolve) => {
            bodyPix.load().then((result) => {
                net = result;
                resolve();
            });
        })
    }
    return net;
}