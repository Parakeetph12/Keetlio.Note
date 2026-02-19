function getUsers() {
    return JSON.parse(localStorage.getItem('codexUsers')) || [];
}

function saveUsers(users) {
    localStorage.setItem('codexUsers', JSON.stringify(users));
}

function getCurrentUser() {
    return localStorage.getItem('currentUser');
}

function getUserKey(key) {
    const user = getCurrentUser();
    return user ? `${key}_${user}` : key;
}

function loadUserList() {
    const userList = document.getElementById('user-list');
    if (!userList) return;
    userList.innerHTML = '';
    const users = getUsers();
    if (users.length === 0) {
        const li = document.createElement('li');
        li.textContent = 'Nenhum usuário cadastrado';
        li.style.color = '#888';
        li.style.cursor = 'default';
        li.style.justifyContent = 'flex-start';
        userList.appendChild(li);
        return;
    }
    users.forEach((user, index) => {
        const li = document.createElement('li');
        const userDiv = document.createElement('div');
        userDiv.className = 'user-item';
        const usernamSpan = document.createElement('span');
        usernamSpan.textContent = user.username;
        usernamSpan.style.cursor = 'pointer';
        usernamSpan.onclick = () => {
            document.getElementById('username').value = user.username;
            document.getElementById('password').focus();
        };
        const deleteBtn = document.createElement('button');
        deleteBtn.textContent = 'Deletar';
        deleteBtn.className = 'delete-user-btn';
        deleteBtn.onclick = (e) => {
            e.stopPropagation();
            abrirConfirmacaoDeletar(index, user.username);
        };
        userDiv.appendChild(usernamSpan);
        userDiv.appendChild(deleteBtn);
        li.appendChild(userDiv);
        userList.appendChild(li);
    });
}

function abrirConfirmacaoDeletar(index, username) {
    let modal = document.getElementById('confirmation-modal');
    if (!modal) {
        modal = document.createElement('div');
        modal.id = 'confirmation-modal';
        modal.className = 'confirmation-modal';
        document.body.appendChild(modal);
    }
    modal.innerHTML = `
        <div class="confirmation-content">
            <h3>Deletar Usuário</h3>
            <p>Tem certeza que deseja deletar o usuário <strong>"${username}"</strong>?</p>
            <p style="font-size: 12px; color: #ff6666;">Aviso: Todos os dados serão permanentemente removidos!</p>
            <div class="confirmation-buttons">
                <button class="confirm-delete" onclick="deletarUsuario(${index})">Deletar</button>
                <button class="cancel-delete" onclick="fecharConfirmacao()">Cancelar</button>
            </div>
        </div>
    `;
    modal.classList.add('active');
}

function fecharConfirmacao() {
    const modal = document.getElementById('confirmation-modal');
    if (modal) {
        modal.classList.remove('active');
    }
}

function deletarUsuario(index) {
    const users = getUsers();
    const usernameDeletado = users[index].username;
    localStorage.removeItem(`tarefasPermanentes_${usernameDeletado}`);
    localStorage.removeItem(`tarefasDiarias_${usernameDeletado}`);
    localStorage.removeItem(`notas_${usernameDeletado}`);
    localStorage.removeItem(`tarefasAdicionais_${usernameDeletado}`);
    localStorage.removeItem(`links_${usernameDeletado}`);
    localStorage.removeItem(`anotacoes_${usernameDeletado}`);
    localStorage.removeItem(`pontos_${usernameDeletado}`);
    localStorage.removeItem(`eventosCalendario_${usernameDeletado}`);
    localStorage.removeItem(`ultimaAtualizacao_${usernameDeletado}`);
    users.splice(index, 1);
    saveUsers(users);
    if (getCurrentUser() === usernameDeletado) {
        logout();
    }
    fecharConfirmacao();
    loadUserList();
    alert(`Usuário "${usernameDeletado}" deletado com sucesso!`);
}

