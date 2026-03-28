/**
 * main.js — Lógica do Painel Principal
 * Funcionalidades:
 *   - Navegação entre secções (sidebar)
 *   - Calendário interactivo
 *   - Agendamento de pagamentos
 *   - Cancelamento de agendamentos
 *   - Filtro de agendamentos
 *   - Exibição do perfil do utilizador
 */

// ============================================================
// ESTADO GLOBAL DA APLICAÇÃO
// Guarda todos os dados da sessão em memória
// ============================================================
const app = {
  // Dados do utilizador (carregados do sessionStorage)
  utilizador: null,

  // Lista de agendamentos (array de objectos)
  agendamentos: [],

  // Estado do calendário
  calendario: {
    ano: 0,
    mes: 0,         // 0 = Janeiro, 11 = Dezembro
    dataSelecionada: null,   // string 'YYYY-MM-DD'
    horarioSelecionado: null // string 'HH:MM'
  },

  // Filtro activo na lista de agendamentos
  filtroActivo: 'todos'
};

// ============================================================
// INICIALIZAÇÃO — Corre quando a página carrega
// ============================================================
document.addEventListener('DOMContentLoaded', function () {

  // 1. Carrega os dados do utilizador
  carregarUtilizador();

  // 2. Inicializa o calendário no mês actual
  const hoje = new Date();
  app.calendario.ano = hoje.getFullYear();
  app.calendario.mes = hoje.getMonth();
  renderizarCalendario();

  // 3. Carrega agendamentos guardados (se existirem)
  carregarAgendamentos();

  // 4. Inicializa eventos dos botões
  inicializarEventos();

  // 5. Preenche os dados do perfil
  preencherPerfil();

  // 6. Actualiza o resumo da sidebar
  actualizarResumo();

});

// ============================================================
// DADOS DO UTILIZADOR
// ============================================================

/**
 * Carrega o utilizador guardado no sessionStorage
 * Se não existir, redireciona para o cadastro
 */
function carregarUtilizador() {
  const dados = sessionStorage.getItem('utilizadorIRPS');

  if (!dados) {
    // Utilizador não fez cadastro — redireciona
    window.location.href = 'cadastro.html';
    return;
  }

  app.utilizador = JSON.parse(dados);

  // Actualiza o nome na navbar
  const primeiroNome = app.utilizador.nomeCompleto.split(' ')[0];
  const navbarUsername = document.getElementById('navbarUsername');
  const navbarAvatar   = document.getElementById('navbarAvatar');

  if (navbarUsername) navbarUsername.textContent = primeiroNome;
  if (navbarAvatar)   navbarAvatar.textContent = primeiroNome[0].toUpperCase();
}

// ============================================================
// NAVEGAÇÃO ENTRE SECÇÕES (Sidebar)
// ============================================================

/**
 * Mostra uma secção e esconde as outras
 * @param {string} nomeSeccao - 'calendario', 'agendamentos' ou 'perfil'
 */
function showSection(nomeSeccao) {
  // Esconde todas as secções
  document.querySelectorAll('.content-section').forEach(function (sec) {
    sec.classList.remove('content-section--active');
  });

  // Remove classe activa de todos os links da sidebar
  document.querySelectorAll('.sidebar-link').forEach(function (link) {
    link.classList.remove('sidebar-link--active');
  });

  // Mostra a secção pedida
  const seccaoEl = document.getElementById('section-' + nomeSeccao);
  if (seccaoEl) seccaoEl.classList.add('content-section--active');

  // Marca o link activo
  const linkActivo = document.querySelector('[data-section="' + nomeSeccao + '"]');
  if (linkActivo) linkActivo.classList.add('sidebar-link--active');

  // Se vai para agendamentos, re-renderiza a lista
  if (nomeSeccao === 'agendamentos') {
    renderizarListaAgendamentos();
  }
}

// Inicializa os cliques da sidebar
function inicializarEventos() {
  // Links da sidebar
  document.querySelectorAll('.sidebar-link').forEach(function (link) {
    link.addEventListener('click', function (e) {
      e.preventDefault();
      const seccao = link.getAttribute('data-section');
      if (seccao) showSection(seccao);
    });
  });

  // Botões de navegação do calendário
  document.getElementById('prevMonth').addEventListener('click', function () {
    app.calendario.mes--;
    if (app.calendario.mes < 0) {
      app.calendario.mes = 11;
      app.calendario.ano--;
    }
    app.calendario.dataSelecionada = null;
    app.calendario.horarioSelecionado = null;
    actualizarPainelConfirmacao();
    renderizarCalendario();
  });

  document.getElementById('nextMonth').addEventListener('click', function () {
    app.calendario.mes++;
    if (app.calendario.mes > 11) {
      app.calendario.mes = 0;
      app.calendario.ano++;
    }
    app.calendario.dataSelecionada = null;
    app.calendario.horarioSelecionado = null;
    actualizarPainelConfirmacao();
    renderizarCalendario();
  });

  // Botão de confirmar agendamento
  const btnAgendar = document.getElementById('btnAgendar');
  if (btnAgendar) {
    btnAgendar.addEventListener('click', confirmarAgendamento);
  }

  // Filtros da lista de agendamentos
  document.querySelectorAll('.filter-btn').forEach(function (btn) {
    btn.addEventListener('click', function () {
      // Remove activo de todos
      document.querySelectorAll('.filter-btn').forEach(function (b) {
        b.classList.remove('filter-btn--active');
      });
      // Activa este botão
      btn.classList.add('filter-btn--active');
      app.filtroActivo = btn.getAttribute('data-filter');
      renderizarListaAgendamentos();
    });
  });
}

