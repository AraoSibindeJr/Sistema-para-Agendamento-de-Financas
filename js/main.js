const app = {
  utilizador: null,
  agendamentos: [],
  calendario: {
    ano: 0,
    mes: 0,
    dataSelecionada: null,
    horarioSelecionado: null
  },
  filtroActivo: 'todos'
};

document.addEventListener('DOMContentLoaded', function () {
  try {
    console.log("INIT OK");

    carregarUtilizador();

    const hoje = new Date();
    app.calendario.ano = hoje.getFullYear();
    app.calendario.mes = hoje.getMonth();

    renderizarCalendario();
    carregarAgendamentos();

    inicializarEventos();

  } catch (e) {
    console.error("ERRO INIT:", e);
  }
});

function carregarUtilizador() {
  const dados = sessionStorage.getItem('utilizadorIRPS');

  if (!dados) {
    window.location.href = 'cadastro.html';
    return;
  }

  app.utilizador = JSON.parse(dados);

  if (app.utilizador?._id) {
    sessionStorage.setItem('userId', app.utilizador._id);
  }

  const primeiroNome =
    app.utilizador?.nomeCompleto?.split(' ')[0] || 'User';

  document.getElementById('navbarUsername').textContent = primeiroNome;
  document.getElementById('navbarAvatar').textContent = primeiroNome[0].toUpperCase();

  actualizarPainelConfirmacao();
  carregarPerfil();
}

function showSection(sec) {
  document.querySelectorAll('.content-section').forEach(e =>
    e.classList.remove('content-section--active')
  );

  document.querySelectorAll('.sidebar-link').forEach(e =>
    e.classList.remove('sidebar-link--active')
  );

  document.getElementById('section-' + sec)?.classList.add('content-section--active');
  document.querySelector(`[data-section="${sec}"]`)?.classList.add('sidebar-link--active');

  if (sec === 'agendamentos') renderizarListaAgendamentos();
}
window.showSection = showSection;

function inicializarEventos() {

  document.querySelectorAll('.sidebar-link').forEach(link => {
    link.addEventListener('click', e => {
      e.preventDefault();
      showSection(link.dataset.section);
    });
  });

  document.getElementById('btnAgendar')?.addEventListener('click', confirmarAgendamento);

  document.getElementById('prevMonth').addEventListener('click', () => {
    app.calendario.mes--;
    if (app.calendario.mes < 0) {
      app.calendario.mes = 11;
      app.calendario.ano--;
    }
    resetSelecao();
    renderizarCalendario();
  });

  document.getElementById('nextMonth').addEventListener('click', () => {
    app.calendario.mes++;
    if (app.calendario.mes > 11) {
      app.calendario.mes = 0;
      app.calendario.ano++;
    }
    resetSelecao();
    renderizarCalendario();
  });

  document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.filter-btn').forEach(b =>
        b.classList.remove('filter-btn--active')
      );

      btn.classList.add('filter-btn--active');
      app.filtroActivo = btn.dataset.filter;

      renderizarListaAgendamentos();
    });
  });

  document.querySelectorAll('.time-slot').forEach(btn => {
    btn.addEventListener('click', () => {

      document.querySelectorAll('.time-slot')
        .forEach(b => b.classList.remove('active'));

      btn.classList.add('active');

      app.calendario.horarioSelecionado = btn.dataset.time;

      verificarBotao();
    });
  });
}

async function confirmarAgendamento() {

  if (!app.calendario.dataSelecionada || !app.calendario.horarioSelecionado) {
    showPopup('warning', 'Selecção Incompleta', 'Selecione data e horário.');
    return;
  }

  try {

    const { email } = JSON.parse(sessionStorage.getItem("utilizadorIRPS"));
    const res = await fetch(`http://localhost:8080/api/v1/cliente/whoami/${email}`);
    const userData = await res.json();
    const { userId } = userData;
    sessionStorage.setItem("userId", userId);

    if (!userId) {
      showPopup('error', 'Erro', 'Utilizador não autenticado.');
      return;
    }

    document.getElementById('btnAgendar').disabled = true;

    const response = await fetch('http://localhost:8080/api/v1/agendamentos/criar', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userId,
        dataAg: app.calendario.dataSelecionada,
        horarioAgendamento: app.calendario.horarioSelecionado,
        status: 'ativo'
      })
    });

    let data;
    try {
      data = await response.json();
    } catch {
      throw new Error('Resposta inválida do servidor');
    }

    if (!response.ok) {
      throw new Error(data.message || 'Erro ao criar agendamento');
    }

    showPopup('success', 'Sucesso', 'Agendamento criado com sucesso!');

    resetSelecao();

    await carregarAgendamentos();

  } catch (err) {
    console.error(err);
    showPopup('error', 'Erro', err.message || 'Erro ao agendar');
  } finally {
    document.getElementById('btnAgendar').disabled = false;
  }
}

async function carregarAgendamentos() {
  try {

    const userId = sessionStorage.getItem('userId');
    if (!userId) return;

    const res = await fetch(`http://localhost:8080/api/v1/agendamentos/listar/${userId}`);
    const result = await res.json();

    console.log("Agendamentos", result);

    if (res.ok) {
      app.agendamentos = result.data.map(ag => ({
        id: ag._id,
        data: ag.dataAgendamento
          ? new Date(ag.dataAgendamento).toISOString().slice(0, 10)
          : '—',
        hora: ag.horarioAgendamento,
        estado: ag.status,
        tipo: 'IRPS — Imposto sobre o Rendimento',
        nuit: app.utilizador?.nuit || '—'
      }));
    }

    renderizarCalendario();
    renderizarListaAgendamentos();

  } catch (err) {
    console.error('Erro ao carregar:', err);
  }
}

