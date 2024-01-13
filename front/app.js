import { getAPI } from "./config.js";

const API_KEY = getAPI();
const URL_GEOCODE = "https://maps.googleapis.com/maps/api/geocode/json?";

alert(
  "C'est un serveur gratuit, il est possible que les données prennent du temps à charger, 1 minute environ (appuyer sur OK pour charger)"
);

document.addEventListener("DOMContentLoaded", function () {
  document.getElementById("exportPDFButton").addEventListener("click", exportToPDF);
  document.getElementById("exportPDFButton").addEventListener("click", exportToPDF);
  document.getElementById("banWordButton").addEventListener("click", banWord);
  document.getElementById("addMyCompagnyButton").addEventListener("click", addMyCompagny);
  document.getElementById("saveParametersButton").addEventListener("click", (event) => {
    saveParameters(event);
  });
});

let map;

function initMapAsync() {
  return new Promise((resolve, reject) => {
    window.initMap = async function () {
      try {
        const city = await getParam();
        const location = await getLocationFromParam(city);
        const options = {
          center: location,
          zoom: 12,
        };

        map = new google.maps.Map(document.getElementById("map"), options);
        resolve();
      } catch (error) {
        reject(error);
      }
    };
  });
}

const script = document.createElement("script");
script.defer = true;
script.src = `https://maps.googleapis.com/maps/api/js?key=${API_KEY}&callback=initMap`;

document.head.appendChild(script);

initMapAsync();

async function initMapWElement(element) {
  var options = {
    center: element.coords,
    zoom: 16,
  };
  map = new google.maps.Map(document.getElementById("map"), options);
  addMarker(element);
  window.scrollTo(0, 0);
}

function addMarker(element) {
  if (
    !(
      (element.coords.lat === 45.764043 && element.coords.lng === 4.835659) ||
      (element.coords.lat === 45.771274 && element.coords.lng === 4.884451) ||
      (element.coords.lat === 45.771944 && element.coords.lng === 4.8901709)
    )
  ) {
    if (element.met == false) {
      const marker = new google.maps.Marker({
        position: element.coords,
        map: map,
      });
    } else {
      const marker = new google.maps.Marker({
        position: element.coords,
        map: map,
        icon: {
          path: google.maps.SymbolPath.BACKWARD_CLOSED_ARROW,
          fillColor: "green",
          fillOpacity: 1,
          strokeColor: "black",
          strokeWeight: 2,
          scale: 8,
        },
      });
    }
  }
}

function wrongpassword() {
  const text = document.getElementById("passwordText");
  text.innerText = "Mot de passe incorrect";
  text.style.color = "red";
}

