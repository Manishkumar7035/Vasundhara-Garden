/* Custom cursor: shared by the main content page */
(() => {
    const cursor = document.getElementById("customCursor");
    if (!cursor || window.matchMedia("(max-width: 650px)").matches ||
        window.matchMedia("(pointer: coarse)").matches) {
        if (cursor) cursor.style.display = "none";
        document.body.style.cursor = "auto";
        return;
    }

    document.addEventListener("mousemove", (event) => {
        cursor.style.left = event.clientX + "px";
        cursor.style.top = event.clientY + "px";
    });

    // Measure the exact word under the pointer and resize the square around it.
    const textTags = "h1,h2,h3,h4,p,a,span,button,label,pre";
    document.querySelectorAll(textTags).forEach((element) => {
        element.addEventListener("mousemove", (event) => {
            const range = document.createRange();
            const nodes = [];

            const walker = document.createTreeWalker(
                element,
                NodeFilter.SHOW_TEXT,
                {
                    acceptNode(node) {
                        return node.textContent.trim()
                            ? NodeFilter.FILTER_ACCEPT
                            : NodeFilter.FILTER_REJECT;
                    }
                }
            );

            let node;
            while ((node = walker.nextNode())) nodes.push(node);

            let foundRect = null;
            for (const textNode of nodes) {
                const text = textNode.textContent;
                for (let i = 0; i < text.length; i++) {
                    if (!/\S/.test(text[i])) continue;
                    range.setStart(textNode, i);
                    range.setEnd(textNode, i + 1);
                    const rect = range.getBoundingClientRect();
                    if (event.clientX >= rect.left && event.clientX <= rect.right &&
                        event.clientY >= rect.top && event.clientY <= rect.bottom) {
                        let start = i;
                        let end = i;
                        while (start > 0 && !/\s/.test(text[start - 1])) start--;
                        while (end < text.length && !/\s/.test(text[end])) end++;
                        range.setStart(textNode, start);
                        range.setEnd(textNode, end);
                        foundRect = range.getBoundingClientRect();
                        break;
                    }
                }
                if (foundRect) break;
            }

            if (foundRect) {
                cursor.style.setProperty("--cursor-width", Math.max(24, foundRect.width + 12) + "px");
                cursor.style.height = Math.max(26, foundRect.height + 10) + "px";
                cursor.classList.add("text-hover");
            } else {
                cursor.classList.remove("text-hover");
                cursor.style.height = "17px";
            }
        });

        element.addEventListener("mouseleave", () => {
            cursor.classList.remove("text-hover");
            cursor.style.height = "17px";
        });
    });
})();
