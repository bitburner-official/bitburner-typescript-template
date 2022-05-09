export class Arg {
    private static space = ' '
    // static unicodeSpace = '\u2002'
    private static unicodeSpace = '_'
    private static escape(val: string): string {
        return val.replaceAll(Arg.space, Arg.unicodeSpace)
    }
    private static unescape<T>(val: T): T {
        return typeof val === 'string'
            ? val.replaceAll(Arg.unicodeSpace, Arg.space) as any
            : val
    }
    static wrap(autocomplete: (data: AutocompleteData, args: string[]) => any[]) {
        return (data: AutocompleteData, args: string[]) => {
            return autocomplete(data, args).map(Arg.escape)
        }
    }
    static unwrap<T extends IBaseFlagsConfig>(flags: T): T {
        for (const [key, value] of Object.entries(flags)) {
            if (typeof value === 'string') {
                (flags as Record<string, any>)[key] = Arg.unescape(value)
            }
            else if (Array.isArray(value)) {
                (flags as Record<string, any>)[key] = value.map(Arg.unescape)
            }
        }
        return flags
    }
}

enum Flag {
    Tail = 'tail',
    Args = '_',
}

export interface IBaseFlagsConfig {
    [Flag.Args]: string[],
}

export function flagToArgument(flag: string): string {
    return `--${flag}`
}

export const baseFlagsConfig: AutocompleteConfig = [
    [Flag.Tail, false],
]
