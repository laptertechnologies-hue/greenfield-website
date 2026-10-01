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
            <h2>{d.marks ? `${d.average}% average` : '…'}</h2>
            <p>{d.marks ? `Overall grade ${grade(d.average)} across ${d.marks.length} subjects` : ''}</p>
          </section>
          <section className="pa-panel"><MarksTable marks={d.marks} /></section>
        </>
      )}
    </Shell>
  );
}