function registerUser() {
    const username = document.getElementById('new-username')?.value.trim();
    const password = document.getElementById('new-password')?.value.trim();
    const registerError = document.getElementById('register-error');
    const registerSuccess = document.getElementById('register-success');
    if (!username || !password) {
        registerError.textContent = 'Usuário e senha são obrigatórios';
        registerError.style.display = 'block';
        return;
    }
    if (password.length < 4) {
        registerError.textContent = 'A senha deve ter pelo menos 4 caracteres';
        registerError.style.display = 'block';
        return;
    }
    const users = getUsers();
    if (users.some(u => u.username === username)) {
        registerError.textContent = 'Usuário já existe';
        registerError.style.display = 'block';
        return;
    }
    users.push({ username, password });
    saveUsers(users);
    localStorage.setItem(`tarefasPermanentes_${username}`, JSON.stringify([]));
    localStorage.setItem(`tarefasDiarias_${username}`, JSON.stringify([]));
    localStorage.setItem(`notas_${username}`, JSON.stringify([]));
    localStorage.setItem(`tarefasAdicionais_${username}`, JSON.stringify([]));
    localStorage.setItem(`links_${username}`, JSON.stringify([]));
    localStorage.setItem(`anotacoes_${username}`, JSON.stringify([]));
    localStorage.setItem(`pontos_${username}`, '0');
    document.getElementById('new-username').value = '';
    document.getElementById('new-password').value = '';
    registerSuccess.style.display = 'block';
    setTimeout(() => registerSuccess.style.display = 'none', 2000);
    loadUserList();
}

function checkAuthState() {
    const currentUser = getCurrentUser();
    const loginContainer = document.getElementById('login-container');
    const mainSections = document.querySelector('.main-sections');
    const drawerContainer = document.querySelector('.drawer-container');
    const nav = document.querySelector('nav');
    if (currentUser) {
        if (loginContainer) loginContainer.style.display = 'none';
        if (mainSections) mainSections.style.display = 'flex';
        if (drawerContainer) drawerContainer.style.display = 'block';
        if (nav) nav.style.display = 'flex';
        loadAll();
    } else {
        if (loginContainer) loginContainer.style.display = 'block';
        if (mainSections) mainSections.style.display = 'none';
        if (drawerContainer) drawerContainer.style.display = 'none';
        if (nav) nav.style.display = 'none';
    }
}

function checkPageAuth() {
    const currentUser = getCurrentUser();
    const isLoginPage = window.location.pathname.endsWith('login.html');
    if (!currentUser && !isLoginPage) {
        window.location.href = 'login.html';
        return false;
    }
    if (currentUser && isLoginPage) {
        window.location.href = 'index.html';
        return false;
    }
    if (!isLoginPage) {
        checkAuthState();
    }
    return true;
}

function login() {
    const username = document.getElementById('username')?.value.trim();
    const password = document.getElementById('password')?.value.trim();
    const loginError = document.getElementById('login-error');
    loginError.style.display = 'none';
    const users = getUsers();
    const user = users.find(u => u.username === username && u.password === password);
    if (user) {
        localStorage.setItem('currentUser', username);
        if (window.location.pathname.endsWith('login.html')) {
            window.location.href = 'index.html';
        } else {
            checkAuthState();
        }
    } else {
        loginError.style.display = 'block';
    }
}

function logout() {
    localStorage.removeItem('currentUser');
    checkAuthState();
    if (!document.getElementById('login-container')) {
        window.location.href = 'login.html';
    }
}

function carregarTarefasDiarias() {
    const hoje = new Date().toLocaleDateString();
    const user = getCurrentUser();
    const ultimaAtualizacao = localStorage.getItem(getUserKey('ultimaAtualizacao'));
    const tarefasPermanentes = JSON.parse(localStorage.getItem(getUserKey('tarefasPermanentes'))) || [];
    if (ultimaAtualizacao !== hoje) {
        const tarefas = tarefasPermanentes.map(tarefa => ({
            tarefa,
            concluida: false
        }));
        localStorage.setItem(getUserKey('tarefasDiarias'), JSON.stringify(tarefas));
        localStorage.setItem(getUserKey('ultimaAtualizacao'), hoje);
    }
    const tarefas = JSON.parse(localStorage.getItem(getUserKey('tarefasDiarias'))) || [];
    const lista = document.getElementById('tarefas-diarias');
    lista.innerHTML = '';
    tarefas.forEach((item, index) => {
        const li = document.createElement('li');
        li.style.display = 'flex';
        li.style.alignItems = 'center';
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.checked = item.concluida;
        checkbox.style.marginRight = '10px';
        checkbox.addEventListener('change', () => marcarTarefa(index));
        const texto = document.createElement('span');
        texto.textContent = item.tarefa;
        texto.style.textDecoration = item.concluida ? 'line-through' : 'none';
        li.appendChild(checkbox);
        li.appendChild(texto);
        lista.appendChild(li);
    });
}