// ============================================================
// CALENDÁRIO INTERACTIVO
// ============================================================

// Nomes dos meses em português
const MESES = [
  'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
  'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
];

/**
 * Renderiza o calendário para o mês/ano actual no estado
 */
function renderizarCalendario() {
  const { ano, mes } = app.calendario;
  const grid = document.getElementById('calendarGrid');
  const tituloMes = document.getElementById('calMonthYear');

  if (!grid || !tituloMes) return;

  // Actualiza o título do mês
  tituloMes.textContent = MESES[mes] + ' ' + ano;

  // Limpa a grelha
  grid.innerHTML = '';

  // Obtém as datas com agendamentos activos
  const datasAgendadas = app.agendamentos
    .filter(function (ag) { return ag.estado === 'activo'; })
    .map(function (ag) { return ag.data; });

  // Dia da semana em que começa o mês (0=Dom, 1=Seg, ...)
  const primeiroDia = new Date(ano, mes, 1).getDay();

  // Total de dias no mês
  const totalDias = new Date(ano, mes + 1, 0).getDate();

  // Data de hoje para comparar
  const hoje = new Date();
  const hojeStr = formatarData(hoje);

  // Células vazias antes do primeiro dia
  for (let i = 0; i < primeiroDia; i++) {
    const celVazia = document.createElement('div');
    celVazia.className = 'cal-day cal-day--empty';
    grid.appendChild(celVazia);
  }

  // Células dos dias
  for (let dia = 1; dia <= totalDias; dia++) {
    const dataStr = ano + '-' + padZero(mes + 1) + '-' + padZero(dia);
    const dataObj = new Date(ano, mes, dia);
    const cel = document.createElement('div');
    cel.textContent = dia;

    // Define as classes do dia
    let classes = ['cal-day'];

    if (dataObj < new Date(hoje.getFullYear(), hoje.getMonth(), hoje.getDate())) {
      // Dia passado
      classes.push('cal-day--past');
    } else {
      // Dia disponível
      classes.push('cal-day--available');

      // Verifica se tem agendamento
      if (datasAgendadas.includes(dataStr)) {
        classes.push('cal-day--scheduled');
      }

      // Verifica se é hoje
      if (dataStr === hojeStr) {
        classes.push('cal-day--today');
      }

      // Verifica se está selecionado
      if (dataStr === app.calendario.dataSelecionada) {
        classes.push('cal-day--selected');
      }

      // Adiciona evento de clique (só em dias disponíveis)
      cel.addEventListener('click', function () {
        selecionarDia(dataStr);
      });
    }

    cel.className = classes.join(' ');
    grid.appendChild(cel);
  }
}

/**
 * Seleciona um dia no calendário
 * @param {string} dataStr - Data no formato 'YYYY-MM-DD'
 */
function selecionarDia(dataStr) {
  app.calendario.dataSelecionada = dataStr;
  app.calendario.horarioSelecionado = null;

  // Re-renderiza para mostrar o dia selecionado
  renderizarCalendario();

  // Mostra o painel de confirmação com a data
  actualizarPainelConfirmacao();

  // Mostra os horários disponíveis
  const timeSelection = document.getElementById('timeSelection');
  if (timeSelection) {
    timeSelection.style.display = 'block';

    // Remove selecção anterior dos horários
    document.querySelectorAll('.time-slot').forEach(function (slot) {
      slot.classList.remove('time-slot--selected');
      slot.addEventListener('click', function () {
        selecionarHorario(slot.getAttribute('data-time'), slot);
      });
    });
  }

  // Desactiva o botão de confirmar até selecionar horário
  document.getElementById('btnAgendar').disabled = true;
}

/**
 * Seleciona um horário
 */
