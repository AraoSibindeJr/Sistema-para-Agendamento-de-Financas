# Development Guide

## Branch Strategy & Workflow

Este documento define a **estratégia de branches e fluxo de
desenvolvimento do projeto**, garantindo organização, estabilidade e
colaboração eficiente entre os membros da equipa.

------------------------------------------------------------------------

# 1. Objetivo

Este guia estabelece regras claras para:

-   organização das branches
-   fluxo de desenvolvimento
-   integração de código
-   promoção para produção

Com esta estrutura conseguimos:

✔ reduzir conflitos de código\
✔ separar ambientes de desenvolvimento e produção\
✔ manter um processo previsível de entrega\
✔ facilitar colaboração entre a equipa

------------------------------------------------------------------------

# 2. Estrutura de Branches

O repositório está organizado em **três camadas principais**:

    Branches Individuais (colaboradores)
                ↓
          Development Branches
       (front-dev / back-dev)
                ↓
          Production Branches
       (front-prod / back-prod)

Cada camada possui uma responsabilidade específica.

------------------------------------------------------------------------

# 3. Branches de Produção

As branches de produção representam **versões finais e estáveis do
sistema**.

## Branches

    front-prod
    back-prod

### Responsabilidade

  Branch       Descrição
  ------------ --------------------------------------
  front-prod   Código final do frontend em produção
  back-prod    Código final do backend em produção

### Regras

-   Apenas recebem **código testado e validado**
-   Atualizações devem ocorrer **via Pull Request**
-   Não é permitido **desenvolvimento direto**
-   Estas branches representam o **estado do sistema em produção**

### Fluxo para produção

    front-dev → front-prod
    back-dev → back-prod

------------------------------------------------------------------------

# 4. Branches de Desenvolvimento

As branches de desenvolvimento funcionam como **ambiente de integração
de funcionalidades** antes de chegar à produção.

## Branches

    front-dev
    back-dev

### Responsabilidade

  Branch      Descrição
  ----------- -------------------------------------
  front-dev   Integra funcionalidades do frontend
  back-dev    Integra funcionalidades do backend

### Regras

-   Recebem código das branches individuais
-   Podem conter funcionalidades em validação
-   Devem ser **testadas antes da promoção para produção**

### Fluxo de integração

    branch-colaborador → front-dev
    branch-colaborador → back-dev

------------------------------------------------------------------------

# 5. Branches de Colaboradores

Cada colaborador possui uma **branch própria de desenvolvimento**.

## Exemplos existentes

    mrtm
    arao
    benjamim
    rhivsss
    xheymon

### Objetivo

Permitir que cada desenvolvedor trabalhe **isoladamente**, sem impactar:

-   o ambiente de desenvolvimento
-   o código de produção

### Regras

-   Cada colaborador trabalha **na sua branch**
-   Alterações são integradas via **Pull Request**
-   Evitar commits diretos em branches dev ou prod

------------------------------------------------------------------------

# 6. Fluxo de Desenvolvimento

Fluxo completo do código dentro do repositório:

    Branch do Colaborador
            ↓
    front-dev / back-dev
            ↓
    front-prod / back-prod

------------------------------------------------------------------------

# 7. Processo de Trabalho

## Atualizar branches

Frontend:

``` bash
git checkout front-dev
git pull origin front-dev
```

Backend:

``` bash
git checkout back-dev
git pull origin back-dev
```

## Trabalhar na branch pessoal

``` bash
git checkout mrtm
git pull origin mrtm
```

## Criar commits

Exemplos:

    feat: add payment validation
    fix: resolve login timeout
    refactor: improve API structure
    docs: update documentation

## Enviar alterações

``` bash
git push origin mrtm
```

## Criar Pull Request

  Tipo de código   Destino
  ---------------- -----------
  Frontend         front-dev
  Backend          back-dev

------------------------------------------------------------------------

# 8. Boas Práticas

✔ Atualizar sempre a branch antes de trabalhar\
✔ Utilizar Pull Requests para integração\
✔ Escrever commits claros e pequenos\
✔ Testar funcionalidades antes de enviar\
✔ Não trabalhar diretamente em `dev` ou `prod`

------------------------------------------------------------------------

# 9. Exemplo de Fluxo

Frontend

    mrtm
     ↓
    front-dev
     ↓
    front-prod

Backend

    benjamim
     ↓
    back-dev
     ↓
    back-prod

------------------------------------------------------------------------

# 10. Responsabilidades

  Papel           Responsabilidade
  --------------- -------------------------------
  Desenvolvedor   Desenvolver na sua branch
  Equipa          Rever Pull Requests
  Maintainers     Promover código para produção

------------------------------------------------------------------------

# 11. Considerações Finais

Seguir esta estratégia garante:

-   maior estabilidade do projeto
-   colaboração organizada
-   entregas previsíveis
-   menor risco de conflitos
