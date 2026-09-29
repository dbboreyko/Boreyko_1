
const cartItems = [150, 0, 45, 320, 0, 85];

let totalCartSum = 0;
let finalToPay = 0;
let acceptedCash = 0;

function initCart() {
  const container = document.getElementById("cartChips");
  if (!container) return;
  container.innerHTML = "";
  for (let i = 0; i < cartItems.length; i++) {
    const price = cartItems[i];
    const chip = document.createElement("span");
    chip.className = `px-3 py-1.5 rounded-lg text-xs font-bold border ${
      price === 0
        ? "bg-amber-50 text-amber-700 border-amber-200"
        : "bg-slate-100 text-slate-700 border-slate-200"
    }`;
    chip.textContent = price === 0 ? "Подарунок (0 ₴)" : `${price} ₴`;
    container.appendChild(chip);
  }
}

function calculateCart() {
  let rawSum = 0;

  for (let i = 0; i < cartItems.length; i++) {
    if (cartItems[i] === 0) {
      continue;
    }
    rawSum += cartItems[i] * 1.2;
  }

  totalCartSum = Number(rawSum.toFixed(2));
  finalToPay = totalCartSum;

  const rawTotalElem = document.getElementById("receiptRawTotal");
  const toPayElem = document.getElementById("receiptToPay");
  const receiptItems = document.getElementById("receiptItems");

  if (rawTotalElem) rawTotalElem.textContent = `${totalCartSum.toFixed(2)} грн`;
  if (toPayElem) toPayElem.textContent = `${finalToPay.toFixed(2)} грн`;

  if (receiptItems) {
    receiptItems.innerHTML = "";
    for (let i = 0; i < cartItems.length; i++) {
      if (cartItems[i] === 0) continue;
      const itemRow = document.createElement("div");
      itemRow.className = "flex justify-between";
      itemRow.innerHTML = `<span>Товар ${i + 1} (+20% ПДВ)</span><span>${(
        cartItems[i] * 1.2
      ).toFixed(2)} грн</span>`;
      receiptItems.appendChild(itemRow);
    }
  }

  console.log(`Загальна сума чека з ПДВ (20%): ${totalCartSum.toFixed(2)} грн`);

  const btnApplyBonuses = document.getElementById("btnApplyBonuses");
  if (btnApplyBonuses) btnApplyBonuses.disabled = false;
}

function validatePromoCode(promoCode) {
  let digitCount = 0;
  let letterCount = 0;
  let isValid = true;

  for (const char of promoCode) {
    if (char === "-") {
      continue;
    }

    const code = char.charCodeAt(0);

    if (code >= 48 && code <= 57) {
      digitCount++;
    } else if ((code >= 65 && code <= 90) || (code >= 97 && code <= 122)) {
      letterCount++;
    } else {
      isValid = false;
      break;
    }
  }

  if (!isValid) {
    console.log("Помилка зчитування купона: виявлено заборонений символ.");
    return false;
  }

  console.log(
    `Промокод введено! Цифр: ${digitCount}, Латинських літер: ${letterCount}`
  );
  return true;
}

function applyBonuses() {
  const bonusInput = document.getElementById("bonusBalanceInput");
  let bonusBalance = bonusInput ? parseFloat(bonusInput.value) : 0;
  if (isNaN(bonusBalance) || bonusBalance < 0) bonusBalance = 0;

  const step = 50;
  const maxDiscount = totalCartSum * 0.5;
  let totalDiscount = 0;

  while (
    bonusBalance >= step &&
    totalDiscount + step <= maxDiscount
  ) {
    bonusBalance -= step;
    totalDiscount += step;
  }

  finalToPay = Number((totalCartSum - totalDiscount).toFixed(2));

  const discountElem = document.getElementById("receiptDiscount");
  const toPayElem = document.getElementById("receiptToPay");

  if (discountElem)
    discountElem.textContent = `-${totalDiscount.toFixed(2)} грн`;
  if (toPayElem) toPayElem.textContent = `${finalToPay.toFixed(2)} грн`;

  const bonusStepsContainer = document.getElementById("bonusStepsContainer");
  if (bonusStepsContainer) {
    bonusStepsContainer.classList.remove("hidden");
    bonusStepsContainer.innerHTML = `
      <div>Списано бонусів: <strong>${totalDiscount}</strong> балів</div>
      <div>Залишок на картці: <strong>${bonusBalance}</strong> балів</div>
      <div>Сума до сплати: <strong>${finalToPay.toFixed(2)} грн</strong></div>
    `;
  }

  console.log(`Списано бонусів: ${totalDiscount}`);
  console.log(`Сума до сплати з бонусами: ${finalToPay.toFixed(2)} грн`);

  const btnValidateCash = document.getElementById("btnValidateCash");
  if (btnValidateCash) btnValidateCash.disabled = false;
}

