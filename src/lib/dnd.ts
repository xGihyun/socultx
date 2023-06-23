export function songDraggable(node: HTMLElement, data: any) {
    let state = data;

    node.draggable = true;
    node.style.cursor = 'grab';

    return {
        destroy() {

        }
    }
}