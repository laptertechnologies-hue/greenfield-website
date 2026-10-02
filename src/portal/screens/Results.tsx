import { Shell, Loading } from '../Shell';
import { useChild } from '../PortalApp';
import { SCHOOL, grade } from '../data';
import { ChildPicker } from './ParentHome';
import { MarksTable, useStudentData } from './parts';

export function Results() {
  const { child } = useChild();
  const d = useStudentData(child);
  return (
    <Shell title="Results">
      <ChildPicker />
      {!child ? <Loading /> : (
        <>
          <section className="pa-hero pa-hero--slim">
            <small>{child.name}, {SCHOOL.term}</small>
            <h2>{d.hasMarks && d.average !== null ? `${d.average}% average` : (d.marks ? 'Marks Pending' : '…')}</h2>
            <p>{d.hasMarks && d.average !== null ? `Overall grade ${grade(d.average)} across ${d.marks?.length || 0} subjects` : 'Term assessments are being compiled by the academic department.'}</p>
          </section>
          <section className="pa-panel"><MarksTable marks={d.marks} /></section>
        </>
      )}
    </Shell>
  );
}
