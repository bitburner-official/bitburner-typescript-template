const POPUP_ID = 'hello-react-root'
const POPUP_HTML = `
    <div id="${POPUP_ID}" class="css-cxl1tz" style="
        position: fixed;
        top: 0px;
        left: 0px;
        background-color: rgb(34 34 34);
        z-index: 100500;
    "></div>
`
const DOC = eval(`document`) as Document

interface IAppProps {
    onClose: () => void,
}

interface IAppState {
    closed: boolean,
}

class App extends React.Component<IAppProps, IAppState> {
    override state: IAppState
    constructor(props: IAppProps) {
        console.log('Constructor called')
        super(props)
        this.state = { closed: false } 
        this.componentDidCatch = (err, errInfo) => console.log('- ERROR: ', err, errInfo)
        this.componentDidMount = () => console.log('- AppRoot mounted')
        this.componentDidUpdate = () => console.log('- AppRoot updated')
        this.componentWillUnmount = () => console.log('- AppRoot will unmount')
        this.close = this.close.bind(this)
    }
    override render(): React.ReactNode {
        return this.state.closed ? <></> :
            <>
                <button onClick={this.close} type="button">x</button>
                Hello world
            </>
    }
    close(): void {
        console.log('AppRoot.close() called')
        this.setState({ closed: true }, () => this.props.onClose())
    }
}

export async function main(ns: NS) {
    const thisScriptName = ns.getScriptName()
    if (ns.ps().filter(info => info.filename === thisScriptName).length > 1) {
        throw new Error("Double lauch")
        return
    }
    if (!DOC.getElementById(POPUP_ID)) {
        DOC.body.insertAdjacentHTML('beforeend', POPUP_HTML)
    }
    const root = DOC.getElementById(POPUP_ID)
    if (root === null) {
        throw new Error("Can't create root element")
        return
    }
    await new Promise<void>(resolve => ReactDOM.render(
        <App onClose={resolve}></App>,
        root,
        () => console.log('AppRoot rendered')
    ))
    ReactDOM.unmountComponentAtNode(root)
    console.log('AppRoot closed')
}
