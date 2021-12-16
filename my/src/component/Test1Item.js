import { useParams, useNavigate } from "react-router-dom";
import { getInvoice, deleteInvoice } from "../data";

export default function Test1Item(props) {
  let navigate = useNavigate();
  let params = useParams();
  let invoice = getInvoice(parseInt(params.test1Id, 10));
  return (
    <main style={{ padding: "1rem" }}>
      <h1>{params.test1Id}</h1>
      <h2>Total Due: {invoice.amount}</h2>
      <p>
        {invoice.name}: {invoice.number}
      </p>
      <p>Due Date: {invoice.due}</p>
      <p>
        <button
          onClick={() => {
            deleteInvoice(invoice.number);
            navigate("/test1");
          }}
        >
          Delete
        </button>
      </p>
    </main>
  );
}
