const P, R, N, pie, line;
const loan_amt_slider = document.getElementById("loan-amount");
const int_rate_slider = document.getElementById("interest-rate");
const loan_period_slider = document.getElementById("loan-period");

// update loan amount
loan_amt_slider.addEventListener("input", (self) => {
  document.querySelector("#loan-amt-text").innerText =
    parseInt(self.target.value).toLocaleString("en-US") + "€";
  P = parseFloat(self.target.value);
  displayDetails();
});

// update Rate of Interest
int_rate_slider.addEventListener("input", (self) => {
  document.querySelector("#interest-rate-text").innerText =
    self.target.value + "%";
  R = parseFloat(self.target.value);
  displayDetails();
});

// update loan period
loan_period_slider.addEventListener("input", (self) => {
  document.querySelector("#loan-period-text").innerText =
    self.target.value + " years";
  N = parseFloat(self.target.value);
  displayDetails();
});

// calculate total Interest payable
function calculateLoanDetails(p, r, emi) {
  /*
		p: principal
		r: rate of interest
		emi: monthly emi
	*/
  let totalInterest = 0;
  let yearlyInterest = [];
  let yearPrincipal = [];
  let years = [];
  let year = 1;
  let [counter, principal, interes] = [0, 0, 0];
  while (p > 0) {
    let interest = parseFloat(p) * parseFloat(r);
    p = parseFloat(p) - (parseFloat(emi) - interest);
    totalInterest += interest;
    principal += parseFloat(emi) - interest;
    interes += interest;
    if (++counter == 12) {
      years.push(year++);
      yearlyInterest.push(parseInt(interes));
      yearPrincipal.push(parseInt(principal));
      counter = 0;
    }
  }
  line.data.datasets[0].data = yearPrincipal;
  line.data.datasets[1].data = yearlyInterest;
  line.data.labels = years;
  return totalInterest;
}

// calculate details
function displayDetails() {
  let r = parseFloat(R) / 1200;
  let n = parseFloat(N) * 12;

  let num = parseFloat(P) * r * Math.pow(1 + r, n);
  let denom = Math.pow(1 + r, n) - 1;
  let emi = parseFloat(num) / parseFloat(denom);

  let payabaleInterest = calculateLoanDetails(P, r, emi);

  let opts = { style: "currency", currency: "EUR", minimumFractionDigits: 0 };

  document.querySelector("#cp").innerText = parseFloat(P).toLocaleString(
    "fr-FR",
    opts
  );

  document.querySelector("#ci").innerText = parseFloat(
    payabaleInterest
  ).toLocaleString("fr-FR", opts);

  document.querySelector("#ct").innerText = parseFloat(
    parseFloat(P) + parseFloat(payabaleInterest)
  ).toLocaleString("en-US", opts);

  document.querySelector("#price").innerText = parseFloat(emi).toLocaleString(
    "fr-FR",
    opts
  );

  pie.data.datasets[0].data[0] = P;
  pie.data.datasets[0].data[1] = payabaleInterest;
  pie.update();
  line.update();
}

// Initialize everything
function initialize() {
  document.querySelector("#loan-amt-text").innerText =
    parseInt(loan_amt_slider.value).toLocaleString("fr-FR") + "€";
  P = parseFloat(document.getElementById("loan-amount").value);

  document.querySelector("#interest-rate-text").innerText =
    int_rate_slider.value + "%";
  R = parseFloat(document.getElementById("interest-rate").value);

  document.querySelector("#loan-period-text").innerText =
    loan_period_slider.value + " years";
  N = parseFloat(document.getElementById("loan-period").value);

  line = new Chart(document.getElementById("lineChart"), {
    data: {
      datasets: [
        {
          type: "line",
          label: "Remboursent principal",
          borderColor: "rgb(37, 32, 92, 1)",
          data: [],
        },
        {
          type: "line",
          label: "Intérêts payés sur l'année",
          borderColor: "rgb(252, 121, 0, 1)",
          data: [],
        },
      ],
      labels: [],
    },
    options: {
      plugins: {
        title: {
          display: true,
          text: "Remboursement crédit par an",
        },
      },
      scales: {
        x: {
          title: {
            color: "grey",
            display: true,
            text: "Années passées",
          },
        },
        y: {
          title: {
            color: "grey",
            display: true,
            text: "Argent remboursé",
          },
        },
      },
    },
  });

  pie = new Chart(document.getElementById("pieChart"), {
    type: "doughnut",
    data: {
      labels: ["Principal", "Intérêts"],
      datasets: [
        {
          label: "Home Loan Details",
          data: [0, 0],
          backgroundColor: ["rgb(37, 32, 92, 1)", "rgb(252, 121, 0, 1)"],
          hoverOffset: 4,
        },
      ],
    },
    options: {
      plugins: {
        title: {
          display: true,
          text: "Coût total du crédit ",
        },
      },
    },
  });
  displayDetails();
}
initialize();