function marcarTarefa(index) {
    const tarefas = JSON.parse(localStorage.getItem(getUserKey('tarefasDiarias'))) || [];
    if (!tarefas[index].concluida) {
        tarefas[index].concluida = true;
        const pontosAtuais = parseInt(localStorage.getItem(getUserKey('pontos')) || '0');
        localStorage.setItem(getUserKey('pontos'), pontosAtuais + 10);
    }
    localStorage.setItem(getUserKey('tarefasDiarias'), JSON.stringify(tarefas));
    carregarTarefasDiarias();
    atualizarPontos();
}
function adicionarTarefaDiaria() {
    const novaTarefa = document.getElementById('nova-tarefa-diaria')?.value.trim();
    if (novaTarefa !== '') {
        const tarefasPermanentes = JSON.parse(localStorage.getItem(getUserKey('tarefasPermanentes'))) || [];
        if (!tarefasPermanentes.includes(novaTarefa)) {
            tarefasPermanentes.push(novaTarefa);
            localStorage.setItem(getUserKey('tarefasPermanentes'), JSON.stringify(tarefasPermanentes));
        }
        const tarefas = JSON.parse(localStorage.getItem(getUserKey('tarefasDiarias'))) || [];
        if (!tarefas.some(t => t.tarefa === novaTarefa)) {
            tarefas.push({ tarefa: novaTarefa, concluida: false });
            localStorage.setItem(getUserKey('tarefasDiarias'), JSON.stringify(tarefas));
        }
        carregarTarefasDiarias();
        document.getElementById('nova-tarefa-diaria').value = '';
        mostrarGerenciarTarefas();
    }
}

function mostrarGerenciarTarefas() {
    const gerenciarSection = document.getElementById('gerenciar-tarefas');
    const listaGerenciar = document.getElementById('lista-tarefas-gerenciar');
    listaGerenciar.innerHTML = '';
    const tarefasPermanentes = JSON.parse(localStorage.getItem(getUserKey('tarefasPermanentes'))) || [];
    if (tarefasPermanentes.length === 0) {
        const li = document.createElement('li');
        li.textContent = 'Nenhuma tarefa permanente cadastrada';
        li.style.color = '#888';
        listaGerenciar.appendChild(li);
    } else {
        tarefasPermanentes.forEach((tarefa, index) => {
            const li = document.createElement('li');
            const span = document.createElement('span');
            span.textContent = tarefa;
            const botaoExcluir = document.createElement('button');
            botaoExcluir.textContent = 'Remover';
            botaoExcluir.onclick = () => removerTarefaPermanente(index);
            li.appendChild(span);
            li.appendChild(botaoExcluir);
            listaGerenciar.appendChild(li);
        });
    }
    gerenciarSection.style.display = gerenciarSection.style.display === 'none' ? 'block' : 'none';
}

function removerTarefaPermanente(index) {
    const tarefasPermanentes = JSON.parse(localStorage.getItem(getUserKey('tarefasPermanentes'))) || [];
    const tarefaRemovida = tarefasPermanentes.splice(index, 1)[0];
    localStorage.setItem(getUserKey('tarefasPermanentes'), JSON.stringify(tarefasPermanentes));
    const tarefasDiarias = JSON.parse(localStorage.getItem(getUserKey('tarefasDiarias'))) || [];
    const indexDiaria = tarefasDiarias.findIndex(t => t.tarefa === tarefaRemovida);
    if (indexDiaria !== -1) {
        tarefasDiarias.splice(indexDiaria, 1);
        localStorage.setItem(getUserKey('tarefasDiarias'), JSON.stringify(tarefasDiarias));
    }
    mostrarGerenciarTarefas();
    carregarTarefasDiarias();
}

function carregarDados() {
    const notas = JSON.parse(localStorage.getItem(getUserKey('notas')) || '[]');
    const tarefasAdicionais = JSON.parse(localStorage.getItem(getUserKey('tarefasAdicionais')) || '[]');
    const links = JSON.parse(localStorage.getItem(getUserKey('links')) || '[]');
    const listaNotas = document.getElementById('lista-notas');
    const listaTarefasAdicionais = document.getElementById('lista-tarefas-adicionais');
    const listaLinks = document.getElementById('lista-links');
    listaNotas.innerHTML = '';
    listaTarefasAdicionais.innerHTML = '';
    listaLinks.innerHTML = '';
    notas.forEach((nota, index) => {
        const item = criarItemComBotao(nota, index, 'notas');
        listaNotas.appendChild(item);
    });
    tarefasAdicionais.forEach((tarefa, index) => {
        const item = criarItemComBotao(tarefa, index, 'tarefasAdicionais');
        listaTarefasAdicionais.appendChild(item);
    });
    links.forEach((link, index) => {
        const item = criarItemComBotao(link, index, 'links', true);
        listaLinks.appendChild(item);
    });
}

