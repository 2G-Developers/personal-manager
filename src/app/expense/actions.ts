"use server";

export const expenseAction = async (prevState, formData) => {
  const payload = {
    name: formData.get("name"),
    category: formData.get("category"),
    type: formData.get("type"),
    date: new Date(formData.get("date")).toUTCString(),
    amount: formData.get("amount"),
  };

  const res = await fetch("http://localhost:3000/api/expenses", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });
  const json = await res.json();

  return json;
};
