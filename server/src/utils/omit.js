const omit = (obj, keysToOmit) => {
    return Object.fromEntries(Object.entries(obj).filter(([key]) => !keysToOmit.includes(key)));
};

export { omit };