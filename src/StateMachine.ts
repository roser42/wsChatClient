interface IState {
    name: string
    onEnter?: () => void
    onUpdate?: (dt: number) => void
    onExit?: () => void
}

export default class StateMachine {
    private states = new Map<string, IState>();
    private currentState?: IState;
    private readonly context?: object;
    private isChangingState = false;

    constructor(context: object) {
        this.context = context;
    }

    public addState(name: string, config?: { onEnter?: () => void, onUpdate?: (dt: number) => void, onExit?: () => void }) {
        const context = this.context;

        this.states.set(name, {
            name,
            onEnter: config?.onEnter?.bind(context),
            onUpdate: config?.onUpdate?.bind(context),
            onExit: config?.onExit?.bind(context)
        });
        return this
    }

    public setState(name: string) {
        if (!this.states.has(name)) {
            console.warn(`Tried to change to unknown state: ${name}`);
            return;
        }
        if (this.isCurrentState(name)) {
            return;
        }

        this.isChangingState = true;

        if (this.currentState && this.currentState.onExit) {
            this.currentState.onExit();
        }

        this.currentState = this.states.get(name)!;

        if (this.currentState.onEnter) {
            this.currentState.onEnter();
        }

        this.isChangingState = false;
    }

    isCurrentState(name: string) {
        if (!this.currentState) {
            return false;
        }
        return this.currentState.name === name
    }

    public curState() {
        return this.currentState?.name;
    }
}