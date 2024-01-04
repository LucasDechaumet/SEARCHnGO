const API_KEY = "AIzaSyDOgFs-JgriH3ynNbEvANBEwtu8Z4U_aSA";
const URL_GEOCODE = "https://maps.googleapis.com/maps/api/geocode/json?";

async function initMap() {
  const city = await getParam();
  const location = await getLocationFromParam(city);
  var options = {
    center: location,
    zoom: 12,
  };

  map = new google.maps.Map(document.getElementById("map"), options);
}

async function initMapWElement(element) {
  var options = {
    center: element.coords,
    zoom: 16,
  };
  map = new google.maps.Map(document.getElementById("map"), options);
  addMarker(element);
}

function addMarker(element) {
  if (!(element.coords.lat === 45.764043 && element.coords.lng === 4.835659)) {
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

async function saveParameters() {
  const formData = new FormData(document.getElementById("paramForm"));
  event.preventDefault();
  const data = {};
  for (const [key, value] of formData.entries()) {
    data[key] = value;
  }
  console.log(data);
  const response = await fetch("http://localhost:3000/setting/chips", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  })
    .then((response) => response.json())
    .catch((error) => console.log(error));
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
    const response = await fetch(`http://localhost:3000/data/allCompagnies/${param}`);
    const json = await response.json();
    json.forEach((element) => {
      var newTR = document.createElement("tr");
      var entrepriseTD = document.createElement("td");
      var entrepriseLink = document.createElement("a");
      entrepriseLink.innerText = element.compagny_name;
      entrepriseLink.onclick = () => initMapWElement(element);
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
        inputAdress.style.color = "green";
        inputAdress.style.fontWeight = "bold";
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
  try {
    const adress = document.getElementById(`${element.id}`).value;
    await fetch(
      `http://localhost:3000/data/changeAdress/${encodeURIComponent(
        element.compagny_name
      )}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ adress }),
      }
    ).then(() => location.reload());
  } catch (error) {
    console.error("Change Adress Fetch Error:", error);
  }
}

async function metCompagny(element) {
  try {
    const response = await fetch(
      `http://localhost:3000/data/metCompagny/${encodeURIComponent(
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
}

async function banWord() {
  try {
    const input = document.getElementById("banThing");
    const word = input.value;
    body = [word];
    const response = await fetch("http://localhost:3000/setting/banWords", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    }).then((response) => {
      input.value = "";
    });
  } catch (error) {
    console.error(error);
  }
}

async function banCompagnie(element) {
  console.log(JSON.stringify(element));
  const response = await fetch("http://localhost:3000/setting/banCompagnie", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(element),
  })
    .then((response) => {
      response.json();
      location.reload();
    })
    .catch((error) => console.error(error));
}

async function banTitle(element) {
  console.log(JSON.stringify(element));
  const response = await fetch("http://localhost:3000/setting/banTitle", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(element),
  })
    .then((response) => {
      response.json();
      location.reload();
    })
    .catch((error) => console.log(error));
}

async function getParam() {
  const response = await fetch("http://localhost:3000/setting/parameter");
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
