@echo off
chcp 65001 >nul
title Dashboard Piquetes

echo ===================================================
echo     INICIANDO O DASHBOARD DE PIQUETES
echo ===================================================
echo.

:: Verifica se o Node.js esta instalado
where node >nul 2>nul
if %errorlevel% neq 0 (
    echo [ERRO] O Node.js nao foi encontrado no seu computador!
    echo Para que o sistema funcione, voce precisa instalar o Node.js.
    echo Baixe a versao "LTS" em: https://nodejs.org/
    echo.
    echo Apos instalar, de um duplo clique neste arquivo novamente.
    pause
    exit
)

:: Verifica se as dependencias existem, se nao, instala
if not exist "node_modules\" (
    echo [INFO] Primeira vez rodando o sistema neste computador.
    echo Instalando as dependencias necessarias...
    echo Isso pode levar um ou dois minutos. Aguarde...
    call npm install
    echo.
    echo [INFO] Instalacao concluida!
    echo.
)

echo [INFO] Iniciando o servidor local...
echo O seu navegador principal sera aberto automaticamente.
echo.
echo ===================================================
echo ATENCAO: Mantenha esta janela preta aberta enquanto 
echo estiver usando o Dashboard. Para desligar o sistema, 
echo basta fechar esta janela.
echo ===================================================
echo.

:: Inicia o servidor Vite e abre o browser sozinho
call npm run dev -- --open
