import { useState } from "react";

const basePrices = [
  { squareFeet: 700, bedrooms: 1, bathrooms: 1, weekly: 125, biweekly: 137.5, monthly: 162.5, deep: 250 },
  { squareFeet: 1000, bedrooms: 2, bathrooms: 1.5, weekly: 145, biweekly: 159.5, monthly: 188.5, deep: 290 },
  { squareFeet: 1500, bedrooms: 3, bathrooms: 2, weekly: 165, biweekly: 181.5, monthly: 214.5, deep: 330 },
  { squareFeet: 2000, bedrooms: 4, bathrooms: 2.5, weekly: 185, biweekly: 203.5, monthly: 240.5, deep: 370 },
  { squareFeet: 2500, bedrooms: 5, bathrooms: 3, weekly: 205, biweekly: 225.5, monthly: 266.5, deep: 410 },
  { squareFeet: 3000, bedrooms: 6, bathrooms: 3.5, weekly: 225, biweekly: 247.5, monthly: 292.5, deep: 450 },
  { squareFeet: 3500, bedrooms: 7, bathrooms: 4, weekly: 245, biweekly: 269.5, monthly: 318.5, deep: 490 },
  { squareFeet: 4000, bedrooms: 8, bathrooms: 4.5, weekly: 265, biweekly: 291.5, monthly: 344.5, deep: 530 },
  { squareFeet: 4500, bedrooms: 9, bathrooms: 5, weekly: 285, biweekly: 313.5, monthly: 370.5, deep: 570 },
  { squareFeet: 5000, bedrooms: 10, bathrooms: 5.5, weekly: 305, biweekly: 335.5, monthly: 396.5, deep: 610 },
  { squareFeet: 6000, bedrooms: 10, bathrooms: 6, weekly: 350, biweekly: 385, monthly: 455, deep: 700 },
  { squareFeet: 7000, bedrooms: 10, bathrooms: 6, weekly: 380, biweekly: 418, monthly: 494, deep: 760 },
  { squareFeet: 8000, bedrooms: 10, bathrooms: 6, weekly: 410, biweekly: 451, monthly: 533, deep: 820 },
  { squareFeet: 9000, bedrooms: 10, bathrooms: 6, weekly: 440, biweekly: 484, monthly: 572, deep: 880 },
];

function matchBasePrice(form) {
  const matches = basePrices.filter(row => row.squareFeet === form.squareFeet);
  if (!matches.length) return basePrices[0];

  let best = matches[0];
  let minDiff = Infinity;

  for (const row of matches) {
    const diff = Math.abs(row.bedrooms - form.bedrooms) + Math.abs(row.bathrooms - form.bathrooms);
    if (diff < minDiff) {
      best = row;
      minDiff = diff;
    }
  }
  return best;
}

