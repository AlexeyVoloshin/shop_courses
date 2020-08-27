const numFormat = (num) => {
  return new Intl.NumberFormat("ru-RU", {
    currency: "usd",
    style: "currency",
  }).format(num);
};
const dateFormat = (date) => {
  return new Intl.DateTimeFormat("ru-RU", {
    day: "2-digit",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  }).format(new Date(date));
};
document.querySelectorAll(".price").forEach((node) => {
  node.textContent = numFormat(node.textContent);
});

const $date = document.querySelector(".date");
if ($date) {
  $date.textContent = dateFormat($date.textContent);
}

const $basket = document.querySelector("#basket");
if ($basket) {
  $basket.addEventListener("click", (event) => {
    if (event.target.classList.contains("js-remove")) {
      const id = event.target.dataset.id;
      const csrf = event.target.dataset.csrf;
      fetch("/basket/remove/" + id, {
        method: "delete",
        headers: {
          'X-XSRF-TOKEN': csrf
        }
      }).then((res) =>
        res.json().then((basket) => {
          if (basket.courses.length) {
            const html = basket.courses
              .map((c) => {
                return `
                    <tr>
                        <td>${c.title}</td>
                        <td>${c.count}</td>
                        <td>
                            <button class="btn btm-small js-remove" data-id="${c.id}">Удалить</button>
                        </td>
                    </tr>
                    `;
              })
              .join(""); //приводим к строке
            $basket.querySelector("tbody").innerHTML = html;
            $basket.querySelector(".price").textContent = numFormat(
              basket.price
            );
          } else {
            $basket.innerHTML = `<p>Корзина пуста</p>`;
          }
        })
      );
    }
  });
}

M.Tabs.init(document.querySelector(".tabs"));
