function esc(text) {
  var div = document.createElement("div");
  div.textContent = text;
  return div.innerHTML;
}

function val(id) {
  return document.getElementById(id).value.trim();
}


function addGuest() {
  var name = val("gName");
  var phone = val("gPhone");
  var status = document.getElementById("gStatus").value;

  if (name === "") {
    alert("Please enter the guest name.");
    return;
  }

  var row = document.createElement("tr");
  row.innerHTML =
    "<td></td><td></td><td></td>" +
    "<td><button type='button' class='small' onclick='removeGuest(this)'>Remove</button></td>";
  row.cells[0].textContent = name;
  row.cells[1].textContent = phone;
  row.cells[2].textContent = status;
  document.getElementById("guestBody").appendChild(row);

  document.getElementById("gName").value = "";
  document.getElementById("gPhone").value = "";
  updateGuestCount();
}

function removeGuest(btn) {
  btn.parentNode.parentNode.remove();
  updateGuestCount();
}

function updateGuestCount() {
  var count = document.getElementById("guestBody").rows.length;
  document.getElementById("guestCount").textContent = "Total guests: " + count;
  updateTotal();
}


function addBudgetRow(item, cost) {
  var row = document.createElement("tr");
  row.innerHTML =
    "<td><input type='text' class='item' placeholder='Item name'></td>" +
    "<td><input type='number' class='cost' min='0'></td>" +
    "<td><button type='button' class='small' onclick='removeBudgetRow(this)'>Remove</button></td>";
  row.querySelector(".item").value = item;
  row.querySelector(".cost").value = cost;
  row.querySelector(".cost").oninput = updateTotal;
  document.getElementById("budgetBody").appendChild(row);
  updateTotal();
}

function removeBudgetRow(btn) {
  btn.parentNode.parentNode.remove();
  updateTotal();
}

function updateTotal() {

  var guests = document.getElementById("guestBody").rows.length;
  var plate = Number(document.getElementById("plate").value);
  var food = plate * guests;
  document.getElementById("foodLabel").textContent =
    "Food (" + plate + " x " + guests + " guests)";
  document.getElementById("foodCost").textContent = food;

  var costs = document.querySelectorAll(".cost");
  var total = food;
  for (var i = 0; i < costs.length; i++) {
    total += Number(costs[i].value);
  }
  document.getElementById("total").textContent = total;
}

function generateReport() {
  var html = "<div class='report-box' id='reportBox'>";

  
  var who = val("name") || "Birthday Party";
  var age = val("age");
  html += "<h3>" + esc(who) + (age ? " turns " + esc(age) : "") + "</h3>";

  html += "<h4>Details</h4>";
  html += "<p>Date: " + esc(val("date") || "-") + "</p>";
  html += "<p>Time: " + esc(val("time") || "-") + "</p>";
  html += "<p>Venue: " + esc(val("venue") || "-") + "</p>";
  html += "<p>Theme: " + esc(val("theme")) + "</p>";
  if (val("notes") !== "") {
    html += "<p>Notes: " + esc(val("notes")) + "</p>";
  }

  var guests = document.getElementById("guestBody").rows;
  var yes = 0, maybe = 0, no = 0;
  var guestHtml = "";
  for (var i = 0; i < guests.length; i++) {
    var status = guests[i].cells[2].textContent;
    if (status === "Yes") yes++;
    else if (status === "Maybe") maybe++;
    else no++;
    guestHtml += "<tr><td>" + esc(guests[i].cells[0].textContent) +
                 "</td><td>" + esc(guests[i].cells[1].textContent) +
                 "</td><td>" + esc(status) + "</td></tr>";
  }
  html += "<h4>Guests (" + guests.length + ")</h4>";
  html += "<p>Yes: " + yes + " | Maybe: " + maybe + " | No: " + no + "</p>";
  if (guests.length > 0) {
    html += "<table>" + guestHtml + "</table>";
  }

 
  var tasks = document.querySelectorAll(".checklist li");
  var done = 0;
  var taskHtml = "";
  for (var j = 0; j < tasks.length; j++) {
    var checked = tasks[j].querySelector("input").checked;
    if (checked) done++;
    taskHtml += "<p>" + (checked ? "[x] " : "[ ] ") +
                esc(tasks[j].querySelector("label").textContent) + "</p>";
  }
  html += "<h4>Checklist (" + done + "/" + tasks.length + " done)</h4>" + taskHtml;

 
  var items = document.querySelectorAll("#budgetBody tr");
  var budgetHtml = "<tr><td>" + esc(document.getElementById("foodLabel").textContent) +
                   "</td><td>&#8377; " + document.getElementById("foodCost").textContent + "</td></tr>";
  for (var k = 0; k < items.length; k++) {
    budgetHtml += "<tr><td>" + esc(items[k].querySelector(".item").value) +
                  "</td><td>&#8377; " + esc(items[k].querySelector(".cost").value) + "</td></tr>";
  }
  html += "<h4>Budget</h4><table>" + budgetHtml +
          "<tr><td><b>Total</b></td><td><b>&#8377; " +
          document.getElementById("total").textContent + "</b></td></tr></table>";

  html += "</div>";

  document.getElementById("report").innerHTML = html;
  document.getElementById("downloadBtn").disabled = false;
}

function downloadReport() {
  var box = document.getElementById("reportBox");
  if (!box) {
    alert("Generate the report first.");
    return;
  }
  if (typeof html2canvas === "undefined") {
    alert("Image library did not load. Please check your internet connection.");
    return;
  }
  html2canvas(box, { backgroundColor: "#ffffff", scale: 2 }).then(function (canvas) {
    var link = document.createElement("a");
    link.download = "birthday-report.png";
    link.href = canvas.toDataURL("image/png");
    link.click();
  });
}


addBudgetRow("Venue", 3000);
addBudgetRow("Cake", 1200);
addBudgetRow("Decorations", 1500);
