export const toCamelCase = str => str && str.trim()
    .toLowerCase()
    .replace(/[\s_-]+(\w)/g, (_, c) => c.toUpperCase())
    .replace(/^./, c => c.toLowerCase());
