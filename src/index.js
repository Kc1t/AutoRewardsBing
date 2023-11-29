
// Dependencies
import playwright from "playwright";
import { input } from '@inquirer/prompts';
import select, { Separator } from '@inquirer/select';

const browserType = "chromium";

// Environment Variables
import "dotenv/config";

async function main() {
  //Ganhe até 90 pontos por dia, 3 pontos por pesquisa no COMPUTADOR, 90 / 3 = 30. Então o script tem que logar, abrir o bing e efetuar 30 pesquisas

  const answer = await select({
    message: 'Selecione um ação',
    choices: [
      {
        name: 'Modo Desktop',
        value: 'desktop',
        description: 'Recadar pontos com pesquisa no modo desktop',
      },
      {
        name: 'Nunhum',
        value: 'nda',
        description: 'Sair do programa',
      },
      new Separator(),
      {
        name: 'Tarefas Diários',
        value: 'diario',
        description: 'Recardar os pontos diários',
        disabled: '(tarefas diário nao estão disponível por enquanto)',
      },
      {
        name: 'Modo mobile',
        description: 'Recadar pontos com pesquisa no modo mobile',
        value: 'mobile',
        disabled: '(pesquisa no modo mobile nao esta disponível por enquanto)',
      },
    ],
  });

  if (answer != "desktop") return console.log(`Tchauu 👋👋`);

  const CountLoopRes = await input({ message: 'Quantos pesquisas vc quer: ', default :35});

  console.log(`Agora será efetivada ${CountLoopRes} pesquisas no Bing ✨.`);

  const { browser, page } = await AbriAPaginaELogar();

  //Pesquisa Simples
  const Term1 = "0";
  const SInput = await page.$('[name = "q"]');
  await SInput.type(Term1);
  await SInput.press("Enter");
  await page.waitForTimeout(5000);

  // Loop da pesquisa
  await FazerVariasPesquisasEmLoopDesktop(page, CountLoopRes);

  await browser.close();
}

async function AbriAPaginaELogar() {

  const browser = await playwright[browserType].launch({
    executablePath:
      "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe", //abre o edge
    headless: false,
  });

  const context = await browser.newContext();
  const page = await context.newPage();

  await page.goto("https://login.live.com"); // Abre a pagina de login da microsoft

  //Login e Senha

  const input = await page.$('[name ="loginfmt"]');
  await input.type(process.env.EMAIL);
  await input.press("Enter");

  const pass = await page.$('[name ="passwd"]');
  await pass.type(process.env.KEY);
  await page.click("#idSIButton9"); // clica no botão de logar da senha, pq o Enter n funciona
  await page.click("#idSIButton9"); // clica no botão para continuar que possui o mesmo id

  //Abrir Bing

  await page.goto(
    "https://www.bing.com/search?q=0&qs=n&form=QBRE&sp=-1&pq=&sc=10-0&sk=&cvid=AE59F13D55AE4443A173E4DA65169A6E&ghsh=0&ghacc=0&ghpl="
  );

  return { browser, page, context };
}

async function FazerVariasPesquisasEmLoopDesktop(page, loopCount) {
  // Loop de Pesquisa Desktop + Edge

  await page.click("#bnp_btn_accept"); //Botão de cookie

  for (let i = 1; i < loopCount; i++) {
    await page.click("#sb_form_q"); //Botão do form
    await page.click("#sw_clx"); //Botão para limpar o form

    await page.click("#sb_form_q");
    const Input = await page.$("#sb_form_q");
    await Input.type(`Pesquisa Numero ${i}`);
    await Input.press("Enter");

    await new Promise((resolve) => setTimeout(resolve, 500));
  }

  await page.click("#sb_form_q");
  await page.click("#sw_clx");

  await page.click("#sb_form_q");
  const Input = await page.$("#sb_form_q");
  await Input.type(`Por Hoje é Só, no desktop 👏👏👏`);
  console.log((`Por Hoje é Só, no desktop 👏👏👏`));
  await page.waitForTimeout(10000);
}

// add function for looping in mobile browser
// async function FazerVariasPesquisasEmLoopNoMobile(page, loopCount) {
// Loop de Pesquisa Mobile (Achar outro método de definir a tela como mobile)
// setTimeout(async () => {
//   const pageMobile = await context.newPage();
//   await pageMobile.setViewportSize({ width: 375, height: 812 });

//   const pages = await context.pages();
//   await pages[0].close();

//   await pageMobile.goto('https://www.bing.com/search?q=0&qs=n&form=QBRE&sp=-1&pq=&sc=10-0&sk=&cvid=AE59F13D55AE4443A173E4DA65169A6E&ghsh=0&ghacc=0&ghpl=');

//   await pageMobile.click('#sb_form_q');
//   await pageMobile.click('#sw_clx');

//   await pageMobile.click('#sb_form_q');
//   const Input = await pageMobile.$('#sb_form_q');
//   await Input.type(`Pesquisa Numero 0`);
//   await pageMobile.click('.b_searchboxSubmit');

//   // await pageMobile.click('#bnp_btn_accept'); //Aceita os cookies

//   for(let i = 1; i < 5; i++){
//     await pageMobile.click('#sb_form_q');
//     await pageMobile.click('#sw_clx');

//     await pageMobile.click('#sb_form_q');
//     const Input = await pageMobile.$('#sb_form_q');
//     await Input.type(`Pesquisa Numero ${i}`);
//     await pageMobile.click('.b_searchboxSubmit');

//           await new Promise(resolve => setTimeout(resolve, 500));
//     }
// }, 1000);
// }

//! Add latter
// await page.goto("https://rewards.bing.com/?ref=rewardspanel"); //url da pagina de conquistas
// await page.goto("https://rewards.bing.com/pointsbreakdown"); //url da pagina de pontos


main();