import { Arg, IBaseFlagsConfig } from "common/autocomplete"

export const WIN = eval(`window`) as Window & {}
export const DOC = eval(`document`) as Document

export function makeRootElement({ zIndex }: { zIndex?: number } = {}): HTMLDivElement {
    const props: React.CSSProperties = {
        zIndex: zIndex ?? 100500,
        position: 'fixed',
        left: 0, top: 0,
        width: 0, height: 0,
    }
    const root = DOC.createElement('div')
    root.classList.add(P_CLASS_NAMES)
    for (const [name, value] of Object.entries(props) as any) {
        root.style[name] = value
    }
    DOC.body.append(root)
    return root
}

export type AppProps = React.PropsWithChildren<{ ns: NS, onClose: () => void }>
export type AppPropsWith<IFlagsConfig> = AppProps & { data: IFlagsConfig }
export type AppComponent<P> = React.FunctionComponent<P> | React.ComponentClass<P>

export async function asyncRun(ns: NS, App: AppComponent<AppProps>): Promise<void>;
export async function asyncRun<IFlagsConfig extends IBaseFlagsConfig>(
    ns: NS, App: AppComponent<AppPropsWith<IFlagsConfig>>, flagsConfig: AutocompleteConfig): Promise<void>;
export async function asyncRun<IFlagsConfig extends IBaseFlagsConfig>(
    ns: NS,
    appUnion: AppComponent<AppProps> | AppComponent<AppPropsWith<IFlagsConfig>>,
    flagsConfig?: AutocompleteConfig,
): Promise<void> {
    const root = makeRootElement()
    return new Promise<void>(resolve => {
        const App = appUnion as AppComponent<AppProps>
        let props: AppProps | AppPropsWith<IFlagsConfig> = { ns, onClose: resolve }
        if (flagsConfig !== undefined) {
            props = { ...props, data: Arg.unwrap<IFlagsConfig>(ns.flags(flagsConfig)) }
        }
        ReactDOM.render(<Draggable><App {...props} /></Draggable>, root)
    }).then(() => {
        ReactDOM.unmountComponentAtNode(root)
        root.remove()
    })
}

export const enum ButtonClass {
    Primary = 'css-13ak5e0',
    Disabled = 'Mui-disabled',
    Exit = 'css-83reht',
}

function addUserSelectStyles() {
    var styleEl = DOC.getElementById('react-draggable-style-el')
    if (!styleEl) {
        styleEl = DOC.createElement('style')
        styleEl.id = 'react-draggable-style-el'
        styleEl.innerHTML = '.react-draggable-transparent-selection *::-moz-selection {all: inherit}\n'
        styleEl.innerHTML += '.react-draggable-transparent-selection *::selection {all: inherit}\n'
        DOC.head.appendChild(styleEl)
    }
    DOC.body.classList.add('react-draggable-transparent-selection')
}

function removeUserSelectStyles() {
    try {
        DOC.body.classList.remove('react-draggable-transparent-selection')
        // Remove selection caused by scroll, unless it's a focused input
        // (we use doc.defaultView in case we're in an iframe)
        var selection = (DOC.defaultView || WIN).getSelection()
        if (selection && selection.type !== 'Caret') {
            selection.removeAllRanges()
        }
    } catch (e) { }
}

type DraggableData = {
    node: HTMLElement,
    x: number, y: number,
    deltaX: number, deltaY: number,
    lastX: number, lastY: number,
}

type DraggableEventHandler = (e: MouseEvent, data: DraggableData) => void

type DraggableCoreState = {
    dragging: boolean,
    lastX: number,
    lastY: number,
}

type DraggableCoreProps = {
    children: React.ReactElement,
    onStart: DraggableEventHandler,
    onDrag: DraggableEventHandler,
    onStop: DraggableEventHandler,
    onMouseDown?: (e: MouseEvent) => void,
}

