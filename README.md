# Projeto Aplicado: Plataforma Integrada de Saúde e Bem-Estar

**Instituição:** UNIFEBE (Centro Universitário de Brusque)  
**Curso:** Sistemas de Informação  
**Foco:** Integração de Sistemas, Desenvolvimento Mobile e Web  

---

## 📋 Resumo do Projeto

Este repositório contém o código-fonte de um ecossistema digital desenvolvido para a gestão e o consumo de conteúdo focado em saúde e autoconhecimento. O projeto tem como objetivo principal demonstrar a implementação funcional de uma arquitetura distribuída e moderna, integrando aplicações frontend (Mobile e Web) a um serviço de backend gerenciado (BaaS - Backend as a Service).

A solução elimina o acoplamento entre a atualização de dados e o ciclo de lançamento do aplicativo, permitindo que alterações realizadas em um painel administrativo web reflitam em tempo real na interface mobile do usuário final.

---

## 🏗️ Arquitetura do Sistema

O projeto foi estruturado em três camadas independentes que se comunicam via API RESTFul:

1. **Frontend Mobile (Interface do Usuário):** 
   Desenvolvido em **React Native** com o framework **Expo**. Atua como o cliente consumindo dados em tempo real. Possui navegação roteada nativamente via `expo-router` e gerencia estados assíncronos para exibição de artigos e calendário.
2. **Frontend Web (Painel Administrativo):** 
   Construído em **React** (utilizando **Vite** para empacotamento) e hospedado na Vercel. Serve como o ambiente de inserção e manutenção dos dados (CRUD).
3. **Backend as a Service (Camada de Dados):** 
   Provido pelo **Supabase** (baseado em PostgreSQL). Gerencia a persistência dos dados e expõe os endpoints consumidos pelos frontends de forma segura e escalável.

---

## 🎯 Objetivos e Requisitos Cumpridos

* **Desenvolvimento Cross-Platform:** Implementação de uma base de código unificada (JavaScript/TypeScript) capaz de gerar builds nativos para os sistemas operacionais Android (APK) e iOS.
* **Desacoplamento e Sincronização:** Comprovação do modelo cliente-servidor onde a camada de apresentação (Mobile) não armazena dados locais estáticos, dependendo integralmente do estado do banco de dados na nuvem.
* **Tratamento de Exceções e Estabilidade Nativa:** Implementação de `try/catch` em chamadas assíncronas para evitar fechamentos inesperados (crashes) em produção por falhas de rede. Resolução de conflitos de compilação nativa (Jetpack Compose e Polyfills de URL).
* **Segurança e CI/CD:** Utilização de variáveis de ambiente (`.env` e `eas.json`) para ocultar chaves e credenciais do banco de dados do controle de versão público, integrando o processo de build através do EAS (Expo Application Services).

---

## 🛠️ Stack Tecnológico

* **Linguagem Base:** JavaScript / TypeScript
* **Mobile:** React Native, Expo, Expo Router
* **Web:** React, Vite
* **Banco de Dados / API:** Supabase (PostgreSQL)
* **Controle de Versão:** Git / GitHub
* **Deploy e Build:** EAS Build (Mobile), Vercel (Web)

---

## ⚙️ Instruções de Execução (Ambiente de Desenvolvimento)

Para executar o projeto localmente para fins de avaliação técnica:

**1. Pré-requisitos:**
* Node.js instalado (v18 ou superior).
* Expo CLI instalado globalmente (`npm install -g expo-cli`).

**2. Configuração do Ambiente:**
Crie um arquivo `.env` na raiz do projeto contendo as chaves de conexão com o banco de dados:
```env
EXPO_PUBLIC_SUPABASE_URL=https://[ID_DO_PROJETO].supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=[CHAVE_DE_API_PUBLICA]