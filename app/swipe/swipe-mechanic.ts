export function createProfileCard(options: { title: string; age?: number; description: string; image: string }): HTMLElement {
    const card = document.createElement('div');
    card.className = 'profile-card';
    card.innerHTML = `
        <div class="overlay like">FAVORITE 💚</div>
        <div class="overlay nope">HELL NAH ❌</div>
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
    let currentIndex = 0;

    // Hide all cards except the first one
    profile.forEach((card, index) => {
        if (index === 0) {
            card.style.display = 'block';
            card.style.opacity = '1';
            card.style.transform = 'scale(1) translateY(0)';
        } else {
            card.style.display = 'none';
        }
    });

    function setUpProfileCard(card: HTMLElement) {
        let startX = 0;
        let currentX = 0;
        let startY = 0;
        let currentY = 0;
        let dragging = false;
        let startTime = 0;
        
        const favoriteOverlay = card.querySelector('.overlay.like') as HTMLElement;
        const hellNahOverlay = card.querySelector('.overlay.nope') as HTMLElement;

        const whenPointerIsDown = (event: PointerEvent) => {
            if (currentIndex >= profile.length) 
                return;
            
            dragging = true;
            startX = event.clientX;
            startY = event.clientY;
            startTime = Date.now();
            card.setPointerCapture(event.pointerId);
            card.style.transition = 'none';
        };

        const whenPointerMoves = (event: PointerEvent) => {
            if (!dragging)
                return;
            
            currentX = event.clientX - startX;
            currentY = event.clientY - startY;
            const rotation = currentX / 20;
            card.style.transform = `translate(${currentX}px, ${currentY}px) rotate(${rotation}deg)`;

            const opacity = Math.min(Math.abs(currentX) / 150, 1);
            if (currentX > 0) {
                favoriteOverlay.style.opacity = `${opacity}`;
                hellNahOverlay.style.opacity = '0';
            } else {
                hellNahOverlay.style.opacity = `${opacity}`;
                favoriteOverlay.style.opacity = '0';
            }
        };

        const whenPointerUp = (event: PointerEvent) => {
            if (!dragging)
                return;
            
            dragging = false;
            const moveX = event.clientX - startX;
            const moveY = event.clientY - startY;
            const timeTaken = Date.now() - startTime;
            const velocityX = moveX / timeTaken;
            
            card.releasePointerCapture(event.pointerId);

            favoriteOverlay.style.opacity = '0';
            hellNahOverlay.style.opacity = '0';

            // Check if swipe is significant enough
            if (Math.abs(moveX) > 150 || Math.abs(velocityX) > 0.5) {
                const direction = moveX > 0 ? 1 : -1;
                const endX = direction * (window.innerWidth + 200);
                const endY = moveY + (Math.random() * 100 - 50);
                const rotateEnd = direction * 45;

                card.style.transition = 'transform 0.9s cubic-bezier(0.23, 1, 0.32, 1)';
                card.style.transform = `translate(${endX}px, ${endY}px) rotate(${rotateEnd}deg)`; 
                
                if (direction > 0) console.log('💚 Liked');
                else console.log('❌ Nope');

                setTimeout(() => {
                    card.style.display = 'none';
                    currentIndex++;

                    const nextProfileCard = profile[currentIndex];
                    if (nextProfileCard) {
                        nextProfileCard.style.display = 'block';
                        nextProfileCard.style.opacity = '0';
                        nextProfileCard.style.transform = 'scale(0.8) translateY(50px)';
                        
                        // Animate in the next card
                        setTimeout(() => {
                            nextProfileCard.style.transition = 'all 0.4s ease-out';
                            nextProfileCard.style.opacity = '1';
                            nextProfileCard.style.transform = 'scale(1) translateY(0)';
                        }, 50);
                    }
                }, 700);
            } else {
                // Return card to original position
                card.style.transition = 'transform 0.6s ease-out';
                card.style.transform = '';
            }
        };

        card.addEventListener('pointerdown', whenPointerIsDown);
        card.addEventListener('pointermove', whenPointerMoves);
        card.addEventListener('pointerup', whenPointerUp);
    }

    profile.forEach(card => setUpProfileCard(card));
}