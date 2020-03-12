import Dispatcher from './dispatcher';


let Entity = function (settings) {
    let _components = [];

    let _tags = [];

    //TODO tags

    //all functions
    let _componentCalls = {
        start: [],
        update: [],
        preDraw: [],
        draw: [],
        drawDebug: [],
        postDraw: [],
        die: []
    };

    let start = function (data) {
        for (let ii = 0; ii < _componentCalls.start.length; ii++) {
            let comp = _components[_componentCalls.start[ii]];
            comp.start.call(comp, data);
        }
    };

    let die = function (data) {
        for (let ii = 0; ii < _componentCalls.die.length; ii++) {
            let comp = _components[_componentCalls.die[ii]];
            comp.die.call(comp, data);
        }
    };

    let update = function (data) {
        for (let ii = 0; ii < _componentCalls.update.length; ii++) {
            let comp = _components[_componentCalls.update[ii]];
            comp.update.call(comp, data);
        }
    };

    let draw = function (data) {
        for (let ii = 0; ii < _componentCalls.preDraw.length; ii++) {
            let comp = _components[_componentCalls.preDraw[ii]];
            comp.preDraw.call(comp, data);
        }

        for (let ii = 0; ii < _componentCalls.draw.length; ii++) {
            let comp = _components[_componentCalls.draw[ii]];
            comp.draw.call(comp, data);
        }

        //reversed loop
        for (let ii = _componentCalls.postDraw.length - 1; ii >= 0; ii--) {
            let comp = _components[_componentCalls.postDraw[ii]];
            comp.postDraw.call(comp, data);
        }
    };

    let drawDebug = function (data) {
        for (let ii = 0; ii < _componentCalls.preDraw.length; ii++) {
            let comp = _components[_componentCalls.preDraw[ii]];
            comp.preDraw.call(comp, data);
        }

        for (let ii = 0; ii < _componentCalls.drawDebug.length; ii++) {
            let comp = _components[_componentCalls.drawDebug[ii]];
            comp.drawDebug.call(comp, data);
        }

        //reversed loop
        for (let ii = _componentCalls.postDraw.length - 1; ii >= 0; ii--) {
            let comp = _components[_componentCalls.postDraw[ii]];
            comp.postDraw.call(comp, data);
        }
    };

    let addComponent = function (component) {
        let idx = _components.indexOf(component);
        if (idx !== -1) {
            console.warn('component ' + component.name + ' already added to entity ' + self.name);
            return;
        }
        _components.push(component);
        idx = _components.length - 1;

        component.added && component.added({
            entity : self
        });

        for (let name in _componentCalls) {
            if (component[name]) {
                _componentCalls[name].push(idx);
            }
        }

        return component;
    };

    let getComponent = function (name) {
        for (let ii = 0; ii < _components.length; ii++) {
            if (_components[ii].name === name) {
                return _components[ii];
            }
        }
    };

    let getComponents = function (name) {
        //TODO
    };

    let getAllComponents = function () {
        return [].concat(_components);
    };

    let removeComponent = function (component) {
        if (typeof component === 'string') {
            component = getComponent(component);
        }
        if (!component) return;
        let idx = _components.indexOf(component);
        if (idx === -1) {
            console.warn('component ' + component.name + ' was not added to entity ' + self.name);
            return;
        }
        component.die && component.die();
        _components.splice(idx, 1);

        for (let key in _componentCalls) {
            let list = _componentCalls[key];
            for (let ii = list.length - 1; ii >= 0; --ii) {
                if (list[ii] === idx) list.splice(ii, 1);
                if (list[ii] > idx) list[ii]--;
            }
        }
    };



    let addTag = function (tag) {
        let idx = _tags.indexOf(tag);
        if (idx !== -1) return;

        _tags.push(tag);
    };

    let addTags = function (tags) {
        tags.forEach(t => addTag(t));
    };

    let hasTag = function (tag) {
        return _tags.indexOf(tag) !== -1;
    };

    let hasTags = function (tags) {
        return tags.reduce((a, b) => hasTag(b) && a, true);
    };

    let getTags = function () {
        return [].concat(_tags);
    };

    let removeTag = function (tag) {
        let idx = _tags.indexOf(tag);
        if (idx === -1) return;

        _tags.splice(idx, 1);
    };

    let removeTags = function (tags) {
        tags.forEach(t => removeTag(t));
    };



    let self = {
        name: settings.name || 'entity',
        z: settings.z || 0,
        priority: settings.priority || 0,

        start: start,
        update: update,
        draw: draw,
        drawDebug: drawDebug,
        die: die,

        addComponent: addComponent,
        getComponent: getComponent,
        getComponents: getComponents,
        getAllComponents: getAllComponents,
        removeComponent: removeComponent,

        addTag: addTag,
        addTags: addTags,
        hasTag: hasTag,
        hasTags: hasTags,
        getTags: getTags,
        removeTag: removeTag,
        removeTags: removeTags
    };

    Dispatcher.make(self);

    return self;
};

export default Entity;