function criarItemComBotao(conteudo, index, tipo, isLink = false) {
    const item = document.createElement('li');
    if (isLink) {
        const anchor = document.createElement('a');
        anchor.href = conteudo;
        anchor.textContent = conteudo;
        anchor.target = '_blank';
        item.appendChild(anchor);
    } else {
        item.textContent = conteudo;
    }
    const botaoExcluir = document.createElement('button');
    botaoExcluir.textContent = 'Excluir';
    botaoExcluir.style.marginLeft = '10px';
    botaoExcluir.onclick = () => excluirItem(index, tipo);
    item.appendChild(botaoExcluir);
    return item;
}

function excluirItem(index, tipo) {
    const dados = JSON.parse(localStorage.getItem(getUserKey(tipo)) || '[]');
    dados.splice(index, 1);
    localStorage.setItem(getUserKey(tipo), JSON.stringify(dados));
    if (tipo === 'tarefasAdicionais') {
        const pontosAtuais = parseInt(localStorage.getItem(getUserKey('pontos')));
        localStorage.setItem(getUserKey('pontos'), pontosAtuais + 5);
        atualizarPontos();
    }
    atualizarLista(tipo);
}

function atualizarLista(tipo) {
    let lista;
    if (tipo === 'notas') {
        lista = document.getElementById('lista-notas');
    } else if (tipo === 'tarefasAdicionais') {
        lista = document.getElementById('lista-tarefas-adicionais');
    } else if (tipo === 'links') {
        lista = document.getElementById('lista-links');
    } else {
        return;
    }
    lista.innerHTML = '';
    const dados = JSON.parse(localStorage.getItem(getUserKey(tipo)) || '[]');
    dados.forEach((conteudo, index) => {
        const item = criarItemComBotao(conteudo, index, tipo, tipo === 'links');
        lista.appendChild(item);
    });
}

function adicionarNota(val) {
    const nota = (val !== undefined ? val : document.getElementById('nova-nota')?.value).trim();
    if (nota !== '') {
        const notas = JSON.parse(localStorage.getItem(getUserKey('notas')) || '[]');
        notas.push(nota);
        localStorage.setItem(getUserKey('notas'), JSON.stringify(notas));
        atualizarLista('notas');
        if (val === undefined) document.getElementById('nova-nota').value = '';
    }
}

function adicionarTarefaAdicional(val) {
    const tarefa = (val !== undefined ? val : document.getElementById('nova-tarefa-adicional')?.value).trim();
    if (tarefa !== '') {
        const tarefasAdicionais = JSON.parse(localStorage.getItem(getUserKey('tarefasAdicionais')) || '[]');
        tarefasAdicionais.push(tarefa);
        localStorage.setItem(getUserKey('tarefasAdicionais'), JSON.stringify(tarefasAdicionais));
        atualizarLista('tarefasAdicionais');
        if (val === undefined) document.getElementById('nova-tarefa-adicional').value = '';
    }
}

function adicionarLink(val) {
    const link = (val !== undefined ? val : document.getElementById('novo-link')?.value).trim();
    if (link !== '') {
        const links = JSON.parse(localStorage.getItem(getUserKey('links')) || '[]');
        links.push(link);
        localStorage.setItem(getUserKey('links'), JSON.stringify(links));
        atualizarLista('links');
        if (val === undefined) document.getElementById('novo-link').value = '';
    }
}

function openAddModal(tipo) {
    let modal = document.getElementById('add-modal');
    if (!modal) {
        modal = document.createElement('div');
        modal.id = 'add-modal';
        modal.className = 'modal';
        document.body.appendChild(modal);
    }
    let placeholder = '';
    switch (tipo) {
        case 'tarefasDiarias': placeholder = 'Nova tarefa diária'; break;
        case 'notas': placeholder = 'Nova nota'; break;
        case 'tarefasAdicionais': placeholder = 'Nova tarefa adicional'; break;
        case 'links': placeholder = 'Novo link'; break;
        default: placeholder = '';
    }
    modal.innerHTML = `
        <div class="modal-content">
            <h3>Adicionar ${tipo === 'notas' ? 'Nota' : tipo === 'links' ? 'Link' : 'Tarefa'}</h3>
            <input type="text" id="add-input" placeholder="${placeholder}">
            <div class="drawer-buttons">
                <button onclick="confirmAdd('${tipo}')">Adicionar</button>
                <button onclick="closeAddModal()">Cancelar</button>
            </div>
        </div>
    `;
    modal.style.display = 'flex';
}

function closeAddModal() {
    const modal = document.getElementById('add-modal');
    if (modal) modal.style.display = 'none';
}

function confirmAdd(tipo) {
    const valor = document.getElementById('add-input').value.trim();
    if (!valor) return;
    switch (tipo) {
        case 'tarefasDiarias': adicionarTarefaDiaria(valor); break;
        case 'notas': adicionarNota(valor); break;
        case 'tarefasAdicionais': adicionarTarefaAdicional(valor); break;
        case 'links': adicionarLink(valor); break;
    }
    closeAddModal();
}

