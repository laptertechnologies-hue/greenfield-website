import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Shell, Loading } from '../Shell';
import { useAuth } from '../auth';
import { useChild } from '../PortalApp';
import { api, SCHOOL, ugx, type Student } from '../data';
import { ChildPicker } from './ParentHome';
import { FeeStatement, useStudentData } from './parts';

export function Fees() {
  const { user } = useAuth();
  return user?.role === 'staff' ? <StaffFees /> : <ParentFees />;
}

function ParentFees() {
  const { child } = useChild();
  const d = useStudentData(child);
  return (
    <Shell title="School fees">
      <ChildPicker />
      <section className="pa-panel">{child ? <FeeStatement fees={d.fees} /> : <Loading />}</section>
      <section className="pa-panel pa-howto">
        <h3>How to pay</h3>
        <p>Pay through SchoolPay, Mobile Money or at the bank using the pay code <strong>{child?.payCode}</strong>. Payments show here within a day.</p>
        <a className="pa-btn pa-btn--ghost" href={`tel:${SCHOOL.phone.replace(/\s/g, '')}`}>Call the bursar</a>
      </section>
    </Shell>
  );
}

function StaffFees() {
  const [rows, setRows] = useState<{ s: Student; balance: number }[] | null>(null);
  useEffect(() => {
    api.students().then(async (list) => {
      const r = await Promise.all(list.map(async (s) => ({ s, balance: (await api.fees(s.id)).reduce((a, f) => a + f.amount, 0) })));
      setRows(r.sort((a, b) => b.balance - a.balance));
    });
  }, []);
  const owing = rows?.filter((r) => r.balance > 0) ?? [];
  return (
    <Shell title="Fees">
      {!rows ? <Loading /> : (
        <>
          <section className="pa-hero pa-hero--slim">
            <small>Outstanding this term</small>
            <h2>{ugx(owing.reduce((a, r) => a + r.balance, 0))}</h2>
            <p>{owing.length} of {rows.length} students have a balance</p>
          </section>
          <div className="pa-list">
            <div className="pa-list-head"><span>Student</span><span>Class</span><span>Balance</span></div>
            {rows.map(({ s, balance }) => (
              <Link key={s.id} to={`/app/students/${s.id}`} className="pa-list-row">
                <span><strong>{s.name}</strong><small>{s.payCode}</small></span>
                <span>{s.className} {s.stream}</span>
                <span className={balance > 0 ? 'pa-warn' : 'pa-good'}>{balance > 0 ? ugx(balance) : 'Cleared'}</span>
              </Link>
            ))}
          </div>
        </>
      )}
    </Shell>
  );
}
