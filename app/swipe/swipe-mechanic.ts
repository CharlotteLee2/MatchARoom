export function createProfileCard(options: { title: string; age?: number; description: string; image: string }): HTMLElement {
    const card = document.createElement('div');
    card.className = 'profile-card';
    card.innerHTML = `
        <img src="${options.image}" alt="${options.title}" />
        <h2>${options.title} ${options.age ? `(${options.age})` : ''}</h2>
        <p>${options.description}</p>
    `;
    return card;
}
export function SwipeMechanic() {
    const ProfileCard = document.getElementById('ProfileCard');
    if (!ProfileCard) return;
    const profile = Array.from(ProfileCard.querySelectorAll<HTMLElement>('.profile-card'));

    profile.forEach((card) => {
        let startX = 0;
        let currentX = 0;
        let dragging = false;

        const registeredSwipe = (event : PointerEvent) => {
            dragging = true;
            startX = event.clientX;
            const t = event.target as Element | null;
            if (t && typeof t.closest === 'function') {
                const pointCapture = card.setPointerCapture;
                if (typeof pointCapture === 'function') {
                    pointCapture.call(card, event.pointerId);
                }
            }
            card.style.transition = 'none';
            window.addEventListener('pointermove', ifYouSwipe);
            window.addEventListener('pointercancel', afterSwipe);
            window.addEventListener('pointerup', afterSwipe);
        };

        const ifYouSwipe = (event : PointerEvent) => {
            if (!dragging) return;
            currentX = event.clientX - startX;
            card.animate(
                [{ transform: card.style.transform }, { transform: `translateX(${currentX}px) rotate(${currentX / 35}deg)` }],
                { duration: 150, fill: 'forwards', easing: 'ease-out' }
            );
        };
        const afterSwipe = (event : PointerEvent) => {
            if (!dragging) 
                return;
            dragging = false;
            const pointCapture = card.releasePointerCapture;
            if (typeof pointCapture === 'function'){
                pointCapture.call(card, event.pointerId);
            }
            window.removeEventListener('pointermove', ifYouSwipe);
            window.removeEventListener('pointercancel', afterSwipe);
            window.removeEventListener('pointerup', afterSwipe);
            card.style.transition = 'transform 0.5s ease-out';
            if (Math.abs(currentX) > 150){
                let direction: number;
                if (currentX > 0) {
                    direction = 1;
                }else {
                    direction = -1;
                }
                const offScreenX = direction * (window.innerWidth + card.offsetWidth);
             card.animate(
                [{ transform: `translateX(${currentX}px) rotate(${currentX / 35}deg)` },
                    { transform: `translateX(${offScreenX}px) rotate(${direction * 45}deg)` }
                , ],
                { duration: 800, easing: 'ease-out', fill: 'forwards' }
            );

                const removeCard = () => {
                    card.removeEventListener('animationend', removeCard);
                    if (card.parentElement){
                        card.remove();
                    }
                    card.addEventListener('animationend', removeCard);
                    setTimeout(() => {
                        if(card.parentElement){
                            card.remove();
                        }
                    }, 800);                
                };
            }else {
                card.style.transform = '';

            }
            currentX = 0;
        };
        card.addEventListener('pointerdown', registeredSwipe);
        });
}