function resetSelecao() {
  app.calendario.dataSelecionada = null;
  app.calendario.horarioSelecionado = null;

  document.getElementById('timeSelection').style.display = 'none';
  document.getElementById('btnAgendar').disabled = true;

  verificarBotao();
  actualizarPainelConfirmacao();
}

function renderizarCalendario() {
  const grid = document.getElementById('calendarGrid');
  const titulo = document.getElementById('calMonthYear');

  if (!grid || !titulo) return;

  const ano = app.calendario.ano;
  const mes = app.calendario.mes;

  const nomesMeses = [
    'Janeiro','Fevereiro','Março','Abril','Maio','Junho',
    'Julho','Agosto','Setembro','Outubro','Novembro','Dezembro'
  ];

  titulo.textContent = `${nomesMeses[mes]} ${ano}`;

  grid.innerHTML = '';

  const primeiroDia = new Date(ano, mes, 1).getDay();
  const diasNoMes = new Date(ano, mes + 1, 0).getDate();

  for (let i = 0; i < primeiroDia; i++) {
    const empty = document.createElement('div');
    empty.className = 'calendar-day empty';
    grid.appendChild(empty);
  }

  const hoje = new Date();

  for (let dia = 1; dia <= diasNoMes; dia++) {
    const data = new Date(ano, mes, dia);

    const div = document.createElement('div');
    div.className = 'calendar-day';

    const hojeSemHora = new Date(hoje.getFullYear(), hoje.getMonth(), hoje.getDate());

    if (data.getTime() < hojeSemHora.getTime()) {
      div.classList.add('past');
    }

    const dataStr = `${data.getFullYear()}-${String(data.getMonth() + 1).padStart(2, '0')}-${String(data.getDate()).padStart(2, '0')}`;

    const agendado = app.agendamentos.some(a =>
      String(a.data).slice(0, 10) === dataStr
    );

    if (agendado) {
      div.classList.add('scheduled');
    }

    div.textContent = dia;

    div.addEventListener('click', () => {
      if (div.classList.contains('past') || div.classList.contains('empty')) return;

      document.querySelectorAll('.cal-day--selected')
        .forEach(el => el.classList.remove('cal-day--selected'));

      div.classList.add('cal-day--selected');

      app.calendario.dataSelecionada = dataStr;

      document.getElementById('timeSelection').style.display = 'block';

      verificarBotao();

      document.getElementById('selectedDateDisplay').textContent = dataStr;
      document.getElementById('selectedDateDisplay')
        .classList.remove('booking-value--empty');
    });

    grid.appendChild(div);
  }
}

function verificarBotao() {
  const ok =
    app.calendario.dataSelecionada &&
    app.calendario.horarioSelecionado;

  document.getElementById('btnAgendar').disabled = !ok;
}

function actualizarPainelConfirmacao() {
  document.getElementById('bookingUserName').textContent =
    app.utilizador?.nomeCompleto || '—';

  document.getElementById('bookingNuit').textContent =
    app.utilizador?.nuit || '—';
}

function renderizarListaAgendamentos() {
  const container = document.getElementById('listaAgendamentos');
  const emptyState = document.getElementById('emptyState');

  if (!container) return;

  let lista = Array.isArray(app.agendamentos) ? app.agendamentos : [];

  if (app.filtroActivo === 'activo') {
    lista = lista.filter(a => a.estado === 'ativo');
  }

  if (app.filtroActivo === 'cancelado') {
    lista = lista.filter(a => a.estado === 'cancelado');
  }

  container.innerHTML = '';

  if (lista.length === 0) {
    if (emptyState) emptyState.style.display = 'block';
    return;
  }

  if (emptyState) emptyState.style.display = 'none';

  lista.forEach(ag => {

    const div = document.createElement('div');

    div.className = `agendamento-card ${ag.estado}`;

    div.innerHTML = `
      <div class="agendamento-info">
        <h3>${ag.tipo}</h3>
        <p><strong>Data:</strong> ${ag.data}</p>
        <p><strong>Hora:</strong> ${ag.hora}</p>
        <p><strong>NUIT:</strong> ${ag.nuit}</p>
      </div>
      <div class="agendamento-status">
        <span class="status-badge status-${ag.estado}">
          ${ag.estado}
        </span>
      </div>
    `;

    container.appendChild(div);
  });
}

function carregarPerfil() {
  if (!app.utilizador) return;

  document.getElementById('profileNome').textContent =
    app.utilizador.nomeCompleto || '—';

  document.getElementById('profileNuit').textContent =
    app.utilizador.nuit || '—';

  document.getElementById('profileDoc').textContent =
    app.utilizador.identif || '—';

  document.getElementById('profileData').textContent =
    app.utilizador.dataNascimento || '—';

  document.getElementById('profileTel').textContent =
    app.utilizador.nrTelefone || '—';

  document.getElementById('profileEmail').textContent =
    app.utilizador.email || '—';

  const nome = app.utilizador.nomeCompleto || 'U';
  document.getElementById('profileAvatar').textContent =
    nome.charAt(0).toUpperCase();
}

window.confirmarAgendamento = confirmarAgendamento;
window.carregarAgendamentos = carregarAgendamentos;
window.resetSelecao = resetSelecao;