function getEventosKey() {
    return getUserKey('eventosCalendario');
}

function carregarEventosDoDia(data, container) {
    const eventos = JSON.parse(localStorage.getItem(getEventosKey())) || {};
    const eventosDoDia = eventos[data] || [];
    container.innerHTML = '';
    if (eventosDoDia.length > 0) {
        const eventIndicator = document.createElement('div');
        eventIndicator.className = 'event-indicator';
        eventIndicator.textContent = `${eventosDoDia.length} evento(s)`;
        eventIndicator.title = eventosDoDia.join(', ');
        container.appendChild(eventIndicator);
    }
}

function abrirModalEventos(dataCompleta, dia, mes, ano) {
    const eventos = JSON.parse(localStorage.getItem(getEventosKey())) || {};
    const eventosDoDia = eventos[dataCompleta] || [];
    let modal = document.getElementById('eventos-modal');
    if (!modal) {
        modal = document.createElement('div');
        modal.id = 'eventos-modal';
        modal.className = 'modal';
        document.body.appendChild(modal);
    }
    modal.innerHTML = `
        <div class="modal-content">
            <h3>Eventos - ${dia}/${mes + 1}/${ano}</h3>
            <div id="lista-eventos">
                ${eventosDoDia.map((evento, index) => `
                    <div class="evento-item">
                        <span>${evento}</span>
                        <button onclick="removerEvento('${dataCompleta}', ${index})">X</button>
                    </div>
                `).join('')}
                ${eventosDoDia.length === 0 ? '<p>Nenhum evento</p>' : ''}
            </div>
            <div class="novo-evento">
                <input type="text" id="novo-evento-texto" placeholder="Novo evento...">
                <button onclick="adicionarEvento('${dataCompleta}')">Adicionar</button>
            </div>
            <button onclick="fecharModal()">Fechar</button>
        </div>
    `;
    modal.style.display = 'block';
}

function adicionarEvento(data) {
    const texto = document.getElementById('novo-evento-texto').value.trim();
    if (!texto) return;
    const eventos = JSON.parse(localStorage.getItem(getEventosKey())) || {};
    if (!eventos[data]) {
        eventos[data] = [];
    }
    eventos[data].push(texto);
    localStorage.setItem(getEventosKey(), JSON.stringify(eventos));
    generateCalendar();
    abrirModalEventos(
        data, 
        parseInt(data.split('-')[2]),
        parseInt(data.split('-')[1]) - 1,
        parseInt(data.split('-')[0])
    );
}

function removerEvento(data, index) {
    const eventos = JSON.parse(localStorage.getItem(getEventosKey())) || {};
    if (eventos[data]) {
        eventos[data].splice(index, 1);
        if (eventos[data].length === 0) {
            delete eventos[data];
        }
        localStorage.setItem(getEventosKey(), JSON.stringify(eventos));
        generateCalendar();
        abrirModalEventos(
            data,
            parseInt(data.split('-')[2]),
            parseInt(data.split('-')[1]) - 1,
            parseInt(data.split('-')[0])
        );
    }
}

function fecharModal() {
    const modal = document.getElementById('eventos-modal');
    if (modal) {
        modal.style.display = 'none';
    }
}

function toggleDrawer() {
    const drawerContent = document.getElementById('drawer-content');
    const drawerArrow = document.getElementById('drawer-arrow');
    drawerContent.classList.toggle('active');
    drawerArrow.textContent = drawerContent.classList.contains('active') ? '▲' : '▼';
    if (drawerContent.classList.contains('active')) {
        ajustarTamanhoTela();
    }
}

let currentDate = new Date();
let currentMonth = currentDate.getMonth();
let currentYear = currentDate.getFullYear();

