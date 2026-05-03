document.addEventListener('DOMContentLoaded', function () {

  const form     = document.getElementById('loginForm');
  const btnLogin = document.getElementById('btnLogin');

  if (!form) return; // segurança: sai se o formulário não existir

  // REGRAS DE VALIDAÇÃO
  const regrasValidacao = [
    {
      id: 'nuit',
      validar: function (val) { return /^\d{9}$/.test(val.trim()); },
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

  // VALIDAÇÃO EM TEMPO REAL (ao sair do campo)
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

    regrasValidacao.forEach(function (regra) {
      const input = document.getElementById(regra.id);
      if (!input) return;

      const campoValido = validarCampo(regra, input.value);
      if (!campoValido) {
        formularioValido = false;
      }
    });

    if (!formularioValido) {
      showPopup('error', 'Dados Inválidos', 'Por favor, corrija os campos assinalados antes de continuar.');
      return;
    }

    // VERIFICAÇÃO CONTRA DADOS GUARDADOS (SessionStorage)
    const nuitIntroduzido  = document.getElementById('nuit').value.trim();
    const emailIntroduzido = document.getElementById('email').value.trim().toLowerCase();
    const lembrarMe        = document.getElementById('lembrarMe').checked;

    const dadosGuardados = sessionStorage.getItem('utilizadorIRPS');

    if (dadosGuardados) {
      const utilizador = JSON.parse(dadosGuardados);

      const nuitCorreto  = utilizador.nuit  === nuitIntroduzido;
      const emailCorreto = utilizador.email.toLowerCase() === emailIntroduzido;

      if (!nuitCorreto || !emailCorreto) {
        showPopup('error', 'Acesso Negado', 'O NUIT ou o email introduzido não corresponde ao registo. Verifique os dados e tente novamente.');
        return;
      }

      // Guarda preferência "Lembrar-me"
      if (lembrarMe) {
        localStorage.setItem('loginGuardado', JSON.stringify({ nuit: nuitIntroduzido, email: emailIntroduzido }));
      } else {
        localStorage.removeItem('loginGuardado');
      }

      // Sucesso — redireciona para o painel
      btnLogin.textContent = 'A entrar...';
      btnLogin.disabled = true;

      showPopup(
        'success',
        'Acesso Concedido',
        'Bem-vindo ao sistema de agendamento de IRPS. A redirecionar...',
        function () {
          window.location.href = 'main.html';
        },
        2000
      );

    } else {
      // Nenhum registo encontrado na sessão
      showPopup(
        'error',
        'Conta não encontrada',
        'Não encontrámos nenhuma conta com estes dados. Por favor, registe-se primeiro.',
        function () {
          window.location.href = 'cadastro.html';
        },
        3000
      );
    }
  });


  // PRÉ-PREENCHER COM DADOS "LEMBRAR-ME"
  const loginGuardado = localStorage.getItem('loginGuardado');
  if (loginGuardado) {
    try {
      const dados = JSON.parse(loginGuardado);
      const inputNuit  = document.getElementById('nuit');
      const inputEmail = document.getElementById('email');
      const checkLembrar = document.getElementById('lembrarMe');

      if (inputNuit  && dados.nuit)  inputNuit.value  = dados.nuit;
      if (inputEmail && dados.email) inputEmail.value = dados.email;
      if (checkLembrar) checkLembrar.checked = true;
    } catch (err) {
      // JSON inválido — ignora
      localStorage.removeItem('loginGuardado');
    }
  }


  // AUXILIARES

  /**
   * Valida um campo individual e mostra/esconde a mensagem de erro.
   * @param {object} regra - { id, validar, erro }
   * @param {string} valor - Valor actual do campo
   * @returns {boolean}
   */
  function validarCampo(regra, valor) {
    const input   = document.getElementById(regra.id);
    const errSpan = document.getElementById('err-' + regra.id);
    const valido  = regra.validar(valor);

    if (!input) return true;

    if (!valido) {
      input.classList.add('input-error');
      input.classList.remove('input-success');
      if (errSpan) errSpan.textContent = regra.erro;
    } else {
      input.classList.remove('input-error');
      input.classList.add('input-success');
      if (errSpan) errSpan.textContent = '';
    }

    return valido;
  }

  function limparErroCampo(id, input) {
    const errSpan = document.getElementById('err-' + id);
    input.classList.remove('input-error');
    if (errSpan) errSpan.textContent = '';
  }

});