const playwright = require('playwright')
require('dotenv').config();

const browserType = 'chromium';

async function main() {

  //Ganhe até 90 pontos por dia, 3 pontos por pesquisa no COMPUTADOR, 90 / 3 = 30. Então o script tem que logar, abrir o bing e efetuar 30 pesquisas

  const browser = await playwright[browserType].launch({
    executablePath: 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe', //abre o edge
    headless: false,
  });
  const context = await browser.newContext();
  const page = await context.newPage();

  await page.goto('https://login.live.com') // Abre a pagina de login da microsoft 

  //Login e Senha

  const input = await page.$('[name ="loginfmt"]')
  await input.type(process.env.EMAIL)
  await input.press('Enter');

  const pass = await page.$('[name ="passwd"]')
  await pass.type(process.env.KEY)
  await page.click('#idSIButton9') // clica no botão de logar da senha, pq o Enter n funciona
  await page.click('#idSIButton9') // clica no botão para continuar que possui o mesmo id


  //Abrir Bing

  await page.goto('https://www.bing.com/search?q=0&qs=n&form=QBRE&sp=-1&pq=&sc=10-0&sk=&cvid=AE59F13D55AE4443A173E4DA65169A6E&ghsh=0&ghacc=0&ghpl=')

  //Pesquisa

  const Term1 = '0';
  const SInput = await page.$('[name = "q"]');
  await SInput.type(Term1)
  await SInput.press('Enter')

  // Loop de Pesquisa Desktop + Edge
  setTimeout(async () => {

    await page.click("#bnp_btn_accept"); //Botão de cookie
    const data = () => {
      const d = new Date(); // pegar a data
      const year = d.getFullYear(); // pegar o Ano
      const months = ["01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11", "12"];  // lista dos meses
      const month = months[d.getMonth()]; // pegar o mes atual
      const date = d.getDate();  // pegar a data do dia 

      return `${month}/${date}/${year}` // retornar a data em formato MM/DD/YYYY
    }
    await page.goto(`https://www.bing.com/rewardsapp/flyout?channel=0&partnerId=&date=${data()}`);
    let earningsData = "00/00";// zerar o formato dos dados

    if (await page.locator(`.align_left.fc_50pct > .mfo_c_es > div`).count() > 0) {
      earningsData = await page.$eval(`.align_left.fc_50pct > .mfo_c_es > div`, el => el.innerText) // pegar os dados no formato 50%
    };

    if (await page.locator(`.align_left.fc_33pct > .mfo_c_es > div`).count() > 0) {
      earningsData = await page.$eval(`.align_left.fc_33pct > .mfo_c_es > div`, el => el.innerText) // pegar os dados no formato 33%
    };
    const earningsOfTheDay = earningsData; // vai procurar os ganhos do dia, ele tem formatos diferentes de layout, sera retornado aquele que existe

    //  pegar o texto limite de pontos
    const earningsIndex = earningsOfTheDay.lastIndexOf("/");  // pegar o index do limite de pontos
    const earningsLimit = parseInt(earningsOfTheDay.substr(earningsIndex + 1)); // pegar o limite de pontos

    await page.goto('https://www.bing.com/search?q=0&qs=n&form=QBRE&sp=-1&pq=&sc=10-0&sk=&cvid=AE59F13D55AE4443A173E4DA65169A6E&ghsh=0&ghacc=0&ghpl=') // voltar para o Bing

    await page.click("#bnp_btn_accept"); //Botão de cookie

    for (let i = 1; i <= earningsLimit / 3; i++) {

      await page.click('#sb_form_q'); //Botão do form
      await page.click('#sw_clx');    //Botão para limpar o form

      await page.click('#sb_form_q');
      const Input = await page.$('#sb_form_q');
      await Input.type(`Pesquisa Numero ${i}`);
      await Input.press('Enter');

      await new Promise(resolve => setTimeout(resolve, 500));
    }

    await page.click('#sb_form_q');
    await page.click('#sw_clx');

    await page.click('#sb_form_q');
    const Input = await page.$('#sb_form_q');
    await Input.type(`Por Hoje é Só, no desktop 👏👏👏`);

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

    await page.waitForTimeout(10000)
    await browser.close();

  }, 5000);



}

main()