function generateCalendar() {
    const calendar = document.getElementById('calendar');
    const monthYear = document.getElementById('calendar-month-year');
    if (!calendar || !monthYear) return;
    calendar.innerHTML = '';
    const monthNames = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];
    monthYear.textContent = `${monthNames[currentMonth]} ${currentYear}`;
    const daysOfWeek = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
    daysOfWeek.forEach(day => {
        const header = document.createElement('div');
        header.className = 'calendar-header';
        header.textContent = day;
        calendar.appendChild(header);
    });
    const firstDay = new Date(currentYear, currentMonth, 1).getDay();
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    for (let i = 0; i < firstDay; i++) {
        const emptyDay = document.createElement('div');
        emptyDay.className = 'calendar-day empty';
        calendar.appendChild(emptyDay);
    }
    for (let day = 1; day <= daysInMonth; day++) {
        const dayElement = document.createElement('div');
        dayElement.className = 'calendar-day';
        const fullDate = `${currentYear}-${(currentMonth + 1).toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
        dayElement.setAttribute('data-date', fullDate);
        const dayNumber = document.createElement('div');
        dayNumber.className = 'day-number';
        dayNumber.textContent = day;
        dayElement.appendChild(dayNumber);
        const eventsContainer = document.createElement('div');
        eventsContainer.className = 'day-events';
        dayElement.appendChild(eventsContainer);
        carregarEventosDoDia(fullDate, eventsContainer);
        const today = new Date();
        if (day === today.getDate() && currentMonth === today.getMonth() && currentYear === today.getFullYear()) {
            dayElement.classList.add('current');
        }
        dayElement.onclick = () => abrirModalEventos(fullDate, day, currentMonth, currentYear);
        calendar.appendChild(dayElement);
    }
}

function previousMonth() {
    currentMonth--;
    if (currentMonth < 0) {
        currentMonth = 11;
        currentYear--;
    }
    generateCalendar();
}

function nextMonth() {
    currentMonth++;
    if (currentMonth > 11) {
        currentMonth = 0;
        currentYear++;
    }
    generateCalendar();
}

function ajustarTamanhoTela() {
    const largura = Math.min(parseInt(document.getElementById('largura-tela')?.value) || 800, 2000);
    const altura = Math.min(parseInt(document.getElementById('altura-tela')?.value) || 500, 1000);
    const calendar = document.getElementById('calendar');
    if (calendar) {
        calendar.style.width = largura + 'px';
        calendar.style.height = altura + 'px';
        generateCalendar();
    }
}

function atualizarPontos() {
    const pontos = localStorage.getItem(getUserKey('pontos')) || '0';
    const pontosElement = document.getElementById('pontos');
    if (pontosElement) {
        pontosElement.textContent = `Pontos: ${pontos}`;
    }
}

const canvas = document.getElementById('whiteboard');
const ctx = canvas ? canvas.getContext('2d') : null;
let desenhando = false;
let tamanhoTraco = 2;
let corDesenho = '#000000';
let modoBorracha = false;

function inicializarCanvas() {
    if (!canvas || !ctx) {
        console.error('Canvas ou contexto não encontrado');
        return;
    }
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
}

function setColor(cor) {
    corDesenho = cor;
    modoBorracha = false;
    if (ctx) {
        ctx.strokeStyle = cor;
        ctx.globalCompositeOperation = 'source-over';
    }
}

function setEraser() {
    modoBorracha = true;
    if (ctx) {
        ctx.strokeStyle = '#ffffff';
        ctx.globalCompositeOperation = 'source-over';
    }
}

function clearCanvas() {
    if (ctx) {
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
    }
}

function resizeCanvas() {
    if (!canvas || !ctx) return;
    const largura = Math.min(parseInt(document.getElementById('canvas-width')?.value) || 1200, 2000);
    const altura = Math.min(parseInt(document.getElementById('canvas-height')?.value) || 800, 1500);
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    canvas.style.width = largura + 'px';
    canvas.style.height = altura + 'px';
    canvas.width = largura;
    canvas.height = altura;
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.putImageData(imageData, 0, 0);
}

if (canvas) {
    document.getElementById('tamanho-traco')?.addEventListener('input', (e) => {
        tamanhoTraco = parseInt(e.target.value);
    });
    canvas.addEventListener('mousedown', (e) => {
        if (e.button !== 0) return;
        desenhando = true;
        ctx.beginPath();
        ctx.moveTo(e.offsetX, e.offsetY);
    });
    canvas.addEventListener('mousemove', (e) => {
        if (desenhando) {
            ctx.lineTo(e.offsetX, e.offsetY);
            ctx.strokeStyle = modoBorracha ? '#ffffff' : corDesenho;
            ctx.lineWidth = tamanhoTraco;
            ctx.lineCap = 'round';
            ctx.stroke();
        }
    });
    canvas.addEventListener('mouseup', () => {
        desenhando = false;
    });
    canvas.addEventListener('mouseout', () => {
        desenhando = false;
    });
    inicializarCanvas();
}

function carregarAnotacoes() {
    const lista = document.getElementById('lista-anotacoes');
    if (!lista) return;
    lista.innerHTML = '';
    const anotacoes = JSON.parse(localStorage.getItem(getUserKey('anotacoes')) || '[]');
    anotacoes.forEach((anotacao, index) => {
        const li = document.createElement('li');
        li.style.marginBottom = '15px';
        li.style.padding = '10px';
        li.style.border = '1px solid #0066ff';
        li.style.borderRadius = '5px';
        const titulo = document.createElement('h4');
        titulo.textContent = anotacao.titulo || 'Sem título';
        titulo.style.margin = '0 0 5px 0';
        titulo.style.color = '#0066ff';
        const texto = document.createElement('p');
        texto.textContent = anotacao.texto || anotacao;
        texto.style.margin = '0 0 5px 0';
        texto.style.color = '#ffffff';
        const data = document.createElement('small');
        data.textContent = anotacao.data ? `Criado em: ${anotacao.data}` : '';
        data.style.color = '#888';
        const botaoExcluir = document.createElement('button');
        botaoExcluir.textContent = 'Excluir';
        botaoExcluir.style.marginLeft = '10px';
        botaoExcluir.onclick = () => excluirAnotacao(index);
        li.appendChild(titulo);
        li.appendChild(texto);
        li.appendChild(data);
        li.appendChild(botaoExcluir);
        lista.appendChild(li);
    });
}

function salvarAnotacao() {
    const titulo = document.getElementById('diario-titulo')?.value.trim();
    const texto = document.getElementById('diario-texto')?.value.trim();
    if (texto) {
        const anotacoes = JSON.parse(localStorage.getItem(getUserKey('anotacoes')) || '[]');
        anotacoes.push({
            titulo: titulo || 'Sem título',
            texto: texto,
            data: new Date().toLocaleDateString('pt-BR')
        });
        localStorage.setItem(getUserKey('anotacoes'), JSON.stringify(anotacoes));
        document.getElementById('diario-titulo').value = '';
        document.getElementById('diario-texto').value = '';
        carregarAnotacoes();
    }
}

function excluirAnotacao(index) {
    const anotacoes = JSON.parse(localStorage.getItem(getUserKey('anotacoes')) || '[]');
    anotacoes.splice(index, 1);
    localStorage.setItem(getUserKey('anotacoes'), JSON.stringify(anotacoes));
    carregarAnotacoes();
}

function submitContactForm() {
    const name = document.getElementById('contact-name')?.value.trim();
    const email = document.getElementById('contact-email')?.value.trim();
    const message = document.getElementById('contact-message')?.value.trim();
    const error = document.getElementById('contact-error');
    const success = document.getElementById('contact-success');
    error.style.display = 'none';
    success.style.display = 'none';
    if (!name || !email || !message) {
        error.textContent = 'Preencha todos os campos.';
        error.style.display = 'block';
        return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        error.textContent = 'E-mail inválido.';
        error.style.display = 'block';
        return;
    }
    success.style.display = 'block';
    setTimeout(() => success.style.display = 'none', 2000);
    document.getElementById('contact-name').value = '';
    document.getElementById('contact-email').value = '';
    document.getElementById('contact-message').value = '';
}

function initWhiteboard() {
    if (canvas && ctx) {
        inicializarCanvas();
    }
}

function exportarDados() {
    const currentUser = getCurrentUser();
    if (!currentUser) {
        alert('Faça login para exportar seus dados.');
        return;
    }
    const dadosParaExportar = {
        usuario: currentUser,
        dataExportacao: new Date().toISOString(),
        tarefasPermanentes: JSON.parse(localStorage.getItem(`tarefasPermanentes_${currentUser}`) || '[]'),
        tarefasDiarias: JSON.parse(localStorage.getItem(`tarefasDiarias_${currentUser}`) || '[]'),
        notas: JSON.parse(localStorage.getItem(`notas_${currentUser}`) || '[]'),
        tarefasAdicionais: JSON.parse(localStorage.getItem(`tarefasAdicionais_${currentUser}`) || '[]'),
        links: JSON.parse(localStorage.getItem(`links_${currentUser}`) || '[]'),
        anotacoes: JSON.parse(localStorage.getItem(`anotacoes_${currentUser}`) || '[]'),
        pontos: localStorage.getItem(`pontos_${currentUser}`) || '0',
        eventosCalendario: JSON.parse(localStorage.getItem(`eventosCalendario_${currentUser}`) || '{}')
    };
    const dadosJSON = JSON.stringify(dadosParaExportar, null, 2);
    const blob = new Blob([dadosJSON], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `codex-backup-${currentUser}-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    alert('Dados exportados com sucesso!');
}