function selecionarHorario(hora, elemento) {
  app.calendario.horarioSelecionado = hora;

  // Visual: remove selecção anterior
  document.querySelectorAll('.time-slot').forEach(function (s) {
    s.classList.remove('time-slot--selected');
  });
  elemento.classList.add('time-slot--selected');

  // Activa o botão de confirmar
  document.getElementById('btnAgendar').disabled = false;
}

/**
 * Actualiza o painel de confirmação lateral
 */
function actualizarPainelConfirmacao() {
  const dataDisplay  = document.getElementById('selectedDateDisplay');
  const nomeDisplay  = document.getElementById('bookingUserName');
  const nuitDisplay  = document.getElementById('bookingNuit');

  if (app.calendario.dataSelecionada) {
    // Formata a data para exibição
    const partes = app.calendario.dataSelecionada.split('-');
    const dataFormatada = partes[2] + ' de ' + MESES[parseInt(partes[1]) - 1] + ' de ' + partes[0];
    if (dataDisplay) {
      dataDisplay.textContent = dataFormatada;
      dataDisplay.classList.remove('booking-value--empty');
    }
  } else {
    if (dataDisplay) {
      dataDisplay.textContent = 'Nenhuma data selecionada';
      dataDisplay.classList.add('booking-value--empty');
    }
  }

  // Preenche dados do utilizador
  if (app.utilizador) {
    if (nomeDisplay) nomeDisplay.textContent = app.utilizador.nomeCompleto;
    if (nuitDisplay) nuitDisplay.textContent = app.utilizador.nuit;
  }
}

// ============================================================
// AGENDAMENTOS
// ============================================================

/**
 * Confirma e cria um novo agendamento
 */
function confirmarAgendamento() {
  if (!app.calendario.dataSelecionada || !app.calendario.horarioSelecionado) {
    showPopup('warning', 'Selecção Incompleta', 'Por favor, selecione uma data e um horário.');
    return;
  }

  // Verifica se já existe agendamento nesta data
  const jaExiste = app.agendamentos.some(function (ag) {
    return ag.data === app.calendario.dataSelecionada && ag.estado === 'activo';
  });

  if (jaExiste) {
    showPopup('warning', 'Data Ocupada', 'Já tem um agendamento activo nesta data. Escolha outra data.');
    return;
  }

  // Cria o novo agendamento
  const novoAgendamento = {
    id:     'AG' + Date.now(), // ID único baseado no timestamp
    data:   app.calendario.dataSelecionada,
    hora:   app.calendario.horarioSelecionado,
    estado: 'activo',
    tipo:   'IRPS — Imposto sobre o Rendimento',
    nuit:   app.utilizador ? app.utilizador.nuit : '—'
  };

  app.agendamentos.push(novoAgendamento);

  // Guarda no sessionStorage
  guardarAgendamentos();

  // Limpa a selecção
  app.calendario.dataSelecionada = null;
  app.calendario.horarioSelecionado = null;
  document.getElementById('timeSelection').style.display = 'none';
  document.getElementById('btnAgendar').disabled = true;
  actualizarPainelConfirmacao();

  // Re-renderiza o calendário
  renderizarCalendario();

  // Actualiza o resumo
  actualizarResumo();

  // Mostra popup de sucesso
  showPopup(
    'success',
    'Agendamento Confirmado!',
    'O seu pagamento de IRPS foi agendado com sucesso. Receberá uma confirmação no seu email.'
  );
}

/**
 * Cancela um agendamento pelo seu ID
 * @param {string} id - ID do agendamento
 */
function cancelarAgendamento(id) {
  const agendamento = app.agendamentos.find(function (ag) { return ag.id === id; });

  if (!agendamento) return;

  // Confirma com o popup
  showPopup(
    'warning',
    'Cancelar Agendamento',
    'Tem a certeza que deseja cancelar o agendamento de ' + formatarDataDisplay(agendamento.data) + '?',
    null
  );

  // Para este projecto didáctico, o popup não tem botão "Cancelar/Confirmar" dual.
  // Implementamos o cancelamento directamente (em produção usaria-se um popup de confirmação).
  agendamento.estado = 'cancelado';
  guardarAgendamentos();
  renderizarListaAgendamentos();
  renderizarCalendario();
  actualizarResumo();

  showPopup(
    'success',
    'Agendamento Cancelado',
    'O agendamento foi cancelado com sucesso.',
    null,
    2000
  );
}

/**
 * Renderiza a lista de agendamentos na secção correspondente
 */
