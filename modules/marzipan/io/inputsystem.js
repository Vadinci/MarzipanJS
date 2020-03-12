//TODO better name?

//TODO shared with other thing, make it generic
const ENSURE = val => {
    if (val === void (0)) throw "value is required!";
    return val;
};

let InputSystem = function (settings) {
    ENSURE(settings);

    let system = {
      //TODO
    };
    return system;
};

export default InputSystem;