import { baseFlagsConfig, IBaseFlagsConfig } from "./common/autocomplete"
import { AppPropsWith, asyncRun, Button, ButtonClass } from "./common/react-mini-lib"

type Props = AppPropsWith<IFlagsConfig>
type State = {
    moneyThresh: number,
}

class App extends React.PureComponent<Props, State> {
    constructor(props: Props) {
        super(props)
        this.state = {
            moneyThresh: 0,
        }
    }
    close() {
        this.props.onClose()
    }
    single(): number | undefined {
        const { ns } = this.props
        const money = ns.getPlayer().money - 1e6
        let method: undefined | Function
        let price = Infinity
        let cost = ns.hacknet.getPurchaseNodeCost()
        if (money >= cost) {
            price = cost
            method = ns.hacknet.purchaseNode.bind(ns.hacknet)
        }
        for (const hs of _.range(ns.hacknet.numNodes())) {
            cost = ns.hacknet.getLevelUpgradeCost(hs, 1)
            if (money >= cost && cost < price) {
                price = cost
                method = ns.hacknet.upgradeLevel.bind(ns.hacknet, hs, 1)
            }
            cost = ns.hacknet.getCoreUpgradeCost(hs, 1)
            if (money >= cost && cost < price) {
                price = cost
                method = ns.hacknet.upgradeCore.bind(ns.hacknet, hs, 1)
            }
            cost = ns.hacknet.getCacheUpgradeCost(hs, 1)
            if (money >= cost && cost < price) {
                price = cost
                method = ns.hacknet.upgradeCache.bind(ns.hacknet, hs, 1)
            }
            cost = ns.hacknet.getRamUpgradeCost(hs, 1)
            if (money >= cost && cost < price) {
                price = cost
                method = ns.hacknet.upgradeRam.bind(ns.hacknet, hs, 1)
            }
        }
        if (method !== undefined) {
            method()
            return price
        }
        return
    }
    atLeast() {
        let spent = 0
        while (spent < this.state.moneyThresh) {
            const val = this.single()
            if (val !== undefined) {
                spent += val
            } else {
                break
            }
        }
    }
    override render(): React.ReactNode {
        const { ns, onClose, children, data, ...props } = this.props
        return (
            <div {...props}>
                <header>
                    <Button onClick={() => this.close()} className={ButtonClass.Exit}>Close</Button>
                    Upgrading Hacknodes
                </header>
                <div>
                    Upgrade:
                    <Button onClick={() => this.single()}>single</Button>
                </div>
                <div>
                    Spend $ {ns.nFormat(this.state.moneyThresh, '0,0.0a')}:
                    <input type="number" onChange={ev => this.setState({ moneyThresh: eval(ev.target.value) })} />
                    <Button onClick={() => this.atLeast()}>at least</Button>
                </div>
            </div>
        )
    }
}

export enum Flag {
    Never = '',
    NoDaemon = 'no-daemon',
    Limit = 'limit'
}

const flagsConfig: AutocompleteConfig = [
    ...baseFlagsConfig,
    [Flag.NoDaemon, false],
    [Flag.Limit, 0],
]

interface IFlagsConfig extends IBaseFlagsConfig {
    [Flag.Never]: void,
    [Flag.NoDaemon]: boolean,
    [Flag.Limit]: number,
}

export function autocomplete(data: AutocompleteData, args: string[]) {
    const flags = data.flags(flagsConfig)
    return []
}

export async function main(ns: NS) {
    return asyncRun<IFlagsConfig>(ns, App, flagsConfig)
}
