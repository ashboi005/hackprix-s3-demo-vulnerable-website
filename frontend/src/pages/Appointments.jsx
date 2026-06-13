import { useEffect, useState } from "react";
import DashboardLayout from "../layouts/DashboardLayout";
import { appointmentApi } from "../services/api";

const emptyForm = { patient_id: "", doctor_id: "", appointment_date: "", status: "scheduled" };

const Appointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);

  const loadAppointments = async () => {
    const response = await appointmentApi.list();
    setAppointments(response.data);
  };

  useEffect(() => {
    loadAppointments();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (editingId) {
      await appointmentApi.update(editingId, form);
    } else {
      await appointmentApi.create(form);
    }
    setForm(emptyForm);
    setEditingId(null);
    await loadAppointments();
  };

  const handleEdit = (appointment) => {
    setEditingId(appointment.id);
    setForm({
      patient_id: appointment.patient_id || "",
      doctor_id: appointment.doctor_id || "",
      appointment_date: appointment.appointment_date || "",
      status: appointment.status || "scheduled",
    });
  };

  const handleDelete = async (id) => {
    await appointmentApi.remove(id);
    await loadAppointments();
  };

  return (
    <DashboardLayout>
      <h1>Appointments</h1>
      <form className="stack-card" onSubmit={handleSubmit} style={{ marginTop: 18 }}>
        <h2>{editingId ? "Update Appointment" : "Create Appointment"}</h2>
        <input placeholder="Patient ID" value={form.patient_id} onChange={(e) => setForm({ ...form, patient_id: e.target.value })} />
        <input placeholder="Doctor ID" value={form.doctor_id} onChange={(e) => setForm({ ...form, doctor_id: e.target.value })} />
        <input type="datetime-local" value={form.appointment_date} onChange={(e) => setForm({ ...form, appointment_date: e.target.value })} />
        <input placeholder="Status" value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })} />
        <button type="submit">{editingId ? "Update" : "Create"}</button>
      </form>
      <div className="card-grid" style={{ marginTop: 18 }}>
        {appointments.map((appointment) => (
          <article className="metric-card" key={appointment.id}>
            <h3>Appointment #{appointment.id}</h3>
            <p>Patient: {appointment.patient_id}</p>
            <p>Doctor: {appointment.doctor_id}</p>
            <p>Status: {appointment.status}</p>
            <button type="button" onClick={() => handleEdit(appointment)} style={{ marginRight: 8 }}>Edit</button>
            <button type="button" onClick={() => handleDelete(appointment.id)}>Delete</button>
          </article>
        ))}
      </div>
    </DashboardLayout>
  );
};

export default Appointments;
