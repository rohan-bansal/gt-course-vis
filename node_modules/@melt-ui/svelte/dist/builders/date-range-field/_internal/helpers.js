import { isBrowser } from '../../../internal/helpers/index.js';
export function removeDescriptionElement(id) {
    if (!isBrowser)
        return;
    const el = document.getElementById(id);
    if (!el)
        return;
    document.body.removeChild(el);
}
