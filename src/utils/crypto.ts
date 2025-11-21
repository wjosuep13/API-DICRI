import { createHash } from "crypto";

export const hashText = (text: string): string => {
    return createHash('sha256').update(text).digest('hex');
}

export const compareHash = (text: string, hash: string): boolean => {
    const textHash = hashText(text);
    return textHash === hash;
}