export default function CleaningCalculator() {
  const [form, setForm] = useState({
    squareFeet: 700,
    bedrooms: 1,
    bathrooms: 1,
    kitchens: 1,
    diningRooms: 1,
    livingRooms: 1,
    offices: 0,
    closets: 0,
    laundryRooms: 0,
    pets: false,
    kids: false,
    basement: false,
    basementSize: "none",
    oven: false,
    fridge: false,
    floorTypes: {},
    markup: 0,
    generalIncrease: 0,
  });

  const [authenticated, setAuthenticated] = useState(false);
  const [inputPassword, setInputPassword] = useState("");
  const correctPassword = "asdf";

  if (!authenticated) {
    return (
      <div className="min-h-screen bg-black text-white flex flex-col justify-center items-center">
        <h1 className="text-2xl mb-4">Enter Password</h1>
        <input
          type="password"
          placeholder="Password"
          value={inputPassword}
          onChange={(e) => setInputPassword(e.target.value)}
          className="p-2 rounded bg-zinc-800 border border-zinc-700 mb-2"
        />
        <button
          onClick={() => {
            if (inputPassword === correctPassword) setAuthenticated(true);
            else alert("Incorrect password");
          }}
          className="px-4 py-2 bg-blue-500 rounded"
        >
          Enter
        </button>
      </div>
    );
  }

  const handleChange = (key, value) => {
    setForm(prev => ({ ...prev, [key]: value }));
  };

  const handleCheckbox = key => {
    setForm(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const calculateTotal = () => {
    const base = matchBasePrice(form);
    const markupFactor = 1 + ((Number(form.markup) || 0) + (Number(form.generalIncrease) || 0)) / 100;

    let weekly = base.weekly;

    const bedroomDiff = form.bedrooms - base.bedrooms;
    if (bedroomDiff > 0) weekly += bedroomDiff * 10;

    const bathroomDiff = form.bathrooms - base.bathrooms;
    if (bathroomDiff > 0) weekly += bathroomDiff * 7;

    if (form.pets) weekly += 5;
    if (form.kids) weekly += 5;
    if (form.basement) {
      if (form.basementSize === "small") weekly += 30;
      if (form.basementSize === "medium") weekly += 50;
      if (form.basementSize === "large") weekly += 80;
    }

    weekly += form.kitchens * 10;
    weekly += form.diningRooms * 10;
    weekly += form.livingRooms * 10;
    weekly += form.laundryRooms * 10;
    weekly += form.offices * 15;
    weekly += form.closets * 15;

    if (form.oven) weekly += 30;
    if (form.fridge) weekly += 30;

    Object.entries(form.floorTypes).forEach(([key, value]) => {
      if (value !== "Carpet") {
        weekly += 5;
      }
    });

    weekly *= markupFactor;
    const biweekly = weekly * 1.1;
    const monthly = weekly * 1.3;
    const deep = weekly * 2;

    return {
      weekly: weekly.toFixed(2),
      biweekly: biweekly.toFixed(2),
      monthly: monthly.toFixed(2),
      deep: deep.toFixed(2),
    };
  };

  const totals = calculateTotal();

  return (
    <div className="min-h-screen bg-black text-white p-6">
      <h1 className="text-3xl font-bold text-blue-400 text-center mb-4">The MaidFy Cleaning Estimate Calculator</h1>

      <div className="max-w-5xl mx-auto mb-6 grid grid-cols-2 gap-4 text-center">
        <div className="bg-zinc-800 rounded-lg p-4">📅 Weekly: <strong>${totals.weekly}</strong></div>
        <div className="bg-zinc-800 rounded-lg p-4">💰 Bi-weekly: <strong>${totals.biweekly}</strong></div>
        <div className="bg-zinc-800 rounded-lg p-4">📆 Monthly: <strong>${totals.monthly}</strong></div>
        <div className="bg-zinc-800 rounded-lg p-4">🍊 Deep Clean: <strong>${totals.deep}</strong></div>
      </div>

      <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6 bg-zinc-900 p-6 rounded-xl shadow-xl">
        <div>
          <div className="mb-4">
            <label>Increase or Discount (%):</label>
            <input
              type="number"
              className="w-full p-2 rounded bg-zinc-800 border border-zinc-700"
              value={form.generalIncrease}
              onChange={(e) => handleChange("generalIncrease", parseFloat(e.target.value))}
            />
          </div>

          {[
            "squareFeet", "bedrooms", "bathrooms", "kitchens", "diningRooms", "livingRooms", "offices", "closets", "laundryRooms"
          ].map((field) => (
            <div key={field} className="mb-2">
              <label className="capitalize">{field.replace(/([A-Z])/g, ' $1')}:</label>
              {field === "squareFeet" ? (
                <select
                  className="w-full p-2 rounded bg-zinc-800 border border-zinc-700"
                  value={form[field]}
                  onChange={(e) => handleChange(field, parseInt(e.target.value))}
                >
                  {[700, 1000, 1500, 2000, 2500, 3000, 3500, 4000, 4500, 5000, 6000, 7000, 8000, 9000].map(val => (
                    <option key={val} value={val}>{val === 700 ? "Up to 700 sq ft" : `${val} sq ft`}</option>
                  ))}
                </select>
              ) : (
                <input
                  type="number"
                  step={field === "bathrooms" ? 0.5 : 1}
                  className="w-full p-2 rounded bg-zinc-800 border border-zinc-700"
                  value={form[field] || 0}
                  onChange={(e) => handleChange(field, parseFloat(e.target.value))}
                />
              )}
            </div>
          ))}

          <div className="flex flex-col gap-2 mt-2">
            <label><input type="checkbox" checked={form.pets} onChange={() => handleCheckbox("pets")} /> Pets</label>
            <label><input type="checkbox" checked={form.kids} onChange={() => handleCheckbox("kids")} /> Kids</label>
            <label><input type="checkbox" checked={form.basement} onChange={() => handleCheckbox("basement")} /> Includes Basement</label>
            {form.basement && (
              <select className="mt-1 p-2 rounded bg-zinc-800 border border-zinc-700" value={form.basementSize} onChange={(e) => handleChange("basementSize", e.target.value)}>
                <option value="none">------</option>
                <option value="small">Small (+$30)</option>
                <option value="medium">Medium (+$50)</option>
                <option value="large">Large (+$80)</option>
              </select>
            )}
            <label><input type="checkbox" checked={form.oven} onChange={() => handleCheckbox("oven")} /> Inside Oven</label>
            <label><input type="checkbox" checked={form.fridge} onChange={() => handleCheckbox("fridge")} /> Inside Fridge</label>
          </div>
        </div>

        <div>
          <h2 className="text-xl font-semibold text-blue-400 mb-4">Room Floor Types</h2>
          {[
            ...Array.from({ length: form.bedrooms }, (_, i) => `Bedroom ${i + 1}`),
            ...Array.from({ length: form.diningRooms }, (_, i) => `Dining Room ${i + 1}`),
            ...Array.from({ length: form.livingRooms }, (_, i) => `Living Room ${i + 1}`),
            ...Array.from({ length: form.offices }, (_, i) => `Office ${i + 1}`)
          ].map((label) => (
            <div key={label} className="mb-2">
              <label>{label} Floor:</label>
              <select
                className="w-full p-2 rounded bg-zinc-800 border border-zinc-700"
                value={form.floorTypes[label] || "Carpet"}
                onChange={(e) =>
                  setForm((prev) => ({
                    ...prev,
                    floorTypes: {
                      ...prev.floorTypes,
                      [label]: e.target.value,
                    },
                  }))
                }
              >
                {["Carpet", "Hardwood", "Tile"].map((option) => (
                  <option key={option}>{option}</option>
                ))}
              </select>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

