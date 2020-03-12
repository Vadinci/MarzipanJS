/*
TODO:
    Blend modes
    Anti Alias
    Auto-clear?
    Handle Resize
*/

//TODO ENSURE is being used in multiple places. Clean way of centralizing it?
const ENSURE = val => {
    if (val === void (0)) throw "value is required!";
    return val;
};

const TODO = () => console.warn('todo');

let Renderer = function(settings){
    ENSURE(settings);
    let _canvas = ENSURE(settings.canvas);
    let _currentContext = _canvas.getContext('2d');

    let save = () => {
        _currentContext.save();
    };

    let restore = () => {
        _currentContext.restore();
    };

    let clear = TODO;

    let translate = TODO;
    let scale = TODO;
    let rotate = TODO;
    let setTransform = TODO;
    let setAlpha = TODO;

    let drawLine = TODO;
    let drawRect = TODO;
    let drawCircle = TODO;
    let drawPolygon = TODO;

    let drawPicture = TODO;
    let drawImage = TODO;

    return {
        save,
        restore,
        clear,

        translate,
        scale,
        rotate,
        setTransform,
        setAlpha,

        drawLine,
        drawRect,
        drawCircle,
        drawPolygon,

        drawPicture,
        drawImage
    };
};

export default Renderer