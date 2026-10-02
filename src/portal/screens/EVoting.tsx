import { useState } from 'react';
import { Shell } from '../Shell';
import { useAuth } from '../auth';
import { useChild } from '../PortalApp';

export interface Candidate {
  id: string;
  name: string;
  className: string;
  stream: string;
  motto: string;
  votes: number;
  photoColor: string;
  initials: string;
}

export interface ElectionPosition {
  id: string;
  title: string;
  description: string;
  candidates: Candidate[];
}

const DEFAULT_POSITIONS: ElectionPosition[] = [
  {
    id: 'pos-hb',
    title: 'Head Boy',
    description: 'Chief student leader, prefects council chair, and student body representative to administration.',
    candidates: [
      {
        id: 'can-1',
        name: 'MUGISA RONALD',
        className: 'S.5',
        stream: 'Sciences',
        motto: 'Leadership with integrity, discipline, and academic distinction.',
        votes: 384,
        photoColor: '#1e3a8a',
        initials: 'MR',
      },
      {
        id: 'can-2',
        name: 'KATO EMMANUEL',
        className: 'S.5',
        stream: 'Arts',
        motto: 'Bridging the voice between students, teachers, and school development.',
        votes: 298,
        photoColor: '#0f766e',
        initials: 'KE',
      },
    ],
  },
  {
    id: 'pos-hg',
    title: 'Head Girl',
    description: 'Lead female student representative and coordinator of girls welfare and school discipline.',
    candidates: [
      {
        id: 'can-3',
        name: 'KEMBABAZI PATRICIA',
        className: 'S.5',
        stream: 'Sciences',
        motto: 'Empowering young women through academic excellence and talent development.',
        votes: 412,
        photoColor: '#701a75',
        initials: 'KP',
      },
      {
        id: 'can-4',
        name: 'ASIIMWE JOYCE',
        className: 'S.5',
        stream: 'Arts',
        motto: 'Fostering unity, mutual respect, and student-teacher harmony.',
        votes: 270,
        photoColor: '#9d174d',
        initials: 'AJ',
      },
    ],
  },
  {
    id: 'pos-acad',
    title: 'Academic Prefect',
    description: 'Oversees evening preps, library order, peer learning circles, and debate competitions.',
    candidates: [
      {
        id: 'can-5',
        name: 'TUMUSIIME BRIAN',
        className: 'S.3',
        stream: 'East',
        motto: 'Active study circles for every class and maximum UNEB preparation.',
        votes: 350,
        photoColor: '#0369a1',
        initials: 'TB',
      },
      {
        id: 'can-6',
        name: 'ATUHAIRWE SANDRA',
        className: 'S.3',
        stream: 'Central',
        motto: 'Knowledge is power. Revitalizing book clubs and STEM seminars.',
        votes: 332,
        photoColor: '#b45309',
        initials: 'AS',
      },
    ],
  },
  {
    id: 'pos-sports',
    title: 'Games & Sports Prefect',
    description: 'Organizes inter-house sports competitions, football tournaments, and athletic training.',
    candidates: [
      {
        id: 'can-7',
        name: 'BYARUHANGA IVAN',
        className: 'S.4',
        stream: 'North',
        motto: 'Building a champion Greenfield sports team for national competitions.',
        votes: 460,
        photoColor: '#15803d',
        initials: 'BI',
      },
      {
        id: 'can-8',
        name: 'OKELLO SAMUEL',
        className: 'S.4',
        stream: 'South',
        motto: 'Sports for fitness, house points, and physical talent development.',
        votes: 222,
        photoColor: '#b91c1c',
        initials: 'OS',
      },
    ],
  },
];

