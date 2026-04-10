"use client";

import { useState, useEffect } from "react";

const STORAGE_KEY = "troebel_age_verified";

export default function AgeGate() {
  const [isVerified, setIsVerified] = useState(true); // Start true to prevent flash
  const [showError, setShowError] = useState(false);
  const [dob, setDob] = useState({ day: "", month: "", year: "" });

  useEffect(() => {
    // Check localStorage only after mount
    const verified = localStorage.getItem(STORAGE_KEY) === "true";
    setIsVerified(verified);
  }, []);

  const verifyAge = () => {
    const { day, month, year } = dob;

    if (!day || !month || !year) {
      alert("Vul je volledige geboortedatum in.");
      return;
    }

    const birthDate = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();

    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }

    if (age >= 16) {
      localStorage.setItem(STORAGE_KEY, "true");
      setIsVerified(true);
    } else {
      setShowError(true);
    }
  };

  const confirmAge = (isOver16: boolean) => {
    if (isOver16) {
      localStorage.setItem(STORAGE_KEY, "true");
      setIsVerified(true);
    } else {
      // Redirect to responsible drinking site
      window.location.href = "https://www.bob.be/";
    }
  };

  const handleDayChange = (value: string) => {
    setDob({ ...dob, day: value });
    if (value.length === 2 || parseInt(value) > 3) {
      document.getElementById("dob-month")?.focus();
    }
  };

  const handleMonthChange = (value: string) => {
    setDob({ ...dob, month: value });
    if (value.length === 2 || parseInt(value) > 1) {
      document.getElementById("dob-year")?.focus();
    }
  };

  if (isVerified) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-[1000] bg-dark flex items-center justify-center p-4">
      {/* Background Decorations */}
      <div className="absolute top-[-100px] left-[-100px] w-[300px] h-[300px] bg-primary rounded-full opacity-5 pointer-events-none" />
      <div className="absolute bottom-[-150px] right-[-150px] w-[400px] h-[400px] bg-primary rounded-full opacity-5 pointer-events-none" />

      <div className="w-full max-w-[450px] relative z-10">
        <div className="bg-cream rounded-lg p-8 md:p-10 text-center">
          {/* Logo */}
          <div className="font-heading text-3xl font-bold text-primary mb-2">
            Troebel
          </div>
          <div className="text-sm text-dark font-medium mb-8">Brewing Co.</div>

          {/* Title */}
          <h1 className="text-2xl md:text-3xl font-bold text-dark mb-3">
            Ben je 16 jaar of ouder?
          </h1>
          <p className="text-gray-600 mb-8">
            Je moet de wettelijke leeftijd hebben om alcohol te kopen in België
            om deze website te bezoeken.
          </p>

          {/* Date of Birth Input */}
          <div className="mb-6">
            <label className="block font-medium text-dark mb-3">
              Vul je geboortedatum in:
            </label>
            <div className="flex gap-3 justify-center">
              <input
                type="number"
                id="dob-day"
                placeholder="DD"
                min="1"
                max="31"
                value={dob.day}
                onChange={(e) => handleDayChange(e.target.value)}
                className="w-20 px-3 py-3 text-center text-lg border-2 border-gray-200 rounded-lg focus:border-primary focus:outline-none"
              />
              <input
                type="number"
                id="dob-month"
                placeholder="MM"
                min="1"
                max="12"
                value={dob.month}
                onChange={(e) => handleMonthChange(e.target.value)}
                className="w-20 px-3 py-3 text-center text-lg border-2 border-gray-200 rounded-lg focus:border-primary focus:outline-none"
              />
              <input
                type="number"
                id="dob-year"
                placeholder="JJJJ"
                min="1900"
                max="2025"
                value={dob.year}
                onChange={(e) => setDob({ ...dob, year: e.target.value })}
                className="w-24 px-3 py-3 text-center text-lg border-2 border-gray-200 rounded-lg focus:border-primary focus:outline-none"
              />
            </div>
          </div>

          {/* Error Message */}
          {showError && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg mb-4 text-sm">
              Sorry, je moet 16 jaar of ouder zijn om deze website te bezoeken.
            </div>
          )}

          {/* Verify Button */}
          <button
            onClick={verifyAge}
            className="w-full px-8 py-4 bg-primary text-dark text-sm font-bold uppercase tracking-wider hover:bg-primary-dark transition-colors"
          >
            Bevestigen
          </button>

          {/* Quick Confirm */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <p className="text-sm text-gray-600 mb-4">Of bevestig snel:</p>
            <div className="flex gap-3 justify-center">
              <button
                onClick={() => confirmAge(true)}
                className="px-5 py-2.5 border-2 border-dark text-dark text-sm font-semibold hover:bg-dark hover:text-white transition-colors"
              >
                Ja, ik ben 16+
              </button>
              <button
                onClick={() => confirmAge(false)}
                className="px-5 py-2.5 text-gray-500 text-sm font-medium hover:text-dark transition-colors"
              >
                Nee, ik ben jonger
              </button>
            </div>
          </div>

          {/* Legal Note */}
          <p className="text-xs text-gray-500 mt-8">
            Door verder te gaan bevestig je dat je 16 jaar of ouder bent.
            <br />
            Lees ons{" "}
            <a href="#" className="text-primary-dark hover:underline">
              privacybeleid
            </a>
            .
          </p>
        </div>
      </div>
    </div>
  );
}
