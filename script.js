let { jsPDF } = window.jspdf;

function addService() {
  const name = document.getElementById("serviceName").value.trim();
  const qty = Number(document.getElementById("serviceQty").value);
  const price = Number(document.getElementById("servicePrice").value);

  if (!name || qty <= 0 || price < 0) {
    alert("⚠️ Veuillez entrer des données valides");
    return;
  }

  const tbody = document.querySelector("#services tbody");
  const row = document.createElement("tr");

  row.innerHTML = `
    <td>${name}</td>
    <td>${qty}</td>
    <td>${price}</td>
    <td>${qty * price}</td>
    <td><button onclick="deleteRow(this)"><i data-lucide='trash-2'></i> Supprimer</button></td>
  `;
  tbody.appendChild(row);

  updateTotal();
  lucide.createIcons();

  document.getElementById("serviceName").value = "";
  document.getElementById("serviceQty").value = 1;
  document.getElementById("servicePrice").value = 0;
}

function deleteRow(btn) {
  btn.closest("tr").remove();
  updateTotal();
}

function updateTotal() {
  let total = 0;
  document.querySelectorAll("#services tbody tr").forEach(row => {
    total += Number(row.cells[3].textContent);
  });
  document.getElementById("total").textContent = total;
}

function generatePDF() {
  let doc = new jsPDF();

  let invoiceNumber = document.getElementById("invoiceNumber").value || "-";
  let clientName = document.getElementById("clientName").value || "-";
  let date = document.getElementById("date").value || "-";
  let total = document.getElementById("total").textContent;

  doc.setFontSize(16);
  doc.text(`Facture N°: ${invoiceNumber}`, 20, 20);
  doc.setFontSize(12);
  doc.text(`Client: ${clientName}`, 20, 30);
  doc.text(`Date: ${date}`, 20, 40);

  let rows = [];
  document.querySelectorAll("#services tbody tr").forEach(row => {
    let service = row.cells[0].textContent;
    let qty = row.cells[1].textContent;
    let price = row.cells[2].textContent;
    let lineTotal = row.cells[3].textContent;
    rows.push([service, qty, price, lineTotal]);
  });

  doc.autoTable({
    head: [["Service", "Quantité", "Prix", "Total"]],
    body: rows,
    startY: 50
  });

  doc.text(`Total: ${total} €`, 20, doc.lastAutoTable.finalY + 20);

  doc.save(`Facture-${invoiceNumber}.pdf`);
}
