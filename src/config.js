export const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

export function getMaxViewHeight() {
    return isMobile ? window.innerHeight : Math.min(450, window.innerHeight);
}

export function getMaxViewWidth() {
    return isMobile ? window.innerWidth : Math.min(800, getMaxViewHeight() * 16 / 9);
}