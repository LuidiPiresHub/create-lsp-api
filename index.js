#!/usr/bin/env node
import * as fs from 'fs-extra';
import * as path from 'path';
import inquirer from 'inquirer';
import { fileURLToPath } from 'url';
import { exec, spawn } from 'child_process';
import { promisify } from 'util';

const execPromise = promisify(exec);

const green = '\x1b[32m';
const yellow = '\x1b[33m';
const blue = '\x1b[34m';
const red = '\x1b[31m';
const reset = '\x1b[0m';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const templateDir = path.join(__dirname, 'template');

async function getProjectName() {
  try {
    const { projectName } = await inquirer.prompt([
      {
        type: 'input',
        name: 'projectName',
        message: 'Qual é o nome do seu projeto?',
        default: 'typescript-api',
        validate: (input) => {
          if (input.trim() === '') {
            return 'O nome do projeto não pode estar vazio. Por favor, insira um nome válido.';
          }
          return true;
        },
      },
    ]);

    const projectExists = await fs.pathExists(projectName.trim());

    if (projectExists) {
      console.log(`${yellow}Um projeto com o nome "${projectName}" já existe. Por favor, escolha um nome diferente.${reset}`);
      return getProjectName();
    }
    return projectName;
  } catch {
    console.log(`${red}Operação cancelada pelo usuário.${reset}`);
  }
}

async function renameFiles(targetDir) {
  const gitignorePath = path.join(targetDir, '_.gitignore');
  const envPath = path.join(targetDir, '_.env');

  await fs.move(gitignorePath, path.join(targetDir, '.gitignore'));
  await fs.move(envPath, path.join(targetDir, '.env'));
}

async function initializeProject(targetDir) {
  process.chdir(targetDir);
  console.log(`${blue}Configurando o projeto em ${targetDir}...${reset}`);

  console.log(`${yellow}Instalando as dependências...${reset}`);
  await execPromise('npm install');

  console.log(`${yellow}Executando as migrações do Prisma...${reset}`);
  await execPromise('npx prisma migrate dev --name users');

  console.log(`${yellow}Executando os seeders...${reset}`);
  await execPromise('npm run seed');

  console.log(`${yellow}Iniciando o servidor...${reset}`);
  spawn('npm', ['run', 'dev'], { stdio: 'inherit', shell: true });
}

async function createProject() {
  try {
    const targetDir = await getProjectName();
    if (targetDir) {
      await fs.copy(templateDir, targetDir);
      console.log(`\n${green}Projeto criado com sucesso em: ${targetDir}${reset}`);

      await renameFiles(targetDir);

      await initializeProject(targetDir);
    }
  } catch (err) {
    console.error(`${red}Erro ao criar o projeto:${reset} \n`, err);
  }
}

createProject();