function validateCashInput() {
  const cashInputElem = document.getElementById("cashInput");
  const validationMsg = document.getElementById("validationMsg");

  let inputValue = cashInputElem ? cashInputElem.value : "";
  let isValid = false;
  let enteredCash = 0;

  do {
    enteredCash = Number(inputValue);
    if (
      inputValue !== "" &&
      inputValue !== null &&
      !isNaN(enteredCash) &&
      enteredCash >= finalToPay &&
      enteredCash > 0
    ) {
      isValid = true;
    } else {
      isValid = false;
      break;
    }
  } while (false);

  if (isValid) {
    acceptedCash = enteredCash;
    if (validationMsg) {
      validationMsg.textContent = "Суму успішно прийнято!";
      validationMsg.className = "text-xs text-emerald-600 font-bold";
    }

    const receiptCash = document.getElementById("receiptCash");
    if (receiptCash)
      receiptCash.textContent = `${acceptedCash.toFixed(2)} грн`;

    console.log(`Внесено готівки: ${acceptedCash.toFixed(2)} грн`);

    const btnCalculateChange = document.getElementById("btnCalculateChange");
    if (btnCalculateChange) btnCalculateChange.disabled = false;
  } else {
    if (validationMsg) {
      validationMsg.textContent =
        "Некоректна сума! Введіть число, яке дорівнює або перевищує суму до сплати.";
      validationMsg.className = "text-xs text-rose-600 font-bold";
    }
    console.log("Помилка введення готівки.");
  }
}

function calculateChange() {
  let change = Number((acceptedCash - finalToPay).toFixed(2));

  const receiptChange = document.getElementById("receiptChange");
  if (receiptChange) receiptChange.textContent = `${change.toFixed(2)} грн`;

  console.log(`Загальна решта: ${change.toFixed(2)} грн`);

  const banknotes = [500, 200, 100, 50, 20, 10, 5, 2, 1];
  let changeInUah = Math.floor(change);

  const container = document.getElementById("banknotesResult");
  if (container) container.innerHTML = "";

  let i = 0;
  while (i < banknotes.length && changeInUah > 0) {
    const denomination = banknotes[i];
    const count = Math.floor(changeInUah / denomination);

    if (count > 0) {
      changeInUah = changeInUah % denomination;

      console.log(`Купюра ${denomination} грн: ${count} шт.`);

      if (container) {
        const item = document.createElement("div");
        item.className =
          "p-2 bg-purple-50 border border-purple-200 rounded-xl text-center";
        item.innerHTML = `
          <div class="text-xs text-purple-600 font-bold">${denomination} ₴</div>
          <div class="text-lg font-black text-purple-900">${count} шт.</div>
        `;
        container.appendChild(item);
      }
    }
    i++;
  }
}

function resetAll() {
  totalCartSum = 0;
  finalToPay = 0;
  acceptedCash = 0;

  const rawTotal = document.getElementById("receiptRawTotal");
  const discount = document.getElementById("receiptDiscount");
  const toPay = document.getElementById("receiptToPay");
  const cash = document.getElementById("receiptCash");
  const change = document.getElementById("receiptChange");
  const items = document.getElementById("receiptItems");
  const bonusContainer = document.getElementById("bonusStepsContainer");
  const banknotesResult = document.getElementById("banknotesResult");
  const cashInput = document.getElementById("cashInput");
  const validationMsg = document.getElementById("validationMsg");

  if (rawTotal) rawTotal.textContent = "0.00 грн";
  if (discount) discount.textContent = "-0.00 грн";
  if (toPay) toPay.textContent = "0.00 грн";
  if (cash) cash.textContent = "0.00 грн";
  if (change) change.textContent = "0.00 грн";
  if (items)
    items.innerHTML =
      '<p class="text-slate-400 italic">Натисніть "Розрахувати кошик"...</p>';

  if (bonusContainer) {
    bonusContainer.classList.add("hidden");
    bonusContainer.innerHTML = "";
  }
  if (banknotesResult) banknotesResult.innerHTML = "";
  if (cashInput) cashInput.value = "";
  if (validationMsg) validationMsg.textContent = "";

  const btnApplyBonuses = document.getElementById("btnApplyBonuses");
  const btnValidateCash = document.getElementById("btnValidateCash");
  const btnCalculateChange = document.getElementById("btnCalculateChange");

  if (btnApplyBonuses) btnApplyBonuses.disabled = true;
  if (btnValidateCash) btnValidateCash.disabled = true;
  if (btnCalculateChange) btnCalculateChange.disabled = true;

  initCart();
}

document.addEventListener("DOMContentLoaded", initCart);