
document.addEventListener('DOMContentLoaded', function () {

  const form      = document.getElementById('cadastroForm');
  const btnSubmit = document.getElementById('btnSubmit');

  if (!form) return; // seguranca: sai se o formulario nao existir

  // EEGRAS DE VALIDACAO
  // Cada campo tem: campo, funcao validadora, mensagem de erro
  const regrasValidacao = [
    {
      id: 'nomeCompleto',
      validar: function (val) { return val.trim().length >= 3 && val.trim().includes(' '); },
      erro: 'Insira o nome completo (nome e apelido).'
    },
    {
      id: 'nuit',
      validar: function (val) { return /^\d{9}$/.test(val.trim()); },
      erro: 'O NUIT deve ter exactamente 9 dígitos.'
    },
    {
      id: 'documentoIdentidade',
      validar: function (val) { return val.trim().length >= 5; },
      erro: 'Insira um número de BI ou Passaporte válido.'
    },
    {
      id: 'dataNascimento',
      validar: function (val) {
        if (!val) return false;
        const nascimento = new Date(val);
        const hoje = new Date();
        // Deve ser maior de 18 anos
        const idade = hoje.getFullYear() - nascimento.getFullYear();
        return idade >= 18;
      },
      erro: 'O contribuinte deve ter pelo menos 18 anos.'
    },
    {
      id: 'telefone',
      validar: function (val) {
        // Aceita formatos com ou sem prefixo +258
        const telLimpo = val.replace(/[\s\-\(\)]/g, '');
        return /^(\+258|258)?8[234]\d{7}$/.test(telLimpo);
      },
      erro: 'Insira um número de telefone moçambicano válido (ex: +258 84 000 0000).'
    },
    {
      id: 'email',
      validar: function (val) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val.trim());
      },
      erro: 'Insira um endereço de email válido.'
    }
  ];

  // VALIDACAO EM TEMPO REAL (ao sair do campo)
  regrasValidacao.forEach(function (regra) {
    const input = document.getElementById(regra.id);
    if (!input) return;

    // Valida quando o utilizador sai do campo
    input.addEventListener('blur', function () {
      validarCampo(regra, input.value);
    });

    // Remove erro enquanto digita
    input.addEventListener('input', function () {
      if (input.classList.contains('input-error')) {
        limparErroCampo(regra.id, input);
      }
    });
  });

  // SUBMISSAO DO FORM
  form.addEventListener('submit', function (e) {
    e.preventDefault(); // impede o reload da pagina

    let formularioValido = true;

    // Valida todos os campos
    regrasValidacao.forEach(function (regra) {
      const input = document.getElementById(regra.id);
      if (!input) return;

      const campoValido = validarCampo(regra, input.value);
      if (!campoValido) {
        formularioValido = false;
      }
    });

    if (!formularioValido) {
      // Mostra popup de erro
      showPopup('error', 'Dados Inválidos', 'Por favor, corrija os campos assinalados antes de continuar.');
      return;
    }

    // GUARDA DADOS NO SESSIONSTORAGE
    // SessionStorage: dados guardados durante a sessao do browser
    const dadosUtilizador = {
      nomeCompleto:        document.getElementById('nomeCompleto').value.trim(),
      nuit:                document.getElementById('nuit').value.trim(),
      documentoIdentidade: document.getElementById('documentoIdentidade').value.trim(),
      dataNascimento:      document.getElementById('dataNascimento').value,
      telefone:            document.getElementById('telefone').value.trim(),
      email:               document.getElementById('email').value.trim()
    };

    sessionStorage.setItem('utilizadorIRPS', JSON.stringify(dadosUtilizador));

    // Mostra popup de sucesso e redireciona para o painel principal
    showPopup(
      'success',
      'Cadastro Realizado',
      'Os seus dados foram registados. A redirecionar para o painel...',
      function () {
        // close popup
        window.location.href = 'main.html';
      },
      2000 // fecha soz em 2 segundos
    );

    // Feedback visual no botão
    btnSubmit.textContent = 'A processar...';
    btnSubmit.disabled = true;
  });


  // AUXILIARES

  /**
   * Valida um campo individual e mostra/esconde mensagem de erro
   * @param {object} regra - Objecto com { id, validar, erro }
   * @param {string} valor - Valor actual do campo
   * @returns {boolean} - true se valido, false se invalido
   */
  function validarCampo(regra, valor) {
    const input    = document.getElementById(regra.id);
    const errSpan  = document.getElementById('err-' + regra.id);
    const valido   = regra.validar(valor);

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
