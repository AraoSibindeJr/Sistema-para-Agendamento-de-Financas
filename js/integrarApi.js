document.addEventListener("DOMContentLoaded", () => {

  iniciarSistema();
  configurarTimeSlots();

});


// =============================
// INICIAR SISTEMA
// =============================
async function iniciarSistema() {

  const email = localStorage.getItem("userEmail");

  if (!email) {
    window.location.href = "index.html";
    return;
  }

  try {
    const res = await fetch("http://localhost:8080/api/v1/cliente/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ email })
    });

    const user = await res.json();

    localStorage.setItem("userId", user.id);

    preencherUI(user);
    listarAgendamentos();

  } catch (err) {
    console.error(err);
    showPopup("Erro", "Falha ao carregar dados do utilizador.");
  }
}


// =============================
// PREENCHER UI
// =============================
function preencherUI(user) {

  document.getElementById("navbarUsername").innerText = user.nomeCompleto;
  document.getElementById("bookingUserName").innerText = user.nomeCompleto;
  document.getElementById("bookingNuit").innerText = user.nuit;

  document.getElementById("profileNome").innerText = user.nomeCompleto;
  document.getElementById("profileNuit").innerText = user.nuit;
  document.getElementById("profileDoc").innerText = user.identif;
  document.getElementById("profileData").innerText = user.dataNascimento;
  document.getElementById("profileTel").innerText = user.nrTelefone;
  document.getElementById("profileEmail").innerText = user.email;

}


// =============================
// TIME SLOTS
// =============================
function configurarTimeSlots() {

  document.querySelectorAll(".time-slot").forEach(btn => {
    btn.addEventListener("click", () => {
      document.querySelectorAll(".time-slot").forEach(b => b.classList.remove("selected"));
      btn.classList.add("selected");

      document.getElementById("btnAgendar").disabled = false;
    });
  });

}


// =============================
// CRIAR AGENDAMENTO
// =============================
document.getElementById("btnAgendar").addEventListener("click", async () => {

  const userId = localStorage.getItem("userId");
  const dataAg = document.getElementById("selectedDateDisplay").innerText;
  const horario = document.querySelector(".time-slot.selected")?.dataset.time;

  if (!dataAg || dataAg === "Nenhuma data selecionada" || !horario) {
    showPopup("Erro", "Selecione data e horário.");
    return;
  }

  const dados = {
    userId,
    dataAg,
    horarioAgendamento: horario,
    status: "ativo"
  };

  try {
    const res = await fetch("http://localhost:8080/api/v1/agendamentos/criar", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(dados)
    });

    if (!res.ok) throw new Error();

    showPopup("Sucesso", "Agendamento realizado!");
    listarAgendamentos();

  } catch (err) {
    console.error(err);
    showPopup("Erro", "Erro ao criar agendamento.");
  }

});


// =============================
// LISTAR AGENDAMENTOS
// =============================
async function listarAgendamentos() {

  const identif = localStorage.getItem("userDoc");

  try {
    const res = await fetch(`http://localhost:8080/api/v1/listar-status?identif=${identif}&status=ativo`);
    const lista = await res.json();

    const container = document.getElementById("listaAgendamentos");
    const empty = document.getElementById("emptyState");

    container.innerHTML = "";

    if (!lista || lista.length === 0) {
      empty.style.display = "block";
      return;
    }

    empty.style.display = "none";

    lista.forEach(item => {
      const div = document.createElement("div");
      div.classList.add("agendamento-item");

      div.innerHTML = `
        <p><strong>Data:</strong> ${item.dataAg}</p>
        <p><strong>Hora:</strong> ${item.horarioAgendamento}</p>
        <button onclick="cancelar('${item.id}')">Cancelar</button>
      `;

      container.appendChild(div);
    });

    document.getElementById("totalAgendamentos").innerText = lista.length;

  } catch (err) {
    console.error(err);
  }

}


// =============================
// CANCELAR
// =============================
async function cancelar(id) {

  try {
    await fetch("http://localhost:8080/api/v1/cancelar", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ id })
    });

    showPopup("Info", "Agendamento cancelado.");
    listarAgendamentos();

  } catch (err) {
    console.error(err);
  }

}