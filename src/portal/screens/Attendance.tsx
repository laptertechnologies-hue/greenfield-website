import { Shell, Loading } from '../Shell';
import { useChild } from '../PortalApp';
import { ChildPicker } from './ParentHome';
import { AttendanceGrid, useStudentData } from './parts';

export function Attendance() {
  const { child } = useChild();
  const d = useStudentData(child);
  return (
    <Shell title="Attendance">
      <ChildPicker />
      {!child ? <Loading /> : (
        <>
          <section className="pa-hero pa-hero--slim">
            <small>{child.name}, September 2026</small>
            <h2>{d.days ? `${d.present}% present` : '…'}</h2>
            <p>{d.days ? `${d.days.filter((x) => x.present).length} of ${d.days.length} school days` : ''}</p>
          </section>
          <section className="pa-panel"><AttendanceGrid days={d.days} /></section>
        </>
      )}
    </Shell>
  );
}
