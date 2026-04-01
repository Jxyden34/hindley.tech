/* konami.js */
document.addEventListener('DOMContentLoaded', () => {
    const konamiCode = [
        'ArrowUp', 'ArrowUp',
        'ArrowDown', 'ArrowDown',
        'ArrowLeft', 'ArrowRight',
        'ArrowLeft', 'ArrowRight',
        'b', 'a'
    ];
    
    let konamiIndex = 0;

    document.addEventListener('keydown', (e) => {
        // Check if key matches the current index in the sequence
        if (e.key.toLowerCase() === konamiCode[konamiIndex].toLowerCase() || e.key === konamiCode[konamiIndex]) {
            konamiIndex++;
            
            // If sequence is complete
            if (konamiIndex === konamiCode.length) {
                activatePartyMode();
                konamiIndex = 0; // Reset
            }
        } else {
            konamiIndex = 0; // Reset if mistake
        }
    });

    function activatePartyMode() {
        console.log("KONAMI CODE ACTIVATED!");
        
        // 1. Notify user via Terminal (if it exists)
        const terminalOutput = document.getElementById('terminal-output');
        if (terminalOutput) {
            const div = document.createElement('div');
            div.className = 'out-success';
            div.textContent = '*** GOD MODE ENABLED ***';
            terminalOutput.appendChild(div);
            // Open terminal momentarily
            document.getElementById('terminal-overlay').classList.add('open');
        }

        // 2. Enable Matrix Rain (if available)
        if (window.toggleMatrix) {
             // Force enable if not already
             const canvas = document.getElementById('matrix-canvas');
             if(canvas && canvas.style.display === 'none') {
                 // We need to call the function from terminal.js if accessible, 
                 // but since it's scoped, let's just simulate the command if possible or hack it visually.
                 // Actually, let's just inject a rave style.
             }
        }

        // 3. Cyberpunk Rave Theme
        document.documentElement.style.setProperty('--accent', '#ff00ff');
        document.documentElement.style.setProperty('--accent-2', '#00ffff');
        document.documentElement.style.setProperty('--bg-main', '#000000');
        
        // 4. Confetti (CSS Only version for simplicity)
        createConfetti();

        alert("Code Accepted. Welcome to the System.");
    }

    function createConfetti() {
        const colors = ['#f00', '#0f0', '#00f', '#ff0', '#f0f', '#0ff'];
        
        for(let i=0; i<50; i++) {
            const confetti = document.createElement('div');
            confetti.style.position = 'fixed';
            confetti.style.left = Math.random() * 100 + 'vw';
            confetti.style.top = '-10px';
            confetti.style.width = '10px';
            confetti.style.height = '10px';
            confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
            confetti.style.zIndex = '9999';
            confetti.style.transition = 'top 3s ease-in, transform 3s linear';
            
            document.body.appendChild(confetti);

            setTimeout(() => {
                confetti.style.top = '100vh';
                confetti.style.transform = `rotate(${Math.random() * 360}deg)`;
            }, 100);

            setTimeout(() => {
                confetti.remove();
            }, 3000);
        }
    }
});
