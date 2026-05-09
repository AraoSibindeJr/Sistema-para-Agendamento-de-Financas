document.addEventListener('DOMContentLoaded', function () {

  const form = document.getElementById('loginForm');
  const btnLogin = document.getElementById('btnLogin');

  if (!form) return;

  // REGRAS DE VALIDAÇÃO
  const regrasValidacao = [
    {
      id: 'nuit',
      validar: function (val) {
        return /^\d{9}$/.test(val.trim());
      },
      erro: 'O NUIT deve ter exactamente 9 dígitos.'
    },
    {
      id: 'email',
      validar: function (val) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val.trim());
      },
      erro: 'Insira um endereço de email válido.'
    }
  ];

  // VALIDAÇÃO EM TEMPO REAL
  regrasValidacao.forEach(function (regra) {

    const input = document.getElementById(regra.id);

    if (!input) return;

    input.addEventListener('blur', function () {
      validarCampo(regra, input.value);
    });

    input.addEventListener('input', function () {

      if (input.classList.contains('input-error')) {
        limparErroCampo(regra.id, input);
      }

    });

  });

  // SUBMISSÃO DO FORMULÁRIO
  form.addEventListener('submit', function (e) {

    e.preventDefault();

    let formularioValido = true;

    // VALIDAR CAMPOS
    regrasValidacao.forEach(function (regra) {

      const input = document.getElementById(regra.id);

      if (!input) return;

      const campoValido = validarCampo(regra, input.value);

      if (!campoValido) {
        formularioValido = false;
      }

    });

    // BLOQUEIA ENVIO SE HOUVER ERROS
    if (!formularioValido) {

      showPopup(
        'error',
        'Dados Inválidos',
        'Por favor, corrija os campos assinalados antes de continuar.'
      );

      return;
    }

    // DADOS DO FORMULÁRIO
    const nuitIntroduzido = document.getElementById('nuit').value.trim();

    const emailIntroduzido = document
      .getElementById('email')
      .value
      .trim()
      .toLowerCase();

    const lembrarMe = document.getElementById('lembrarMe').checked;

    // ESTADO DO BOTÃO
    btnLogin.textContent = 'A entrar...';
    btnLogin.disabled = true;

    // PEDIDO PARA O BACKEND
    fetch('http://localhost:8080/api/v1/cliente/login', {

      method: 'POST',

      headers: {
        'Content-Type': 'application/json'
      },

      body: JSON.stringify({
        nuit: nuitIntroduzido,
        email: emailIntroduzido
      })

    })

    .then(function (response) {

      if (!response.ok) {
        throw new Error('NUIT ou email inválido.');
      }

      return response.json();

    })

    .then(function (data) {

      // GUARDAR LOGIN SE "LEMBRAR-ME" ESTIVER ACTIVO
      if (lembrarMe) {

        localStorage.setItem(
          'loginGuardado',
          JSON.stringify({
            nuit: nuitIntroduzido,
            email: emailIntroduzido
          })
        );

      } else {

        localStorage.removeItem('loginGuardado');

      }

      // SUCESSO
      showPopup(
        'success',
        'Acesso Concedido',
        'Login efectuado com sucesso.',
        function () {
          window.location.href = 'main.html';
        },
        2000
      );

    })

    .catch(function (error) {

      showPopup(
        'error',
        'Erro de Login',
        error.message
      );

    })

    .finally(function () {

      btnLogin.textContent = 'Entrar';
      btnLogin.disabled = false;

    });

  });

  // PRÉ-PREENCHER "LEMBRAR-ME"
  const loginGuardado = localStorage.getItem('loginGuardado');

  if (loginGuardado) {

    try {

      const dados = JSON.parse(loginGuardado);

      const inputNuit = document.getElementById('nuit');
      const inputEmail = document.getElementById('email');
      const checkLembrar = document.getElementById('lembrarMe');

      if (inputNuit && dados.nuit) {
        inputNuit.value = dados.nuit;
      }

      if (inputEmail && dados.email) {
        inputEmail.value = dados.email;
      }

      if (checkLembrar) {
        checkLembrar.checked = true;
      }

    } catch (err) {

      localStorage.removeItem('loginGuardado');

    }

  }

  // FUNÇÃO DE VALIDAÇÃO
  function validarCampo(regra, valor) {

    const input = document.getElementById(regra.id);

    const errSpan = document.getElementById('err-' + regra.id);

    const valido = regra.validar(valor);

    if (!input) return true;

    if (!valido) {

      input.classList.add('input-error');
      input.classList.remove('input-success');

      if (errSpan) {
        errSpan.textContent = regra.erro;
      }

    } else {

      input.classList.remove('input-error');
      input.classList.add('input-success');

      if (errSpan) {
        errSpan.textContent = '';
      }

    }

    return valido;
  }

  // LIMPA ERRO VISUAL
  function limparErroCampo(id, input) {

    const errSpan = document.getElementById('err-' + id);

    input.classList.remove('input-error');

    if (errSpan) {
      errSpan.textContent = '';
    }

  }

});