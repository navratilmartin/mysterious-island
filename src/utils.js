/**
 * Sets the value of `window.location.href` to the passed `levelUrl`.
 * 
 * @param {string} levelUrl - a url to the game level (html). Use urls from `constants.js`.
 */
export function changeLevel(levelUrl) {
    window.location.href = levelUrl;
}