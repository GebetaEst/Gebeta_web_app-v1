import React, { useState, useEffect } from "react";

export default function MoneyFlow() {
  const [foodPrice, setFoodPrice] = useState(200);
  const [deliveryFee, setDeliveryFee] = useState(100);
  const [result, setResult] = useState(null);
  const [showFlow1, setShowFlow1] = useState(false);
  const [showFlow3, setShowFlow3] = useState(false);
  const [flow1FoodPrice, setFlow1FoodPrice] = useState(500);
  const [flow1DeliveryFee, setFlow1DeliveryFee] = useState(100);
  const [flow1Output, setFlow1Output] = useState("");
  const [flow3FoodPrice, setFlow3FoodPrice] = useState(200);
  const [flow3DeliveryFee, setFlow3DeliveryFee] = useState(100);
  const [flow3Result, setFlow3Result] = useState(null);

  const processPayment = () => {
    const food = parseFloat(foodPrice);
    const delivery = parseFloat(deliveryFee);

    if (isNaN(food) || isNaN(delivery)) {
      setResult("❗ Please enter valid numbers.");
      return;
    }

    // Step 1: Food payment
    const gebetaFoodShare = food * 0.08;
    const restaurantShare = food - gebetaFoodShare;

    // Step 2: Delivery payment DF 
    const deliveryGuyIncoming = delivery;

    // Step 3: Gebeta only deducts 30% of delivery fee
    const deduction = delivery * 0.3;
    const netDeliveryGuy = deliveryGuyIncoming - deduction;

    setResult({
      totalPaid: food + delivery,
      gebetaFoodShare,
      restaurantShare,
      deliveryGuyIncoming,
      deduction,
      netDeliveryGuy,
    });
  };

  const processFlow1Payment = () => {
    const foodPrice = parseFloat(flow1FoodPrice);
    const deliveryFee = parseFloat(flow1DeliveryFee);

    if (isNaN(foodPrice) || isNaN(deliveryFee)) {
      setFlow1Output("❗ Please enter valid numbers.");
      return;
    }

    const gebetaFoodShare = foodPrice * 0.08;
    const gebetaDeliveryShare = deliveryFee * 0.30;
    const restaurantShare = foodPrice - gebetaFoodShare;
    const deliveryGuyShare = deliveryFee - gebetaDeliveryShare;

    setFlow1Output(`
      <h3>💰 Payment Breakdown</h3>
      <p><strong>Total Paid:</strong> ${foodPrice + deliveryFee} ETB</p>
      <p><strong>Gebeta Company:</strong><br/>
      - 8% of food price: ${gebetaFoodShare.toFixed(2)} ETB<br/>
      - 30% of delivery fee: ${gebetaDeliveryShare.toFixed(2)} ETB</p>
      <p><strong>Restaurant:</strong><br/>
      - Remaining food price: ${restaurantShare.toFixed(2)} ETB</p>
      <p><strong>Delivery Guy:</strong><br/>
      - Remaining delivery fee: ${deliveryGuyShare.toFixed(2)} ETB</p>
    `);
  };

  const processFlow3Payment = () => {
    const food = parseFloat(flow3FoodPrice);
    const delivery = parseFloat(flow3DeliveryFee);

    if (isNaN(food) || isNaN(delivery)) {
      setFlow3Result("❗ Please enter valid numbers.");
      return;
    }

    const totalPaid = food + delivery;

    // Step 2: Gateway splits
    const gebetaFirstTotalCommission = totalPaid * 0.08;

    const restaurantReceives =  food -(food * 0.08);

    // Step 3: Restaurant gives the change (delivery fee) to the delivery guy
    const deliveryGuyIncoming =  delivery - (delivery * 0.08)
// console.log(deliveryGuyIncoming)

    // Step 4: Gebeta deducts 22% of the delivery fee from the delivery guy's wallet
    const gebetaDeliveryShare = deliveryGuyIncoming * 0.22;
    const deliveryGuyNet = deliveryGuyIncoming - gebetaDeliveryShare;

    setFlow3Result({
      totalPaid,
      gebetaFirstTotalCommission,
      restaurantReceives,
      deliveryGuyIncoming,
      gebetaDeliveryShare,
      deliveryGuyNet
    });
  };

  useEffect(() => {
    processPayment();
  }, []);

  useEffect(() => {
    if (showFlow1) {
      processFlow1Payment();
    }
  }, [showFlow1, flow1FoodPrice, flow1DeliveryFee]);

  useEffect(() => {
    if (showFlow3) {
      processFlow3Payment();
    }
  }, [showFlow3, flow3FoodPrice, flow3DeliveryFee]);

  const Flow1Component = () => (
    <div style={{
      fontFamily: "'Segoe UI', sans-serif",
      background: "#f4f6f8",
      padding: "40px",
      color: "#333",
      minHeight: "100vh"
    }}>
      <div style={{
        maxWidth: "700px",
        margin: "auto",
        background: "#fff",
        padding: "30px",
        borderRadius: "12px",
        boxShadow: "0 8px 20px rgba(0,0,0,0.1)"
      }}>
        <h1 style={{
          textAlign: "center",
          color: "#2c3e50"
        }}>💳 Gebeta Payment Flow</h1>

        <label style={{
          fontWeight: "bold",
          marginTop: "20px",
          display: "block"
        }}>Enter Food Price (ETB):</label>
        <input
          type="number"
          value={flow1FoodPrice}
          onChange={(e) => setFlow1FoodPrice(e.target.value)}
          style={{
            width: "100%",
            padding: "12px",
            marginTop: "8px",
            border: "1px solid #ccc",
            borderRadius: "8px",
            fontSize: "16px",
            boxSizing: "border-box"
          }}
        />

        <label style={{
          fontWeight: "bold",
          marginTop: "20px",
          display: "block"
        }}>Enter Delivery Fee (ETB):</label>
        <input
          type="number"
          value={flow1DeliveryFee}
          onChange={(e) => setFlow1DeliveryFee(e.target.value)}
          style={{
            width: "100%",
            padding: "12px",
            marginTop: "8px",
            border: "1px solid #ccc",
            borderRadius: "8px",
            fontSize: "16px",
            boxSizing: "border-box"
          }}
        />

        <button
          onClick={processFlow1Payment}
          style={{
            marginTop: "25px",
            padding: "14px 24px",
            backgroundColor: "#27ae60",
            color: "white",
            border: "none",
            borderRadius: "8px",
            fontSize: "16px",
            cursor: "pointer",
            width: "100%"
          }}
          onMouseOver={(e) => e.target.style.backgroundColor = "#219150"}
          onMouseOut={(e) => e.target.style.backgroundColor = "#27ae60"}
        >
          Split Payment
        </button>

        <div
          style={{
            marginTop: "30px",
            background: "#eafaf1",
            padding: "20px",
            borderRadius: "10px",
            borderLeft: "6px solid #2ecc71"
          }}
          dangerouslySetInnerHTML={{ __html: flow1Output }}
        />

        <div style={{
          marginTop: "30px",
          padding: "20px",
          background: "#f0f0ff",
          borderRadius: "10px",
          borderLeft: "6px solid #3498db"
        }}>
          <h3>🔁 Payment Flow Steps</h3>
          <div style={{
            margin: "10px 0",
            padding: "10px",
            background: "#fff",
            border: "1px solid #ccc",
            borderRadius: "8px"
          }}>
            <strong>User</strong> places order and initiates payment
          </div>
          <div style={{
            textAlign: "center",
            fontSize: "24px",
            margin: "5px 0",
            color: "#3498db"
          }}>↓</div>
          <div style={{
            margin: "10px 0",
            padding: "10px",
            background: "#fff",
            border: "1px solid #ccc",
            borderRadius: "8px"
          }}>
            <strong>Yaya Payment Gateway</strong> receives full payment
          </div>
          <div style={{
            textAlign: "center",
            fontSize: "24px",
            margin: "5px 0",
            color: "#3498db"
          }}>↓</div>
          <div style={{
            margin: "10px 0",
            padding: "10px",
            background: "#fff",
            border: "1px solid #ccc",
            borderRadius: "8px"
          }}>
            <strong>Gebeta Company</strong> gets:<br/>
            - 8% of food price<br/>
            - 30% of delivery fee
          </div>
          <div style={{
            textAlign: "center",
            fontSize: "24px",
            margin: "5px 0",
            color: "#3498db"
          }}>↓</div>
          <div style={{
            margin: "10px 0",
            padding: "10px",
            background: "#fff",
            border: "1px solid #ccc",
            borderRadius: "8px"
          }}>
            <strong>Restaurant</strong> gets remaining food price
          </div>
          <div style={{
            textAlign: "center",
            fontSize: "24px",
            margin: "5px 0",
            color: "#3498db"
          }}>↓</div>
          <div style={{
            margin: "10px 0",
            padding: "10px",
            background: "#fff",
            border: "1px solid #ccc",
            borderRadius: "8px"
          }}>
            <strong>Delivery Guy</strong> gets remaining delivery fee
          </div>
        </div>
      </div>
    </div>
  );

  const Flow3Component = () => (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-6">
      <div className="w-full max-w-2xl bg-white rounded-2xl shadow-xl p-6">
        <h1 className="text-2xl font-bold text-center text-gray-800 mb-6">
          💳 Gebeta Payment Flow (Flow 3)
        </h1>

        {/* Input Fields */}
        <div className="space-y-4">
          <div>
            <label className="font-semibold">Enter Food Price (ETB):</label>
            <input
              type="number"
              value={flow3FoodPrice}
              onChange={(e) => setFlow3FoodPrice(e.target.value)}
              className="w-full p-2 border rounded-lg mt-2"
            />
          </div>
          <div>
            <label className="font-semibold">Enter Delivery Fee (ETB):</label>
            <input
              type="number"
              value={flow3DeliveryFee}
              onChange={(e) => setFlow3DeliveryFee(e.target.value)}
              className="w-full p-2 border rounded-lg mt-2"
            />
          </div>
          <button
            onClick={processFlow3Payment}
            className="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded-lg shadow mt-4"
          >
            Split Payment
          </button>
        </div>

        {/* Result Breakdown */}
        {flow3Result && typeof flow3Result === "object" && (
          <div className="mt-6 p-4 bg-green-50 border-l-4 border-green-600 rounded-lg text-gray-800">
            <h3 className="font-bold mb-2">💰 Payment Breakdown</h3>
            <p>
              <strong>Total Paid by User:</strong> {flow3Result.totalPaid} ETB
            </p>
            <p>
              <strong>Gebeta:</strong>
              <br /> - 8% of food price (Gateway split):{" "}
              {flow3Result.gebetaFirstTotalCommission.toFixed(2)} ETB
              <br /> - 22% of delivery fee (Wallet deduction):{" "}
              {flow3Result.gebetaDeliveryShare.toFixed(2)} ETB
            </p>
            <p>
              <strong>Restaurant:</strong>
              <br /> - Receives from Gateway (Total - 8%):{" "}
              {flow3Result.restaurantReceives.toFixed(2)} ETB
            </p>
            <p>
              <strong>Delivery Guy:</strong>
              <br /> - Incoming from Restaurant: {flow3Result.deliveryGuyIncoming.toFixed(2)} ETB
              <br /> - Net balance after deduction:{" "}
              <span className="font-bold">
                {flow3Result.deliveryGuyNet.toFixed(2)} ETB
              </span>
            </p>
          </div>
        )}

        {/* Flow Steps */}
        <div className="mt-8 bg-blue-50 p-4 rounded-lg border-l-4 border-blue-600">
          <h3 className="font-bold mb-3">🔁 Payment Flow Steps</h3>
          <div className="space-y-2">
            <div className="p-2 bg-white border rounded-lg">
              1️⃣ <strong>User</strong> pays Food + Delivery Fee →{" "}
              <strong>Gateway</strong>
            </div>
            <div className="text-center text-blue-500">↓</div>
            <div className="p-2 bg-white border rounded-lg">
              2️⃣ <strong>Gateway</strong> splits payment:
              <br /> - 8% of <strong>Food Price</strong> →{" "}
              <strong>Gebeta Bank</strong>
              <br /> - Remainder (Food + Delivery - Gebeta's 8%) →{" "}
              <strong>Restaurant</strong>
            </div>
            <div className="text-center text-blue-500">↓</div>
            <div className="p-2 bg-white border rounded-lg">
              3️⃣ <strong>Restaurant</strong> gives the delivery fee to the{" "}
              <strong>Delivery Guy</strong> as change
            </div>
            <div className="text-center text-blue-500">↓</div>
            <div className="p-2 bg-white border rounded-lg">
              4️⃣ <strong>Gebeta</strong> deducts{" "}
              <span className="text-red-600">22% of delivery fee</span> from the
              <strong>Delivery Guy's Wallet</strong>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  if (showFlow1) {
    return (
      <div>
        <div className="p-4 bg-white shadow-sm">
           <button
            className="bg-green-600 text-white px-4 py-2 rounded-lg mr-2"
          >
            Flow 1 (Active)
          </button>
          <button
            onClick={() => setShowFlow1(false)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg mr-2"
          >
            Flow 2
          </button>
          <button
            onClick={() => {
              setShowFlow1(false);
              setShowFlow3(true);
            }}
            className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg"
          >
            Flow 3
          </button>
        </div>
        <Flow1Component />
      </div>
    );
  }

  if (showFlow3) {
    return (
      <div>
        <div className="p-4 bg-white shadow-sm">
          <button
            onClick={() => {
              setShowFlow3(false);
              setShowFlow1(true);
            }}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg mr-2"
          >
            Flow 1
          </button>
          <button
            onClick={() => setShowFlow3(false)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg mr-2"
          >
            Flow 2
          </button>
          <button
            className="bg-purple-600 text-white px-4 py-2 rounded-lg"
          >
            Flow 3 (Active)
          </button>
        </div>
        <Flow3Component />
      </div>
    );
  }

  return (
    <div>
      <div className="p-4 bg-white shadow-sm">
        <button
          onClick={() => setShowFlow1(true)}
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg mr-2"
        >
          Flow 1
        </button>
        <button
          className="bg-blue-600 text-white px-4 py-2 rounded-lg mr-2"
        >
          Flow 2 (Active)
        </button>
        <button
          onClick={() => setShowFlow3(true)}
          className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg"
        >
          Flow 3
        </button>
      </div>
      <div className="min-h-screen bg-gray-100 flex items-center justify-center p-6">
        <div className="w-full max-w-2xl bg-white rounded-2xl shadow-xl p-6">
          <h1 className="text-2xl font-bold text-center text-gray-800 mb-6">
            💳 Gebeta Payment Flow
          </h1>

          {/* Input Fields */}
          <div className="space-y-4">
            <div>
              <label className="font-semibold">Enter Food Price (ETB):</label>
              <input
                type="number"
                value={foodPrice}
                onChange={(e) => setFoodPrice(e.target.value)}
                className="w-full p-2 border rounded-lg mt-2"
              />
            </div>
            <div>
              <label className="font-semibold">Enter Delivery Fee (ETB):</label>
              <input
                type="number"
                value={deliveryFee}
                onChange={(e) => setDeliveryFee(e.target.value)}
                className="w-full p-2 border rounded-lg mt-2"
              />
            </div>
            <button
              onClick={processPayment}
              className="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded-lg shadow mt-4"
            >
              Split Payment
            </button>
          </div>

          {/* Result Breakdown */}
          {result && typeof result === "object" && (
            <div className="mt-6 p-4 bg-green-50 border-l-4 border-green-600 rounded-lg text-gray-800">
              <h3 className="font-bold mb-2">💰 Payment Breakdown</h3>
              <p>
                <strong>Total Paid:</strong> {result.totalPaid} ETB
              </p>
              <p>
                <strong>Gebeta:</strong>
                <br /> - 8% of food price: {result.gebetaFoodShare.toFixed(2)} ETB
                <br /> - 30% of delivery fee: {result.deduction.toFixed(2)} ETB
              </p>
              <p>
                <strong>Restaurant:</strong>
                <br /> - Remaining food price: {result.restaurantShare.toFixed(2)}{" "}
                ETB
              </p>
              <p>
                <strong>Delivery Guy:</strong>
                <br /> - Incoming: {result.deliveryGuyIncoming.toFixed(2)} ETB
                <br /> - Net Balance after deduction:{" "}
                <span
                  className={`font-bold ${
                    result.netDeliveryGuy >= 0 ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {result.netDeliveryGuy.toFixed(2)} ETB
                </span>
              </p>
          </div>
          )}

          {/* Flow Steps */}
          <div className="mt-8 bg-blue-50 p-4 rounded-lg border-l-4 border-blue-600">
            <h3 className="font-bold mb-3">🔁 Payment Flow Steps</h3>
            <div className="space-y-2">
              <div className="p-2 bg-white border rounded-lg">
                <strong>User</strong> pays for food → Gateway
              </div>
              <div className="text-center text-blue-500">↓</div>
              <div className="p-2 bg-white border rounded-lg">
                <strong>Gateway</strong> splits food payment:
                <br /> - 8% to <strong>Gebeta Bank</strong>
                <br /> - 92% to <strong>Restaurant</strong>
              </div>
              <div className="text-center text-blue-500">↓</div>
              <div className="p-2 bg-white border rounded-lg">
                <strong>User</strong> pays delivery fee directly →
                <strong> Delivery Guy Bank</strong>
              </div>
              <div className="text-center text-blue-500">↓</div>
              <div className="p-2 bg-white border rounded-lg">
                <strong>Gebeta</strong> deducts: 30% of delivery fee only
                <br />
                <span className="text-red-600">
                  Deduction reduces Delivery Guy's wallet
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}