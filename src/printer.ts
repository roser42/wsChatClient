import {reader} from './index';

const enum Colors {
    Reset = '\x1b[0m',
    Bright = '\x1b[1m',
    Dim = '\x1b[2m',
    Underscore = '\x1b[4m',
    Blink = '\x1b[5m',
    Reverse = '\x1b[7m',
    Hidden = '\x1b[8m',

    FgBlack = '\x1b[30m',
    FgRed = '\x1b[31m',
    FgGreen = '\x1b[32m',
    FgYellow = '\x1b[33m',
    FgBlue = '\x1b[34m',
    FgMagenta = '\x1b[35m',
    FgCyan = '\x1b[36m',
    FgWhite = '\x1b[37m',

    BgBlack = '\x1b[40m',
    BgRed = '\x1b[41m',
    BgGreen = '\x1b[42m',
    BgYellow = '\x1b[43m',
    BgBlue = '\x1b[44m',
    BgMagenta = '\x1b[45m',
    BgCyan = '\x1b[46m',
    BgWhite = '\x1b[47m'
}

const enum Info {
    error = '[ERROR]: ',
    success = '[SUCCESS]: ',
    warning = '[WARNING]: ',
    info = '[INFO]: '
}

class Printer {

    static error(msg: string, infoCall?: boolean) {
        this.log(Colors.FgRed, Info.error, msg, infoCall);
    }

    static success(msg: string, infoCall?: boolean) {
        this.log(Colors.FgGreen, Info.success, msg, infoCall);
    }

    static warning(msg: string, infoCall?: boolean) {
        this.log(Colors.FgYellow, Info.warning, msg, infoCall);
    }

    static info(msg: string, infoCall?: boolean) {
        this.log(Colors.FgBlue, Info.info, msg, infoCall);
    }

    //TODO create ...msg for all messages
    static print(msg: string, infoCall?: boolean) {
        this.log(msg, infoCall);
    }

    static chatPrint(msg: string, infoCall?: boolean) {
        this.noRLog(msg, infoCall);
    }

    static beep() {
        process.stdout.write('\x07');
    }

    static log(...objs: any[]) {
        let infoCall = objs.pop();
        infoCall = typeof infoCall === 'boolean' && infoCall;

        if (infoCall) {
            process.stdout.write('\r\x1b[K');
        }

        console.log('\n', ...objs, Colors.Reset, '\n');

        if (infoCall) {
            reader.recursiveAsyncReadLine();
        }
    }

    static noRLog(...objs: any[]) {
        let infoCall = objs.pop();
        infoCall = typeof infoCall === 'boolean' && infoCall;

        if (infoCall) {
            process.stdout.write('\r\x1b[K');
        }

        console.log(...objs, Colors.Reset);

        if (infoCall) {
            reader.recursiveAsyncReadLine();
        }
    }
}


export default Printer;