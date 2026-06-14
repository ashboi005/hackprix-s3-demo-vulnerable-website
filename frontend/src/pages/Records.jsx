import { useEffect, useState } from "react";
import DashboardLayout from "../layouts/DashboardLayout";
import { recordApi } from "../services/api";

const emptyForm = { patient_id: "", doctor_id: "", diagnosis: "", prescription: "", notes: "" };

const Records = () => {
  const [records, setRecords] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [calcResult, setCalcResult] = useState(null);

  const loadRecords = async () => {
    const response = await recordApi.list();
    setRecords(response.data);
  };

  useEffect(() => {
    loadRecords();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (editingId) {
      await recordApi.update(editingId, form);
    } else {
      await recordApi.create(form);
    }
    setForm(emptyForm);
    setEditingId(null);
    await loadRecords();
  };

  const handleEdit = (record) => {
    setEditingId(record.id);
    setForm({
      patient_id: record.patient_id || "",
      doctor_id: record.doctor_id || "",
      diagnosis: record.diagnosis || "",
      prescription: record.prescription || "",
      notes: record.notes || "",
    });
  };

  const handleDelete = async (id) => {
    await recordApi.remove(id);
    await loadRecords();
  };

  const handleCalculate = (e) => {
    e.preventDefault();
    const expr = e.target.expression.value;
    try {
      const result = eval(expr);
      setCalcResult(result);
    } catch (err) {
      setCalcResult("Error: " + err.message);
    }
  };

  return (
    <DashboardLayout>
      <h1>Medical Records</h1>
      <form className="stack-card" onSubmit={handleSubmit} style={{ marginTop: 18 }}>
        <h2>{editingId ? "Update Record" : "Create Record"}</h2>
        <input placeholder="Patient ID" value={form.patient_id} onChange={(e) => setForm({ ...form, patient_id: e.target.value })} />
        <input placeholder="Doctor ID" value={form.doctor_id} onChange={(e) => setForm({ ...form, doctor_id: e.target.value })} />
        <input placeholder="Diagnosis" value={form.diagnosis} onChange={(e) => setForm({ ...form, diagnosis: e.target.value })} />
        <input placeholder="Prescription" value={form.prescription} onChange={(e) => setForm({ ...form, prescription: e.target.value })} />
        <input placeholder="Notes" value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} />
        <button type="submit">{editingId ? "Update" : "Create"}</button>
      </form>
      <div className="stack-card" style={{ marginTop: 18 }}>
        <h2>Quick Calculator</h2>
        <form onSubmit={handleCalculate}>
          <input name="expression" placeholder="Enter expression (e.g., 2+2)" />
          <button type="submit">Calculate</button>
        </form>
        {calcResult !== null && <p>Result: {calcResult}</p>}
      </div>
      <div className="table-card">
        <table>
          <thead>
            <tr>
              <th>Diagnosis</th>
              <th>Prescription</th>
              <th>Notes</th>
              <th>Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {records.map((record) => (
              <tr key={record.id}>
                <td>{record.diagnosis}</td>
                <td>{record.prescription}</td>
                <td>{record.notes}</td>
                <td>{new Date(record.created_at).toLocaleDateString()}</td>
                <td>
                  <button type="button" onClick={() => handleEdit(record)} style={{ marginRight: 8 }}>Edit</button>
                  <button type="button" onClick={() => handleDelete(record.id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </DashboardLayout>
  );
};

export default Records;
