document.addEventListener('DOMContentLoaded', () => {
    async function loadComponent(placeholderId, filePath) {
        try {
            const response = await fetch(filePath);
            if (!response.ok) {
                throw new Error(`Erro ao carregar o componente ${filePath}: ${response.statusText}`);
            }
            const html = await response.text();
            document.getElementById(placeholderId).innerHTML = html;
        } catch (error) {
            console.error(error);
        }
    }

    loadComponent('header-placeholder', 'header.html')
        .then(() => {
            const themeToggle = document.getElementById('theme-toggle');
            const body = document.body;

            const currentTheme = localStorage.getItem('theme');
            if (currentTheme) {
                body.classList.add(currentTheme);
            } else {
                body.classList.add('light-mode');
            }

            if (themeToggle) {
                themeToggle.addEventListener('click', () => {
                    if (body.classList.contains('dark-mode')) {
                        body.classList.remove('dark-mode');
                        body.classList.add('light-mode');
                        localStorage.setItem('theme', 'light-mode');
                    } else {
                        body.classList.remove('light-mode');
                        body.classList.add('dark-mode');
                        localStorage.setItem('theme', 'dark-mode');
                    }
                });
            }

            document.querySelectorAll('a[href^="#"]').forEach(anchor => {
                anchor.addEventListener('click', function (e) {
                    e.preventDefault();
                    const targetId = this.getAttribute('href').substring(1);
                    const targetElement = document.getElementById(targetId);
                    if (targetElement) {
                        window.scrollTo({
                            top: targetElement.offsetTop - (document.querySelector('header').offsetHeight + 20),
                            behavior: 'smooth'
                        });
                    }
                });
            });
        })
        .catch(error => console.error("Falha ao configurar funcionalidades do cabeçalho:", error));

    loadComponent('footer-placeholder', 'footer.html')
        .catch(error => console.error("Falha ao carregar o rodapé:", error));

    const contactFormDedicated = document.getElementById('contactFormDedicated');
    const formMessageDedicated = document.getElementById('form-message-dedicated');

    const validateForm = (form, messageElement) => {
        const nameInput = form.querySelector('input[type="text"][name^="name"]');
        const emailInput = form.querySelector('input[type="email"][name^="email"]');
        const messageInput = form.querySelector('textarea[name^="message"]');
        const subjectInput = form.querySelector('input[type="text"][name^="subject"]');

        if (!nameInput || !emailInput || !messageInput) {
            console.error("Um ou mais campos essenciais do formulário não foram encontrados.");
            return false;
        }

        let isValid = true;
        let errors = [];

        if (nameInput.value.trim() === '') {
            errors.push('O campo Nome é obrigatório.');
            isValid = false;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (emailInput.value.trim() === '') {
            errors.push('O campo Email é obrigatório.');
            isValid = false;
        } else if (!emailRegex.test(emailInput.value.trim())) {
            errors.push('Por favor, insira um email válido.');
            isValid = false;
        }

        if (messageInput.value.trim() === '') {
            errors.push('O campo Mensagem é obrigatório.');
            isValid = false;
        } else if (messageInput.value.trim().length < 10) {
            errors.push('A mensagem deve ter pelo menos 10 caracteres.');
            isValid = false;
        }

        if (isValid) {
            messageElement.textContent = 'Mensagem enviada com sucesso! Em breve entraremos em contato.';
            messageElement.className = 'form-message success';
            form.reset();
        } else {
            messageElement.innerHTML = 'Por favor, corrija os seguintes erros:<br>' + errors.join('<br>');
            messageElement.className = 'form-message error';
        }
        messageElement.style.display = 'block';
        return isValid;
    };

    if (contactFormDedicated) {
        contactFormDedicated.addEventListener('submit', (event) => {
            event.preventDefault();
            validateForm(contactFormDedicated, formMessageDedicated);
        });
    }

    const scrollToTopButton = document.getElementById('scroll-to-top');

    if (scrollToTopButton) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 200) {
                scrollToTopButton.classList.add('show');
            } else {
                scrollToTopButton.classList.remove('show');
            }
        });

        scrollToTopButton.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    const linuxTips = [
        "Use `Ctrl+Alt+T` para abrir o terminal rapidamente na maioria das distribuições Linux.",
        "O comando `sudo apt update && sudo apt upgrade` atualiza sua lista de pacotes e instala as atualizações disponíveis no Debian/Ubuntu.",
        "Para listar arquivos e diretórios detalhadamente, use `ls -l`.",
        "Use `man [comando]` para ver o manual de qualquer comando Linux (ex: `man ls`).",
        "O comando `pwd` mostra o diretório de trabalho atual.",
        "Para criar um novo diretório, use `mkdir [nome_do_diretorio]`.",
        "Use `cp [origem] [destino]` para copiar arquivos ou diretórios.",
        "O comando `mv [origem] [destino]` move ou renomeia arquivos/diretórios.",
        "Com `rm -rf [diretorio]` você remove um diretório e seu conteúdo (cuidado, é irreversível!).",
        "O comando `df -h` mostra o uso de disco em formato legível.",
        "Use `free -h` para verificar o uso da memória RAM.",
        "O comando `top` exibe os processos em execução e o uso de recursos em tempo real.",
        "Para desligar o sistema imediatamente, use `sudo shutdown now` ou `sudo poweroff`."
    ];

    const tipBox = document.createElement('div');
    tipBox.id = 'linux-tip-box';
    document.body.appendChild(tipBox);

    let tipInterval;

    const showRandomTip = () => {
        const randomIndex = Math.floor(Math.random() * linuxTips.length);
        tipBox.innerHTML = `<strong>Dica Linux:</strong><br>${linuxTips[randomIndex]}<button id="close-tip">Fechar</button>`;
        tipBox.classList.add('show-tip');

        document.getElementById('close-tip').addEventListener('click', () => {
            tipBox.classList.remove('show-tip');
            clearInterval(tipInterval);
            setTimeout(startTipRotation, 30000);
        });
    };

    const startTipRotation = () => {
        showRandomTip();
        tipInterval = setInterval(showRandomTip, 45000);
    };

    setTimeout(startTipRotation, 5000);
});