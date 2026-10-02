import { Shell, Loading } from '../Shell';
import { useChild } from '../PortalApp';
import { SCHOOL } from '../data';
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
            <small>{child.name}, {SCHOOL.term}</small>
            <h2>{d.hasAttendance && d.present !== null ? `${d.present}% present` : (d.days ? '100% attendance' : '…')}</h2>
            <p>{d.hasAttendance && d.days ? `${d.days.filter((x) => x.present).length} of ${d.days.length} school days attended` : 'No absences or missed roll calls recorded this term.'}</p>
          </section>
          <section className="pa-panel"><AttendanceGrid days={d.days} /></section>
        </>
      )}
    </Shell>
  );
}
