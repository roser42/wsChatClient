import * as readline from 'readline';
import {stdin as input, stdout as output} from 'node:process';
import printer from './printer';
import StateMachine from './StateMachine';
import Chat from './chat';
import config from './config';

export class Reader {
    public readonly rl: readline.Interface;
    public readonly stateMachine: StateMachine;
    private bashChar: string = '>>';

    public chat?: Chat;

    constructor() {
        this.rl = readline.createInterface({input, output});

        this.stateMachine = new StateMachine(this);
        this.initStates();
        this.stateMachine.setState('menu');

        this.recursiveAsyncReadLine();
    }

    private initStates() {
        this.stateMachine
            .addState('menu', {
                onEnter: this.onMenuEnter
            })
            .addState('chat', {
                onEnter: this.onChatEnter
            });
    }

    recursiveAsyncReadLine = () => {
        this.rl.question(`${this.bashChar} `, (input) => {
            if (input[0] === '/') {
                this.commands(input);
            } else if (this.stateMachine.curState() === 'menu') {
                printer.error(`Command '${input}' not found, type /H for Help`);
            }

            if (this.stateMachine.curState() === 'chat' && input[0] !== '/') {
                if (this.chat !== undefined) {
                    this.chat.sendMsd(input);
                } else {
                    printer.error('Failed to connect to the server');
                }
            }

            this.recursiveAsyncReadLine();
        });
    }

    private exit() {
        switch (this.stateMachine.curState()) {
            case 'menu':
                process.exit();
                break;
            case 'chat':
                this.stateMachine.setState('menu');
                this.chat?.close();
                break;
            default:
                return
        }
    }

    private connect2Chat(values: string[]) {
        if
        (
            values.length === 0
            || !values.join(' ').replace(/\s/g, '').length
        ) {
            printer.error('Enter your user name: /C <name>');
            return;
        }
        this.chat = new Chat(config.SERVER_IP, values.join(' '));
        this.stateMachine.setState('chat');
    }

    private commands(input: string) {
        const values = input.slice(1).split(' ');
        const cmd = values.shift()!.toUpperCase();

        switch (cmd) {
            case 'CONNECT':
            case 'C':
                this.connect2Chat(values);
                break;
            case 'EXIT':
            case 'E':
                this.exit();
                break;
            case 'HELP':
            case 'H':
                printer.print
                ('/h Help\n'
                    + ' /e Exit\n'
                    + ' /c <name> Connect to chat \n'
                    + ' /cl Clear console'
                );
                break;
            case 'CLEAR':
            case 'CL':
                console.clear();
                break

            default:
                printer.error(`Command '/${cmd}' not found, type /H for Help`);
        }
    }

    private onChatEnter() {
        console.clear();
        this.bashChar = '---';
        this.recursiveAsyncReadLine();
    }

    private onMenuEnter() {
        this.bashChar = '>>';
        this.recursiveAsyncReadLine();
    }
}



