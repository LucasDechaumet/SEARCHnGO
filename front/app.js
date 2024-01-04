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

function addMarker(element) {
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
  doc.autoTable({ html: "#summary" });
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
      entrepriseTD.innerText = element.compagny_name;
      var adressTD = document.createElement("td");
      adressTD.innerText = element.address;
      var titleTD = document.createElement("td");
      titleTD.innerText = element.title;
      var optionTD = document.createElement("td");

      var button1 = document.createElement("button");
      button1.innerText = "Ban Entreprise";
      button1.addEventListener("click", () => banCompagnie(element));

      var button2 = document.createElement("button");
      button2.innerText = "Ban Titre";
      button2.addEventListener("click", () => banTitle(element));

      var button3 = document.createElement("button");
      button3.innerText = "Changer adresse manuellement";
      button3.addEventListener("click", function () {});
      optionTD.appendChild(button1);
      optionTD.appendChild(button2);
      optionTD.appendChild(button3);

      if (element.met == false) {
        var button4 = document.createElement("button");
        button4.innerText = "CV déposé";
        button4.addEventListener("click", () => metCompagny(element));
        optionTD.appendChild(button4);
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
    console.log("=============ERROR===========");
    console.log(error);
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
    );
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
    console.log(error);
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
    .catch((error) => console.log(error));
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
