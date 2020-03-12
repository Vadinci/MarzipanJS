/**
 * A Picture is a simple representation of 2 pieces of data, an HTML5 image (or any renderable HTML5 element really) and
 * a bounding rectangle for the part of that image that we care about. This makes it convenient to pack multiple pictures
 * on one image
 * 
 * Based on Bento's packedImage module:
 * https://github.com/LuckyKat/Bento/blob/master/js/packedimage.js
 */

 export default function(image, area){
    if (!area){
        //TODO make a rectangle module
        area = {
            x : 0, y : 0,
            width : image.width,
            height : image.height
        };
    }

    return {
        x : area.x,
        y : area.y,
        width : area.width,
        height : area.height,
        image : image
    };
 };