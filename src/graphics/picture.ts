/**
 * A Picture is a simple representation of 2 pieces of data, an HTML5 image (or any renderable HTML5 element really) and
 * a bounding rectangle for the part of that image that we care about. This makes it convenient to pack multiple pictures
 * on one image
 * 
 * Based on Bento's packedImage module:
 * https://github.com/LuckyKat/Bento/blob/master/js/packedimage.js
 */

import { Rectangle } from "../math/rectangle";

export interface IPicture {
    x: number;
    y: number;
    width: number;
    height: number;
    image: HTMLImageElement;
};

export function buildPicture(image: HTMLImageElement, area: Rectangle | null): IPicture {
    if (!area) {
        //TODO make a rectangle module
        area = new Rectangle(0, 0, image.width, image.height);
    }

    return {
        x: area.x,
        y: area.y,
        width: area.width,
        height: area.height,
        image: image
    };
};