function importarDados() {
    const fileInput = document.getElementById('import-file');
    fileInput.click();
    fileInput.onchange = function(e) {
        const file = e.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = function(event) {
            try {
                const dadosImportados = JSON.parse(event.target.result);
                confirmarImportacao(dadosImportados);
            } catch (error) {
                alert('Erro ao ler o arquivo. Certifique-se de que é um arquivo JSON válido.');
            }
        };
        reader.readAsText(file);
    };
}

function confirmarImportacao(dados) {
    const currentUser = getCurrentUser();
    if (!currentUser) {
        alert('Faça login para importar dados.');
        return;
    }
    if (confirm(`Importar dados de ${dados.usuario}?\nIsso substituirá seus dados atuais.`)) {
        if (!dados.usuario || !dados.dataExportacao) {
            alert('Arquivo inválido. Use um backup exportado do Codex.');
            return;
        }
        localStorage.setItem(`tarefasPermanentes_${currentUser}`, JSON.stringify(dados.tarefasPermanentes || []));
        localStorage.setItem(`tarefasDiarias_${currentUser}`, JSON.stringify(dados.tarefasDiarias || []));
        localStorage.setItem(`notas_${currentUser}`, JSON.stringify(dados.notas || []));
        localStorage.setItem(`tarefasAdicionais_${currentUser}`, JSON.stringify(dados.tarefasAdicionais || []));
        localStorage.setItem(`links_${currentUser}`, JSON.stringify(dados.links || []));
        localStorage.setItem(`anotacoes_${currentUser}`, JSON.stringify(dados.anotacoes || []));
        localStorage.setItem(`pontos_${currentUser}`, dados.pontos || '0');
        localStorage.setItem(`eventosCalendario_${currentUser}`, JSON.stringify(dados.eventosCalendario || {}));
        loadAll();
        alert('Dados importados com sucesso!');
    }
    document.getElementById('import-file').value = '';
}