async function checkPassword() {
  try {
    const password = document.getElementById("password").value;

    if (password === "") {
      const text = document.getElementById("passwordText");
      text.innerText = "Veuillez entrer un mot de passe";
      text.style.color = "red";
      return { success: false };
    } else {
      const response = await fetch("https://searchngo.onrender.com/setting/password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      return await response.json();
    }
  } catch (error) {
    console.error(error);
  }
}

async function saveParameters(event) {
  event.preventDefault();
  const password = await checkPassword();
  if (password.success === true) {
    const formData = new FormData(document.getElementById("paramForm"));
    const data = {};
    for (const [key, value] of formData.entries()) {
      data[key] = value;
    }
    const response = await fetch("https://searchngo.onrender.com/setting/chips", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    location.reload();
  } else if (password.success === false) {
    wrongpassword();
  }
}

function exportToPDF() {
  window.jsPDF = window.jspdf.jsPDF;
  var doc = new jsPDF();

  function shouldExcludeCell(cell) {
    return cell.classList.contains("exclude-from-pdf");
  }

  function addRowToPDF(row) {
    const cells = row.cells;
    const rowData = [];

    const columnWidths = [50, 80, 80];

    for (let i = 0; i < cells.length; i++) {
      if (!shouldExcludeCell(cells[i])) {
        let cellContent;

        const inputElement = cells[i].querySelector("input");
        if (inputElement) {
          cellContent = inputElement.value;
        } else {
          cellContent = cells[i].innerText;
        }

        const styles = {
          columnWidth: columnWidths[i],
          cellWidth: "auto",
          overflow: "linebreak",
        };

        rowData.push({ content: cellContent, styles });
      }
    }

    doc.autoTable({
      body: [rowData],
    });
  }

  const tableRows = document.getElementById("summary").rows;
  for (let i = 0; i < tableRows.length; i++) {
    addRowToPDF(tableRows[i]);
  }

  doc.save("table.pdf");
}

async function loadTable(data) {
  try {
    const param = data.param;
    const response = await fetch(
      `https://searchngo.onrender.com/data/allCompagnies/${param}`
    );
    const json = await response.json();
    json.forEach((element) => {
      var newTR = document.createElement("tr");
      var entrepriseTD = document.createElement("td");

      var entrepriseLink = document.createElement("a");
      entrepriseLink.innerText = element.compagny_name;
      entrepriseLink.onclick = () => initMapWElement(element);
      entrepriseLink.style.textDecoration = "underline";
      entrepriseLink.style.color = "purple";
      entrepriseTD.appendChild(entrepriseLink);
      var adressTD = document.createElement("td");
      var inputAdress = document.createElement("input");
      adressTD.appendChild(inputAdress);
      inputAdress.value = element.address;
      inputAdress.id = `${element.id}`;
      inputAdress.style.width = "100%";
      adressTD.style.width = "40%";
      inputAdress.style.whiteSpace = "nowrap";
      var titleTD = document.createElement("td");
      titleTD.innerText = element.title;
      var optionTD = document.createElement("td");
      optionTD.className = "exclude-from-pdf";

      var button1 = document.createElement("button");
      button1.innerText = "Ban Entreprise";
      button1.addEventListener("click", () => banCompagnie(element));

      var button2 = document.createElement("button");
      button2.innerText = "Ban Titre";
      button2.addEventListener("click", () => banTitle(element));

      var button3 = document.createElement("button");
      button3.innerText = "Changer adresse manuellement";
      button3.addEventListener("click", () => changeAdress(element));

      optionTD.appendChild(button1);
      optionTD.appendChild(button2);
      optionTD.appendChild(button3);

      if (element.met == false) {
        var button4 = document.createElement("button");
        button4.innerText = "CV déposé";
        button4.addEventListener("click", () => metCompagny(element));
        optionTD.appendChild(button4);
      } else {
        entrepriseTD.style.backgroundColor = "green";
        entrepriseLink.style.fontWeight = "bold";
      }

      newTR.appendChild(entrepriseTD);
      newTR.appendChild(adressTD);
      newTR.appendChild(titleTD);
      newTR.appendChild(optionTD);
      const tbody = document.getElementById("tbody");
      tbody.appendChild(newTR);
      setTimeout(() => {
        addMarker(element);
      }, 200);
    });
  } catch (error) {
    console.error(error);
  }
}

async function changeAdress(element) {
  const password = await checkPassword();
  if (password.success === true) {
    try {
      const adress = document.getElementById(`${element.id}`).value;
      await fetch(
        `https://searchngo.onrender.com/data/changeAdress/${encodeURIComponent(
          element.compagny_name
        )}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ adress }),
        }
      ).then(() => {
        location.reload();
      });
    } catch (error) {
      console.error("Change Adress Fetch Error:", error);
    }
  } else if (password.success === false) {
    scrollTop();
    wrongpassword();
  }
}

async function metCompagny(element) {
  const password = await checkPassword();
  if (password.success === true) {
    try {
      const response = await fetch(
        `https://searchngo.onrender.com/data/metCompagny/${encodeURIComponent(
          element.compagny_name
        )}`,
        {
          method: "PUT",
        }
      ).then((response) => {
        const adress = document.getElementById(`${element.id}`);
        adress.style.color = "green";
        adress.style.fontWeight = "bold";
      });
    } catch (error) {
      console.error("Met Compagny Fetch Error:", error);
    }
  } else if (password.success === false) {
    scrollTop();
    wrongpassword();
  }
}

function scrollTop() {
  window.scrollTo({
    top: 0,
    behavior: "smooth",
  });
}

async function banWord() {
  const password = await checkPassword();
  if (password.success === true) {
    try {
      const input = document.getElementById("banThing");
      const word = input.value;
      const body = [word];
      const response = await fetch("https://searchngo.onrender.com/setting/banWords", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      }).then((response) => {
        location.reload();
      });
    } catch (error) {
      console.error(error);
    }
  } else if (password.success === false) {
    scrollTop();
    wrongpassword();
  }
}

async function banCompagnie(element) {
  const password = await checkPassword();
  if (password.success === true) {
    const response = await fetch("https://searchngo.onrender.com/setting/banCompagnie", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(element),
    })
      .then((response) => {
        response.json();
        location.reload();
      })
      .catch((error) => console.error(error));
  } else if (password.success === false) {
    scrollTop();
    wrongpassword();
  }
}

async function banTitle(element) {
  const password = await checkPassword();
  if (password.success === true) {
    const response = await fetch("https://searchngo.onrender.com/setting/banTitle", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(element),
    })
      .then((response) => {
        response.json();
        location.reload();
      })
      .catch((error) => console.log(error));
  } else if (password.success === false) {
    scrollTop();
    wrongpassword();
  }
}

async function getParam() {
  const response = await fetch("https://searchngo.onrender.com/setting/parameter");
  const data = await response.json();
  const param = data[0].param;
  const location = data[0].location;
  const lrad = data[0].lrad;
  loadParameter(param, location, lrad);
  loadTable(data[0]);
  return location;
}

function loadParameter(param, location, lrad) {
  document.getElementById("keyword").value = param;
  document.getElementById("location").value = location;
  const lradSelect = document.getElementById("lrad");

  for (let i = 0; i < lradSelect.options.length; i++) {
    const option = lradSelect.options[i];
    if (option.value == lrad) {
      option.selected = true;
    } else {
      option.selected = false;
    }
  }
}

async function getLocationFromParam(location) {
  try {
    const response = await fetch(
      `${URL_GEOCODE}address=${encodeURIComponent(location)}&key=${API_KEY}`
    );

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();
    const coord = data.results[0].geometry.location;
    return coord;
  } catch (error) {
    console.error("Error:", error);
  }
}

async function addMyCompagny() {
  console.log("addMyCompagny");
  const password = await checkPassword();
  if (password.success === true) {
    try {
      const name = document.getElementById("compagnyName").value;
      const loc = document.getElementById("compagnyLocation").value;
      const loca = loc.toLowerCase();
      const param = document.getElementById("keyword").value;
      const data = {
        compagny_name: name,
        location: loca,
        q_parameter: param,
      };

      const response = await fetch("https://searchngo.onrender.com/data/addCompagny", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      }).then((response) => {
        console.log("je reload");
        location.reload();
      });
    } catch (error) {
      console.error(error);
    }
  } else if (password.success === false) {
    wrongpassword();
  }
}
