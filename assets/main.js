const searchParamStr = new URLSearchParams(window.location.search);

document.querySelector('#header .brand').addEventListener('click', (e) => window.open('/', '_self'));

// Adding margins to first and last elements instead of a margin on the parent to keep the scrollbar the entire width
const links = document.querySelector('.linksWrapper .links')
if (links) {
    links.firstElementChild.style.marginLeft = '1.35rem';
    links.lastElementChild.style.marginRight = '1.35rem';
}

// Disable content scrolling logic for debug, not many use cases but good to have ig
const mobileDebug = false;

const contentWrapper = document.querySelector('#content');
if (mobileDebug || 'ontouchstart' in window || navigator.maxTouchPoints > 0) {
    contentWrapper.style.overflow = 'auto';
    document.querySelector('.portfolio').style.overflowX = 'unset';

    function forceContext(id) {
        const nextContent = contentWrapper.children[id];
        if (nextContent) nextContent.scrollIntoView({behavior: 'smooth', block: 'start'});
    }
} else {
    let currentContentIndex = 0;
    contentWrapper.addEventListener('wheel', (e) => {
        const nextContentIndex = e.deltaY > 0 ? currentContentIndex + 1 : currentContentIndex - 1;
        const nextContent = contentWrapper.children[nextContentIndex];
        if (nextContent) {
            const currentContent = contentWrapper.children[currentContentIndex];
            if (currentContent.scrollHeight > currentContent.clientHeight) {
                if (e.deltaY > 0) {
                    if (currentContent.scrollHeight - currentContent.scrollTop > currentContent.clientHeight) return;
                } else {
                    if (currentContent.scrollTop > 0) return;
                }
            }
            nextContent.scrollIntoView({behavior: 'smooth', block: 'start'});
            currentContentIndex = nextContentIndex;
        }
    }, {passive: true});

    function forceContext(id) {
        const nextContent = contentWrapper.children[id];
        if (nextContent) {
            nextContent.scrollIntoView({behavior: 'smooth', block: 'start'});
            currentContentIndex = id;
        }
    }
}

// Can't decide on an appropriate image to set as the background of the site, so creating logic to randomly select an image daily
const imageLinks = [ // TODO: Get images
    //'assets/backgrounds/cat.jpg',
    '' // blank image to just show fallback colour (#89cff0)
]

// probably the most inefficient shitcode ever but tests were random enough for me :shrug:
function getDailyBackground(dateOverride) {
    const date = dateOverride ? new Date(dateOverride) : new Date();
    const dateId = (date.getUTCDate() * (date.getUTCMonth() + 1)) * date.getUTCFullYear()
    if (dateId % 2 === 0) {
        return Math.ceil((dateId / imageLinks.length) % imageLinks.length)
    } else {
        return Math.floor((dateId / imageLinks.length) % imageLinks.length)
    }
}
document.body.style.backgroundImage = `url('${imageLinks[getDailyBackground()]}')`;