export function EVoting() {
  const { user } = useAuth();
  const { child } = useChild();
  const isStaff = user?.role === 'staff';

  const [positions, setPositions] = useState<ElectionPosition[]>(() => {
    try {
      const saved = localStorage.getItem('gfss_voting_positions');
      return saved ? JSON.parse(saved) : DEFAULT_POSITIONS;
    } catch {
      return DEFAULT_POSITIONS;
    }
  });

  const [activeTab, setActiveTab] = useState<'ballot' | 'results'>('ballot');
  const [selectedPositionId, setSelectedPositionId] = useState(DEFAULT_POSITIONS[0].id);

  // Votes tracked per student: { [studentId_positionId]: candidateId }
  const [castVotes, setCastVotes] = useState<Record<string, string>>(() => {
    try {
      const saved = localStorage.getItem('gfss_cast_votes');
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  const [votingSuccess, setVotingSuccess] = useState<string | null>(null);

  const studentKey = child?.id || (user?.role === 'staff' ? 'staff_test' : 'guest');
  const activePosition = positions.find((p) => p.id === selectedPositionId) || positions[0];
  const positionVoteKey = `${studentKey}_${activePosition.id}`;
  const votedCandidateId = castVotes[positionVoteKey];

  function handleCastVote(candidateId: string) {
    if (votedCandidateId) {
      alert('You have already cast your official vote for this position. Votes cannot be changed.');
      return;
    }

    if (!window.confirm(`Are you sure you want to vote for this candidate? Your vote will be recorded on the official student register.`)) {
      return;
    }

    // Record vote locally and increment count
    const updatedVotes = { ...castVotes, [positionVoteKey]: candidateId };
    setCastVotes(updatedVotes);
    localStorage.setItem('gfss_cast_votes', JSON.stringify(updatedVotes));

    const updatedPositions = positions.map((pos) => {
      if (pos.id !== activePosition.id) return pos;
      return {
        ...pos,
        candidates: pos.candidates.map((can) => {
          if (can.id === candidateId) {
            return { ...can, votes: can.votes + 1 };
          }
          return can;
        }),
      };
    });

    setPositions(updatedPositions);
    localStorage.setItem('gfss_voting_positions', JSON.stringify(updatedPositions));

    setVotingSuccess('Your vote has been officially cast and counted!');
    setTimeout(() => setVotingSuccess(null), 3000);
  }

  // Calculate totals
  const totalVotesInPosition = activePosition.candidates.reduce((a, c) => a + c.votes, 0);

  return (
    <Shell title="E-Voting" back>
      {/* Election Header */}
      <section className="pa-hero" style={{ background: 'linear-gradient(135deg, #0f2e17, #1e3a8a)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
          <span style={{ background: '#e3b23c', color: '#0f2e17', fontWeight: 700, fontSize: '0.72rem', padding: '2px 8px', borderRadius: '4px' }}>
            OFFICIAL E-BALLOT
          </span>
          <span style={{ fontSize: '0.75rem', opacity: 0.9 }}>Certified Electoral Commission</span>
        </div>
        <h2>2026/2027 Prefects Election</h2>
        <p>Democratic, transparent voting for student leadership. 1 verified student = 1 vote.</p>
      </section>

      {/* Segmented control: Ballot vs Live Results */}
      <div className="pa-seg pa-seg--light" role="tablist">
        <button
          role="tab"
          aria-selected={activeTab === 'ballot'}
          className={activeTab === 'ballot' ? 'is-on' : ''}
          onClick={() => setActiveTab('ballot')}
        >
          <i className="fas fa-check-to-slot" style={{ marginRight: '6px' }} />
          Cast Vote
        </button>
        <button
          role="tab"
          aria-selected={activeTab === 'results'}
          className={activeTab === 'results' ? 'is-on' : ''}
          onClick={() => setActiveTab('results')}
        >
          <i className="fas fa-chart-pie" style={{ marginRight: '6px' }} />
          Live Results ({totalVotesInPosition} cast)
        </button>
      </div>

      {/* Position selector chips */}
      <div className="pa-chips" style={{ margin: '4px 0 10px', overflowX: 'auto' }}>
        {positions.map((p) => {
          const isVoted = !!castVotes[`${studentKey}_${p.id}`];
          return (
            <button
              key={p.id}
              className={selectedPositionId === p.id ? 'is-on' : ''}
              onClick={() => setSelectedPositionId(p.id)}
            >
              {p.title}
              {isVoted && <i className="fas fa-check-circle" style={{ marginLeft: '5px', color: '#16a34a' }} />}
            </button>
          );
        })}
      </div>

      {/* Voting feedback notification */}
      {votingSuccess && (
        <div style={{ background: '#dcfce7', border: '1px solid #86efac', borderRadius: '12px', padding: '10px 14px', color: '#166534', fontSize: '0.85rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px' }}>
          <i className="fas fa-circle-check" />
          {votingSuccess}
        </div>
      )}

      {/* TAB 1: BALLOT */}
      {activeTab === 'ballot' && (
        <div style={{ display: 'grid', gap: '14px' }}>
          <div style={{ background: '#fff', padding: '12px 16px', borderRadius: '14px', border: '1px solid #dfe5dc' }}>
            <h3 style={{ margin: 0, fontSize: '1rem', color: '#0f2e17' }}>Position: {activePosition.title}</h3>
            <p style={{ margin: '4px 0 0', fontSize: '0.8rem', color: '#64748b' }}>{activePosition.description}</p>
            {votedCandidateId && (
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', marginTop: '8px', fontSize: '0.78rem', color: '#15803d', fontWeight: 600 }}>
                <i className="fas fa-shield-halved" /> Your ballot is locked and verified.
              </span>
            )}
          </div>

          {activePosition.candidates.map((can) => {
            const hasVotedThis = votedCandidateId === can.id;
            const hasVotedOther = votedCandidateId && votedCandidateId !== can.id;

            return (
              <div
                key={can.id}
                className="pa-panel"
                style={{
                  padding: '16px',
                  border: hasVotedThis ? '2px solid #16a34a' : '1px solid #dfe5dc',
                  background: hasVotedThis ? '#f0fdf4' : '#fff',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                  <div
                    style={{
                      width: '50px',
                      height: '50px',
                      borderRadius: '50%',
                      background: can.photoColor,
                      color: '#fff',
                      display: 'grid',
                      placeItems: 'center',
                      fontWeight: 700,
                      fontSize: '1.1rem',
                      flexShrink: 0,
                    }}
                  >
                    {can.initials}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                      <h4 style={{ margin: 0, fontSize: '1rem', color: '#0f2e17' }}>{can.name}</h4>
                      <span style={{ fontSize: '0.75rem', background: '#f1f5f9', color: '#475569', padding: '2px 6px', borderRadius: '4px', fontWeight: 600 }}>
                        {can.className} {can.stream}
                      </span>
                    </div>
                    <p style={{ margin: '6px 0 10px', fontSize: '0.84rem', color: '#475569', fontStyle: 'italic', lineHeight: 1.4 }}>
                      "{can.motto}"
                    </p>

                    <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '6px' }}>
                      {hasVotedThis ? (
                        <span style={{ background: '#16a34a', color: '#fff', padding: '6px 14px', borderRadius: '8px', fontSize: '0.8rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <i className="fas fa-check-circle" /> Voted By You
                        </span>
                      ) : (
                        <button
                          onClick={() => handleCastVote(can.id)}
                          disabled={Boolean(votedCandidateId)}
                          style={{
                            padding: '8px 18px',
                            borderRadius: '8px',
                            border: 0,
                            background: hasVotedOther ? '#e2e8f0' : 'var(--g-900)',
                            color: hasVotedOther ? '#94a3b8' : '#fff',
                            fontSize: '0.82rem',
                            fontWeight: 600,
                            cursor: votedCandidateId ? 'not-allowed' : 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '6px',
                          }}
                        >
                          <i className="fas fa-vote-yea" /> Vote {can.name.split(' ')[0]}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* TAB 2: LIVE RESULTS */}
      {activeTab === 'results' && (
        <div style={{ display: 'grid', gap: '14px' }}>
          <div style={{ background: '#fff', padding: '14px 16px', borderRadius: '14px', border: '1px solid #dfe5dc' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ margin: 0, fontSize: '1rem', color: '#0f2e17' }}>Live Tally: {activePosition.title}</h3>
              <span style={{ fontSize: '0.78rem', color: '#64748b' }}>
                <i className="fas fa-users" style={{ marginRight: '4px' }} />
                {totalVotesInPosition} votes verified
              </span>
            </div>
          </div>

          {activePosition.candidates.map((can) => {
            const percent = totalVotesInPosition > 0 ? Math.round((can.votes / totalVotesInPosition) * 100) : 0;
            const isLeading = can.votes === Math.max(...activePosition.candidates.map((c) => c.votes));

            return (
              <div key={can.id} className="pa-panel" style={{ padding: '16px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div style={{ width: '38px', height: '38px', borderRadius: '50%', background: can.photoColor, color: '#fff', display: 'grid', placeItems: 'center', fontWeight: 700, fontSize: '0.85rem' }}>
                      {can.initials}
                    </div>
                    <div>
                      <strong style={{ fontSize: '0.92rem', display: 'block', color: '#0f2e17' }}>{can.name}</strong>
                      <span style={{ fontSize: '0.74rem', color: '#64748b' }}>{can.className} {can.stream}</span>
                    </div>
                  </div>

                  <div style={{ textAlign: 'right' }}>
                    <strong style={{ fontSize: '1.25rem', color: isLeading ? '#166534' : '#1e293b' }}>
                      {percent}%
                    </strong>
                    <span style={{ display: 'block', fontSize: '0.72rem', color: '#64748b' }}>
                      {can.votes} votes
                    </span>
                  </div>
                </div>

                {/* Progress bar */}
                <div style={{ height: '8px', background: '#f1f5f9', borderRadius: '999px', overflow: 'hidden' }}>
                  <div
                    style={{
                      height: '100%',
                      width: `${percent}%`,
                      background: isLeading ? 'linear-gradient(90deg, #16a34a, #22c55e)' : '#94a3b8',
                      borderRadius: '999px',
                      transition: 'width 0.4s ease',
                    }}
                  />
                </div>

                {isLeading && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginTop: '6px', fontSize: '0.72rem', color: '#16a34a', fontWeight: 600 }}>
                    <i className="fas fa-crown" style={{ color: '#eab308' }} /> Current Leader
                  </div>
                )}
              </div>
            );
          })}

          {isStaff && (
            <div style={{ textAlign: 'center', padding: '10px' }}>
              <button
                onClick={() => alert('Official results certified. Ready for export to school electoral notice board.')}
                style={{ padding: '8px 16px', borderRadius: '10px', border: '1px solid #cbd5e1', background: '#fff', fontSize: '0.8rem', fontWeight: 600, color: 'var(--g-700)', cursor: 'pointer' }}
              >
                <i className="fas fa-print" style={{ marginRight: '6px' }} />
                Certify & Print Electoral Results
              </button>
            </div>
          )}
        </div>
      )}
    </Shell>
  );
}
