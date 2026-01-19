import { useState } from "react";

const basePrices = Array.from({ length: 84 }, (_, i) => {
  const squareFeet = 700 + i * 100;
  const weekly = (100 + i * 3.9) * 0.6 * 1.2;

  return {
    squareFeet,
    weekly: parseFloat(weekly.toFixed(2)),
    biweekly: parseFloat((weekly * 1.15).toFixed(2)),
    monthly: parseFloat((weekly * 1.35).toFixed(2)),
    deep: parseFloat((weekly * 2).toFixed(2)),
  };
});

function getBasePrice(squareFeet) {
  const match = basePrices.find(row => row.squareFeet === squareFeet);
  return match || basePrices[0];
}

export default function CleaningCalculator() {
  const [form, setForm] = useState({
    propertyType: "house",
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
    basement: true,
    basementSize: "medium",
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
    const base = getBasePrice(form.squareFeet);
    const markupFactor = 1 + ((Number(form.markup) || 0) + (Number(form.generalIncrease) || 0)) / 100;

    let weekly = base.weekly;

    weekly += form.bedrooms * 10;
    weekly += form.bathrooms * 7;
    weekly += form.kitchens * 10;
    weekly += form.diningRooms * 10;
    weekly += form.livingRooms * 10;
    weekly += form.laundryRooms * 10;
    weekly += form.offices * 15;
    weekly += form.closets * 15;

    if (form.pets) weekly += 5;
    if (form.kids) weekly += 5;

    if (form.propertyType !== "apartment" && !form.basement) {
  if (form.squareFeet <= 2500) weekly -= 20;
  else if (form.squareFeet <= 5000) weekly -= 30;
  else weekly -= 40;
}

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
  const predefinedFields = ["bedrooms", "bathrooms", "kitchens", "diningRooms", "livingRooms", "offices", "closets", "laundryRooms"];

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
          <label>Property Type:</label>
          <select
            className="w-full p-2 rounded bg-zinc-800 border border-zinc-700"
            value={form.propertyType}
            onChange={(e) => handleChange("propertyType", e.target.value)}
          >
            <option value="house">House</option>
            <option value="townhouse">Townhouse</option>
            <option value="apartment">Apartment</option>
          </select>
        </div>

        <div className="mb-4">
            <label>Increase or Discount (%):</label>
            <select
              className="w-full p-2 rounded bg-zinc-800 border border-zinc-700"
              value={form.generalIncrease}
              onChange={(e) => handleChange("generalIncrease", parseFloat(e.target.value))}
            >
              {Array.from({ length: 21 }, (_, i) => -100 + i * 10).map((val) => (
                <option key={val} value={val}>{val > 0 ? `+${val}%` : `${val}%`}</option>
              ))}
            </select>
          </div>

          {["squareFeet", ...predefinedFields].map((field) => (
            <div key={field} className="mb-2">
              <label className="capitalize">{field.replace(/([A-Z])/g, ' $1')}:</label>
              <select
                className="w-full p-2 rounded bg-zinc-800 border border-zinc-700"
                value={form[field]}
                onChange={(e) => handleChange(field, parseInt(e.target.value))}
              >
                {(field === "squareFeet"
                  ? Array.from({ length: 84 }, (_, i) => 700 + i * 100)
                  : Array.from({ length: 31 }, (_, i) => i)
                ).map((val) => (
                  <option key={val} value={val}>
                    {field === "squareFeet" && val === 700 ? "Up to 700 sq ft" : val}
                  </option>
                ))}
              </select>
            </div>
          ))}

          <div className="flex flex-col gap-2 mt-2">
            <label><input type="checkbox" checked={form.pets} onChange={() => handleCheckbox("pets")} /> Pets</label>
            <label><input type="checkbox" checked={form.kids} onChange={() => handleCheckbox("kids")} /> Kids</label>
            <label><input type="checkbox" checked={form.basement} onChange={() => handleCheckbox("basement")} disabled={form.propertyType === "apartment"} /> Includes Basement</label>
            
            <label><input type="checkbox" checked={form.oven} onChange={() => handleCheckbox("oven")} /> Inside Oven</label>
            <label><input type="checkbox" checked={form.fridge} onChange={() => handleCheckbox("fridge")} /> Inside Fridge</label>
          </div>
        </div>

        {/* restante do código */}
      </div>
    </div>
  );
}
