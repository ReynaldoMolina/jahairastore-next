'use client';

import Link from 'next/link';
import { useState, createContext, useContext } from 'react';
import { calculateTotals } from '@/app/lib/calculateTotals';
import { FormSpan, FormDate } from '@/app/ui/forms/FormInputs/formInputsClient';
import ArrowDown from '@/app/ui/icons/arrowdown.svg';
import SearchInput from '@/app/ui/actiontools/SearchInput';

const FormContext = createContext();

export function useFormContext() {
  const context = useContext(FormContext);
  return context;
}

export function FormCreate({ children, createRegister, convert = false }) {
  const [productList, setProductList] = useState([]);
  const totals = convert
    ? calculateTotals(productList, convert)
    : calculateTotals(productList);
  const [formTotals, setFormTotals] = useState(totals);
  const [formAbono, setFormAbono] = useState(0);

  function handleRegister(formData) {
    if (productList.length === 0) {
      alert('Agrega productos a la lista');
      return;
    }
    createRegister(formData, productList);
  }

  return (
    <form
      action={handleRegister}
      className="flex flex-col bg-white dark:bg-neutral-800 rounded-xl shadow-md gap-4 mx-auto max-w-170 p-3 w-full h-fit"
    >
      <FormContext.Provider
        value={{
          productList,
          setProductList,
          formTotals,
          setFormTotals,
          formAbono,
          setFormAbono,
        }}
      >
        {children}
      </FormContext.Provider>
    </form>
  );
}

export function FormEdit({
  children,
  updateRegister,
  registerId,
  detailList,
  convert = false,
  allowEmpty = false,
  abono = 0,
}) {
  const originalList = detailList;
  const [productList, setProductList] = useState(detailList);
  const totals = convert
    ? calculateTotals(productList, convert)
    : calculateTotals(productList);
  const [formTotals, setFormTotals] = useState(totals);
  const [formAbono, setFormAbono] = useState(abono);

  function handleOrder(formData) {
    if (!allowEmpty && productList.length === 0) {
      alert('Agrega productos a la lista');
      return;
    }
    updateRegister(registerId, formData, productList, originalList);
  }

  return (
    <form
      action={handleOrder}
      className="flex flex-col bg-white dark:bg-neutral-800 rounded-xl shadow-md gap-4 mx-auto max-w-170 p-3 w-full h-fit"
    >
      <FormContext.Provider
        value={{
          productList,
          setProductList,
          formTotals,
          setFormTotals,
          formAbono,
          setFormAbono,
        }}
      >
        {children}
      </FormContext.Provider>
    </form>
  );
}

export function FormInfo({ children, date, value = 0, register }) {
  const formSubtotals = {
    orders: <OrderSubtotals abono={value} />,
    purchases: <PurchaseSubtotals gastos={value} />,
    sales: <SaleSubtotals abono={value} />,
  };

  return (
    <section className="flex flex-col gap-4">
      <div className="flex flex-col md:flex-row gap-4">
        <FormDate date={date} />
        {children}
      </div>
      {formSubtotals[register]}
    </section>
  );
}

export function ProductSearch({ children, open }) {
  const [isSearchProductOpen, setIsSearchProductOpen] = useState(open);

  return (
    <section className="flex flex-col gap-4">
      <div className="flex flex-col gap-2 bg-neutral-100 dark:bg-neutral-900 rounded-xl p-2">
        <div
          className="flex items-center justify-between gap-1 cursor-pointer"
          onClick={() => setIsSearchProductOpen((state) => !state)}
        >
          <p className="text-sm font-semibold px-2">Agregar productos</p>
          <ArrowDown
            className={`rounded-xl w-10 h-6 border border-neutral-300 bg-white dark:bg-neutral-700 ${
              isSearchProductOpen ? 'rotate-180' : 'rotate-0'
            }`}
          />
        </div>
        {isSearchProductOpen && <SearchInput />}
        {isSearchProductOpen && children}
      </div>
    </section>
  );
}

export function FormButtons({ link, label }) {
  return (
    <div className="flex w-full justify-center gap-3">
      <Link
        href={link}
        className="flex items-center justify-center rounded-xl font-semibold cursor-pointer h-9 w-full sm:w-35 bg-red-500 hover:bg-red-600 transition text-xs text-white"
      >
        Cancelar
      </Link>
      <button
        type="submit"
        value="Save"
        className="flex items-center justify-center rounded-xl font-semibold cursor-pointer h-9 w-full sm:w-35 bg-green-600 hover:bg-green-700 transition text-xs text-white"
      >
        {label}
      </button>
    </div>
  );
}

function SubtotalsDiv({ children }) {
  return <div className="flex w-full items-end gap-1 md:gap-3">{children}</div>;
}

function OrderSubtotals({ abono }) {
  const { formTotals } = useContext(FormContext);
  return (
    <SubtotalsDiv>
      <FormSpan
        name="OrderTotal"
        holder="Total"
        value={formTotals.totalSell}
        type="number"
        color="gray"
      />
      <FormSpan
        name="OrderAbono"
        holder="Abono"
        value={abono}
        type="number"
        color="green"
      />
      <FormSpan
        name="Saldo"
        holder="Saldo"
        value={formTotals.totalSell - abono}
        type="number"
        color="red"
      />
      <FormSpan
        name="Profit"
        holder="Ganancia"
        value={formTotals.totalSell - formTotals.totalCost}
        type="number"
        color="blue"
      />
    </SubtotalsDiv>
  );
}

function PurchaseSubtotals({ gastos }) {
  const { formTotals } = useContext(FormContext);
  const profit = formTotals.totalSell - formTotals.totalCost - gastos;
  return (
    <SubtotalsDiv>
      <FormSpan
        name="PurchaseTotalVenta"
        holder="Venta"
        value={formTotals.totalSell}
        type="number"
      />
      <FormSpan
        name="PurchaseTotalCompra"
        holder="Compra"
        value={formTotals.totalCost}
        type="number"
      />
      {gastos > 0 && (
        <FormSpan
          name="PurchaseGastos"
          holder="Gastos"
          value={gastos}
          type="number"
          color="red"
        />
      )}
      <FormSpan
        name="Profit"
        holder="Ganancia"
        value={profit}
        type="number"
        color="blue"
      />
    </SubtotalsDiv>
  );
}

function SaleSubtotals() {
  const { formTotals, formAbono } = useContext(FormContext);
  const profit = formTotals.totalSell - formTotals.totalCost;
  return (
    <SubtotalsDiv>
      <FormSpan
        name="SaleTotal"
        holder="Total"
        value={formTotals.totalSell}
        type="number"
      />
      <FormSpan
        name="SaleAbono"
        holder="Abono"
        value={formAbono || 0}
        type="number"
        color="green"
      />
      <FormSpan
        name="SaleBalance"
        holder="Saldo"
        value={formTotals.totalSell - (formAbono || 0)}
        type="number"
        color="red"
      />
      <FormSpan
        name="Profit"
        holder="Ganancia"
        value={profit}
        type="number"
        color="blue"
      />
    </SubtotalsDiv>
  );
}
