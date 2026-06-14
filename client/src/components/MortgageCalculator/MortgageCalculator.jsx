import { useMemo, useState } from "react";
import "./MortgageCalculator.css";
import { useTranslation } from "react-i18next";

const MortgageCalculator = ({ price }) => {
  const { t } = useTranslation();

  // Default equity to 20% of purchase price
  const [equity, setEquity] = useState(Math.round((price * 0.2) / 1000) * 1000);
  const [interestRate, setInterestRate] = useState(3.5);
  const [years, setYears] = useState(20);

  // Monthly mortgage payment using standard annuity formula
  const { monthlyRate, totalCost, totalInterest } = useMemo(() => {
    const loanAmount = price - equity;
    const monthlyInterest = interestRate / 100 / 12;
    const numPayments = years * 12;

    // Annuity formula: M = P * [r(1+r)^n] / [(1+r)^n - 1]
    const monthlyRate =
      monthlyInterest === 0
        ? loanAmount / numPayments
        : (loanAmount *
            (monthlyInterest * Math.pow(1 + monthlyInterest, numPayments))) /
          (Math.pow(1 + monthlyInterest, numPayments) - 1);

    const totalCost = monthlyRate * numPayments;
    const totalInterest = totalCost - loanAmount;

    return {
      monthlyRate: Math.round(monthlyRate),
      totalCost: Math.round(totalCost),
      totalInterest: Math.round(totalInterest),
    };
  }, [price, equity, interestRate, years]);

  const loanAmount = price - equity;

  return (
    <div className="mortgage-calculator">
      <h2 className="mortgage-title">{t("mortgage.title")}</h2>

      <div className="mortgage-inputs">
        {/* Purchase Price – readonly, from property */}
        <div className="mortgage-field">
          <div className="mortgage-field-header">
            <label>{t("mortgage.purchasePrice")}</label>
            <span className="mortgage-value">EUR {price.toLocaleString()}</span>
          </div>
        </div>

        {/* Equity Slider */}
        <div className="mortgage-field">
          <div className="mortgage-field-header">
            <label>{t("mortgage.equity")}</label>
            <span className="mortgage-value">
              EUR {equity.toLocaleString()}
            </span>
          </div>
          <input
            type="range"
            min={0}
            max={price}
            step={5000}
            value={equity}
            onChange={(e) => setEquity(Number(e.target.value))}
            className="mortgage-slider"
          />
          <div className="mortgage-slider-labels">
            <span>EUR 0</span>
            <span>EUR {price.toLocaleString()}</span>
          </div>
        </div>

        {/* Interest Rate */}
        <div className="mortgage-field">
          <div className="mortgage-field-header">
            <label>{t("mortgage.interestRate")}</label>
            <span className="mortgage-value">{interestRate.toFixed(1)}%</span>
          </div>
          <input
            type="range"
            min={0.5}
            max={10}
            step={0.1}
            value={interestRate}
            onChange={(e) => setInterestRate(Number(e.target.value))}
            className="mortgage-slider"
          />
          <div className="mortgage-slider-labels">
            <span>0.5%</span>
            <span>10%</span>
          </div>
        </div>

        {/* Loan Term */}
        <div className="mortgage-field">
          <div className="mortgage-field-header">
            <label>{t("mortgage.loanTerm")}</label>
            <span className="mortgage-value">
              {years} {t("mortgage.years")}
            </span>
          </div>
          <input
            type="range"
            min={5}
            max={30}
            step={1}
            value={years}
            onChange={(e) => setYears(Number(e.target.value))}
            className="mortgage-slider"
          />
          <div className="mortgage-slider-labels">
            <span>5 {t("mortgage.years")}</span>
            <span>30 {t("mortgage.years")}</span>
          </div>
        </div>
      </div>

      {/* Results */}
      <div className="mortgage-results">
        <div className="mortgage-result highlight">
          <span className="result-label">{t("mortgage.monthlyPayment")}</span>
          <span className="result-value">
            EUR {monthlyRate.toLocaleString()}
          </span>
        </div>
        <div className="mortgage-result">
          <span className="result-label">{t("mortgage.loanAmount")}</span>
          <span className="result-value">
            EUR {loanAmount.toLocaleString()}
          </span>
        </div>
        <div className="mortgage-result">
          <span className="result-label">{t("mortgage.totalCost")}</span>
          <span className="result-value">EUR {totalCost.toLocaleString()}</span>
        </div>
        <div className="mortgage-result">
          <span className="result-label">{t("mortgage.totalInterest")}</span>
          <span className="result-value">
            EUR {totalInterest.toLocaleString()}
          </span>
        </div>
      </div>

      <p className="mortgage-disclaimer">{t("mortgage.disclaimer")}</p>
    </div>
  );
};

export default MortgageCalculator;
