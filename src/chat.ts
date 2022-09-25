import {io, Socket} from 'socket.io-client';
import {DefaultEventsMap} from 'socket.io/dist/typed-events';
import printer from './printer';

class Chat {
    private readonly socket: Socket<DefaultEventsMap, DefaultEventsMap>;
    private readonly userName: string;

    constructor(host: string, userName: string) {
        this.userName = userName;
        this.socket = io(host);
        this.registerEvents();
    }

    private registerEvents() {
        this.socket.on('connect', () => {
            printer.success('Connection established', true);
            this.socket.emit('connection_message', this.userName);
        });

        this.socket.on('disconnect', () => {
            printer.warning('Server dropped the connection', true);
        });

        this.socket.on('chat_message', function (msg, userName) {
            printer.chatPrint(`${userName}: ${msg}`, true);
        });

        this.socket.on('connection_message', function (userName) {
           printer.info(`${userName} is connected`,true);
        });

        this.socket.on('disconnection_message', function (userName) {
            printer.info(`${userName} is disconnected`,true);
        });
    }

    public sendMsd(msg: string) {
        this.socket.emit('chat_message', msg, this.userName);
    }

    public close() {
        this.socket.close();
    }
}

export default Chat;