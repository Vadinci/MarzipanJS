import { Marzipan } from '#Marzipan';

import PictureLoader from './io/loaders/picture';

let init = function (settings) {
    settings = settings || {};

    Marzipan.assets.addLoader(new PictureLoader());
};

let Graphics = {
    init
};

export { Graphics as Graphics };