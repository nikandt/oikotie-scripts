const source_url = "https://asunnot.oikotie.fi/myytavat-asunnot?locations=%5B%5B2,7,%22Uusimaa%22%5D%5D&cardType=100&habitationType%5B%5D=1&price%5Bmax%5D=230000&size%5Bmin%5D=22&newDevelopment=1&buildingType%5B%5D=1&buildingType%5B%5D=256&constructionYear%5Bmax%5D=2023";

async function transformStringToNumber(string) {
  const numericString = string.replace(/€|\s/g, '').replace(/,/, '.');
  const number = parseFloat(numericString);
  return number;
}

const cities = ["helsinki", "vantaa", "espoo", "turku", "tampere", "oulu", "kerrostalot", "rivitalo", "kuopio", "lahti", "pori", "kouvola", "lappeenranta", "jyv%C3%A4skyl%C3%A4", "vaasa", "h%C3%A4meenlinna"];

async function readFromWindow(_url) {
  return new Promise((resolve) => {
    const win = window.open(_url);

    win.addEventListener('load', async function() {
      var listingDetailsDiv = win.document.querySelectorAll('.listing-details')[1];
      var infoTableRows = listingDetailsDiv.querySelectorAll('.info-table__row');

      for (const row of infoTableRows) {
        var dtElement = row.querySelector('dt');

        if (dtElement.textContent.trim() === 'Myyntihinta') {
          var myyntihintaElement = row.querySelector('dd');
          var myyntihinta = myyntihintaElement.textContent.trim();

          var num = await transformStringToNumber(myyntihinta);
          console.log("Myyntihinta: " + num);

          if (num < 35000)
          {
               console.log("Cutoff at: " + win.location.href );
          }
        }
      }
      win.close();

      resolve();
    });
  });
}

async function runScript() {
  const els = document.getElementsByTagName("a");

  for (var i = 0, l = els.length; i < l; i++) {
    var el = els[i];
    if (el.href.includes('https://asunnot.oikotie.fi/myytavat-asunnot/')) {
      var target = el.href.split("/");
      lastelem = target.slice(-1).toString();

      if ( cities.indexOf(lastelem) === -1 )
      {
        await readFromWindow(el.href);
      }
    }
  }
}

(async () => {
  await runScript();
})();

