function toggleMenu() {
    const nav = document.getElementById('navMenu');
    nav.classList.toggle('active');
}

function closeMenu() {
    const nav = document.getElementById('navMenu');
    nav.classList.remove('active');
}