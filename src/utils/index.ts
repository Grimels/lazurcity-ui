export const throwIfNull = (v: unknown, errorText: string) => {
    if (!!v) return;
    throw new Error(errorText);
}
