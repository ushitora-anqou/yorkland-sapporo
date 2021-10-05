import { DataConnection } from "skyway-js";
import { types } from "util";

// P2P Clients
// wrapping different connections between skyway and raw webrtc
class User {
    constructor(
        private _id: string, // uuid v4
        private _name: string,
        private _conn: RTCDataChannel | DataConnection
    ){}

    get id(): string {
        return this._id;
    }

    get name(): string {
        return this._name;
    }

    get conn(): RTCDataChannel | DataConnection { 
        return this._conn;
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/explicit-module-boundary-types
    send = (data: any): void => {
        if (this._conn instanceof RTCDataChannel) {
            if (typeof data === 'string') {
                this._conn.send(data);
            } else if (data instanceof Blob) {
                this._conn.send(data);
            } else if (data instanceof ArrayBuffer) {
                this._conn.send(data);
            } else if (types.isArrayBufferView(data)) {
                // FIXME refine this condition
                this._conn.send(data);
            } else {
                throw TypeError('Bad typed value in RTCDataChannel.send()')
            }
        } else {
            // skyway accepts any type
            this._conn.send(data);
        }
    }

    on = (type: string, fn: (_: Event) => void): void => {
        if (this._conn instanceof RTCDataChannel) {
            this._conn.addEventListener(type, fn)
        } else {
            this._conn.on(type, fn)
        }
    }

    // wrap "message" in RTCDataChannel and "data" in Skyway's DataConnection 
    onRecieve = (fn: (_: Event) => void): void => {
        if (this._conn instanceof RTCDataChannel) {
            this._conn.addEventListener('message', fn)
        } else {
            this._conn.on('data', fn)
        }
    }

    close = (): void => this._conn.close();
}
export default User;