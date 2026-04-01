document.addEventListener('DOMContentLoaded', () => {
    // Inject HTML if not present (to make it easy to add to all pages)
    if (!document.getElementById('terminal-overlay')) {
        const termHTML = `
        <div id="terminal-overlay">
            <canvas id="matrix-canvas"></canvas>
            <div class="terminal-header">
                <span>hindley.tech - terminal</span>
                <span>[~] to toggle</span>
            </div>
            <div class="terminal-body" id="terminal-body">
                <div class="terminal-output" id="terminal-output">
                    <div class="out-info">Welcome to HindleyOS v2.0. Type 'help' for commands.</div>
                    <div class="out-info">Try 'neofetch', 'hack', or 'theme retro'!</div>
                </div>
                <div class="terminal-input-line">
                    <span class="prompt">visitor@hindley.tech:~$</span>
                    <input type="text" id="terminal-input" autocomplete="off" spellcheck="false" />
                </div>
            </div>
        </div>`;
        document.body.insertAdjacentHTML('beforeend', termHTML);
    }

    const term = document.getElementById('terminal-overlay');
    const input = document.getElementById('terminal-input');
    const output = document.getElementById('terminal-output');
    const body = document.getElementById('terminal-body');
    const matrixCanvas = document.getElementById('matrix-canvas');

    let isOpen = false;
    let matrixInterval = null;

    // Toggle logic
    function toggleTerminal() {
        isOpen = !isOpen;
        if (isOpen) {
            term.classList.add('open');
            input.focus();
        } else {
            term.classList.remove('open');
            input.blur();
        }
    }

    // Key listener for ~ (Backtick)
    document.addEventListener('keydown', (e) => {
        // Tilde/Backtick is usually the same key
        if (e.key === '`' || e.key === '~') {
            e.preventDefault();
            toggleTerminal();
        }
        // Esc to close
        if (e.key === 'Escape' && isOpen) {
            toggleTerminal();
        }
    });

    // Command History
    let history = [];
    let historyIndex = -1;

    // Command Handling
    input.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            const cmd = input.value.trim();
            if (cmd) {
                history.push(cmd);
                historyIndex = history.length;
                print(`visitor@hindley.tech:~$ ${cmd}`, 'out-cmd');
                processCommand(cmd);
            }
            input.value = '';
            scrollToBottom();
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            if (historyIndex > 0) {
                historyIndex--;
                input.value = history[historyIndex];
            }
        } else if (e.key === 'ArrowDown') {
            e.preventDefault();
            if (historyIndex < history.length - 1) {
                historyIndex++;
                input.value = history[historyIndex];
            } else {
                historyIndex = history.length;
                input.value = '';
            }
        }
    });

    function print(text, className = '') {
        const div = document.createElement('div');
        div.className = className;
        div.textContent = text;
        output.appendChild(div);
    }

    function scrollToBottom() {
        body.scrollTop = body.scrollHeight;
    }

    // File System Mock
    const fileSystem = {
        'about.txt': 'Jayden Hindley. Digital Solutions Analyst. Loves Linux, Automation, and Cybersec.',
        'contact.txt': 'Email: jayden@hindley.tech',
        'projects': '[DIR]',
        'skills': '[DIR]',
        'secret.txt': 'You found the easter egg! 🐰'
    };

    function processCommand(rawCmd) {
        const args = rawCmd.split(' ');
        const cmd = args[0].toLowerCase();
        const arg1 = args[1];

        switch (cmd) {
            case 'help':
                print('Available commands:');
                print('  help             - Show this help');
                print('  ls               - List directory contents');
                print('  cat [file]       - View file content');
                print('  cd [page]        - Navigate (home, about, projects...)');
                print('  neofetch         - System Information');
                print('  hack             - Initiate hacking sequence');
                print('  cowsay [txt]     - Moo.');
                print('  theme [style]    - Change colors (main, retro, cyber, matrix)');
                print('  clear            - Clear terminal');
                break;
            case 'ls':
                print(Object.keys(fileSystem).join('  '), 'out-info');
                break;
            case 'cat':
                if (!arg1) {
                    print('Usage: cat [filename]', 'out-warning');
                } else if (fileSystem[arg1]) {
                    if (fileSystem[arg1] === '[DIR]') {
                        print(`${arg1} is a directory.`, 'out-error');
                    } else {
                        print(fileSystem[arg1], 'out-success');
                    }
                } else {
                    print(`File not found: ${arg1}`, 'out-error');
                }
                break;
            case 'cd':
                if (!arg1) {
                    print('Usage: cd [page]', 'out-warning');
                    return;
                }
                const page = arg1.toLowerCase().replace('/', '');
                const routes = {
                    'home': '/',
                    'about': '/about',
                    'projects': '/project',
                    'skills': '/skills',
                    'contact': '/contact'
                };
                if(page === 'project') routes['project'] = '/project';

                if (routes[page]) {
                    print(`Navigating to ${page}...`, 'out-success');
                    setTimeout(() => window.location.href = routes[page], 800);
                } else {
                    print(`Directory not found: ${page}`, 'out-error');
                }
                break;
            case 'clear':
                output.innerHTML = '';
                break;
            case 'whoami':
                print('visitor', 'out-info');
                break;
            case 'date':
                print(new Date().toString());
                break;
            case 'matrix':
                toggleMatrix();
                break;
            case 'neofetch':
                const asciiArt = `
        .---.
       /     \\ 
      |   JH  |    OS: HindleyOS v2.0
      |       |    Host: hindley.tech using Browser
       \\     /     Kernel: Web / HTML5
        '---'      Uptime: ${Math.floor(performance.now() / 60000)} mins
                   Shell: ZSH (JS-Term)
                   Theme: ${document.documentElement.style.getPropertyValue('--term-color') || 'Default'}
`;
                print(asciiArt, 'out-info');
                break;
            case 'hack':
                runHackSequence();
                break;
            case 'cowsay':
                const msg = args.slice(1).join(' ') || "Moo.";
                const cow = `
  < ${msg} >
         \\   ^__^
          \\  (oo)\\_______
             (__)\\       )\\/\\
                 ||----w |
                 ||     ||
`;
                print(cow);
                break;
            case 'theme':
                if (!arg1) {
                    print('Usage: theme [main|retro|cyber|matrix]', 'out-warning');
                    return;
                }
                setTheme(arg1);
                break;
            case 'sudo':
                print('Permission denied: you are not in the sudoers file. This incident will be reported.', 'out-error');
                break;
            default:
                print(`Command not found: ${cmd}`, 'out-error');
        }
    }

    // --- Helper Functions ---

    function setTheme(name) {
        const root = document.documentElement;
        switch (name) {
            case 'retro': // Matrix Green
                root.style.setProperty('--term-color', '#22c55e');
                root.style.setProperty('--term-bg', 'rgba(10, 20, 10, 0.95)');
                print('Theme set to Retro.', 'out-success');
                break;
            case 'cyber': // Cyberpunk Blue/Pink
                root.style.setProperty('--term-color', '#06b6d4');
                root.style.setProperty('--term-bg', 'rgba(10, 10, 25, 0.95)');
                print('Theme set to Cyber.', 'out-info');
                break;
            case 'matrix': // Dark Green
                root.style.setProperty('--term-color', '#00ff00');
                root.style.setProperty('--term-bg', 'black');
                print('Follow the white rabbit.', 'out-success');
                break;
            default: // Main Purple
                root.style.setProperty('--term-color', '#8b5cf6');
                root.style.setProperty('--term-bg', 'rgba(10, 10, 15, 0.95)');
                print('Theme restored to Default.', 'out-cmd');
        }
    }

    function runHackSequence() {
        const steps = [
            { text: 'Initiating handshake...', time: 500, type: 'out-cmd' },
            { text: 'Connecting to server (Port 443)...', time: 1200, type: 'out-cmd' },
            { text: 'Bypassing firewall...', time: 2500, type: 'out-warning' },
            { text: 'Brute-forcing admin credentials...', time: 3800, type: 'out-warning' },
            { text: 'Access Granted.', time: 5000, type: 'out-success' },
            { text: 'Downloading sensitive_data.zip (1.2GB)...', time: 6000, type: 'out-info' },
            { text: 'Download Complete.', time: 7500, type: 'out-success' }
        ];

        steps.forEach(step => {
            setTimeout(() => {
                print(step.text, step.type);
                scrollToBottom();
            }, step.time);
        });
    }

    // Matrix Effect
    function toggleMatrix() {
        if (matrixInterval) {
            clearInterval(matrixInterval);
            matrixCanvas.style.display = 'none';
            matrixInterval = null;
            print('Matrix disabled.', 'out-info');
        } else {
            matrixCanvas.style.display = 'block';
            print('Matrix enabled. Follow the white rabbit.', 'out-success');
            startMatrix();
        }
    }

    function startMatrix() {
        const ctx = matrixCanvas.getContext('2d');
        matrixCanvas.width = window.innerWidth;
        matrixCanvas.height = window.innerHeight;

        const katakana = 'アァカサタナハマヤャラワガザダバパイィキシチニヒミリヰギジヂビピウゥクスツヌフムユュルグズブヅプエェケセテネヘメレヱゲゼデベペオォコソトノホモヨョロヲゴゾドボポヴッン';
        const latin = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        const nums = '0123456789';
        const alphabet = katakana + latin + nums;

        const fontSize = 16;
        const columns = matrixCanvas.width / fontSize;
        const drops = [];

        for (let x = 0; x < columns; x++) {
            drops[x] = 1;
        }

        const draw = () => {
            ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
            ctx.fillRect(0, 0, matrixCanvas.width, matrixCanvas.height);

            ctx.fillStyle = '#0F0';
            ctx.font = fontSize + 'px monospace';

            for (let i = 0; i < drops.length; i++) {
                const text = alphabet.charAt(Math.floor(Math.random() * alphabet.length));
                ctx.fillText(text, i * fontSize, drops[i] * fontSize);

                if (drops[i] * fontSize > matrixCanvas.height && Math.random() > 0.975) {
                    drops[i] = 0;
                }
                drops[i]++;
            }
        };
        matrixInterval = setInterval(draw, 30);
    }
});
