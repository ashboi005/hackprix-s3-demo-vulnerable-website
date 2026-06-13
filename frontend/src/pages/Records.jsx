import { useEffect, useState } from "react";
import DashboardLayout from "../layouts/DashboardLayout";
import { recordApi } from "../services/api";

const Records = () => {
  const [records, setRecords] = useState([]);

  useEffect(() => {
    recordApi.list().then((response) => setRecords(response.data));
  }, []);

  return (
    <DashboardLayout>
      <h1>Medical Records</h1>
      <div className="table-card">
        <table>
          <thead>
            <tr>
              <th>Diagnosis</th>
              <th>Prescription</th>
              <th>Notes</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {records.map((record) => (
              <tr key={record.id}>
                <td>{record.diagnosis}</td>
                <td>{record.prescription}</td>
                <td>{record.notes}</td>
                <td>{new Date(record.created_at).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </DashboardLayout>
  );
};

export default Records;
