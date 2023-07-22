import { musicQueue, areSongsSelected } from "$lib/music";
import { trackIndex } from "svelte-mp3";
import type { Song } from "$lib/types";
import { get } from "svelte/store";

export function draggableSong(node: HTMLElement, indexOfElement: number) {

    node.draggable = true;
    node.style.cursor = 'move';

    node.addEventListener('dragstart', () => {
        node.classList.add('dragging')
    })

    node.addEventListener('click', () => {
        if (node.getAttribute('selected') == "true") {
            let selectedElements = node.parentElement?.querySelectorAll("[selected='true']");
            selectedElements?.forEach((item) => {
                item.classList.remove('border-error-400', 'rounded', 'border-2');
                item.setAttribute('selected', 'false')
            })

            areSongsSelected.set({ state: false, selectedIndexes: [] })


            console.log("reset selected items: ", get(areSongsSelected))

        } else {
            node.classList.add('border-error-400', 'rounded', 'border-2')
            node.setAttribute('selected', "true");
            areSongsSelected.update((current) => ({
                state: true, selectedIndexes: [...current.selectedIndexes, indexOfElement]
            }))
            console.log(get(areSongsSelected))
        }
    })

    node.addEventListener('dragend', () => {
        node.classList.remove('dragging')

        // Reset selected items just in case

        let selectedElements = node.parentElement?.querySelectorAll("[selected='true']");
        selectedElements?.forEach((item) => {
            item.classList.remove('border-error-400', 'rounded', 'border-2');
            item.setAttribute('selected', 'false')
        })

        areSongsSelected.set({ state: false, selectedIndexes: [] })
        console.log("reset selected items (cause of dragging): ", get(areSongsSelected))

    })

    return {
        destroy() {
        }
    }
}

// Can't seem to understand the logic behind these functions, but it does work! -- https://yewtu.be/watch?v=jfYWwQrtzzY
export function draggableContainer(node: HTMLElement) {
    node.addEventListener('dragover', (e) => {
        e.preventDefault();
        const afterElement = getDragAfterElement(node, e.clientY);
        // The element that is currently being dragged by the user will have the `.dragging` class selector
        let draggable = node.querySelector('.dragging');
        if (afterElement == null) {
            node.appendChild(draggable as Element);
        } else {
            node.insertBefore(draggable as Element, afterElement);
        }

    })

    node.addEventListener('dragend', async () => {
        let newQueue: Song[] = []
        let indexToSet: number;

        for (let i = 0; i < node.children.length; i++) {
            let element = node.children[i] as HTMLElement;
            if (element.dataset.now_playing as string == "true") {
                indexToSet = i;
                // trackIndex.set(i);
            }
            newQueue.push({
                id: element.dataset.id as string,
                song: element.dataset.song as string,
                artist: element.dataset.artist as string,
                album: element.dataset.album,
                url: element.dataset.url as string,
                cover_art_url: element.dataset.cover_art_url as string,
                duration: element.dataset.duration as string,
                lyrics: element.dataset.lyrics as string,
            })
        }

        // Set changes
        musicQueue.set(newQueue);
        trackIndex.set(indexToSet);
    })

    return {
        destroy() {

        }
    }

}

function getDragAfterElement(container: HTMLElement, y: number) {
    // grab draggable elements except the one that the user is currently holding, store into some array
    const draggableElements = [...container.querySelectorAll('.draggable:not(.dragging)')]

    return draggableElements.reduce((closest, child) => {
        const box = child.getBoundingClientRect()
        const offset = y - box.top - box.height / 2

        if (offset < 0 && offset > closest.offset) {
            return {
                offset: offset,
                element: child
            }
        } else {
            return closest
        }
    }, { offset: Number.NEGATIVE_INFINITY }).element;
}