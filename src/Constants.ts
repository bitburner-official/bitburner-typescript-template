export const CONSTANTS: {
    GROW_SECURITY_INC: number;
    HACK_SECURITY_INC: number;
    WEAKEN_SECURITY_DEC: number;
    NULLPORT: string;
    ARGS: [string, string | number | boolean | string[]][];
    LINETERM: string;
} = {
    GROW_SECURITY_INC: 0.004,
    HACK_SECURITY_INC: 0.002,
    WEAKEN_SECURITY_DEC: 0.05,
    NULLPORT: 'NULL PORT DATA',
    ARGS: [
        ['d', false],
        ['debug', false]
    ],
    LINETERM: '\r\n'
};
