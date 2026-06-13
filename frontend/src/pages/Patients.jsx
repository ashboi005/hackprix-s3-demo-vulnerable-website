import { useEffect, useState } from "react";
import DashboardLayout from "../layouts/DashboardLayout";
import { patientApi } from "../services/api";

const emptyForm = { name: "", email: "", age: "", blood_group: "", phone: "", insurance_number: "" };

const Patients = () => {
  const [patients, setPatients] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);

  const loadPatients = async () => {
    const response = await patientApi.list();
    setPatients(response.data);
  };

  useEffect(() => {
    loadPatients();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (editingId) {
      await patientApi.update(editingId, form);
    } else {
      await patientApi.create(form);
    }
    setForm(emptyForm);
    setEditingId(null);
    await loadPatients();
  };

  const handleEdit = (patient) => {
    setEditingId(patient.id);
    setForm({
      name: patient.name || "",
      email: patient.email || "",
      age: patient.age || "",
      blood_group: patient.blood_group || "",
      phone: patient.phone || "",
      insurance_number: patient.insurance_number || "",
    });
  };

  const handleDelete = async (id) => {
    await patientApi.remove(id);
    await loadPatients();
  };

  return (
    <DashboardLayout>
      <h1>Patients</h1>
      <form className="stack-card" onSubmit={handleSubmit} style={{ marginTop: 18 }}>
        <h2>{editingId ? "Update Patient" : "Create Patient"}</h2>
        <input placeholder="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
        <input placeholder="Email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
        <input placeholder="Age" value={form.age} onChange={(e) => setForm({ ...form, age: e.target.value })} />
        <input placeholder="Blood group" value={form.blood_group} onChange={(e) => setForm({ ...form, blood_group: e.target.value })} />
        <input placeholder="Phone" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
        <input placeholder="Insurance number" value={form.insurance_number} onChange={(e) => setForm({ ...form, insurance_number: e.target.value })} />
        <button type="submit">{editingId ? "Update" : "Create"}</button>
      </form>
      <div className="card-grid" style={{ marginTop: 18 }}>
        {patients.map((patient) => (
          <article className="metric-card" key={patient.id}>
            <h3>{patient.name}</h3>
            <p>{patient.email}</p>
            <p>{patient.blood_group} | {patient.phone}</p>
            <button type="button" onClick={() => handleEdit(patient)} style={{ marginRight: 8 }}>Edit</button>
            <button type="button" onClick={() => handleDelete(patient.id)}>Delete</button>
          </article>
        ))}
      </div>
    </DashboardLayout>
  );
};

export default Patients;
