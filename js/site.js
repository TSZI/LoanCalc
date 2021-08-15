function getValues() {
    let loanAmount = document.querySelector('#loanAmount').value;
    let loanPayments = document.querySelector('#loanPayments').value;
    let loanRate = document.querySelector('#loanRate').value;

    // validate
    loanAmount = parseFloat(loanAmount);
    loanPayments = parseInt(loanPayments);
    loanRate = parseFloat(loanRate);

    if (isNaN(loanAmount) === false && isNaN(loanPayments) === false && isNaN(loanRate) === false) {
        let loanArray = calculateValues(loanAmount, loanPayments, loanRate);
        displayValues(loanArray);
    } else {
        alert('Please enter values to calculate your loan payments');
        displayValues(null);
    }
}

function calculateValues(amount, payments, rate) {
    let retObj = {};
    let loanArray = [];

    let MonthlyPayment = Round2((amount * (rate / 1200)) / (1 - Math.pow(1 + rate / 1200, -Math.abs(payments))));

    let pPrincipal = 0;
    let pInterest = 0;
    let pTotalInterest = 0;
    let pBalance = amount;

    for (let i = 1; i <= payments; i++) {
        let obj = {};

        // local values
        pInterest = pBalance * (rate / 1200);
        pTotalInterest += pInterest;
        pPrincipal = MonthlyPayment - pInterest;
        pBalance -= pPrincipal;

        // values for the month
        obj.month = i;
        obj.payment = MonthlyPayment;
        obj.interest = Round2(pInterest);
        obj.principal = Round2(pPrincipal);
        obj.totalInterest = Round2(pTotalInterest);
        obj.balance = Round2(pBalance);

        // add month to array
        loanArray.push(obj);
    }

    // add values for display to return object
    retObj.loanArray = loanArray;
    retObj.payment = MonthlyPayment;
    retObj.totalPrincipal = amount;
    retObj.totalInterest = Round2(pTotalInterest);
    retObj.totalCost = Round2(amount + pTotalInterest);

    return retObj;
}

function displayValues(retObj) {
    let body = document.querySelector('#loanBody');
    let row = document.querySelector('#loanRow');

    // clear body
    body.innerHTML = '';

    // show table values
    if (retObj) {
        for (let i = 0; i < retObj.loanArray.length; i++) {
            let myRow = retObj.loanArray[i];
            let tableRow = document.importNode(row.content, true);
            let rowCols = tableRow.querySelectorAll('td');

            rowCols[0].textContent = myRow.month;
            rowCols[1].textContent = myRow.payment;
            rowCols[2].textContent = myRow.principal;
            rowCols[3].textContent = myRow.interest;
            rowCols[4].textContent = myRow.totalInterest;
            rowCols[5].textContent = myRow.balance;

            body.appendChild(tableRow);
        }
    }

    // show quick view values
    let payment = document.querySelector('#monthlyPayment');
    let totalPrincipal = document.querySelector('#totalPrincipal');
    let totalInterest = document.querySelector('#totalInterest');
    let totalCost = document.querySelector('#totalCost');

    if (retObj) {
        payment.innerHTML = formatter.format(retObj.payment);
        totalPrincipal.innerHTML = formatter.format(retObj.totalPrincipal);
        totalInterest.innerHTML = formatter.format(retObj.totalInterest);
        totalCost.innerHTML = formatter.format(retObj.totalCost);
    } else {
        payment.innerHTML = '-';
        totalPrincipal.innerHTML = '-';
        totalInterest.innerHTML = '-';
        totalCost.innerHTML = '-';
    }
}

function Round2(num) {
    return Math.round((num + Number.EPSILON) * 100) / 100;
}

const formatter = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' });