function getButtonTheme() {
    return 'custom';
}

function setButtonTheme(theme) {
}

function getCustomColor() {
    return localStorage.getItem('customColor') || '#2563eb';
}

function setCustomColor(color) {
    localStorage.setItem('customColor', color);
}

function aplicarTemaGlobal() {
    const cor = getCustomColor();
    const botoes = document.querySelectorAll('button');
    botoes.forEach(botao => {
        botao.classList.remove('theme-blue','theme-red','theme-yellow',
                               'theme-green','theme-black','theme-white');
        if (!botao.classList.contains('delete-user-btn') &&
            !botao.classList.contains('confirm-delete') &&
            !botao.classList.contains('cancel-delete') &&
            !botao.classList.contains('close-settings')) {
            botao.style.backgroundColor = cor;
            botao.style.borderColor = cor;
            botao.style.color = '#ffffff';
        }
    });
}

aplicarTemaGlobal();

function abrirConfiguracoes() {
    let modal = document.getElementById('settings-modal');
    if (!modal) {
        modal = document.createElement('div');
        modal.id = 'settings-modal';
        modal.className = 'settings-modal';
        document.body.appendChild(modal);
    }
    modal.innerHTML = `
        <div class="settings-content">
            <h2>Configurações</h2>
            <div class="settings-group">
                <h3>Cor dos Botões</h3>
                <input type="color" id="custom-color-picker" value="${getCustomColor()}">
            </div>
            <div class="settings-buttons">
                <button class="close-settings" onclick="fecharConfiguracoes()">Fechar</button>
            </div>
        </div>
    `;
    modal.classList.add('active');
    const picker = document.getElementById('custom-color-picker');
    if (picker) {
        picker.addEventListener('input', (e) => {
            setCustomColor(e.target.value);
            aplicarTemaGlobal();
        });
    }
}

function fecharConfiguracoes() {
    const modal = document.getElementById('settings-modal');
    if (modal) {
        modal.classList.remove('active');
    }
}

window.onload = () => {
    loadUserList();
    const users = getUsers();
    if (users.length === 0) {
        // Não cria usuário padrão
    }

    checkPageAuth();
    initWhiteboard();
    carregarAnotacoes();
    if (document.getElementById('calendar')) {
        generateCalendar();
    }
    const observer = new MutationObserver(() => {
        aplicarTemaGlobal();
    });
    observer.observe(document.body, { 
        childList: true, 
        subtree: true 
    });
    window.addEventListener('resize', () => {
        if (document.getElementById('drawer-content')?.classList.contains('active')) {
            const calendar = document.getElementById('calendar');
            const proporcao = parseInt(document.getElementById('largura-tela')?.value || 800) / parseInt(document.getElementById('altura-tela')?.value || 500);
            calendar.style.width = '100%';
            calendar.style.height = (calendar.offsetWidth / proporcao) + 'px';
            generateCalendar();
        }
    });
};

function loadAll() {
    carregarTarefasDiarias();
    carregarDados();
    atualizarPontos();
    if (document.getElementById('calendar')) {
        generateCalendar();
    }
}