function renderizarListaAgendamentos() {
  const lista       = document.getElementById('listaAgendamentos');
  const emptyState  = document.getElementById('emptyState');

  if (!lista) return;

  // Filtra os agendamentos segundo o filtro activo
  let agendamentosFiltrados = app.agendamentos;

  if (app.filtroActivo === 'activo') {
    agendamentosFiltrados = app.agendamentos.filter(function (ag) { return ag.estado === 'activo'; });
  } else if (app.filtroActivo === 'cancelado') {
    agendamentosFiltrados = app.agendamentos.filter(function (ag) { return ag.estado === 'cancelado'; });
  }

  // Remove cards anteriores (mantém o empty state)
  lista.querySelectorAll('.agendamento-card').forEach(function (c) { c.remove(); });

  if (agendamentosFiltrados.length === 0) {
    if (emptyState) emptyState.style.display = 'block';
    return;
  }

  if (emptyState) emptyState.style.display = 'none';

  // Ordena por data (mais recente primeiro)
  agendamentosFiltrados.sort(function (a, b) { return b.data.localeCompare(a.data); });

  // Cria um card para cada agendamento
  agendamentosFiltrados.forEach(function (ag) {
    const partes = ag.data.split('-');
    const dia    = partes[2];
    const mesNome = MESES[parseInt(partes[1]) - 1].substring(0, 3).toUpperCase();

    const card = document.createElement('div');
    card.className = 'agendamento-card';
    card.innerHTML = `
      <div class="ag-date-block">
        <span class="ag-date-day">${dia}</span>
        <span class="ag-date-month">${mesNome}</span>
      </div>
      <div class="ag-info">
        <div class="ag-title">${ag.tipo}</div>
        <div class="ag-details">
          ${formatarDataDisplay(ag.data)} às ${ag.hora} &nbsp;·&nbsp; NUIT: ${ag.nuit}
        </div>
      </div>
      <span class="ag-status ag-status--${ag.estado}">
        ${ag.estado === 'activo' ? 'Activo' : 'Cancelado'}
      </span>
      <button
        class="ag-cancel-btn"
        onclick="cancelarAgendamento('${ag.id}')"
        ${ag.estado !== 'activo' ? 'disabled' : ''}
      >
        Cancelar
      </button>
    `;

    lista.appendChild(card);
  });
}

// ============================================================
// PERFIL DO UTILIZADOR
// ============================================================

/**
 * Preenche os campos da secção de perfil
 */
function preencherPerfil() {
  if (!app.utilizador) return;

  const u = app.utilizador;

  const campos = {
    profileNome:   u.nomeCompleto,
    profileNuit:   u.nuit,
    profileDoc:    u.documentoIdentidade,
    profileData:   formatarDataDisplay(u.dataNascimento),
    profileTel:    u.telefone,
    profileEmail:  u.email,
    profileAvatar: u.nomeCompleto[0].toUpperCase()
  };

  Object.keys(campos).forEach(function (id) {
    const el = document.getElementById(id);
    if (el) el.textContent = campos[id];
  });
}

// ============================================================
// RESUMO DA SIDEBAR
// ============================================================

function actualizarResumo() {
  const totalEl    = document.getElementById('totalAgendamentos');
  const proximoEl  = document.getElementById('proximoAgendamento');

  const activos = app.agendamentos.filter(function (ag) { return ag.estado === 'activo'; });

  if (totalEl) totalEl.textContent = activos.length;

  if (proximoEl) {
    if (activos.length === 0) {
      proximoEl.textContent = '—';
    } else {
      // Encontra o próximo agendamento (data mais próxima no futuro)
      const hoje = new Date();
      const futuros = activos.filter(function (ag) { return new Date(ag.data) >= hoje; });
      futuros.sort(function (a, b) { return a.data.localeCompare(b.data); });

      if (futuros.length > 0) {
        const partes = futuros[0].data.split('-');
        proximoEl.textContent = partes[2] + '/' + partes[1];
      } else {
        proximoEl.textContent = '—';
      }
    }
  }
}


// PERSISTÊNCIA — SessionStorage


function guardarAgendamentos() {
  sessionStorage.setItem('agendamentosIRPS', JSON.stringify(app.agendamentos));
}

function carregarAgendamentos() {
  const dados = sessionStorage.getItem('agendamentosIRPS');
  if (dados) {
    app.agendamentos = JSON.parse(dados);
  }
}


// UTILITÁRIOS


/** Formata data 'YYYY-MM-DD' para 'DD de Mês de AAAA' */
function formatarDataDisplay(dataStr) {
  if (!dataStr) return '—';
  const partes = dataStr.split('-');
  if (partes.length < 3) return dataStr;
  return partes[2] + ' de ' + MESES[parseInt(partes[1]) - 1] + ' de ' + partes[0];
}

/** Formata Date para string 'YYYY-MM-DD' */
function formatarData(data) {
  return data.getFullYear() + '-' + padZero(data.getMonth() + 1) + '-' + padZero(data.getDate());
}

/** Adiciona zero a esquerda (ex: 5 → '05') */
function padZero(num) {
  return String(num).padStart(2, '0');
}