class DraggableCore extends React.PureComponent<DraggableCoreProps, DraggableCoreState> {
    constructor(props: DraggableCoreProps) {
        super(props)
        this.state = {
            dragging: false,
            lastX: NaN,
            lastY: NaN,
        }
        this.handleDragStart = this.handleDragStart.bind(this)
        this.handleDrag = this.handleDrag.bind(this)
        this.handleDragStop = this.handleDragStop.bind(this)
    }
    createCoreData(x: number, y: number): DraggableData {
        const { lastX, lastY } = this.state
        const node = DOC.body
        if (isNaN(lastX) || isNaN(lastY)) {
            return {
                node, x, y,
                deltaX: 0,
                deltaY: 0,
                lastX: x,
                lastY: y,
            }
        }
        return {
            node, lastX, lastY, x, y,
            deltaX: x - lastX,
            deltaY: y - lastY,
        }
    }
    onMouseDown(ev: React.MouseEvent): void {
        this.handleDragStart(ev)
    }
    handleDragStart(ev: React.MouseEvent | MouseEvent): void {
        addUserSelectStyles()
        this.props.onMouseDown && this.props.onMouseDown(ev as any)
        const x = ev.clientX + DOC.body.scrollLeft
        const y = ev.clientY + DOC.body.scrollTop
        const coreEvent = this.createCoreData(x, y)  // for custom event handling
        this.props.onStart(ev as any, coreEvent)
        this.setState({
            dragging: true,
            lastX: x,
            lastY: y,
        })
        DOC.addEventListener('mousemove', this.handleDrag)
        DOC.addEventListener('mouseup', this.handleDragStop)
    }
    handleDrag(ev: MouseEvent): void {
        const x = ev.clientX + DOC.body.scrollLeft
        const y = ev.clientY + DOC.body.scrollTop
        const coreEvent = this.createCoreData(x, y)  // for custom event handling
        this.props.onDrag(ev, coreEvent)
        const { lastX, lastY } = this.state
        if (lastX !== x || lastY !== y) {
            this.setState({
                lastX: x,
                lastY: y,
            })
        }
    }
    handleDragStop(ev: React.MouseEvent | MouseEvent): void {
        if (!this.state.dragging) {
            return
        }
        removeUserSelectStyles()
        const x = ev.clientX + DOC.body.scrollLeft
        const y = ev.clientY + DOC.body.scrollTop
        const coreEvent = this.createCoreData(x, y)  // for custom event handling
        this.props.onStop(ev as any, coreEvent)
        this.setState({
            dragging: false,
            lastX: NaN,
            lastY: NaN,
        })
        DOC.removeEventListener('mousemove', this.handleDrag)
        DOC.removeEventListener('mouseup', this.handleDragStop)
    }
    override render(): React.ReactElement {
        return (
            React.cloneElement(React.Children.only(this.props.children), {
                onMouseDown: this.handleDragStart,
                onMouseUp: this.handleDragStop,
            })
        )
    }
}

type DraggableProps = {
    children: React.ReactElement,
    onStart?: DraggableEventHandler,
    onDrag?: DraggableEventHandler,
    onStop?: DraggableEventHandler,
    onMouseDown?: (ev: MouseEvent) => void,
}

type DraggableState = {
    x: number,
    y: number,
    dragging: boolean,
    dragged: boolean,
}

export class Draggable extends React.PureComponent<DraggableProps, DraggableState> {
    constructor(props: DraggableProps) {
        super(props)
        this.state = {
            x: 0, y: 0,
            dragging: false,
            dragged: false,
        }
        this.onDrag = this.onDrag.bind(this)
        this.onDragStart = this.onDragStart.bind(this)
        this.onDragStop = this.onDragStop.bind(this)
    }
    createDraggableData(coreData: DraggableData) {
        const { node, deltaX, deltaY } = coreData
        return {
            node, deltaX, deltaY,
            x: this.state.x + coreData.deltaX,
            y: this.state.y + coreData.deltaY,
            lastX: this.state.x,
            lastY: this.state.y
        }
    }
    onDragStart(ev: MouseEvent, coreData: DraggableData) {
        this.props.onStart && this.props.onStart(ev, this.createDraggableData(coreData))
        this.setState({
            dragging: true,
            dragged: true,
        })
    }
    onDrag(ev: MouseEvent, coreData: DraggableData) {
        if (!this.state.dragging) {
            return
        }
        const data = this.createDraggableData(coreData)
        this.props.onDrag && this.props.onDrag(ev, data)
        if (data.x !== this.state.x || data.y !== this.state.y) {
            this.setState({ x: data.x, y: data.y })
        }
    }
    onDragStop(ev: MouseEvent, coreData: DraggableData) {
        if (!this.state.dragging) {
            return
        }
        this.props.onStop && this.props.onStop(ev, this.createDraggableData(coreData))
        this.setState({ dragging: false })
    }
    override render(): React.ReactElement {
        const { x, y, dragging } = this.state
        const { children } = this.props
        const style: React.CSSProperties = {
            position: 'fixed',
            backgroundColor: 'black',
            border: '1px solid rgb(70 70 70)',
            cursor: dragging ? 'grabbing' : 'grab',
            padding: 6,
            left: 0,
            top: 0,
            transform: `translate(${x}px,${y}px)`,
        }
        return (
            React.createElement(
                DraggableCore,
                {
                    ...this.props,
                    onStart: this.onDragStart,
                    onDrag: this.onDrag,
                    onStop: this.onDragStop,
                },
                React.cloneElement(React.Children.only(children), {
                    style: { ...children.props.style, ...style },
                }),
            )
        )
    }
}

/**
 * Button
 */

type ButtonProps = React.PropsWithChildren<
    React.DetailedHTMLProps<React.ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement>
>

export class Button extends React.PureComponent<ButtonProps> {
    override render(): React.ReactNode {
        const { children, className, ...props } = this.props
        const classes: string[] = [className ?? ButtonClass.Primary]
        if (props.disabled) {
            classes.push(ButtonClass.Disabled)
        }
        return (
            <button {...props} className={classes.join(' ')}>
                {children}
            </button>
        )
    }
}
