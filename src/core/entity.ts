import { Dispatcher } from './dispatcher';
import { Transform } from '../math/transform';
import { Scene } from './scene';
import { Component } from './component';

type EntitySettings = {
    name?: string;
    z?: number;
    priority?: number;
    visible?: boolean
    active?: boolean;
};

export class Entity extends Dispatcher {
    private _components: Component[] = [];
    private _tags: string[] = [];

    private _scene: Scene | null = null;
    private _transform: Transform = new Transform();

    private _tick: number = 0;

    public name: string = 'entity';
    public z: number = 0;
    public priority: number = 0;
    public visible: boolean = true;
    public active: boolean = true;

    constructor(settings: EntitySettings) {
        super();

        if (settings.name !== void (0)) this.name = settings.name;
        if (settings.z !== void (0)) this.z = settings.z;
        if (settings.priority !== void (0)) this.priority = settings.priority;
        if (settings.visible !== void (0)) this.visible = settings.visible;
        if (settings.active !== void (0)) this.active = settings.active;

        //TODO components and tags
    };

    public start(data): void {
        for (let ii = 0; ii < this._components.length; ii++) {
            let comp = this._components[ii];
            comp.start(data);
        }
    };

    public die(data): void {
        for (let ii = 0; ii < this._components.length; ii++) {
            let comp = this._components[ii];
            comp.die(data);
        }
    };

    public update(data): void {
        this._tick++;

        for (let ii = 0; ii < this._components.length; ii++) {
            let comp = this._components[ii];
            comp.update(data);
        }
    };

    public draw(data): void {
        for (let ii = 0; ii < this._components.length; ii++) {
            let comp = this._components[ii];
            comp.preDraw(data);
        }

        for (let ii = 0; ii < this._components.length; ii++) {
            let comp = this._components[ii];
            comp.draw(data);
        }

        //reversed loop
        for (let ii = this._components.length - 1; ii >= 0; ii--) {
            let comp = this._components[ii];
            comp.postDraw(data);
        }
    };

    public drawDebug(data): void {
        for (let ii = 0; ii < this._components.length; ii++) {
            let comp = this._components[ii];
            comp.preDraw(data);
        }

        for (let ii = 0; ii < this._components.length; ii++) {
            let comp = this._components[ii];
            comp.drawDebug(data);
        }

        //reversed loop
        for (let ii = this._components.length - 1; ii >= 0; ii--) {
            let comp = this._components[ii];
            comp.postDraw(data);
        }
    };

    public addComponent(component: Component): Component | null {
        let idx = this._components.indexOf(component);
        if (idx !== -1) {
            console.warn('component ' + component.name + ' already added to entity ' + self.name);
            return null;
        }
        this._components.push(component);
        idx = this._components.length - 1;

        component.added({
            entity: self
        });

        return component;
    };

    public getComponent(name: string): Component | null {
        for (let ii = 0; ii < this._components.length; ii++) {
            if (this._components[ii].name === name) {
                return this._components[ii];
            }
        }
        return null;
    };

    public getAllComponents(): Component[] {
        return [...this._components];
    };

    public removeComponent(component: Component | string): void {
        if (typeof component === 'string') {
            let c = this.getComponent(component);
            if (c === null) return;
            component = c;
        }
        if (!component) return;

        let idx = this._components.indexOf(component);
        if (idx === -1) {
            console.warn('component ' + component.name + ' was not added to entity ' + self.name);
            return;
        }
        if (component.die) component.die.call(component);
        this._components.splice(idx, 1);
    };

    public addTag(tag: string) {
        let idx = this._tags.indexOf(tag);
        if (idx !== -1) return;

        this._tags.push(tag);
    };


    public addTags(tags: string[]) {
        tags.forEach(t => this.addTag(t));
    };

    public hasTag(tag: string) {
        return this._tags.indexOf(tag) !== -1;
    };

    public hasAnyTag(tags: string[]) {
        return tags.reduce((a, b) => this.hasTag(b) || a, false);
    };

    public hasTags(tags: string[]) {
        return tags.reduce((a, b) => this.hasTag(b) && a, true);
    };

    public removeTag(tag: string) {
        let idx = this._tags.indexOf(tag);
        if (idx === -1) return;

        this._tags.splice(idx, 1);
    };

    public removeTags(tags: string[]) {
        tags.forEach(t => this.removeTag(t));
    };

    public get scene(): Scene | null { return this._scene; };
    public set scene(v: Scene | null) {
        if (this._scene && v !== null) throw new Error("can't set Scene twice. Entity needs to be removed first");
        this._scene = v;
    }

    public get tags() { return [...this._tags]; };

    public get tick() { return this._tick; };

    public get transform() { return this._transform; };

    //TODO transform matrix accesors
    /*

        position: {
            get: () => _transform.position
        },
        scale: {
            get: () => _transform.scale
        },
        rotation: {
            get: () => _transform.rotation,
            set: v => _transform.rotation = v
        } */
};